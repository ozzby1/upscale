// Verify the built, crawlable site rather than just the source templates.
// Usage: node tests/seo.cjs _site
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { parseHTML, DOMParser } = require('linkedom');
const root = path.resolve(process.argv[2] || '_site');
const origin = 'https://photoupscale.online';
const pages = ['/', '/cs/', '/info/'];
function fileFor(url) {
  const pathname = decodeURIComponent(new URL(url, origin).pathname);
  return path.join(root, pathname.endsWith('/') ? pathname + 'index.html' : pathname);
}
const documents = new Map();
for (const route of pages) {
  const { document: d } = parseHTML(fs.readFileSync(fileFor(route), 'utf8'));
  documents.set(route, d);
  assert.equal(d.querySelectorAll('link[rel="canonical"]').length, 1, route + ': one canonical');
  assert.equal(d.querySelector('link[rel="canonical"]').href, origin + route);
  assert.ok(d.title.length > 20 && d.title.length < 85, route + ': descriptive title');
  assert.ok(d.querySelector('meta[name="description"]').content.length > 70);
  assert.match(d.querySelector('meta[name="robots"]').content, /^index,follow/);
  assert.equal(d.querySelectorAll('h1').length, 1, route + ': one visible main heading');
  assert.equal(d.querySelector('meta[property="og:url"]').content, origin + route);
  assert.equal(d.querySelector('meta[property="og:title"]').content, d.title);
  assert.ok(fs.existsSync(fileFor(d.querySelector('meta[property="og:image"]').content)));
  const graph = [...d.querySelectorAll('script[type="application/ld+json"]')].flatMap(s => JSON.parse(s.textContent)['@graph']);
  assert.ok(graph.some(n => n['@type'] === 'WebPage' && n.url === origin + route));
  assert.ok(graph.every(n => !n.aggregateRating && !n.review), 'No invented reviews or ratings');
  for (const a of d.querySelectorAll('a[href]')) {
    const url = new URL(a.getAttribute('href'), origin + route);
    if (url.origin !== origin) continue;
    assert.ok(fs.existsSync(fileFor(url.href)), route + ': link target exists ' + url.href);
    if (url.hash) {
      const target = url.pathname === route ? d : parseHTML(fs.readFileSync(fileFor(url.href), 'utf8')).document;
      assert.ok(target.getElementById(decodeURIComponent(url.hash.slice(1))), 'Anchor exists: ' + url.href);
    }
  }
}
for (const route of ['/', '/cs/']) {
  const d = documents.get(route);
  const alternatives = Object.fromEntries([...d.querySelectorAll('link[rel="alternate"][hreflang]')].map(a => [a.hreflang, a.href]));
  assert.deepEqual(alternatives, { en: origin + '/', cs: origin + '/cs/', 'x-default': origin + '/' });
  assert.ok([...d.querySelectorAll('footer a')].some(a => new URL(a.href, origin + route).pathname === '/info/'));
}
console.log('PASS: canonical URLs, reciprocal language annotations, social metadata, structured data and crawlable internal links');
const info = documents.get('/info/');
const graph = JSON.parse(info.querySelector('script[type="application/ld+json"]').textContent)['@graph'];
const questions = graph.find(n => n['@type'] === 'FAQPage').mainEntity;
assert.equal(questions.length, info.querySelectorAll('.faq-item').length);
for (const q of questions) {
  assert.ok(info.querySelector('article').textContent.includes(q.name));
  assert.ok(info.querySelector('article').textContent.includes(q.acceptedAnswer.text));
}
assert.equal(info.querySelectorAll('script[type="module"]').length, 0, 'Guide does not start the image-processing app');
console.log('PASS: English guide and FAQ answers are present in static HTML and match their structured data');
const sitemap = new DOMParser().parseFromString(fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8'), 'text/xml');
assert.deepEqual([...sitemap.querySelectorAll('url > loc')].map(n => n.textContent).sort(), pages.map(p => origin + p).sort());
const robots = fs.readFileSync(path.join(root, 'robots.txt'), 'utf8');
assert.match(robots, /User-agent: \*\s+Allow: \//);
assert.match(robots, /Sitemap: https:\/\/photoupscale\.online\/sitemap\.xml/);
assert.ok(!/^Disallow: \/\s*$/m.test(robots), 'Do not block the entire site');
const llms = fs.readFileSync(path.join(root, 'llms.txt'), 'utf8');
assert.match(llms, /^# Photoupscale.online/);
for (const route of pages) assert.ok(llms.includes(origin + route));
console.log('PASS: sitemap, robots.txt and llms.txt are included in the deployable site');
