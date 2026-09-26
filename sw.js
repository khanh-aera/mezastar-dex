/* Mezastar Binder service worker. Bump VERSION whenever the site changes. */
const VERSION = "mezastar-v15";
const SHELL = ["./", "index.html", "assets/style.css", "assets/app.js",
  "data/roster.json", "data/bosses.json", "data/typechart.json", "data/pool.json",
  "island/data/sprites.json", "island/data/pokedex.json",
  "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  const isArt = url.pathname.includes("/img/") || url.pathname.includes("/icons/") || url.pathname.includes("/sprites/");
  if (isArt) {
    /* art never changes: cache first so the arcade visit works offline */
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
      const copy = r.clone();
      caches.open(VERSION).then(c => c.put(req, copy));
      return r;
    })));
    return;
  }
  /* pages and data: fresh when online, cache when not */
  e.respondWith(fetch(req).then(r => {
    const copy = r.clone();
    caches.open(VERSION).then(c => c.put(req, copy));
    return r;
  }).catch(() => caches.match(req).then(hit => hit || caches.match("index.html"))));
});
