// Service worker de FRIPE.
//
// - Les fichiers statiques versionnés de Next (/_next/static) : cache d'abord,
//   ils ne changent jamais à URL égale.
// - Les pages : réseau d'abord, la dernière version en cache si le réseau
//   manque, et une page « hors ligne » en dernier recours. L'historique vit
//   dans IndexedDB, donc il reste consultable sans réseau.
// - Les routes /api ne sont jamais mises en cache : une analyse demande le
//   réseau, et la réponse de connexion porte un cookie.

const VERSION = "fripe-v1";
const STATIQUE = `${VERSION}-statique`;
const PAGES = `${VERSION}-pages`;
const PRECACHE = ["/offline.html", "/icons/icon.svg", "/icons/icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(STATIQUE).then((c) => c.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cles) => Promise.all(cles.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;

  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/")) {
    event.respondWith(
      caches.match(req).then(
        (enCache) =>
          enCache ||
          fetch(req).then((rep) => {
            if (rep.ok) {
              const copie = rep.clone();
              caches.open(STATIQUE).then((c) => c.put(req, copie));
            }
            return rep;
          }),
      ),
    );
    return;
  }

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((rep) => {
          // On ne garde que les vraies pages, pas une redirection vers /login.
          if (rep.ok && !rep.redirected) {
            const copie = rep.clone();
            caches.open(PAGES).then((c) => c.put(req, copie));
          }
          return rep;
        })
        .catch(() => caches.match(req).then((enCache) => enCache || caches.match("/offline.html"))),
    );
  }
});
