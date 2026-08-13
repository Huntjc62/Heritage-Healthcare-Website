# Heritage Healthcare — Local Office Blog CMS V1

## What has been added

Each office manager can now access a small, simplified Local Blog CMS from the existing CRM.

### Office access
After signing in through `crm-login.html`, a manager sees:
- CRM
- Enquiries
- Reports
- Local Blog

The Local Blog opens:
- `local-cms.html` — dashboard
- `local-cms-content.html` — article library
- `local-cms-editor.html` — create/edit article

National Admin accounts are blocked from this local CMS and continue to use the Head Office CMS.

## Local blog ownership

Articles are stored in browser localStorage under `heritageLocalBlogs_v1` and keyed by office ID.

A manager can only read/write the articles belonging to their own `officeId`.

### Public pages

There is now a dedicated local blog page for all 24 offices:
- `{office-id}-blog.html`

Existing location home pages have a **Latest Articles from your local team** section linking to their dedicated blog page.

## V1 limitation

This is deliberately still localStorage, as requested.

That means the CMS and public blog content are shared only within the same browser/device. When Firebase is introduced, this exact content model can be moved to Firestore so each office's articles become genuinely shared and public for all visitors.

The local CMS should therefore be treated as a working prototype of the final office publishing experience, not the production database layer.
