/*
 Heritage Healthcare V1 — navigation
 Main navigation and individual location links always perform full page navigation.
*/
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[data-location-link="true"], a.nav-page-link[data-page]').forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      const destination = link.getAttribute('href');
      if (destination) window.location.assign(destination);
    }, true);
  });
});
