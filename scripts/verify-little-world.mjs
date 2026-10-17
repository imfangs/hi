#!/usr/bin/env node
// The flow under test is Hi search -> new work -> return, then the published
// subpath app -> saved edits -> an actual downloaded wallpaper and offline ZIP.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const argv = process.argv.slice(2);
assert(argv.length % 2 === 0, 'Use --url ORIGIN --out DIRECTORY --playwright-root EXISTING_PROJECT');
const args = {};
for (let index = 0; index < argv.length; index += 2) {
  assert(['--url', '--out', '--playwright-root'].includes(argv[index]), `Unknown argument: ${argv[index]}`);
  args[argv[index].slice(2)] = argv[index + 1];
}
assert(args.url && args.out && args['playwright-root'], 'Use --url ORIGIN --out DIRECTORY --playwright-root EXISTING_PROJECT');
const base = new URL(args.url);
assert(['http:', 'https:'].includes(base.protocol) && base.pathname === '/' && !base.search && !base.hash && !base.username && !base.password, 'Provide an HTTP(S) root origin');
const root = fileURLToPath(new URL('..', import.meta.url));
const out = path.resolve(args.out);
const relativeOut = path.relative(root, out);
assert(relativeOut.startsWith(`..${path.sep}`) || path.isAbsolute(relativeOut), '--out must be outside the source repository');
fs.mkdirSync(out, { recursive: true });
const { chromium, expect } = createRequire(path.resolve(args['playwright-root'], 'package.json'))('@playwright/test');
const canonical = {
  app: 'https://hi.fangs.cc/little-world/',
  zip: 'https://hi.fangs.cc/little-world/download/little-world.zip',
};
const onTarget = value => { const url = new URL(value); return new URL(url.pathname + url.search + url.hash, base).href; };
const report = {
  startedAt: new Date().toISOString(), base: base.origin, results: [], errors: [],
  environment: 'Isolated Chromium with existing Playwright.',
  limits: ['Viewport checks do not represent physical phone acceptance.', 'Screenshots are evidence files; layout assertions do not establish visual preference.', 'This script owns no server and never attaches to user browser tabs.'],
};
const save = () => fs.writeFileSync(path.join(out, 'little-world.json'), JSON.stringify(report, null, 2) + '\n');

// Compare every previously featured work, not a hardcoded historical count.
// Excluding the new ID also makes the check reusable after its commit.
const sourceFiles = execFileSync('git', ['ls-tree', '-r', '--name-only', 'HEAD', '--', 'src/content/projects'], { cwd: root, encoding: 'utf8' }).trim().split('\n').filter(file => file.endsWith('.mdx'));
const previousIds = sourceFiles.filter(file => path.basename(file, '.mdx') !== 'little-world').filter(file => {
  const source = execFileSync('git', ['show', `HEAD:${file}`], { cwd: root, encoding: 'utf8' });
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
  if (frontmatter.trimStart().startsWith('{')) {
    const data = JSON.parse(frontmatter);
    return data.featured === true && data.draft !== true;
  }
  return /^featured:\s*true\s*$/m.test(frontmatter) && !/^draft:\s*true\s*$/m.test(frontmatter);
}).map(file => path.basename(file, '.mdx')).sort();
assert(previousIds.length > 0, 'No previous featured projects found at HEAD');
const expectedIds = [...previousIds, 'little-world'].sort();
report.baseline = { previousFeaturedCount: previousIds.length, expectedFeaturedCount: expectedIds.length, previousIds };

let browser;
let step = 'launch';
const visibleIds = page => page.locator('.work-item:visible [data-project]').evaluateAll(elements => elements.map(element => element.dataset.project).sort());
async function checkLayout(page, label) {
  const geometry = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
  assert(geometry.document <= geometry.viewport + 1 && geometry.body <= geometry.viewport + 1, `${label}: document overflow ${JSON.stringify(geometry)}`);
  return geometry;
}
async function imageReady(image) {
  await image.scrollIntoViewIfNeeded();
  await expect(image).toBeVisible();
  await expect.poll(() => image.evaluate(element => element.complete && element.naturalWidth > 0)).toBe(true);
  return image.evaluate(element => ({ source: new URL(element.currentSrc).pathname, width: element.naturalWidth, height: element.naturalHeight }));
}
async function readDownload(download) {
  const stream = await download.createReadStream();
  assert(stream, 'Browser must provide actual downloaded bytes');
  const parts = [];
  for await (const part of stream) parts.push(part);
  assert.equal(await download.failure(), null);
  return Buffer.concat(parts);
}
function observe(page) {
  const pageErrors = [], consoleErrors = [], failedResources = [], successfulResources = [];
  const shortUrl = value => { const url = new URL(value); return url.protocol === 'data:' ? 'data:image (inline)' : `${url.origin}${url.pathname}`; };
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push({ text: message.text().slice(0, 1000), location: message.location() }); });
  page.on('response', response => {
    const url = new URL(response.url());
    if (url.origin !== base.origin) return;
    const resource = { url: shortUrl(response.url()), status: response.status(), type: response.request().resourceType() };
    if (response.status() >= 400) failedResources.push(resource);
    else successfulResources.push(resource);
  });
  page.on('requestfailed', request => {
    if (request.failure()?.errorText === 'net::ERR_ABORTED') return; // Navigation cancels previous document work.
    failedResources.push({ url: shortUrl(request.url()), error: request.failure()?.errorText });
  });
  return { pageErrors, consoleErrors, failedResources, successfulResources };
}
function checkHealth(health, label) {
  if (health.pageErrors.length || health.consoleErrors.length || health.failedResources.length) {
    report.errors.push({ step, label, pageErrors: health.pageErrors, consoleErrors: health.consoleErrors, failedResources: health.failedResources });
  }
}

