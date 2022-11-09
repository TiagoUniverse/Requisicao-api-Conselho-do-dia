const CACHE_NAME = `ConselhoDoDia-v1`;

// Use the install event to pre-cache all initial resources.
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    cache.addAll([
      './index.html' 

    ]);
  })());
});

self.addEventListener('message', function (event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    try {
      // Try to fetch the resource from the network.
      const fetchResponse = await fetch(event.request);

      // Save the resource in the cache.
      cache.put(event.request, fetchResponse.clone());

      // And return it.
      return fetchResponse;
    } catch (e) {
      // Fetching didn't work get the resource from the cache.
      const cachedResponse = await cache.match(event.request);

      // And return it.
      return cachedResponse;
    }
  })());
});


//Request a sync
async function requestBackgroundSync() {
  await self.registration.sync.register('my-tag-name');
}

self.addEventListener('sync', event => {
  if (event.tag === 'my-tag-name') {
      event.waitUntil(doTheWork());
  }
});


// periodic sync
async function registerPeriodicSync() {
  await registration.periodicSync.register('get-daily-news', {
      minInterval: 24 * 60 * 60 * 1000
  });
}

self.addEventListener('periodicsync', event => {
  if (event.tag === 'get-daily-news') {
      event.waitUntil(getDailyNewsInCache());
  }
});