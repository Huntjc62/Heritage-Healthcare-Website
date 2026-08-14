# Heritage Healthcare Postcode Routing V12

Loaded from the 20 Excel coverage files supplied in this turn.

- Coverage files processed: 20
- Postcode sectors loaded: 1,149
- Unique sectors: 1,149
- Duplicate/overlapping sectors in these 20 files: 0
- Routing level: postcode sector (e.g. `YO24 1` from `YO24 1AA`)

## Routing behaviour

1. A valid full UK postcode is normalised.
2. Its postcode sector is extracted.
3. The sector is checked against `postcode-routing-data.js`.
4. If exactly one office covers it, the enquiry is assigned to that office.
5. If no office covers it, it is assigned to National Office.
6. If future files introduce an overlapping sector, the routing layer marks it ambiguous and sends it to National Office for review rather than guessing.
7. Public website enquiries are also captured into the local CRM localStorage database, with routing status, postcode sector and matched office recorded.
8. The email workflow opens the routed office's email address for a covered postcode. If a matched office does not yet have an email configured, the enquiry is still assigned to that office in the CRM but the email is directed to National Office.

## Current configuration note

`Epsom and Ewell, Sutton` has 54 covered postcode sectors in the supplied spreadsheet, but no office email address was present in the existing website routing configuration. Its CRM routing is therefore loaded, but email fallback is National Office until the office's correct email address is supplied.

The routing data is deliberately stored separately in `postcode-routing-data.js`, so additional Excel coverage files can be added later without redesigning the CRM routing logic.


## V13 update — final two spreadsheets added

Added:
- Windsor — `Windsor - Base area list.xlsx` — 47 postcode sectors
- Wandsworth — `Wandsworth & Merton - Base area list (1).xlsx` — 76 postcode sectors

Both sets were checked against the existing routing database and had no postcode-sector overlaps.

Windsor email routing: `care@windsor.heritagehealthcare.co.uk`
Wandsworth email routing: `care@wandsworth.heritagehealthcare.co.uk`

The routing engine remains postcode-sector based: a matching sector routes to the matching office; an unmatched sector routes to National Office.
