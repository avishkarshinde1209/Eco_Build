/**
 * EcoBuild Smart - Service Worker (v3.0.0)
 * Enables 100% offline standalone application functionality,
 * caching all calculations, climate normals, botanical databases, and UI components.
 */

const CACHE_NAME = "ecobuild-app-v3.0.0";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/manifest.json",
  "/icons/icon.svg",
  "/icons/icon-192.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/ecobuild.ico",
  "/js/config.js",
  "/js/fallbackData.js",
  "/js/plantDatabase.js",
  "/js/models/sampleProjects.js",
  "/js/correlationEngine.js",
  "/js/api.js",
  "/js/calculations/runoffCalculator.js",
  "/js/calculations/waterCalculator.js",
  "/js/calculations/vegetationCalculator.js",
  "/js/calculations/carbonCalculator.js",
  "/js/calculations/energyCalculator.js",
  "/js/calculations/heatIslandCalculator.js",
  "/js/calculations/scoreCalculator.js",
  "/js/calculations/recoveryCalculator.js",
  "/js/calculations/environmentalCalculator.js",
  "/js/recommendations.js",
  "/js/validation.js",
  "/js/components/explainModal.js",
  "/js/components/mapModule.js",
  "/js/components/wizard.js",
  "/js/components/dashboard.js",
  "/js/components/stormwater.js",
  "/js/components/greenInfra.js",
  "/js/components/energy.js",
  "/js/components/biodiversity.js",
  "/js/components/technicalAnalysis.js",
  "/js/components/natureRecovery.js",
  "/js/components/scenarioStudio.js",
  "/js/components/history.js",
  "/js/components/methodology.js",
  "/js/components/dataSources.js",
  "/js/components/report.js",
  "/js/components/materialsView.js",
  "/js/components/wasteView.js",
  "/js/components/sitePlannerView.js",
  "/js/components/monitoringView.js",
  "/js/components/hero3d.js",
  "/js/components/homeView.js",
  "/js/components/installModal.js",
  "/js/app.js"
];

// Install: Cache critical application assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[ServiceWorker] Pre-caching offline application shell (v3.0.0)");
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up older cache versions
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[ServiceWorker] Removing obsolete cache:", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Stale-while-revalidate for local assets, network-first with cache fallback for APIs
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // For external live APIs (Open-Meteo, OpenStreetMap, Nominatim)
  if (url.origin !== self.location.origin) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // For internal local application files: Cache First with background refresh
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch((err) => {
        // Network offline; cached response will be served
      });

      return cachedResponse || fetchPromise;
    })
  );
});
