# WhatsApp counselling alerts — sending path

Status: **capture only.** The site collects opt-ins (`counselling_leads`, source
`predictor` and `counselling-dates`) and the super-admin can view/export them at
`/admin/leads`. **Nothing sends messages automatically yet.** This doc is the
spec for closing that loop.

## Current state

- Opt-in forms: `LeadCapture` (predictor) and `CounsellingReminderSignup`
  (counselling-dates page) → `POST /api/leads` → upsert into `counselling_leads`
  on `(phone, source)`.
- Read/export: `GET /api/admin/leads` (super-admin only), JSON or `?format=csv`.
- Manual workflow today: export CSV from `/admin/leads`, import into your WhatsApp
  provider, send an approved template broadcast.

## To automate (one-time setup)

1. **Pick a provider** with the WhatsApp Business Platform (Cloud API):
   - Meta WhatsApp Cloud API (direct), or an aggregator — Gupshup, Interakt,
     AiSensy, Twilio. Aggregators are faster to onboard for an Indian number and
     handle template approval UX.
2. **Get a sender number** verified on WhatsApp Business and a permanent access
   token. Add as env vars (do **not** commit):
   - `WHATSAPP_API_URL`, `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_ID` (Cloud API), or the
     provider equivalents.
3. **Get message templates approved** (WhatsApp requires pre-approved templates
   for business-initiated messages). Suggested templates:
   - `counselling_web_options_open` — "Web options are open for TS EAPCET 2026.
     Enter & freeze by {{1}}. Build your list: {{2}}"
   - `counselling_allotment_out` — "TS EAPCET seat allotment result is out. Pay
     fee & self-report by {{1}}. Details: {{2}}"
   - `counselling_deadline_reminder` — generic "Reminder: {{1}} closes {{2}}."

## Sending implementation (when ready)

- Add `src/lib/whatsapp.ts` — a `sendTemplate(phone, template, params[])` wrapper
  around the provider API. Server-only.
- Add a send trigger. Two viable shapes:
  - **Scheduled broadcast**: a cron/route that, on a milestone day, queries
    `counselling_leads` and sends the matching template. Gate by `source`/`state`
    so predictor leads can get rank-specific copy.
  - **Admin "send now"**: a button on `/admin/leads` that POSTs to a protected
    route which broadcasts the chosen template to the current filter.
- **Compliance:** only send during counselling season; include opt-out ("STOP")
  handling; respect WhatsApp's 24-hour session vs. template rules; rate-limit to
  the provider's caps; log every send for audit.
- **Delivery tracking** (optional): store provider message IDs + status webhooks
  in a `lead_messages` table.

## Why this is gated

Sending requires a billing account, a verified business number, and
provider-approved templates — none of which can be provisioned from the repo.
Until those exist, automated-send code would be untestable and misleading, so the
shipped surface is capture + export only.
