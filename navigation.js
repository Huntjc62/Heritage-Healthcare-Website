/*
  Heritage Healthcare V1 — page navigation
  Navigation items are deliberately handled as full-page links.
  This makes the site work reliably when opened locally and on GitHub Pages.
*/
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-page-link[data-page]').forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const page = link.getAttribute('data-page');
      if (page) window.location.assign(page);
    }, true);
  });
});
