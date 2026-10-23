/* ============================================================
   10,000 Hours — Service Worker
   Enables offline-ready PWA installation across desktop (Windows,
   macOS, Linux, ChromeOS) and mobile.
   Other apps share this origin (abhinav-prabhakar.github.io), so
   CacheStorage is shared too: only ever read or delete caches
   that start with CACHE_PREFIX.
   ============================================================ */
'use strict';

const CACHE_PREFIX = 'tenk-';
const CACHE_NAME = CACHE_PREFIX + 'v2';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './gallery.html',
  './theme.css',
  './theme.js',
  './store.js',
  './share-card.js',
  './share-card.css',
  './microskill.css',
  './site.webmanifest',
  './favicon.svg',
  './favicon-32.png',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png',
  './images/piano.jpg',
  './images/golfing.jpg',
  './images/chess.jpg',
  './images/cooking.jpg',
  './images/gym.jpg',
  './images/painting.jpg',
  './images/karting.jpg',
  './images/cali.jpg',
  './images/archery.jpg',
  './images/swimming.jpg',
  './images/boxing.jpg',
  './images/dancing.jpg',
  './images/basketball.jpg',
  './images/jee.jpg',
  './images/running.jpg',
  './images/guitar.jpg',
  './images/martial-arts.png',
  './images/cycling.jpg',
  './images/ice-skating.jpg',
  './images/coding.jpg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        await cache.addAll(PRECACHE_ASSETS);
      } catch (_) {
        // Fallback: cache individual items so one transient failure never breaks install
        await Promise.all(
          PRECACHE_ASSETS.map((asset) => cache.add(asset).catch(() => {}))
        );
      }
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        )
      )
    ])
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // Only handle same-origin requests or Google Fonts
  if (url.origin !== self.location.origin && !url.origin.includes('fonts.g')) {
    return;
  }

  // HTML page navigations: network first, falling back to cached shell
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          return (await cache.match(req)) ||
            (await cache.match('./')) ||
            cache.match('./index.html');
        })
    );
    return;
  }

  // Static assets: stale-while-revalidate / cache with network update
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => cache.match(req)).then((cached) => {
      const fetchPromise = fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});
