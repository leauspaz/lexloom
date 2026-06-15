"use strict";

/* ── Lexloom Service Worker ────────────────────────────── */
// Cache-busting: bump this version on every deploy
const CACHE_VERSION = 1;
const CACHE_NAME = `lexloom-v${CACHE_VERSION}`;

// Relative paths — works on GitHub Pages subdirectories
const PRECACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./space_efficient_loader.js",
  "./favicon.png",
  "./preview.png",
  "./manifest.json"
];

// ── Install: pre-cache app shell ─────────────────────────
self.addEventListener("install", (event) => {
  console.log("[SW] Installing v" + CACHE_VERSION);

  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      console.log("[SW] Opened cache, adding " + PRECACHE.length + " items");

      // Try to add all, but if any fail, add individually so we know which one
      try {
        await cache.addAll(PRECACHE);
        console.log("[SW] Precache complete");
      } catch (err) {
        console.warn("[SW] cache.addAll failed, trying individual adds...");
        for (const url of PRECACHE) {
          try {
            await cache.add(url);
            console.log("[SW] Cached:", url);
          } catch (e) {
            console.warn("[SW] Failed to cache:", url, "—", e.message);
          }
        }
      }
    })()
  );

  self.skipWaiting();
});

// ── Activate: clean old caches, claim clients ──────────────
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating v" + CACHE_VERSION);
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log("[SW] Deleting old cache:", name);
            return caches.delete(name);
          })
      )
    ).then(() => {
      console.log("[SW] Claiming clients");
      return self.clients.claim();
    })
  );
});

// ── Fetch: cache-first for same-origin, network for rest ─
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Skip cross-origin (Google Sheets, CDNs, analytics)
  if (url.origin !== self.location.origin) return;

  // Skip the service worker itself
  if (url.pathname.endsWith("sw.js")) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return caches.match(request, { ignoreSearch: true }).then((cachedNoQuery) => {
        if (cachedNoQuery) return cachedNoQuery;

        return fetch(request).then((response) => {
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response;
          }
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        }).catch(() => {
          if (request.mode === "navigate") {
            return caches.match("./index.html");
          }
        });
      });
    })
  );
});

// ── Message handling ─
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    console.log("[SW] Skip waiting requested");
    self.skipWaiting();
  }
});
