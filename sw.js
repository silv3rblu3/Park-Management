// sw.js

const CACHE_NAME = 'omnihub-v1';

// These are all the files the app needs to function completely offline.
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './css/global.css',
    './css/components.css',
    './js/core.js',
    './js/stateManager.js',
    './js/notifications.js',
    './apps/inventory/template.js',
    './apps/inventory/app.js',
    './apps/fleet/template.js',
    './apps/fleet/app.js',
    './apps/winterization/template.js',
    './apps/winterization/app.js',
    './apps/first-aid/template.js',
    './apps/first-aid/app.js',
    // Cache the external libraries for offline barcode scanning and CSV parsing
    'https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js',
    'https://unpkg.com/html5-qrcode'
];

// Install Event: Caches all the files listed above
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Opened cache');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Fetch Event: When offline, it serves files from the cache instead of the network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Return the cached version if we have it, otherwise go to the network
            return response || fetch(event.request);
        })
    );
});

// Activate Event: Clears out old caches if you ever update the CACHE_NAME version
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});