const CACHE = 'alacena-v8';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))
  ));
  self.clients.claim();
});

// Only cache same-origin requests, never API calls
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Skip all external API calls
  if(url.origin !== location.origin) return;
  if(e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
