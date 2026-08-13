/* Keeps the live site update-first after GitHub/static-host deployments. */
(() => {
  if (!('serviceWorker' in navigator)) return;

  const swUrl = './sw.js?update=20260813-home5';
  let reloadedForUpdate = false;

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloadedForUpdate) return;
    reloadedForUpdate = true;
    window.location.reload();
  });

  navigator.serviceWorker.register(swUrl, { updateViaCache: 'none' })
    .then(registration => {
      registration.update().catch(() => {});
      setInterval(() => registration.update().catch(() => {}), 60000);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') registration.update().catch(() => {});
      });
    })
    .catch(() => {});
})();
