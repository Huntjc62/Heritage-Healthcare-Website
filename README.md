# Heritage Healthcare — V1 Website Concept

This is a multi-page front-end V1 prototype for a proposed Heritage Healthcare website redesign.

## Run it
1. Unzip the folder.
2. Open `index.html` in a browser.
3. No build tools or server are required.

## Included
- Premium responsive homepage
- Sticky navigation
- Mobile navigation
- Interactive 3-step care finder demo
- Location search demo
- Service cards
- UK location explorer visual
- Testimonials
- Care Hub preview
- Careers section
- Contact CTA
- Responsive mobile layout

## Important
This is a visual/UX prototype, not a production healthcare platform.
Replace placeholder imagery with approved Heritage Healthcare photography and apply the final approved brand assets before launch.
Connect forms, location data, CRM, analytics, review feeds and CMS in the production build.

## Current Heritage information used for the prototype
The prototype reflects the public-facing service/location structure and contact details currently shown by Heritage Healthcare, including the broad service categories, 20+ UK locations, 0333 004 0277 and care@heritagehealthcare.co.uk.


## Multi-page routes
- `index.html` — Home
- `care-support.html` — Care & Support
- `why-heritage.html` — Why Heritage
- `locations.html` — Locations
- `care-hub.html` — Care Hub
- `careers.html` — Careers
- `care-finder.html` — Find Care
- `contact.html` — Contact

All primary navigation and footer links now point to their own pages.

The forms, search and care finder are functional front-end demos. Production integrations would connect these to a CRM, database, location service, CMS and secure form endpoint.


## Navigation fix
The main navigation now uses ordinary `.html` page links and JavaScript only handles same-page `#section` scrolling. Navigation links are not intercepted by the smooth-scroll script, so clicking a navigation item loads the corresponding page.

## V1 Expanded
This revision expands the core pages into a longer, editorial-style experience with:
- deeper expertise-led content
- service journey storytelling
- trust/statistics sections
- testimonials
- FAQs
- editorial feature blocks
- local network storytelling
- richer careers content
- richer care-finder explanation
- interactive FAQ accordions
- scroll reveal animations

The claims in the prototype are based on information publicly presented by Heritage Healthcare and should be checked against final approved corporate copy before production.

## Navigation hardening
The main header navigation now has explicit `data-page` destinations and a dedicated navigation handler that forces a full page load. This prevents the navigation from being treated as an in-page anchor/scroll interaction. It is designed to work both from local files and when hosted on GitHub Pages.


## Authoritative location list supplied by user

### North East
- North East
- North Tyneside & South Northumberland

### North West
- Cheadle & Wilmslow
- Rochdale
- Trafford & Cheshire

### Yorkshire
- Barnsley
- Kirklees
- Northallerton & Richmond (North Yorkshire)
- Wakefield
- York

### East Midlands
- Leicester
- Milton Keynes
- Northampton
- St Albans & Watford

### West Midlands
- Coventry
- Birmingham South

### South East
- Windsor

### South West
- Bristol

### London
- Basildon
- Ealing – Coming Soon
- Hounslow – Richmond
- Wandsworth

### Wales
- Cardiff
- Swansea


## Visual fix
The expertise/principle cards have been normalised to equal heights with consistent spacing and responsive behaviour. Long headings such as “Peace of mind” now wrap cleanly without making the card shorter or taller than its neighbours.


## Location navigation fix
Every location listed on the Locations page is now a real link to its corresponding dedicated location HTML page. The location directory cards and the location list/search links use explicit destinations and are protected from smooth-scroll interception.


## Location pages V2 — local SEO architecture
Every location now has its own content profile rather than sharing a generic template. Each page has:
- a unique SEO title and meta description
- a unique local proposition and hero
- unique local service focus
- unique local area/coverage information
- a dedicated "Meet the team" section
- verified named team profiles where the current Heritage Healthcare website publishes them
- role-based team cards where no named profiles are currently published (no names have been invented)
- individual local phone number and email address
- individual office address and opening information
- a dedicated local enquiry form addressed to the local office email
- local proof/insight content

The local contact details and published team information were checked against Heritage Healthcare's public location pages during the build. Ealing remains a coming-soon page and therefore uses central Heritage Healthcare contact details until a local office is published.
