const CACHE_NAME = 'md-preview-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles/style.css',
  './scripts/script.js',
  './manifest.json',
  './assets/favicon/favicon.png',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/marked/12.0.0/marked.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
