const CACHE = 'ivrit-v1';
const NEVER_CACHE = ['script.google.com'];
const CACHE_FIRST = ['.woff', '.woff2', 'fonts.googleapis', 'fonts.gstatic'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c =>
    c.addAll(['./index.html', './vocab.json', './icon.svg', './manifest.webmanifest'])
  ));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  if (NEVER_CACHE.some(s => url.includes(s))) return;
  if (CACHE_FIRST.some(s => url.includes(s))) {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      const c = res.clone();
      caches.open(CACHE).then(cache => cache.put(e.request, c));
      return res;
    })));
    return;
  }
  e.respondWith(
    fetch(e.request).then(res => {
      const c = res.clone();
      caches.open(CACHE).then(cache => cache.put(e.request, c));
      return res;
    }).catch(() => caches.match(e.request))
  );
});
