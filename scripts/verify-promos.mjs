#!/usr/bin/env node
/**
 * Focused Hi promo-page QA. Uses this repository's content and public assets;
 * it does not test product business flows or certify remote MP4 byte identity.
 *
 * node scripts/verify-promos.mjs --url http://127.0.0.1:4218 \
 *   --slugs snow-duel --out /tmp/hi-promo-batch-qa-local \
 *   --playwright-root ../snow-duel/videos/promo-2026-10-01 --full \
 *   --engines chromium,webkit
 */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const projectRequire = createRequire(path.join(root, 'package.json'));
const options = { url: 'http://127.0.0.1:4218', engines: 'chromium', full: false };
const flags = new Set(['url', 'slugs', 'out', 'playwright-root', 'engines', 'views']);
for (let i = 2; i < process.argv.length; i++) {
  const flag = process.argv[i];
  if (flag === '--full') options.full = true;
  else if (flag === '--help') {
    console.log('Usage: node scripts/verify-promos.mjs [--url URL] [--slugs comma,list] [--out DIR] [--playwright-root DIR] [--engines chromium,webkit] [--views desktop,phone,narrow-dark] [--full]\nDefaults: URL http://127.0.0.1:4218; all non-draft projects with videos; chromium; all views; /tmp/hi-promo-batch-qa-<time>. --full requires uninterrupted desktop playback when desktop is selected; other runs explicitly use seek-to-end. Exit 0 = passed, 1 = failed/incomplete, 2 = verified checks passed with an explicitly unverified external-app navigation boundary. Requires installed Playwright and ffprobe; installs nothing.');
    process.exit(0);
  } else {
    const key = flag.replace(/^--/, '');
    assert(flag.startsWith('--') && flags.has(key), `Unknown option: ${flag}`);
    assert(process.argv[i + 1] && !process.argv[i + 1].startsWith('--'), `Missing value for ${flag}`);
    options[key] = process.argv[++i];
  }
}
const base = new URL(options.url);
assert(['http:', 'https:'].includes(base.protocol), '--url must be HTTP(S)');
assert(base.pathname === '/' && !base.search && !base.hash, '--url must be an origin, without a path/query/hash');
const engines = [...new Set(options.engines.split(',').map(s => s.trim()).filter(Boolean))];
assert(engines.length && engines.every(e => ['chromium', 'webkit'].includes(e)), '--engines supports chromium,webkit');
const out = path.resolve(options.out || `/tmp/hi-promo-batch-qa-${new Date().toISOString().replace(/[:.]/g, '-')}`);
fs.mkdirSync(out, { recursive: true });
const receiptPath = path.join(out, 'qa.json');
const receipt = {
  schemaVersion: 2, startedAt: new Date().toISOString(), root, base: base.origin,
  options: { ...options, out, engines }, contentInventory: [], assets: [], results: [],
  complete: false, passed: false,
  limits: [
    'Synthetic browser viewports; no physical phone or Safari application test.',
    'No human audio listening, continuous human visual review, or promotion-effectiveness claim.',
    'Local public MP4 SHA-256 identifies the reference file only. Browser URLs/headers/duration do not establish whole remote-file identity; run FBT public-preview verify_static separately.',
    '--full means uninterrupted normal-speed desktop playback to ended; phone/narrow runs use documented seeks before reaching ended.',
    'Product CTA checks cover link opening and HTTP reachability only; product business flows are outside this script.',
    'A WebKit App Store link click with no observable browser navigation can be PARTIAL only after an unprevented trusted click, successful HTTP check and a separate direct browser navigation. This does not verify the click opened a browser page or native App Store.',
  ],
};
const save = () => fs.writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const message = error => error instanceof Error ? error.message : String(error);
const allEnvironments = [
  { name: 'desktop', viewport: { width: 1280, height: 900 }, colorScheme: 'light' },
  { name: 'phone', viewport: { width: 390, height: 844 }, colorScheme: 'light' },
  { name: 'narrow-dark', viewport: { width: 320, height: 740 }, colorScheme: 'dark' },
];
const selectedViews = options.views ? [...new Set(options.views.split(',').map(s => s.trim()).filter(Boolean))] : allEnvironments.map(e => e.name);
assert(selectedViews.length && selectedViews.every(view => allEnvironments.some(e => e.name === view)), '--views supports desktop,phone,narrow-dark');
const environments = allEnvironments.filter(environment => selectedViews.includes(environment.name));

