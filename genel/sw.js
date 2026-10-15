// Basit çevrimdışı önbellek: uygulama bir kez açıldıktan sonra internetsiz de açılır.
const ONBELLEK = 'konusma-kocu-v1';
const DOSYALAR = ['./', './index.html', './manifest.webmanifest', './simge.svg'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(ONBELLEK).then((c) => c.addAll(DOSYALAR)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((adlar) => Promise.all(adlar.filter((a) => a !== ONBELLEK).map((a) => caches.delete(a)))));
  self.clients.claim();
});

// Önce ağ, olmazsa önbellek: yeni sürüm yayınlanınca kullanıcı hemen görür.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then((yanit) => { const kopya = yanit.clone(); caches.open(ONBELLEK).then((c) => c.put(e.request, kopya)); return yanit; })
      .catch(() => caches.match(e.request).then((k) => k || caches.match('./index.html'))),
  );
});
