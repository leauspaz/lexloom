"use strict";

/* ── Lexloom Service Worker ────────────────────────────── */
// Cache-busting: bump this version on every deploy
const CACHE_VERSION = 1;
const CACHE_NAME = `lexloom-v${CACHE_VERSION}`;

// Files to pre-cache (the app shell)
const PRECACHE = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/space_efficient_loader.js",
  "/favicon.png",
  "/preview.png",
  "/manifest.json"
];

// ── Install: pre-cache app shell ─────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE))
      .catch((err) => console.error("[SW] Precache failed:", err))
  );
  // Skip waiting so the new SW activates immediately on next load
  self.skipWaiting();
});

// ── Activate: clean old caches, claim clients ──────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    ).then(() => self.clients.claim())
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
  if (url.pathname === "/sw.js") return;

  event.respondWith(
    caches.match(request).then((cached) => {
      // Return cached immediately if found
      if (cached) return cached;

      // Otherwise fetch and cache
      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      }).catch(() => {
        // Offline fallback: return cached index.html for navigation
        if (request.mode === "navigate") {
          return caches.match("/index.html");
        }
      });
    })
  );
});

// ── Message handling: respond to skip-waiting from page ─
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
