/* Service Worker for basic caching and background sync handling (T611/T612)
   This file will be processed by VitePWA (generateSW) when building.
*/
const CACHE_NAME = 'lms-static-v1';
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([OFFLINE_URL]);
    })
  );
});

self.addEventListener('fetch', (event: any) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    );
  }
});

// Simple sync event for queued actions
self.addEventListener('sync', (event: any) => {
  if (event.tag === 'lms-sync-queue') {
    event.waitUntil(processQueue());
  }
});

async function processQueue() {
  // Attempt to open the indexedDB queue via client message (main thread handles actual upload)
  // As a fallback, just skip — main app will retry when online.
  return Promise.resolve();
}

self.addEventListener('message', (event: any) => {
  // allow skipWaiting
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
