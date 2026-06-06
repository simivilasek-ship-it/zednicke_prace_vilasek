// Service Worker pro offline podporu
const CACHE_NAME = 'zatepleni-vilasek-v4';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/poptavka/index.html',
  '/style.css',
  '/templatemo-amber-script.js',
  '/favicon.svg',
  '/favicon-32.png',
  '/apple-touch-icon.png',
  '/images/realizace_21.jpg',
  '/images/realizace_01.jpg',
  '/images/realizace_11.jpg',
  '/404.html'
];

// Instalace
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Service Worker: Cachování assets');
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.warn('Některé assety se nepodařilo cachovat:', err);
      });
    })
  );
  self.skipWaiting();
});

// Aktivace
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Mazání starého cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch - Network first, fallback na cache
self.addEventListener('fetch', event => {
  // Ignoruj non-GET requesty
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cachuj úspěšné responses
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });

        return response;
      })
      .catch(error => {
        // Fallback na cache
        console.log('Service Worker: Offline, používám cache');
        return caches.match(event.request).then(response => {
          return response || caches.match('/404.html');
        });
      })
  );
});
