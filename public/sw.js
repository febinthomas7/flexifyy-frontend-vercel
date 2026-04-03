const CACHE_NAME = "flexifyy-full-v1";

// 1. Pre-cache the "Shell" (The files that start the app)
const PRE_CACHE = [
  "/",
  "/index.html",
  "/logo2.png",
  "/manifest.json",
  "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js",
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("SW: Pre-caching shell...");
      return cache.addAll(PRE_CACHE);
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
  // Clean up old caches if version changes
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
      );
    }),
  );
});

// 2. The "Catch-All" Fetch Strategy
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return if found in cache
      if (cachedResponse) {
        return cachedResponse;
      }

      // Otherwise, fetch from network and SAVE to cache
      return fetch(event.request)
        .then((networkResponse) => {
          // Only cache successful GET requests
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            (networkResponse.type !== "basic" &&
              !event.request.url.includes("cdnjs"))
          ) {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
            console.log("SW: Automatically Cached ->", event.request.url);
          });

          return networkResponse;
        })
        .catch(() => {
          // Offline Fallback for navigation (the Black Screen fix)
          if (event.request.mode === "navigate") {
            return caches.match("/index.html");
          }
        });
    }),
  );
});
