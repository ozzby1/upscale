// End-to-end checks in a real Chromium against the deployed static files.
// Usage: node tests/browser-e2e.cjs _site
const assert = require('node:assert/strict'), fs = require('node:fs'), http = require('node:http'), path = require('node:path');
const { chromium } = require('playwright');
const root = path.resolve(process.argv[2] || '_site');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm', '.webmanifest': 'application/manifest+json', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  let file = path.join(root, decodeURIComponent(new URL(req.url, 'http://local').pathname));
  if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

// Helpers evaluated inside the page.
const helpers = () => {
  const $ = id => document.getElementById(id), sleep = ms => new Promise(r => setTimeout(r, ms));
  const waitFor = async (fn, ms = 300000) => { const start = performance.now(); while (performance.now() - start < ms) { const v = fn(); if (v) return v; await sleep(50); } throw new Error('timeout'); };
  const disc = (w = 128, h = 128, opaque = false) => { const c = new OffscreenCanvas(w, h), g = c.getContext('2d'); if (opaque) { g.fillStyle = '#e8eef5'; g.fillRect(0, 0, w, h); } g.fillStyle = 'rgb(120,0,0)'; g.beginPath(); g.arc(w / 2, h / 2, Math.min(w, h) * .4, 0, 7); g.fill(); return c; };
  const drop = files => { const dt = new DataTransfer(); for (const f of files) dt.items.add(f); document.dispatchEvent(new DragEvent('drop', { dataTransfer: dt, bubbles: true, cancelable: true })); };
  const file = async (canvas, name) => new File([await canvas.convertToBlob({ type: 'image/png' })], name, { type: 'image/png' });
  const decode = async blob => { const bm = await createImageBitmap(blob, { premultiplyAlpha: 'none' }); const c = new OffscreenCanvas(bm.width, bm.height), g = c.getContext('2d'); g.drawImage(bm, 0, 0); return g.getImageData(0, 0, bm.width, bm.height); };
  const edge = img => { let n = 0, r = 0, g = 0, b = 0; for (let i = 0; i < img.data.length; i += 4) if (img.data[i + 3] > 20 && img.data[i + 3] < 235) { n++; r += img.data[i]; g += img.data[i + 1]; b += img.data[i + 2]; } return { n, r: r / n, g: g / n, b: b / n }; };
  const finished = () => (!document.body.classList.contains('busy') && $('download').getAttribute('aria-disabled') === 'false') || (!$('message').hidden && $('message').textContent);
  const load = async (canvas, name) => { drop([await file(canvas, name)]); await waitFor(() => !$('upscale').disabled && $('filename').textContent === name); };
  const upscale = async () => {
    $('upscale').click(); await sleep(100); await waitFor(finished);
    if (!$('message').hidden) return { error: $('message').textContent };
    const out = await decode(await (await fetch($('download').href)).blob());
    return { width: out.width, height: out.height, edge: edge(out), name: $('download').download };
  };
  const set = (id, value, type = 'input') => { $(id).value = value; $(id).dispatchEvent(new Event(type)); };
  window.E2E = { $, sleep, waitFor, disc, drop, file, decode, edge, load, upscale, set };
};

