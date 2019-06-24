const CACHE_NAME = "ereyomi-v1";
const myURL = ["/", "index.html", "ereyomi.css", "ereyomi.js"];

self.addEventListener("install", event => {
  console.log("Service worker install event!");
  console.log(`${CACHE_NAME} installing!`);
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(myURL);
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => {
            return cacheName.startsWith("ereyomi-") && cacheName !== CACHE_NAME;
          })
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
});

self.addEventListener("fetch", event => {
  var requestUrl = new URL(event.request.url);

  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname === "/") {
      event.respondWith(caches.match("/index.html"));
      return;
    }
  }
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("message", event => {
  if (event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});
