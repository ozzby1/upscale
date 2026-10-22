// End-to-end checks in a real Chromium against the deployed static files.
// Usage: node tests/browser-e2e.cjs _site
const assert = require('node:assert/strict'), fs = require('node:fs'), http = require('node:http'), path = require('node:path');
const { chromium } = require('playwright');
const root = path.resolve(process.argv[2] || '_site');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm' };
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
  const disc = (w = 128, h = 128) => { const c = new OffscreenCanvas(w, h), g = c.getContext('2d'); g.fillStyle = 'rgb(120,0,0)'; g.beginPath(); g.arc(w / 2, h / 2, Math.min(w, h) * .4, 0, 7); g.fill(); return c; };
  const drop = files => { const dt = new DataTransfer(); for (const f of files) dt.items.add(f); document.dispatchEvent(new DragEvent('drop', { dataTransfer: dt, bubbles: true, cancelable: true })); };
  const file = async (canvas, name) => new File([await canvas.convertToBlob({ type: 'image/png' })], name, { type: 'image/png' });
  const decode = async blob => { const bm = await createImageBitmap(blob, { premultiplyAlpha: 'none' }); const c = new OffscreenCanvas(bm.width, bm.height), g = c.getContext('2d'); g.drawImage(bm, 0, 0); return g.getImageData(0, 0, bm.width, bm.height); };
  const edge = img => { let n = 0, r = 0, g = 0, b = 0; for (let i = 0; i < img.data.length; i += 4) if (img.data[i + 3] > 20 && img.data[i + 3] < 235) { n++; r += img.data[i]; g += img.data[i + 1]; b += img.data[i + 2]; } return { n, r: r / n, g: g / n, b: b / n }; };
  window.E2E = { $, sleep, waitFor, disc, drop, file, decode, edge };
};

(async () => {
  await new Promise(resolve => server.listen(0, resolve));
  const base = `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  try {
    await page.goto(base); await page.evaluate(helpers);

    // 1. Semi-transparent edges keep their colour (no white halo) with both models.
    for (const model of ['fast', 'illustration']) {
      const result = await page.evaluate(async model => {
        const { $, waitFor, disc, drop, file, decode, edge, sleep } = E2E;
        $('model-' + model).click(); document.querySelector('.scale[data-scale="2"]').click();
        drop([await file(disc(), model + '.png')]);
        await waitFor(() => !$('upscale').disabled && $('filename').textContent === model + '.png');
        $('upscale').click(); await sleep(100);
        await waitFor(() => (!document.body.classList.contains('busy') && $('download').getAttribute('aria-disabled') === 'false') || (!$('message').hidden && $('message').textContent));
        if (!$('message').hidden) return { error: $('message').textContent };
        const out = await decode(await (await fetch($('download').href)).blob());
        return { width: out.width, height: out.height, edge: edge(out) };
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

    // 3. Batch: changing DPI after processing re-exports the ZIP instead of discarding results.
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
      return { hiddenWhileUpdating, rows: [...$('batch-list').children].map(li => li.lastChild.textContent), zipBytes: zip.length, signature: zip[0] === 0x50 && zip[1] === 0x4b };
    });
    assert.ok(batch.hiddenWhileUpdating && batch.signature && batch.zipBytes > 100, JSON.stringify(batch));
    assert.ok(batch.rows.every(text => /^Done/.test(text)), JSON.stringify(batch.rows));
    console.log('PASS: batch keeps AI results and re-exports ZIP after a DPI change');
    assert.deepEqual(errors, []);
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
