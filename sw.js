/* PhotoUpscale service worker.
 * - Offline: app shell is precached; vendor runtimes and AI models are cached on
 *   first use (stale-while-revalidate, ETag-aware so unchanged files are not rewritten).
 * - Cross-origin isolation: adds COOP/COEP headers so the page can use
 *   multi-threaded WASM (GitHub Pages cannot send these headers itself).
 * - Android share target: stores shared images and redirects to the app.
 * BUILD is replaced by the deploy script with the commit SHA. */
const BUILD = '__BUILD__';
const SHELL = `upscale-shell-${BUILD}`, ASSETS = 'upscale-assets-v1', SHARE = 'upscale-share';
const scope = new URL(self.registration.scope);
const shellFiles = ['./', './cs/', './app.js?v=11', './info/', './usage-counter.js?v=2', './manifest.webmanifest', './cs/manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];
const isolationHeaders = { 'Cross-Origin-Opener-Policy': 'same-origin', 'Cross-Origin-Embedder-Policy': 'require-corp' };

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL);
    // One missing file must not prevent installation.
    await Promise.all(shellFiles.map(path => cache.add(new Request(new URL(path, scope), { cache: 'reload' })).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) if (name.startsWith('upscale-shell-') && name !== SHELL) await caches.delete(name);
    await self.clients.claim();
  })());
});

function isolated(response) {
  if (!response || response.type === 'opaque' || response.type === 'opaqueredirect' || response.status === 0) return response;
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(isolationHeaders)) headers.set(name, value);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

async function networkFirst(request) {
  const cache = await caches.open(SHELL);
  try {
    const response = await fetch(request);
    if (response.ok) await cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await cache.match(request, { ignoreSearch: request.mode === 'navigate' })
      || (request.mode === 'navigate' ? await cache.match(new URL(new URL(request.url).pathname.includes('/cs/') ? './cs/' : './', scope)) : null);
    if (cached) return cached;
    throw error;
  }
}

async function staleWhileRevalidate(request, event) {
  const cache = await caches.open(ASSETS), cached = await cache.match(request);
  const refresh = fetch(request).then(async response => {
    if (response.ok && response.status === 200) {
      const tag = response.headers.get('etag');
      if (!cached || !tag || cached.headers.get('etag') !== tag) await cache.put(request, response.clone());
    }
    return response;
  });
  if (cached) { event.waitUntil(refresh.catch(() => {})); return cached; }
  return refresh;
}

async function receiveShare(request) {
  const data = await request.formData(), cache = await caches.open(SHARE);
  for (const old of await cache.keys()) await cache.delete(old);
  const files = data.getAll('images').filter(file => typeof file !== 'string').slice(0, 10);
  await Promise.all(files.map((file, index) => cache.put(new Request(new URL(`./__shared/${index}`, scope)),
    new Response(file, { headers: { 'content-type': file.type || 'application/octet-stream', 'x-file-name': encodeURIComponent(file.name || `image-${index + 1}`) } }))));
  return Response.redirect(new URL(`./?shared=${files.length}`, request.url).href, 303);
}

self.addEventListener('fetch', event => {
  const { request } = event, url = new URL(request.url);
  if (url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
  if (request.method === 'POST' && url.pathname.endsWith('/share-target')) { event.respondWith(receiveShare(request)); return; }
  if (request.method !== 'GET' || request.headers.has('range')) return;
  const path = url.pathname.slice(scope.pathname.length);
  const asset = /^(vendor|models)\//.test(path);
  event.respondWith((asset ? staleWhileRevalidate(request, event) : networkFirst(request)).then(isolated));
});
