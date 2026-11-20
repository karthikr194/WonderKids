const REVISION = 'dev-revision';
const SHELL_CACHE = `wonderkids-shell-${REVISION}`;
const LESSON_CACHE = 'wonderkids-lesson-assets-v1';
const BUILD_ASSETS = [];
const SHELL = ['/', '/manifest.json', '/icon.svg', '/icon-192.png', '/icon-512.png', ...BUILD_ASSETS];
const managedAsset = path => /^\/(learning\/(pictures|audio)|audio\/phonics)\//.test(path);

self.addEventListener('install', event => {
  event.waitUntil(caches.open(SHELL_CACHE).then(cache => cache.addAll(SHELL)));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(key => key.startsWith('wonderkids-shell-') && key !== SHELL_CACHE).map(key => caches.delete(key))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(caches.open(SHELL_CACHE).then(async cache => (await cache.match('/')) ?? fetch(request)));
    return;
  }
  if (SHELL.includes(url.pathname)) {
    event.respondWith(caches.open(SHELL_CACHE).then(async cache => (await cache.match(request)) ?? fetch(request)));
    return;
  }
  if (!managedAsset(url.pathname)) return;
  event.respondWith(caches.open(LESSON_CACHE).then(async cache => {
    // Fetch a full same-origin representation so future visits can play the downloaded clip offline.
    const cached = await cache.match(url.href);
    if (cached) return cached;
    try {
      const response = await fetch(url.href);
      if (response.ok && /^(image|audio)\//.test(response.headers.get('content-type') ?? '')) {
        try { await cache.put(url.href, response.clone()); } catch { /* The asset remains usable online. */ }
      }
      return response;
    } catch {
      return new Response('', { status: 503 });
    }
  }));
});
