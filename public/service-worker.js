const CACHE_NAME="budget-tracker"
const DATA_CACHE_NAME = "budget-trackerv1"
const FILES_TO_CACHE = [
    "./",
  "./index.html",
  "./manifest.webmanifest",
  "./style.css",
  "./index.js"
]


// install
self.addEventListener("install", function (evt) {
    // pre cache image data
    // pre cache all static assets
    evt.waitUntil(
      caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
    );
  
    // tell the browser to activate this service worker immediately once it
    // has finished installing
    self.skipWaiting();
  });

  
  // fetch
  self.addEventListener("fetch", function(evt) {
    if (evt.request.url.includes("/api/")) {
      evt.respondWith(
        caches.open(DATA_CACHE_NAME).then(cache => {
          return fetch(evt.request)
            .then(response => {
              // If the response was good, clone it and store it in the cache.
              if (response.status === 200) {
                cache.put(evt.request.url, response.clone());
              }
  
              return response;
            })
            .catch(err => {
              // Network request failed, try to get it from the cache.
              return cache.match(evt.request);
            });
        }).catch(err => console.log(err))
      );
  
      return;
    }
  
    evt.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(evt.request).then(response => {
          return response || fetch(evt.request);
        });
      })
    );
  });
  
  // activate
  self.addEventListener("activate", function(evt) {
    evt.waitUntil(
      caches.keys().then(keyList => {
        return Promise.all(keyList.map(function (key, i) {
            if (cacheKeeplist.indexOf(key) === -1) {
              return caches.delete(keyList[i]);
            }
          }));
      })
    );
  
    self.clients.claim();
  });

  
// // install event handler
// self.addEventListener('install', event => {
//     event.waitUntil(
//       caches.open(CACHE_NAME).then( cache => {
//         return cache.addAll(FILES_TO_CACHE);
//       })
//     );
//     console.log('Install');
//     self.skipWaiting();
//   });
  
//   // retrieve assets from cache
//   self.addEventListener('fetch', event => {
//     event.respondWith(
//       caches.match(event.request).then( response => {
//         return response || fetch(event.request);
//       })
//     );
//   });
//   self.addEventListener("activate", function(evt) {
//     evt.waitUntil(
//       caches.keys().then(keyList => {
//         return Promise.all(
//           keyList.map(key => {
//             if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
//               console.log("Removing old cache data", key);
//               return caches.delete(key);
//             }
//           })
//         );
//       })
//     );

//     self.clients.claim();
//   });
//   self.addEventListener('fetch', function(evt) {
//     evt.respondWith(
//         caches.open(CACHE_NAME).then(cache => {
//           return cache.match(evt.request).then(response => {
//             return response || fetch(evt.request);
//           });
//         })
//       );
//     });
  