try {
  browser = await chromium.launch({ headless: true, ...(fs.existsSync(chromium.executablePath()) ? {} : { channel: 'chrome' }) });
  for (const view of [{ name: 'desktop', width: 1440, height: 1000 }, { name: 'phone', width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport: { width: view.width, height: view.height }, acceptDownloads: true, reducedMotion: 'reduce' });
    context.setDefaultTimeout(15000);
    try {
      const page = await context.newPage();
      const galleryHealth = observe(page);
      step = `${view.name}: homepage and previous works`;
      console.log(step);
      await page.goto(base.href, { waitUntil: 'networkidle', timeout: 60000 });
      await expect(page.locator('.browse-toolbar')).toBeVisible();
      assert.deepEqual(await visibleIds(page), expectedIds, 'Homepage must preserve every previous work and add exactly little-world');
      const homeLayout = await checkLayout(page, step);
      const newCard = page.locator('#work-little-world');
      await expect(newCard).toHaveCount(1);
      const cardCover = await imageReady(newCard.locator('.work-image img'));
      assert.equal(await newCard.locator('.work-launch').getAttribute('href'), canonical.app);

      step = `${view.name}: search and detail`;
      await page.locator('#work-search').fill('小小世界');
      await expect.poll(() => visibleIds(page)).toEqual(['little-world']);
      await page.locator('[data-project="little-world"]').click();
      await page.waitForURL(url => url.pathname === '/projects/little-world/', { waitUntil: 'networkidle' });
      await expect(page.locator('h1')).toHaveText('我们的小小世界');
      assert.equal(new URL(page.url()).searchParams.get('q'), '小小世界');
      const detailLayout = await checkLayout(page, step);
      const detailCover = await imageReady(page.locator('.detail-cover img'));
      const actions = await page.locator('.detail-actions .project-action').evaluateAll(elements => elements.map(element => ({ label: element.textContent.trim(), href: element.getAttribute('href'), target: element.target, rel: element.rel })));
      assert.deepEqual(actions.map(action => action.href), [canonical.app, canonical.zip]);
      assert(actions.every(action => action.target === '_blank' && action.rel.includes('noopener')), 'CTAs must keep new-tab isolation');
      await page.screenshot({ path: path.join(out, `${view.name}-detail.png`), fullPage: false });

      let zip;
      if (view.name === 'desktop') {
        step = 'desktop: actual offline ZIP download';
        const zipLink = page.locator('.detail-actions .project-action').nth(1);
        // The source href was asserted above. Only this isolated DOM link is
        // remapped for a local build so the click tests the candidate release.
        await zipLink.evaluate((element, href) => { element.href = href; }, onTarget(canonical.zip));
        const [download] = await Promise.all([page.waitForEvent('download'), zipLink.click()]);
        const bytes = await readDownload(download);
        assert.equal(bytes.readUInt32LE(0), 0x04034b50, 'Offline download must be a ZIP');
        fs.writeFileSync(path.join(out, 'little-world.zip'), bytes);
        zip = { filename: download.suggestedFilename(), bytes: bytes.length, path: onTarget(canonical.zip) };
        await zipLink.evaluate((element, href) => { element.href = href; }, canonical.zip);
      }

      step = `${view.name}: return restores search and focus`;
      await page.locator('[data-return]').first().click();
      await page.waitForURL(url => url.pathname === '/' && url.hash === '#work-little-world', { waitUntil: 'networkidle' });
      await expect(page.locator('#work-search')).toHaveValue('小小世界');
      await expect.poll(() => visibleIds(page)).toEqual(['little-world']);
      await expect(page.locator('[data-project="little-world"]')).toBeFocused();
      await checkLayout(page, step);
      await page.screenshot({ path: path.join(out, `${view.name}-return.png`), fullPage: false });
      await page.locator('.search-clear').click();
      await expect.poll(() => visibleIds(page)).toEqual(expectedIds);
      checkHealth(galleryHealth, `${view.name} Hi`);

      step = `${view.name}: subpath app`;
      const app = await context.newPage();
      const appHealth = observe(app);
      await app.goto(onTarget(canonical.app), { waitUntil: 'networkidle', timeout: 60000 });
      await expect(app).toHaveTitle('我们的小小世界');
      await expect(app.locator('#scene svg')).toBeVisible();
      const appLayout = await checkLayout(app, step);
      assert.equal(await app.locator('vite-error-overlay, nextjs-portal').count(), 0);
      const references = await app.locator('script[src], link[rel="stylesheet"]').evaluateAll(elements => elements.map(element => element.src || element.href));
      assert(references.length >= 2 && references.every(href => new URL(href).pathname.startsWith('/little-world/assets/')), 'App script and stylesheet must use the published subpath');
      await app.locator('button[data-light="day"]').click();
      await app.locator('#edit').click();
      const title = `导出回归-${view.name}`;
      await app.locator('#edit-form [name="title"]').fill(title);
      await app.locator('#edit-form button[type="submit"]').click();
      await expect(app.locator('#scene svg')).toContainText(title);
      await app.reload({ waitUntil: 'networkidle' });
      await expect(app.locator('#scene svg')).toContainText(title);
      await expect(app.locator('button[data-light="day"]')).toHaveAttribute('aria-pressed', 'true');
      await app.screenshot({ path: path.join(out, `${view.name}-world.png`), fullPage: false });

      step = `${view.name}: actual PNG export`;
      await app.locator('#export').click();
      const [width, height] = view.name === 'desktop' ? [3840, 2400] : [1920, 1200];
      await app.locator('#export-form [name="size"]').selectOption(`${width}x${height}`);
      if (view.name === 'phone') await app.locator('#export-form [name="mode"]').selectOption('lock');
      await checkLayout(app, step);
      const [pngDownload] = await Promise.all([
        app.waitForEvent('download', { timeout: 60000 }),
        app.locator('#export-form button[type="submit"]').click(),
      ]);
      const png = await readDownload(pngDownload);
      assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
      assert.equal(png.readUInt32BE(16), width);
      assert.equal(png.readUInt32BE(20), height);
      fs.writeFileSync(path.join(out, `${view.name}-wallpaper.png`), png);
      const pixels = await app.evaluate(async base64 => {
        const blob = await (await fetch(`data:image/png;base64,${base64}`)).blob();
        const bitmap = await createImageBitmap(blob);
        const canvas = document.createElement('canvas');
        canvas.width = bitmap.width; canvas.height = bitmap.height;
        const context = canvas.getContext('2d');
        context.drawImage(bitmap, 0, 0);
        const colors = [[.25, .35], [.5, .5], [.65, .65], [.8, .3], [.4, .75]].map(([x, y]) => [...context.getImageData(Math.floor(bitmap.width * x), Math.floor(bitmap.height * y), 1, 1).data].join(','));
        const cornerAlpha = [[0, 0], [bitmap.width - 1, 0], [0, bitmap.height - 1], [bitmap.width - 1, bitmap.height - 1]].map(([x, y]) => context.getImageData(x, y, 1, 1).data[3]);
        bitmap.close(); canvas.width = canvas.height = 1;
        return { distinctColors: new Set(colors).size, cornerAlpha };
      }, png.toString('base64'));
      assert(pixels.distinctColors >= 3, 'Export must contain artwork, not a flat rectangle');
      assert(pixels.cornerAlpha.every(alpha => alpha === 255), 'Export must have opaque corners');
      await expect(app.locator('#export-message')).toContainText(`已生成 ${width} × ${height} PNG`);
      checkHealth(appHealth, `${view.name} little-world`);
      assert(appHealth.successfulResources.some(resource => resource.type === 'script' && resource.url.includes('/little-world/assets/')), 'Actual app JavaScript response missing');
      assert(appHealth.successfulResources.some(resource => resource.type === 'stylesheet' && resource.url.includes('/little-world/assets/')), 'Actual app stylesheet response missing');
      report.results.push({ view: view.name, homeLayout, detailLayout, appLayout, previousProjectsPreserved: previousIds.length, featuredCount: expectedIds.length, uniqueSearch: true, returnSearchAndFocus: true, cardCover, detailCover, actions, ...(zip ? { zip } : {}), app: { references, editSurvivesReload: true, png: { filename: pngDownload.suggestedFilename(), bytes: png.length, width, height, ...pixels }, ...appHealth }, galleryHealth });
      save();
    } finally {
      await context.close();
    }
  }

  step = 'no-JavaScript homepage';
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  try {
    const page = await context.newPage();
    await page.goto(base.href, { waitUntil: 'networkidle', timeout: 60000 });
    assert.deepEqual(await visibleIds(page), expectedIds);
    await expect(page.locator('.browse-toolbar')).toBeHidden();
    await expect(page.locator('[data-project="little-world"]')).toHaveAttribute('href', '/projects/little-world/');
    const cover = await imageReady(page.locator('#work-little-world .work-image img'));
    const layout = await checkLayout(page, step);
    report.results.push({ noJavaScript: true, featuredCount: expectedIds.length, newWorkVisible: true, cover, layout });
  } finally {
    await context.close();
  }
  report.passed = report.errors.length === 0;
  if (!report.passed) process.exitCode = 1;
} catch (error) {
  report.passed = false;
  report.errors.push({ step, error: error.stack || String(error) });
  process.exitCode = 1;
} finally {
  await browser?.close();
  report.finishedAt = new Date().toISOString();
  save();
  console.log(JSON.stringify({ passed: report.passed, step, results: report.results.length, errors: report.errors, out }));
}
