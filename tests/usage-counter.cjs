const assert = require('node:assert/strict');
const fs = require('node:fs'), http = require('node:http');
const { chromium } = require('playwright');
const script = fs.readFileSync('usage-counter.js', 'utf8');
const target = 'photoupscale-online-8d06bf2f/upscaled-images';
let total = 0, exists = false, hits = 0, failNextHit = false, delayNextRead = false;
const server = http.createServer((req, res) => {
  const path = new URL(req.url, 'http://localhost').pathname;
  if (path === '/usage-counter.js') { res.setHeader('Content-Type', 'text/javascript; charset=utf-8'); return res.end(script); }
  // Keep the production HTML and CSP. Only the unrelated image-processing
  // module is stubbed, so native fetch must actually pass the site's policy.
  if (path === '/app.js') { res.setHeader('Content-Type', 'text/javascript; charset=utf-8'); return res.end(''); }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(fs.readFileSync(path.startsWith('/cs') ? 'cs/index.html' : 'index.html'));
});
async function setup(context) {
  await context.route('https://abacus.jasoncameron.dev/**', async route => {
    const request = route.request(), path = new URL(request.url()).pathname;
    assert.ok(path === '/get/' + target || path === '/hit/' + target);
    assert.equal(request.method(), 'GET'); assert.equal(request.postData(), null);
    const hit = path.startsWith('/hit/');
    if (hit) { hits++; total++; exists = true; }
    const value = total;
    if (hit && failNextHit) { failNextHit = false; return route.fulfill({ status: 503 }); }
    if (!hit && !exists) return route.fulfill({ status: 404, json: { error: 'Key not found' } });
    if (!hit && delayNextRead) { delayNextRead = false; await new Promise(resolve => setTimeout(resolve, 150)); }
    await route.fulfill({ json: { value } });
  });
}
async function expect(page, value) {
  await page.waitForFunction(value => document.getElementById('usage-counter').textContent.endsWith(': ' + value), String(value));
}
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch();
  try {
    const base = `http://127.0.0.1:${server.address().port}`;
    const first = await browser.newContext(), second = await browser.newContext();
    await setup(first); await setup(second);
    const a = await first.newPage(), b = await second.newPage();
    await a.goto(base); await b.goto(base + '/cs/');
    await expect(a, 0); await expect(b, 0); assert.equal(hits, 0);
    await a.evaluate(() => usageCounter.record()); await expect(a, 1);
    await b.reload(); await expect(b, 1);
    assert.match(await b.locator('#usage-counter').textContent(), /Celkem/);
    // Different browser contexts share only the external service, no storage.
    await b.evaluate(() => Promise.all([usageCounter.record(), usageCounter.record(), usageCounter.record()]));
    await expect(b, 4); await a.reload(); await expect(a, 4);
    assert.equal(hits, 4);
    console.log('PASS: two independent browser contexts, EN/CS, share one aggregate; one hit per completion, no hits on reads or reloads');
    delayNextRead = true;
    await a.evaluate(() => dispatchEvent(new Event('online')));
    await a.waitForTimeout(30);
    await a.evaluate(() => usageCounter.record()); await a.waitForTimeout(200);
    await expect(a, 5);
    console.log('PASS: delayed reads cannot overwrite a newer shared count');
    // A hit can commit but lose its response; do not automatically repeat it.
    failNextHit = true;
    await a.evaluate(() => usageCounter.record()); await a.waitForTimeout(200);
    assert.equal(hits, 6); await expect(a, 5);
    await a.reload(); await expect(a, 6); assert.equal(hits, 6);
    console.log('PASS: failure never rejects image completion or retries an ambiguous hit; next read restores the confirmed aggregate');
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
