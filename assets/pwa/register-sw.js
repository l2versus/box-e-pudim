(() => {
  'use strict';

  const isLocalhost = /^(127\.0\.0\.1|localhost)$/.test(window.location.hostname);
  if (isLocalhost) {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .getRegistrations()
        .then((regs) => regs.forEach((registration) => registration.unregister()))
        .catch(() => {});
    }
    if (window.caches) {
      caches
        .keys()
        .then((keys) => keys.forEach((key) => caches.delete(key)))
        .catch(() => {});
    }
    return;
  }

  const isAdmin = /\/admin(?:\.html|\/|$)/.test(window.location.pathname);
  const canRegister =
    'serviceWorker' in navigator &&
    window.location.protocol !== 'file:' &&
    !isAdmin;

  if (!canRegister) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('sw.js', { scope: './' })
      .catch((error) => {
        console.warn('[BK_PWA] Service worker registration failed:', error);
      });
  });
})();
