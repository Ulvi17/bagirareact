// Service Worker for VAPI resource caching
const CACHE_NAME = 'bagira-vapi-v1';
const VAPI_RESOURCES = [
  'https://esm.sh/@vapi-ai/web',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js'
];

// Install event - cache VAPI resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('🚀 Caching VAPI resources for faster loading');
        return cache.addAll(VAPI_RESOURCES);
      })
  );
});

// Fetch event - serve from cache when possible
self.addEventListener('fetch', (event) => {
  // Only handle VAPI-related requests
  if (VAPI_RESOURCES.some(url => event.request.url.includes(url))) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Return cached version if available, otherwise fetch from network
          return response || fetch(event.request);
        })
    );
  }
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