(async () => {
  await new Promise(resolve => server.listen(0, resolve));
  const base = `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  try {
    await page.goto(base); await page.evaluate(helpers);

    // 1. Semi-transparent edges keep their colour (no white halo) with every model.
    for (const model of ['photo', 'fast', 'illustration']) {
      const result = await page.evaluate(async model => {
        const { $, disc, load, upscale } = E2E;
        $('model-' + model).click(); document.querySelector('.scale[data-scale="2"]').click();
        await load(disc(), model + '.png');
        return upscale();
      }, model);
      assert.equal(result.error, undefined, model + ': ' + result.error);
      assert.equal(result.width, 256); assert.equal(result.height, 256);
      assert.ok(result.edge.n > 100 && result.edge.g < 40 && result.edge.b < 40, `${model}: semi-transparent edge stays dark red, got ${JSON.stringify(result.edge)}`);
      console.log(`PASS: ${model} keeps semi-transparent edge colour`, JSON.stringify(result.edge));
    }

    // 2. Oversized image is rejected from its header, before decoding.
    const oversized = await page.evaluate(async () => {
      const { $, waitFor, drop } = E2E, bytes = new Uint8Array(64), view = new DataView(bytes.buffer);
      bytes.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13, 73, 72, 68, 82]); view.setUint32(16, 20000); view.setUint32(20, 20000);
      $('message').hidden = true; drop([new File([bytes], 'huge.png', { type: 'image/png' })]);
      return waitFor(() => !$('message').hidden && $('message').textContent, 10000);
    });
    assert.match(oversized, /12 MP/); console.log('PASS: oversized image rejected from header');

    // 3. Print format: AI scale is chosen automatically and the output fills the paper.
    const print = await page.evaluate(async () => {
      const { $, disc, load, upscale, set, waitFor } = E2E;
      $('model-fast').click(); $('message').hidden = true;
      await load(disc(64, 48, true), 'print.png');
      $('size-print').click(); set('paper', 'custom', 'change'); set('paper-width', '2'); set('paper-height', '1.5'); set('dpi', '300', 'change');
      const plan = $('print-plan').textContent, pixels = $('output-pixels').textContent;
      const first = await upscale();
      set('dpi', '150', 'change');
      const rescale = await waitFor(() => !$('message').hidden && $('message').textContent, 10000);
      $('size-scale').click(); set('dpi', '300', 'change');
      return { plan, pixels, first, rescale, cleared: $('download').hidden };
    });
    assert.equal(print.first.error, undefined, print.first.error);
    assert.equal(print.first.width, 236); assert.equal(print.first.height, 177);
    assert.match(print.plan, /AI 4×/); assert.match(print.pixels, /236 × 177/);
    assert.match(print.first.name, /-2x1\.5cm-300dpi\.png$/);
    assert.match(print.rescale, /different AI scale/); assert.ok(print.cleared);
    console.log('PASS: print format picks AI 4×, resamples to 236 × 177 px and asks to rerun when the AI scale changes');

    // 4. Model comparison on a crop: all three models, crop at output scale, "use" switches model.
    const preview = await page.evaluate(async () => {
      const { $, disc, load, waitFor } = E2E;
      $('message').hidden = true; $('model-photo').click();
      await load(disc(160, 120, true), 'preview.png');
      $('preview-open').click();
      await waitFor(() => $('preview-dialog').open && !document.body.classList.contains('busy') && $('preview-grid').children.length === 4, 300000);
      const cards = [...$('preview-grid').children].map(card => ({ title: card.querySelector('figcaption').textContent, width: card.querySelector('img').naturalWidth, shown: card.querySelector('img').width, ready: !card.querySelector('img').hidden, use: card.querySelector('button')?.disabled }));
      [...$('preview-grid').children][2].querySelector('button').click();
      return { cards, open: $('preview-dialog').open, illustrationActive: $('model-illustration').classList.contains('active') };
    });
    assert.ok(preview.cards.every(card => card.ready && card.shown === 240), JSON.stringify(preview.cards));
    assert.equal(preview.cards[0].width, 120); assert.ok(preview.cards.slice(1).every(card => card.width === 240), JSON.stringify(preview.cards));
    assert.ok(preview.cards.slice(1).every(card => card.use === false), JSON.stringify(preview.cards));
    assert.equal(preview.open, false); assert.ok(preview.illustrationActive);
    console.log('PASS: crop preview runs all models and "use this model" selects it');

    // 5. Batch: changing DPI after processing re-exports the ZIP instead of discarding results.
    const batch = await page.evaluate(async () => {
      const { $, waitFor, disc, file, sleep } = E2E;
      $('model-illustration').click();
      const input = $('batch-files'), dt = new DataTransfer();
      dt.items.add(await file(disc(40, 30), 'a.png')); dt.items.add(await file(disc(30, 40), 'b.png'));
      input.files = dt.files; input.dispatchEvent(new Event('change'));
      $('batch-start').click(); await sleep(100);
      await waitFor(() => !document.body.classList.contains('busy') && !$('batch-download').hidden);
      const first = $('batch-download').href;
      $('dpi').value = '150'; $('dpi').dispatchEvent(new Event('input'));
      const hiddenWhileUpdating = $('batch-download').hidden;
      await waitFor(() => !$('batch-download').hidden && $('batch-download').href !== first, 60000);
      const zip = new Uint8Array(await (await fetch($('batch-download').href)).arrayBuffer());
      const rows = [...$('batch-list').children].map(li => li.lastChild.textContent);
      $('batch-clear').click();
      return { hiddenWhileUpdating, rows, zipBytes: zip.length, signature: zip[0] === 0x50 && zip[1] === 0x4b };
    });
    assert.ok(batch.hiddenWhileUpdating && batch.signature && batch.zipBytes > 100, JSON.stringify(batch));
    assert.ok(batch.rows.every(text => /^Done/.test(text)), JSON.stringify(batch.rows));
    console.log('PASS: batch keeps AI results and re-exports ZIP after a DPI change');

    // 6. PWA: manifest, service worker, cross-origin isolation, offline use, share target.
    const manifest = await page.evaluate(async () => (await fetch(document.querySelector('link[rel=manifest]').href)).json());
    assert.equal(manifest.display, 'standalone'); assert.ok(manifest.icons.length >= 3 && manifest.share_target);
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.reload(); await page.evaluate(helpers);
    const isolated = await page.evaluate(() => ({ controlled: Boolean(navigator.serviceWorker.controller), isolated: crossOriginIsolated }));
    assert.deepEqual(isolated, { controlled: true, isolated: true });
    // Multi-threaded WASM once isolated; this run also caches the model for offline use.
    const threaded = await page.evaluate(async () => { const { $, disc, load, upscale } = E2E; $('model-illustration').click(); await load(disc(48, 48), 'threads.png'); return upscale(); });
    assert.equal(threaded.error, undefined, threaded.error);
    console.log('PASS: service worker controls the page, cross-origin isolated, upscale works with threaded WASM');
    await context.setOffline(true);
    await page.reload(); await page.evaluate(helpers);
    const offline = await page.evaluate(async () => { const { $, disc, load, upscale } = E2E; $('model-illustration').click(); await load(disc(48, 48), 'offline.png'); return upscale(); });
    await context.setOffline(false);
    assert.equal(offline.error, undefined, offline.error); assert.equal(offline.width, 96);
    console.log('PASS: app and illustration model work offline after first use');
    const shared = await page.evaluate(async () => {
      const { file, disc } = E2E, form = new FormData();
      form.append('images', await file(disc(50, 40), 'shared-photo.png'));
      const response = await fetch('./share-target', { method: 'POST', body: form });
      return { redirected: response.redirected, url: response.url };
    });
    assert.ok(shared.redirected && /\?shared=1$/.test(shared.url), JSON.stringify(shared));
    await page.goto(base + '?shared=1'); await page.evaluate(helpers);
    const sharedName = await page.evaluate(() => E2E.waitFor(() => E2E.$('filename').textContent, 10000));
    assert.equal(sharedName, 'shared-photo.png');
    console.log('PASS: share target hands shared images to the app');
    // SEO metadata must survive localization; the guide must work without app JS.
    for (const route of ['', 'cs/', 'info/']) {
      await page.goto(base + route);
      if (route !== 'info/') await page.waitForFunction(() => document.documentElement.lang && document.querySelector('.brand'));
      const metadata = await page.evaluate(() => ({ title: document.title, canonical: document.querySelector('link[rel="canonical"]').href, socialTitle: document.querySelector('meta[property="og:title"]').content, description: document.querySelector('meta[name="description"]').content, socialDescription: document.querySelector('meta[property="og:description"]').content }));
      assert.equal(metadata.title, metadata.socialTitle);
      assert.equal(metadata.description, metadata.socialDescription);
      assert.equal(metadata.canonical, 'https://photoupscale.online/' + route);
      for (const width of [277, 320, 375, 1280]) {
        await page.setViewportSize({ width, height: 850 });
        const layout = await page.evaluate(() => {
          const brand = document.querySelector('.brand').getBoundingClientRect(), languages = document.querySelector('.languages').getBoundingClientRect(), main = document.querySelector('main').getBoundingClientRect();
          return { overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth, overlap: brand.right > languages.left, headerRight: languages.right, contentRight: main.right - parseFloat(getComputedStyle(document.querySelector('main')).paddingRight) };
        });
        assert.equal(layout.overflow, false, route + ' overflow at ' + width);
        assert.equal(layout.overlap, false, route + ' header overlap at ' + width);
        assert.ok(Math.abs(layout.headerRight - layout.contentRight) < 1, JSON.stringify(layout));
      }
    }
    assert.equal(await page.locator('.faq-item').count(), 9);
    console.log('PASS: localized SEO metadata and English guide render correctly; header aligns without overflow at 277, 320, 375 and 1280 px');
    assert.deepEqual(errors, []);
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
