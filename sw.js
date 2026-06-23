const STATIC_CACHE = 'bk-static-v128';
const RUNTIME_CACHE = 'bk-runtime-v128';

const CORE_ASSETS = [
  './',
  './index.html',
  './pudim.html',
  './box.html',
  './manifest.webmanifest',
  './favicon.svg',
  './entry.css?v=128',
  './styles.css?v=128',
  './box.css?v=128',
  './assets/header/header.css?v=128',
  './assets/cart/cart-drawer.css?v=128',
  './assets/delivery/delivery.css?v=128',
  './assets/vendor/fluid-particles.css?v=128',
  './assets/img/picture.js?v=128',
  './assets/config/config.js?v=128',
  './assets/api/client.js?v=128',
  './entry.js?v=128',
  './app.js?v=128',
  './box.js?v=128',
  './assets/header/header.js?v=128',
  './assets/cart/cart-drawer.js?v=128',
  './assets/i18n/box-i18n.js?v=128',
  './assets/concierge/concierge-ai.js?v=128',
  './assets/vendor/fluid-particles.js?v=128',
  './assets/pwa/register-sw.js?v=128',
  './assets/img/products/product-classic-pudim.avif',
  './assets/img/products/product-dessert-cups.avif',
  './assets/img/products/product-shrimp-tray.avif',
  './assets/img/products/product-classic-pudim.png'
];

const isSameOrigin = (url) => url.origin === self.location.origin;
const isAdminPath = (url) => /\/admin(?:\.html|\/|$)/.test(url.pathname);
const isAdminAsset = (url) =>
  /\/admin\.(?:css|js)$/i.test(url.pathname) ||
  url.pathname.includes('/assets/admin/');
const isApiPath = (url) => url.pathname.startsWith('/api/');
const isCacheableStatic = (url) =>
  /\.(?:css|js|mjs|png|webp|avif|svg|webmanifest)$/i.test(url.pathname);

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => ![STATIC_CACHE, RUNTIME_CACHE].includes(key))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(RUNTIME_CACHE);
    cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request, fallbackUrl = './index.html') {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (error) {
    return (await caches.match(request)) || caches.match(fallbackUrl);
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (!isSameOrigin(url)) return;

  if (isAdminPath(url) || isAdminAsset(url) || isApiPath(url)) {
    event.respondWith(fetch(request));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  if (isCacheableStatic(url)) {
    event.respondWith(cacheFirst(request));
  }
});
