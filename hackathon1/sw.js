// Nom du cache
const cacheName = 'signalement-panne-v1';
const assets = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  'https://unpkg.com/leaflet/dist/leaflet.js',
  'https://unpkg.com/leaflet/dist/leaflet.css',
];

// Installation du Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// Activation du Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker activé');
});

// Intercepter les requêtes pour renvoyer les données en cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});