class UnverifiedExternalAppNavigation extends Error {
  constructor(evidence) {
    super('App Store click/native-app handoff was not observable in WebKit; link, HTTP and separate direct browser navigation were verified');
    this.evidence = evidence;
  }
}

function publicAsset(relative, prefix) {
  assert(typeof relative === 'string' && relative.startsWith(prefix), `Invalid asset path: ${relative}`);
  const absolute = path.resolve(root, 'public', `.${relative}`);
  assert(absolute.startsWith(`${path.join(root, 'public')}${path.sep}`), 'Asset must remain inside public/');
  const bytes = fs.readFileSync(absolute);
  return { publicPath: relative, localPath: absolute, bytes: bytes.length, sha256: sha(bytes) };
}

function readContent() {
  // Astro already depends on js-yaml; resolving from Astro works with pnpm's
  // strict dependency layout without adding a second parser to this project.
  const astroRequire = createRequire(projectRequire.resolve('astro/package.json'));
  const yaml = astroRequire('js-yaml');
  const contentRoot = path.join(root, 'src/content/projects');
  const projects = fs.readdirSync(contentRoot).filter(name => /\.mdx?$/.test(name)).sort().map(name => {
    const file = path.join(contentRoot, name);
    const text = fs.readFileSync(file, 'utf8');
    const frontmatter = text.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1];
    assert(frontmatter, `Missing frontmatter: ${file}`);
    const data = yaml.load(frontmatter, { schema: yaml.JSON_SCHEMA });
    assert(data && typeof data === 'object' && !Array.isArray(data), `Invalid frontmatter: ${file}`);
    return { slug: name.replace(/\.mdx?$/, ''), file, contentSha256: sha(Buffer.from(text)), data };
  });
  receipt.contentInventory = projects.map(p => ({ slug: p.slug, contentSha256: p.contentSha256, hasVideo: Boolean(p.data.video), draft: Boolean(p.data.draft) }));
  const requested = options.slugs ? [...new Set(options.slugs.split(',').map(s => s.trim()).filter(Boolean))] : projects.filter(p => p.data.video && !p.data.draft).map(p => p.slug);
  assert(requested.length, 'No promo projects selected');
  return requested.map(slug => {
    assert(/^[a-z0-9][a-z0-9-]*$/.test(slug), `Invalid slug: ${slug}`);
    const project = projects.find(p => p.slug === slug);
    assert(project, `Unknown project: ${slug}`);
    const { data } = project;
    assert(!data.draft && data.video, `${slug}: project must be non-draft and have video metadata`);
    assert(['apps', 'games', 'reading'].includes(data.group), `${slug}: invalid group`);
    assert(typeof data.video.caption === 'string' && data.video.caption.trim(), `${slug}: missing video caption`);
    assert(Array.isArray(data.links) && data.links.length, `${slug}: no CTA links`);
    for (const link of data.links) {
      assert(link.label && ['http:', 'https:'].includes(new URL(link.href).protocol), `${slug}: invalid CTA`);
    }
    const mp4 = publicAsset(data.video.src, '/videos/projects/');
    const poster = publicAsset(data.video.poster, '/images/projects/');
    const credits = publicAsset(data.video.credits, '/videos/projects/');
    const probe = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_format', '-show_streams', '-of', 'json', mp4.localPath], { encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 }));
    const stream = probe.streams.find(s => s.codec_type === 'video');
    assert(stream?.width > 0 && stream?.height > 0, `${slug}: no valid local video stream`);
    const duration = Number(probe.format.duration);
    assert(Number.isFinite(duration) && duration > 0, `${slug}: no valid local duration`);
    const asset = { slug, title: data.title, group: data.group, contentFile: project.file, contentSha256: project.contentSha256, caption: data.video.caption, links: data.links, localReference: { mp4, poster, credits, media: { duration, width: stream.width, height: stream.height, codec: stream.codec_name, audioStreams: probe.streams.filter(s => s.codec_type === 'audio').length } }, remoteWholeMp4Integrity: { verified: false, method: null, requiredSeparateCheck: 'FBT public-preview verify_static' } };
    receipt.assets.push(asset);
    return { ...project, asset };
  });
}

