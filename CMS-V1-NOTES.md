# Heritage Healthcare CMS V1

## Head Office access
The National Admin account now signs into the Head Office Control Centre instead of going directly to the CRM.

From there, Head Office can open:
- CRM
- Content Manager
- Blog editor
- Care Hub guide editor
- Public Blog
- Public Care Hub

Office manager accounts still go directly to their CRM dashboard.

## CMS workflow
1. Sign in as National Admin.
2. Choose Write a blog or Write a Care Hub guide.
3. Add title, slug, category, excerpt and content.
4. Add SEO title and SEO description.
5. Save as Draft or Publish.
6. Published content appears on the public Blog or Care Hub page in that browser.

## Important V1 limitation
This package is a static GitHub-style website, so the CMS currently stores content in browser localStorage. It is a working prototype of the publishing experience, but it is NOT yet a shared production CMS/database.

For production, the CMS should be connected to a secure backend/database (for example Firebase/Firestore or another authenticated API). That will make published content available to every visitor and allow multiple authorised Head Office users to work from different devices.

The interface, content model and public rendering have been deliberately structured so that backend connection can be added without redesigning the CMS.
