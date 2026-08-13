# Heritage Healthcare — automatic updates

This package includes an update-first service worker for static hosting such as GitHub Pages.

## What it does

- Requests the latest HTML/CSS/JS from the network first.
- Uses the cache only as an offline fallback.
- Registers the service worker with `updateViaCache: "none"`.
- Checks for a new service-worker version when a page loads.
- Checks again when the tab becomes visible.
- Checks every 60 seconds while the page is open.
- Activates a newly installed service worker immediately and reloads the page once so the new version is displayed.
- Adds cache-busting query strings to the main website assets.

## Deployment

Upload/push the whole package to the same repository/hosting location. Do not remove `sw.js` or `site-update.js`.

The service worker is deliberately network-first, so changing HTML/CSS/JS does not require the visitor to clear their browser cache.

For GitHub Pages, HTTPS must be enabled because browsers only allow service workers on secure origins (HTTPS, or localhost during development).

## Important limitation

A visitor who has completely disabled JavaScript/service workers, is offline, or is viewing a page before the service worker has ever been installed cannot be forced to receive a remote update by website code alone. For normal HTTPS visitors, this package is designed to make updates automatic without asking them to hard-refresh.