// Function passed into the browser: keep it self-contained.
const mediaState = v => {
  const quality = v.getVideoPlaybackQuality?.();
  return { duration: v.duration, currentTime: v.currentTime, paused: v.paused, ended: v.ended, playbackRate: v.playbackRate, readyState: v.readyState, videoWidth: v.videoWidth, videoHeight: v.videoHeight, currentSrc: v.currentSrc, muted: v.muted, volume: v.volume, error: v.error ? { code: v.error.code, message: v.error.message } : null, quality: quality ? { totalVideoFrames: quality.totalVideoFrames, droppedVideoFrames: quality.droppedVideoFrames } : null };
};

async function run(browser, engine, environment, project) {
  const { slug, data, asset } = project;
  const expectedMediaURL = new URL(data.video.src, base).href;
  const expectedPosterURL = new URL(data.video.poster, base).href;
  const result = {
    slug, engine, environment: environment.name, browser: browser.version(),
    viewport: environment.viewport, colorScheme: environment.colorScheme,
    localMp4Sha256: asset.localReference.mp4.sha256,
    contentSha256: project.contentSha256, expectedMediaURL, expectedPosterURL,
    checks: [], mediaRequests: [], mediaResponses: [], posterResponses: [],
    pageErrors: [], consoleErrors: [], failedRequests: [], boundaries: [], passed: false,
    remoteWholeMp4IntegrityVerified: false,
  };
  receipt.results.push(result);
  const context = await browser.newContext({ viewport: environment.viewport, colorScheme: environment.colorScheme, reducedMotion: 'reduce', serviceWorkers: 'block' });
  const page = await context.newPage();
  const pendingResponses = [];
  let interacted = false;
  const check = async (name, task) => {
    const entry = { name, passed: false };
    result.checks.push(entry);
    try { entry.evidence = await task(); entry.passed = true; entry.status = 'passed'; return entry.evidence; }
    catch (error) {
      if (error instanceof UnverifiedExternalAppNavigation) {
        entry.passed = null;
        entry.status = 'unverified';
        entry.evidence = error.evidence;
        entry.reason = error.message;
        result.boundaries.push({ check: name, reason: error.message, evidence: error.evidence });
        return entry.evidence;
      }
      entry.status = 'failed'; entry.error = message(error); throw error;
    }
    finally { save(); }
  };
  page.on('pageerror', error => result.pageErrors.push(error.message));
  page.on('console', item => { if (item.type() === 'error') result.consoleErrors.push(item.text()); });
  page.on('requestfailed', request => result.failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
  page.on('request', request => {
    if (request.resourceType() === 'media' || /\.mp4(?:[?#]|$)/i.test(request.url())) result.mediaRequests.push({ url: request.url(), beforeInteraction: !interacted, method: request.method(), range: request.headers().range || null });
  });
  page.on('response', response => {
    const isPoster = response.url() === expectedPosterURL;
    const isMedia = response.request().resourceType() === 'media' || /\.mp4(?:[?#]|$)/i.test(response.url());
    if (!isPoster && !isMedia) return;
    const list = isPoster ? result.posterResponses : result.mediaResponses;
    const record = { url: response.url(), status: response.status(), beforeInteraction: !interacted };
    list.push(record);
    pendingResponses.push((async () => {
      try {
        const headers = await response.allHeaders();
        record.headers = Object.fromEntries(['content-type', 'content-length', 'content-range', 'accept-ranges', 'etag', 'last-modified', 'cache-control'].filter(k => headers[k] !== undefined).map(k => [k, headers[k]]));
        record.fromServiceWorker = response.fromServiceWorker();
        if (isPoster && response.status() === 200) {
          const bytes = await response.body();
          record.bodyBytes = bytes.length;
          record.bodySha256 = sha(bytes);
          record.matchesLocalPoster = record.bodySha256 === asset.localReference.poster.sha256;
        }
      } catch (error) { record.captureError = message(error); }
    })());
  });
  try {
    await check('entry-and-category', async () => {
      const homeResponse = await page.goto(new URL(`/?view=${data.group}`, base).href, { waitUntil: 'domcontentloaded' });
      assert(homeResponse?.ok(), `Home returned ${homeResponse?.status()}`);
      await page.locator(`[data-filter="${data.group}"][aria-pressed="true"]`).waitFor();
      if (data.featured) {
        await page.locator(`[data-project="${slug}"]`).click();
        await page.waitForURL(url => url.pathname === `/projects/${slug}/`);
      } else {
        const response = await page.goto(new URL(`/projects/${slug}/?view=${data.group}`, base).href, { waitUntil: 'domcontentloaded' });
        assert(response?.ok(), `Detail returned ${response?.status()}`);
      }
      assert.equal(new URL(page.url()).searchParams.get('view'), data.group);
      assert.equal((await page.locator('h1').innerText()).trim(), data.title);
      return { url: page.url(), method: data.featured ? 'clicked filtered gallery card' : 'direct non-featured detail' };
    });
    const video = page.locator('.detail-video video');
    await check('initial-player-layout-and-no-prefetch', async () => {
      assert.equal(await video.count(), 1, 'Expected exactly one promo player');
      await video.scrollIntoViewIfNeeded();
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(650);
      const state = await video.evaluate(v => {
        const rect = v.getBoundingClientRect();
        return { paused: v.paused, time: v.currentTime, preload: v.preload, autoplay: v.autoplay, playsInline: v.playsInline, controls: v.controls, poster: v.poster, source: v.querySelector('source')?.src, objectFit: getComputedStyle(v).objectFit, width: rect.width, height: rect.height, pageWidth: document.documentElement.scrollWidth, viewportWidth: innerWidth };
      });
      assert.equal(state.preload, 'none');
      assert.equal(state.autoplay, false);
      assert.equal(state.playsInline, true);
      assert.equal(state.controls, true);
      assert.equal(state.paused, true);
      assert.equal(state.time, 0);
      assert.equal(state.source, expectedMediaURL);
      assert.equal(state.poster, expectedPosterURL);
      assert.equal(state.objectFit, 'contain');
      assert(Math.abs(state.width / state.height - 16 / 9) < 0.015, 'Player must retain complete 16:9 frame');
      assert(state.pageWidth <= state.viewportWidth, `Horizontal overflow: ${state.pageWidth} > ${state.viewportWidth}`);
      assert.equal(result.mediaRequests.length, 0, 'MP4 requested before interaction');
      assert.equal((await page.locator('#video-caption span').innerText()).trim(), data.video.caption);
      await Promise.all(pendingResponses);
      const posterResponse = result.posterResponses.find(r => r.status === 200 && r.matchesLocalPoster);
      assert(posterResponse, 'Browser did not receive the exact local-reference poster bytes');
      return { ...state, mediaRequestsBeforeInteraction: result.mediaRequests.length, posterBodySha256: posterResponse.bodySha256 };
    });
    await video.evaluate(v => {
      window.__hiPromoEvents = [];
      for (const type of ['play', 'playing', 'pause', 'seeking', 'seeked', 'ended', 'ratechange', 'volumechange', 'error']) v.addEventListener(type, () => window.__hiPromoEvents.push({ type, time: v.currentTime, atMs: performance.now() }));
    });
    // Chromium 151/154 can briefly paint a native loading arc on a paused
    // preload=none poster while requesting no media. Let this initialization
    // settle before using the screenshot as evidence of the resting layout.
    await page.waitForTimeout(2500);
    assert.equal(result.mediaRequests.length, 0, 'MP4 requested before poster capture');
    await page.screenshot({ path: path.join(out, `${slug}-${engine}-${environment.name}-poster.png`) });
    const clickPlay = async () => {
      await video.scrollIntoViewIfNeeded();
      const box = await video.boundingBox();
      assert(box, 'Player has no bounding box');
      interacted = true;
      if (engine === 'chromium') await video.click({ position: { x: 24, y: box.height - 50 } });
      else await video.click();
    };
    await check('active-click-play-and-metadata', async () => {
      await clickPlay();
      await page.waitForFunction(() => { const v = document.querySelector('video'); return v.currentTime > Math.min(1.2, v.duration / 4) && !v.paused; }, undefined, { timeout: 45000 });
      const state = await video.evaluate(mediaState);
      assert.equal(state.error, null);
      assert.equal(state.currentSrc, expectedMediaURL);
      assert(Math.abs(state.duration - asset.localReference.media.duration) < 0.12, 'Browser/local duration mismatch');
      assert.equal(state.videoWidth, asset.localReference.media.width);
      assert.equal(state.videoHeight, asset.localReference.media.height);
      assert(Math.abs(state.videoWidth / state.videoHeight - 16 / 9) < 0.015, 'Source video must be 16:9');
      assert.equal(state.playbackRate, 1);
      return { method: 'trusted pointer click on native player', ...state };
    });
    await page.screenshot({ path: path.join(out, `${slug}-${engine}-${environment.name}-playing.png`) });
    if (environment.name === 'desktop' && options.full) {
      await check('uninterrupted-full-playback', async () => {
        await page.waitForFunction(() => document.querySelector('video').ended, undefined, { timeout: Math.ceil(asset.localReference.media.duration * 1000) + 30000 });
        const state = await video.evaluate(mediaState);
        const events = await page.evaluate(() => window.__hiPromoEvents);
        assert(state.ended && !state.error);
        assert(!events.some(event => ['seeking', 'ratechange'].includes(event.type)), 'Full playback contained seek/rate change');
        assert.equal(state.playbackRate, 1);
        return { method: 'from initial pointer play to ended, no seek or speed changes', ...state, events };
      });
      await clickPlay();
      await page.waitForFunction(() => { const v = document.querySelector('video'); return v.currentTime > 0.1 && v.currentTime < v.duration / 2 && !v.paused; }, undefined, { timeout: 15000 });
    }
    await check('seek-forward-back-and-ended', async () => {
      const seek = async fraction => {
        const before = await video.evaluate(v => v.currentTime);
        const eventStart = await page.evaluate(() => window.__hiPromoEvents.length);
        // currentTime is stable across native control layouts. This explicitly
        // verifies the media seek path, not native timeline dragging.
        await video.evaluate((v, f) => { v.currentTime = v.duration * f; }, fraction);
        try {
          await page.waitForFunction(f => { const v = document.querySelector('video'); return !v.seeking && Math.abs(v.currentTime - v.duration * f) < 1.5; }, fraction, { timeout: 20000 });
        } catch (error) {
          const state = await video.evaluate(v => ({ currentTime: v.currentTime, seeking: v.seeking, seekable: Array.from({ length: v.seekable.length }, (_, i) => [v.seekable.start(i), v.seekable.end(i)]) }));
          throw new Error(`Seek to ${fraction} failed: ${JSON.stringify(state)}; ensure the server supports media Range requests. ${message(error)}`);
        }
        const events = await page.evaluate(start => window.__hiPromoEvents.slice(start), eventStart);
        assert(events.some(e => e.type === 'seeked'), 'No seeked event');
        return { targetFraction: fraction, before, after: await video.evaluate(v => v.currentTime), events };
      };
      const forward = await seek(0.72);
      assert(forward.after > forward.before, 'Forward seek did not advance');
      const backward = await seek(0.18);
      assert(backward.after < backward.before, 'Backward seek did not rewind');
      const tail = await seek(0.9);
      if (await video.evaluate(v => v.paused)) await clickPlay();
      await page.waitForFunction(() => document.querySelector('video').ended, undefined, { timeout: Math.ceil(asset.localReference.media.duration * 150) + 15000 });
      const state = await video.evaluate(mediaState);
      assert(state.ended && !state.error);
      return { method: 'HTMLMediaElement.currentTime forward/back/tail seek followed by normal playback to ended; native dragging not claimed', fullPlaybackRequired: environment.name === 'desktop' && options.full, forward, backward, tail, final: state };
    });
    if (environment.name === 'desktop') {
      await check('desktop-volume-and-fullscreen', async () => {
        const before = await video.evaluate(v => ({ muted: v.muted, volume: v.volume }));
        const box = await video.boundingBox();
        if (engine === 'chromium') {
          // Chromium's native controls, as exercised by the existing Hi QA.
          await page.mouse.move(box.x + box.width - 120, box.y + box.height - 48);
          await video.click({ position: { x: box.width - 120, y: box.height - 48 } });
          await page.waitForFunction(was => document.querySelector('video').muted !== was, before.muted, { timeout: 5000 });
          const muted = await video.evaluate(v => v.muted);
          await video.click({ position: { x: box.width - 120, y: box.height - 48 } });
          assert.equal(await video.evaluate(v => v.muted), before.muted);
          await video.click({ position: { x: box.width - 72, y: box.height - 48 } });
          await page.waitForFunction(() => Boolean(document.fullscreenElement), undefined, { timeout: 5000 });
          await page.evaluate(() => document.exitFullscreen());
          await page.waitForFunction(() => !document.fullscreenElement, undefined, { timeout: 5000 });
          return { method: 'native Chromium mute/unmute and fullscreen buttons', before, mutedDuringCheck: muted, exitedFullscreen: true, exitMethod: 'document.exitFullscreen for harness cleanup' };
        }
        // Safari/WebKit uses a different native shadow control layout. Exercise
        // its APIs with a real click, and avoid claiming native-button coverage.
        await video.evaluate(v => { v.volume = 0.4; v.muted = !v.muted; });
        const changed = await video.evaluate(v => ({ muted: v.muted, volume: v.volume }));
        assert.equal(changed.muted, !before.muted);
        assert(Math.abs(changed.volume - 0.4) < 0.01);
        await video.evaluate((v, original) => { v.muted = original.muted; v.volume = original.volume; }, before);
        await video.evaluate(v => v.addEventListener('click', event => { event.preventDefault(); v.requestFullscreen(); }, { once: true }));
        await video.click();
        await page.waitForFunction(() => Boolean(document.fullscreenElement), undefined, { timeout: 5000 });
        await page.evaluate(() => document.exitFullscreen());
        await page.waitForFunction(() => !document.fullscreenElement, undefined, { timeout: 5000 });
        return { method: 'WebKit media volume/mute API and requestFullscreen under trusted click; native buttons not claimed', before, changed, exitedFullscreen: true };
      });
    }
    await check('browser-media-response-identity', async () => {
      await Promise.all(pendingResponses);
      assert(result.mediaRequests.length > 0, 'No browser media request observed');
      assert(!result.mediaRequests.some(r => r.beforeInteraction), 'Media was requested before interaction');
      const response = result.mediaResponses.find(r => r.url === expectedMediaURL && [200, 206].includes(r.status));
      assert(response, 'No successful browser response for expected media URL');
      assert(!response.captureError, response.captureError);
      assert(/^video\/mp4(?:;|$)/i.test(response.headers['content-type'] || ''), 'Expected video/mp4 response');
      const rangeTotal = response.headers['content-range']?.match(/\/(\d+)$/)?.[1];
      if (rangeTotal) assert.equal(Number(rangeTotal), asset.localReference.mp4.bytes, 'Range total differs from local reference length');
      return { localReferenceSha256: asset.localReference.mp4.sha256, observedURL: response.url, status: response.status, headers: response.headers, localByteLength: asset.localReference.mp4.bytes, wholeRemoteFileSha256: null, wholeRemoteFileEqualityVerified: false, scope: 'URL, response metadata, dimensions and duration only; separate FBT verify_static required' };
    });
    await check('credits-link-open-and-content', async () => {
      const link = page.locator('#video-caption a');
      const href = await link.getAttribute('href');
      assert.equal(new URL(href, base).href, new URL(data.video.credits, base).href);
      const response = await context.request.get(new URL(href, base).href, { timeout: 30000 });
      assert(response.ok(), `Credits returned ${response.status()}`);
      const bytes = await response.body();
      assert.equal(sha(bytes), asset.localReference.credits.sha256, 'Credits response differs from content source');
      return { method: 'resolved actual page link, HTTP GET and byte comparison', url: response.url(), status: response.status(), bytes: bytes.length, sha256: sha(bytes) };
    });
    await check('cta-links-and-http', async () => {
      const evidence = [];
      const links = page.locator('.project-actions a');
      assert.equal(await links.count(), data.links.length);
      for (let index = 0; index < data.links.length; index++) {
        const expected = data.links[index];
        const link = links.nth(index);
        assert.equal((await link.innerText()).trim(), expected.label);
        assert.equal(await link.getAttribute('href'), expected.href);
        assert.equal(await link.getAttribute('target'), '_blank');
        const response = await context.request.get(expected.href, { timeout: 30000 });
        try {
          assert(response.ok(), `${expected.label} returned ${response.status()}`);
          evidence.push({ label: expected.label, expectedURL: expected.href, httpURL: response.url(), status: response.status(), method: 'verified actual anchor label/href/target and separate HTTP GET; does not claim browser opening' });
        } finally { await response.dispose(); }
      }
      return evidence;
    });
    await check('cta-links-open', async () => {
      const evidence = [];
      const links = page.locator('.project-actions a');
      let hasBoundary = false;
      for (let index = 0; index < data.links.length; index++) {
        const expected = data.links[index];
        const link = links.nth(index);
        const navigationRequests = [];
        const onNavigation = request => { if (request.isNavigationRequest()) navigationRequests.push(request.url()); };
        context.on('request', onNavigation);
        let popup;
        try {
          await link.evaluate(a => {
            window.__hiCtaClick = null;
            a.addEventListener('click', event => queueMicrotask(() => {
              window.__hiCtaClick = { trusted: event.isTrusted, defaultPrevented: event.defaultPrevented, href: a.href, target: a.target };
            }), { once: true });
          });
          // Attach a rejection handler immediately so a click failure cannot
          // leave an unhandled pending popup rejection.
          const popupPromise = page.waitForEvent('popup', { timeout: 15000 }).then(value => ({ popup: value }), error => ({ error }));
          const hiURLBeforeClick = page.url();
          await link.click();
          const observation = await popupPromise;
          const click = await page.evaluate(() => window.__hiCtaClick);
          const expectedURL = new URL(expected.href);
          const appId = expectedURL.hostname === 'apps.apple.com' && expectedURL.protocol === 'https:' ? expectedURL.pathname.match(/\/app\/(?:[^/]+\/)?id(\d+)\/?$/)?.[1] : null;
          const knownWebKitBoundary = observation.error?.name === 'TimeoutError' && engine === 'webkit' && appId && click?.trusted && !click.defaultPrevented && click.href === expected.href && click.target === '_blank' && page.url() === hiURLBeforeClick && navigationRequests.length === 0;
          if (observation.error && !knownWebKitBoundary) throw observation.error;
          if (knownWebKitBoundary) {
            // Isolate a demonstrated WebKit/App Store link-activation boundary.
            // A new page.goto proves the web listing is available, not that the
            // preceding click opened it or handed it to the native store.
            context.off('request', onNavigation);
            const directPage = await context.newPage();
            let directBrowserNavigation;
            try {
              const response = await directPage.goto(expected.href, { waitUntil: 'domcontentloaded', timeout: 30000 });
              assert(response?.ok(), `Direct App Store navigation returned ${response?.status()}`);
              const finalURL = new URL(directPage.url());
              assert.equal(finalURL.hostname, 'apps.apple.com');
              assert(finalURL.pathname.endsWith(`/id${appId}`), 'Direct App Store navigation changed app identity');
              const title = await directPage.title();
              assert(title.trim(), 'Direct App Store page has no title');
              directBrowserNavigation = { verified: true, url: directPage.url(), status: response.status(), title, method: 'separate harness-initiated page.goto; not the CTA click result' };
            } finally { await directPage.close(); }
            hasBoundary = true;
            evidence.push({ label: expected.label, expectedURL: expected.href, click, navigationRequests, popupObserved: false, openedByClick: false, nativeAppStoreHandoffVerified: false, popupError: message(observation.error), directBrowserNavigation, status: 'unverified-external-app-navigation', method: 'trusted unprevented App Store link click had no browser navigation; separate direct listing navigation succeeded; native handoff unknown' });
          } else {
            popup = observation.popup;
            await popup.waitForLoadState('domcontentloaded', { timeout: 30000 });
            assert(/^https?:/.test(popup.url()), `CTA failed to open: ${popup.url()}`);
            evidence.push({ label: expected.label, expectedURL: expected.href, openedURL: popup.url(), title: await popup.title(), click, navigationRequests, popupObserved: true, openedByClick: true, status: 'passed', method: 'clicked CTA into anonymous popup; HTTP verification recorded separately' });
          }
        } finally {
          context.off('request', onNavigation);
          if (popup) await popup.close();
        }
      }
      if (hasBoundary) throw new UnverifiedExternalAppNavigation(evidence);
      return evidence;
    });
    result.mediaEvents = await page.evaluate(() => window.__hiPromoEvents || []);
    await check('return-to-category', async () => {
      await page.locator('[data-return]').last().click();
      await page.waitForURL(url => url.pathname === '/' && url.searchParams.get('view') === data.group);
      await page.locator(`[data-filter="${data.group}"][aria-pressed="true"]`).waitFor();
      const visibleGroups = await page.locator('.work-item:visible').evaluateAll(items => items.map(item => item.dataset.group));
      assert(visibleGroups.length > 0 && visibleGroups.every(group => group === data.group));
      return { url: page.url(), selectedGroup: data.group, visibleItems: visibleGroups.length };
    });
    await check('no-page-errors', async () => {
      assert.equal(result.pageErrors.length, 0, result.pageErrors.join('\n'));
      assert.equal(result.consoleErrors.length, 0, result.consoleErrors.join('\n'));
      return { pageErrors: 0, consoleErrors: 0 };
    });
    result.passed = result.boundaries.length === 0;
  } catch (error) {
    result.error = message(error);
    result.failedURL = page.url();
    await page.screenshot({ path: path.join(out, `${slug}-${engine}-${environment.name}-error.png`) }).catch(() => {});
  } finally {
    result.mediaEvents ||= await page.evaluate(() => window.__hiPromoEvents || []).catch(() => []);
    await Promise.allSettled(pendingResponses);
    await context.close();
    const requiredMediaChecks = ['initial-player-layout-and-no-prefetch', 'active-click-play-and-metadata', 'seek-forward-back-and-ended', 'browser-media-response-identity'];
    if (environment.name === 'desktop') requiredMediaChecks.push('desktop-volume-and-fullscreen');
    if (environment.name === 'desktop' && options.full) requiredMediaChecks.push('uninterrupted-full-playback');
    result.mediaVerification = { passed: requiredMediaChecks.every(name => result.checks.some(check => check.name === name && check.passed === true)), checks: requiredMediaChecks };
    result.status = result.error ? 'failed' : result.boundaries.length ? 'partial' : result.passed ? 'passed' : 'failed';
    result.finishedAt = new Date().toISOString();
    save();
    console.log(`${slug} ${engine}/${environment.name}: ${result.status === 'partial' ? 'PARTIAL App Store click/handoff unverified; media checks passed' : result.passed ? 'PASS' : `FAIL ${result.error}`}`);
  }
}

try {
  const projects = readContent();
  const playwrightRoot = path.resolve(options['playwright-root'] || root);
  const playwright = createRequire(path.join(playwrightRoot, 'package.json'))('playwright');
  receipt.playwright = { root: playwrightRoot, version: createRequire(path.join(playwrightRoot, 'package.json'))('playwright/package.json').version };
  save();
  for (const engine of engines) {
    let browser;
    try { browser = await playwright[engine].launch({ headless: true, ...(engine === 'chromium' ? { channel: 'chrome' } : {}) }); }
    catch (error) {
      for (const project of projects) for (const environment of environments) {
        receipt.results.push({ slug: project.slug, engine, environment: environment.name, localMp4Sha256: project.asset.localReference.mp4.sha256, passed: false, status: 'failed', checks: [{ name: 'engine-launch', passed: false, error: message(error) }], error: message(error) });
        console.log(`${project.slug} ${engine}/${environment.name}: FAIL engine launch`);
      }
      save();
      continue;
    }
    try { for (const project of projects) for (const environment of environments) await run(browser, engine, environment, project); }
    finally { await browser.close(); }
  }
  receipt.complete = true;
  receipt.expectedResults = projects.length * engines.length * environments.length;
  receipt.passed = receipt.results.length === receipt.expectedResults && receipt.results.every(result => result.passed);
} catch (error) { receipt.fatalError = message(error); }
receipt.finishedAt = new Date().toISOString();
receipt.failures = receipt.results.filter(result => !result.passed && result.status !== 'partial').length;
receipt.partialResults = receipt.results.filter(result => result.status === 'partial').length;
receipt.status = receipt.passed ? 'passed' : receipt.complete && !receipt.failures && receipt.partialResults ? 'partial' : 'failed';
save();
console.log(JSON.stringify({ passed: receipt.passed, status: receipt.status, complete: receipt.complete, results: receipt.results.length, failures: receipt.failures, partialResults: receipt.partialResults, receipt: receiptPath, ...(receipt.fatalError ? { fatalError: receipt.fatalError } : {}) }));
process.exitCode = receipt.passed ? 0 : receipt.status === 'partial' ? 2 : 1;
