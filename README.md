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


## V3 — Postcode enquiry routing

The website now includes a full front-end demonstration of the proposed enquiry routing architecture.

### Routing behaviour
1. Every location form records the page/location the enquiry came from.
2. The postcode is normalised and checked against the configured office coverage list.
3. If the postcode is covered by the office whose page the user submitted on, the enquiry is marked `local` and routed to that office.
4. If the postcode is covered by a different Heritage office, the enquiry is marked `other-office` and routed to the National Office with the suggested local office shown.
5. If no configured Heritage office covers the postcode, it is marked `national` and routed to the National Office.
6. Invalid postcodes can still be submitted, but are flagged for National review.
7. The main Contact page uses National routing by default.

### Demo
Open `admin-routing.html` to test postcode routing and view the configured office directory.

### Important production note
This downloadable V3 is a browser-only prototype. It DOES NOT send real emails and it must not be used as the production routing mechanism. The production implementation should move postcode lookup, coverage matching, recipient selection, spam protection, database logging and email delivery to a secure server/API. The browser should never be trusted to decide the final recipient.

### Recommended production flow
Website form → secure API → postcode validation/lookup → coverage database → route to local or National Office → log enquiry centrally → send confirmation to enquirer → notify office → CRM/lead dashboard.

The coverage list in this prototype is a configurable demonstration and should be replaced with the final approved postcode coverage dataset supplied by Heritage Healthcare before launch.


## V4 — Live postcode verification + working email action

The routing data has been rechecked against the current Heritage Healthcare location pages available during this verification pass. The live pages publish postcode **sectors** (for example `YO24 1`, not merely the outward code `YO24`), so the router now matches the full postcode sector.

This fixes a major problem in V3: broad outward-code matching could incorrectly claim an entire postcode area was covered when the live Heritage page only listed selected sectors.

### Coverage safety
- Verified live sector lists are loaded for the locations successfully retrieved from the current Heritage pages.
- Where a live location page could not be fully retrieved during the verification pass, its coverage is deliberately left unverified and enquiries fall back to National Office. No invented postcode coverage is used.
- The final production launch should import the complete approved postcode-sector dataset from Heritage Healthcare and keep it in a server-side database.

### Send Enquiry button
The button now works in the static download: submitting the form opens the visitor's configured email application with:
- the correct local or National recipient
- a subject
- source location
- postcode routing result
- customer details
- care requirement
- message

This is the maximum reliable "send" behaviour available from a completely static HTML/GitHub Pages package without a backend. For the production website, the same form should POST to a secure backend/API so the website can send the email automatically without opening the visitor's email client, while also logging the enquiry to a CRM/database.

### Production routing
Browser form → secure API → exact postcode-sector match → local/National routing → database log → office email → customer confirmation.
