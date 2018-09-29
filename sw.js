//to update CACHE_NAME change after restaurants-cache-v to your new version number
//this will delete all caches in the activate function
var CACHE_NAME = 'restaurants-cache-v1';
var REQUIRED_FILES = [
  '/',
  '/manifest.json',
  '/img/map.jpg',
  '/img/1.jpg',
  '/img/2.jpg',
  '/img/3.jpg',
  '/img/4.jpg',
  '/img/5.jpg',
  '/img/6.jpg',
  '/img/7.jpg',
  '/img/8.jpg',
  '/img/9.jpg',
  '/img/10.jpg',
  '/img/undefined.jpg',
  '/css/styles.css',
  '/js/idb.js',
  '/js/main.js',
  '/js/dbhelper.js',
  '/js/restaurant_info.js',
  '/restaurant.html',
  '/offline.html'
];

self.addEventListener('install', function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log('Opened cache:' + CACHE_NAME);
        return cache.addAll(REQUIRED_FILES);
      }).then(function () {
        // At this point everything has been cached
        return self.skipWaiting();
      })
  );
});

self.addEventListener('fetch', function (event) {
  const req = event.request;

  if (req.method === 'GET') {
    event.respondWith(
      caches.match(req).then(function (resp) {
        return resp || fetch(req).then(function (response) {

          // Check if we received a valid response
          if(!response || response.status !== 200 || response.type !== 'basic') {
            console.log("Not 200 or opaque response");
                  return response;
          }

          // IMPORTANT: Clone the request. A request is a stream and
          // can only be consumed once. Since we are consuming this
          // once by cache and once by the browser for fetch, we need
          // to clone the response.
          let fetchResponse = response.clone();

          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(req, fetchResponse);
          });

          return response;
        });
      }).catch(function (e) {
        console.log(e)
        return caches.match('offline.html');
      })
    );
  }


  function unableToResolve() {
    /* There's a couple of things we can do here.
       - Test the Accept header and then return one of the `offlineFundamentals`
         e.g: `return caches.match('/some/cached/image.png')`
       - You should also consider the origin. It's easier to decide what
         "unavailable" means for requests against your origins than for requests
         against a third party, such as an ad provider
       - Generate a Response programmaticaly, as shown below, and return that
    */

    console.log('WORKER: fetch request failed in both cache and network.');

    /* Here we're creating a response programmatically. The first parameter is the
       response body, and the second one defines the options for the response.
    */
    return new Response('<h1>Service Unavailable</h1>', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'text/html'
      })
    });
  }
});




//followed step by step from
//https://developers.google.com/web/fundamentals/primers/service-workers/
