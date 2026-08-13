# Heritage Healthcare CRM — Production Architecture

## Frontend
Heritage website + CRM application.

## Backend
Recommended:
- Supabase/PostgreSQL
- Supabase Auth
- Row Level Security
- Server-side API / Edge Functions

## Email
Use a transactional email provider such as Resend or equivalent. Never expose API keys in browser code.

## Data flow

Website form
→ secure API
→ validate/sanitise
→ exact postcode-sector lookup
→ determine office
→ create enquiry
→ notify office
→ customer confirmation
→ CRM timeline

## Roles

National Super Admin
- all offices
- all enquiries
- postcode coverage
- users
- reporting
- reassignment

Office Manager
- own office
- own enquiries
- team
- notes
- emails
- tasks
- reports

Staff
- assigned enquiries
- notes
- contact
- tasks

## Critical security requirement

Do not use the prototype localStorage implementation for real care enquiries. The server must enforce office-level permissions. The browser must never be trusted to decide which office is allowed to see a record.
