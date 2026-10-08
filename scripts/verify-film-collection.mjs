#!/usr/bin/env node
// Browser verification of the short-film collection and shared gallery routing.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = {};
for (let i = 2; i < process.argv.length; i += 2) args[process.argv[i].replace(/^--/, '')] = process.argv[i + 1];
assert(args.url && args.out && args['playwright-root'], 'Provide --url, --out, --playwright-root');
const base = new URL(args.url);
const out = path.resolve(args.out);
fs.mkdirSync(out, { recursive: true });
const playwright = createRequire(path.resolve(args['playwright-root'], 'package.json'))('playwright');
const expected = JSON.parse(fs.readFileSync(path.join(root, 'docs/school-secret-lab-media.json'))).films;
const record = { date: new Date().toISOString(), url: base.origin, passed: false, results: [],
  limits: ['Chromium synthetic viewports; not a physical phone test.', 'Media playback and seeking verified; no subjective audio-quality claim.', 'Remote media byte identity is checked separately.'] };
const save = () => fs.writeFileSync(path.join(out, 'qa.json'), JSON.stringify(record, null, 2) + '\n');
const browser = await playwright.chromium.launch({ headless: true });
try {
  for (const env of [
    { name: 'desktop', viewport: { width: 1280, height: 900 }, colorScheme: 'light' },
    { name: 'phone', viewport: { width: 390, height: 844 }, colorScheme: 'light' },
    { name: 'narrow-dark', viewport: { width: 320, height: 740 }, colorScheme: 'dark' },
  ]) {
    const context = await browser.newContext({ viewport: env.viewport, colorScheme: env.colorScheme, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    const mediaRequests = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => { if (request.url().includes('/school-secret-lab/') && request.url().endsWith('.mp4')) mediaRequests.push(request.url()); });
    const result = { environment: env.name, clips: [], passed: false };
    record.results.push(result);
    const overflow = async () => assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Horizontal overflow');
    assert((await page.goto(base.origin, { waitUntil: 'networkidle' })).ok());
    const links = await page.locator('[data-project]').evaluateAll(nodes => nodes.map(n => ({ slug: n.dataset.project, href: n.getAttribute('href') })));
    await page.locator('[data-filter="creations"]').click();
    assert(new URL(page.url()).searchParams.get('view') === 'creations');
    assert((await page.locator('.work-item:visible').evaluateAll(items => items.map(n => n.dataset.group))).every(g => g === 'creations'));
    await overflow();
    await page.screenshot({ path: path.join(out, `${env.name}-gallery.png`), fullPage: true });
    await page.locator('[data-project="school-secret-lab"]').click();
    await page.waitForURL('**/projects/school-secret-lab/**');
    assert.equal((await page.locator('h1').innerText()).trim(), '爱养蘑菇的小学生');
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('.film video').count(), expected.length);
    await page.waitForTimeout(700);
    assert.equal(mediaRequests.length, 0, 'Collection preloaded MP4s before interaction');
    await overflow();
    await page.screenshot({ path: path.join(out, `${env.name}-detail.png`), fullPage: true });
    for (const [index, film] of expected.entries()) {
      const video = page.locator('.film video').nth(index);
      await video.scrollIntoViewIfNeeded();
      const layout = await video.evaluate(v => {
        const b = v.getBoundingClientRect();
        return { width: b.width, height: b.height, preload: v.preload, controls: v.controls, playsInline: v.playsInline, autoplay: v.autoplay, src: v.querySelector('source').src, poster: v.poster, fit: getComputedStyle(v).objectFit };
      });
      assert.equal(layout.preload, 'none');
      assert(layout.controls && layout.playsInline && !layout.autoplay);
      assert.equal(layout.fit, 'contain');
      assert(Math.abs(layout.width / layout.height - 9 / 16) < 0.01);
      assert.equal(layout.src, new URL(film.publicPath, base).href);
      assert((await context.request.get(layout.poster)).ok());
      await video.evaluate(v => { v.muted = true; });
      const box = await video.boundingBox();
      await video.click({ position: { x: 24, y: box.height - 50 } });
      await page.waitForFunction(i => document.querySelectorAll('.film video')[i].currentTime > 0.15, index, { timeout: 30000 });
      const metadata = await video.evaluate(v => ({ duration: v.duration, width: v.videoWidth, height: v.videoHeight, error: v.error?.code ?? null }));
      assert(Math.abs(metadata.duration - film.duration) < 0.12);
      assert.equal(metadata.width, 720); assert.equal(metadata.height, 1280); assert.equal(metadata.error, null);
      if (env.name === 'desktop' && args.playback !== 'quick') {
        await page.waitForFunction(i => document.querySelectorAll('.film video')[i].ended, index, { timeout: film.duration * 1000 + 15000 });
      }
      await video.evaluate(v => { v.pause(); v.currentTime = v.duration * 0.7; });
      await page.waitForFunction(i => { const v = document.querySelectorAll('.film video')[i]; return !v.seeking && v.currentTime >= v.duration * 0.65; }, index);
      await video.evaluate(v => { v.currentTime = v.duration * 0.2; });
      await page.waitForFunction(i => { const v = document.querySelectorAll('.film video')[i]; return !v.seeking && v.currentTime <= v.duration * 0.25; }, index);
      await video.evaluate(v => { v.currentTime = v.duration - 0.3; return v.play(); });
      await page.waitForFunction(i => document.querySelectorAll('.film video')[i].ended, index, { timeout: 15000 });
      result.clips.push({ name: film.name, layout, metadata, fullPlayback: env.name === 'desktop' && args.playback !== 'quick', seekForwardBackwardAndEnd: true });
      save();
    }
    await page.locator('.film video').nth(0).evaluate(v => { v.currentTime = 0; return v.play(); });
    await page.locator('.film video').nth(1).evaluate(v => { v.currentTime = 0; return v.play(); });
    assert.equal(await page.locator('.film video').nth(0).evaluate(v => v.paused), true, 'Previous film kept playing');
    await page.locator('.film video').nth(1).evaluate(v => v.pause());
    result.singleActivePlayer = true;
    const credits = page.locator('a[href="/videos/projects/school-secret-lab/credits.txt"]');
    assert.equal(await credits.count(), 1);
    const creditsResponse = await context.request.get(new URL(await credits.getAttribute('href'), base).href);
    assert(creditsResponse.ok() && (await creditsResponse.text()).includes('含 AI 生成内容'));
    const next = page.locator('.next-project');
    assert(new URL(await next.getAttribute('href'), base).pathname !== new URL(page.url()).pathname, 'Next item loops to itself');
    await page.locator('[data-return]').first().click();
    await page.waitForURL(url => url.pathname === '/' && url.searchParams.get('view') === 'creations' && url.hash === '#work-school-secret-lab', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.activeElement?.getAttribute('data-project') === 'school-secret-lab');
    assert.equal(await page.locator('[data-filter="creations"]').getAttribute('aria-pressed'), 'true');
    await page.locator('[data-filter="all"]').click();
    assert.equal(await page.locator('.work-item:visible').count(), links.length);
    await page.goBack();
    assert.equal(await page.locator('[data-filter="creations"]').getAttribute('aria-pressed'), 'true');
    // Every existing detail remains reachable after shared category changes.
    for (const link of links) {
      assert((await page.goto(new URL(link.href, base).href)).ok());
      assert.equal(await page.locator('h1').count(), 1);
      const brokenImages = await page.locator('img[src]:visible').evaluateAll(images => images.filter(i => i.complete && !i.naturalWidth).map(i => i.src));
      assert.deepEqual(brokenImages, [], `Visible image failed on ${link.slug}`);
      await overflow();
    }
    assert.deepEqual(errors, []);
    result.detailsChecked = links.length;
    result.passed = true;
    result.errors = errors;
    save();
    await context.close();
  }
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(base.origin);
  assert(await page.locator('[data-project="school-secret-lab"]').isVisible());
  await page.locator('[data-project="school-secret-lab"]').click();
  assert.equal(await page.locator('.film video[controls]').count(), expected.length);
  record.noJavaScript = 'gallery and native players available';
  await context.close();
  record.passed = true;
} catch (error) { record.error = String(error.stack || error); process.exitCode = 1; }
finally { record.finishedAt = new Date().toISOString(); save(); await browser.close(); }
console.log(JSON.stringify({ passed: record.passed, resultFile: path.join(out, 'qa.json'), error: record.error }));
