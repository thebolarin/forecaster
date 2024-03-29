self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('forecaster').then(cache => {
            return cache.addAll([
                '/',
                '/index.html',
                '/style.css',
                '/scripts/index.js',
                '/assets/favicon/android-chrome-512x512.png'
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
