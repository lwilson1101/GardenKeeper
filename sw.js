const CACHE = ‘gardenkeeper-v1’;
const ASSETS = [
‘./’,
‘./index.html’,
‘./manifest.json’,
‘./icon-192.svg’,
‘./icon-512.svg’,
‘https://fonts.googleapis.com/css2?family=Yeseva+One&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap’
];

// Install — cache all core assets
self.addEventListener(‘install’, e => {
e.waitUntil(
caches.open(CACHE).then(cache => cache.addAll(ASSETS))
);
self.skipWaiting();
});

// Activate — clean up old caches
self.addEventListener(‘activate’, e => {
e.waitUntil(
caches.keys().then(keys =>
Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
)
);
self.clients.claim();
});

// Fetch — serve from cache, fall back to network
self.addEventListener(‘fetch’, e => {
e.respondWith(
caches.match(e.request).then(cached => {
if (cached) return cached;
return fetch(e.request).then(response => {
// Cache fresh responses for next time
if (response && response.status === 200) {
const copy = response.clone();
caches.open(CACHE).then(cache => cache.put(e.request, copy));
}
return response;
}).catch(() => caches.match(’./index.html’));
})
);
});
