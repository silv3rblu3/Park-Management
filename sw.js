// sw.js

const CACHE_NAME = 'omnihub-v6'; 

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
    './apps/parts/template.js',
    './apps/parts/app.js',
    
    // Icons
    './assets/icon-192.png',
    './assets/icon-512.png',

    // Libraries
    'https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js',
    'https://unpkg.com/html5-qrcode',
    'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
];

self.addEventListener('install', (event) => {
    self.skipWaiting(); 
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

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
        }).then(() => {
            // CRITICAL: This forces the Service Worker to take over instantly, 
            // allowing Chrome to validate the PWA install check immediately.
            return self.clients.claim(); 
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse; 
            }
            
            return fetch(event.request).catch(() => {
                // If the network fails (Chrome's offline test), always fall back to index.html
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});