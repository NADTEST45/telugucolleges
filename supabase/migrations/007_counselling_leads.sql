-- 007_counselling_leads.sql
-- WhatsApp lead capture from the EAPCET predictor results screen.
-- Written ONLY via the service-role client in /api/leads (server-side);
-- RLS is enabled with no policies so the anon key can neither read nor
-- write this table directly (same model as data_reports).

create table if not exists public.counselling_leads (
  id uuid primary key default gen_random_uuid(),
  phone text not null,                       -- normalized 10-digit Indian mobile
  name text,                                 -- optional
  exam_state text,                           -- 'Telangana' | 'Andhra Pradesh' at capture time
  rank int,                                  -- EAPCET rank entered in the predictor
  branch text,                               -- branch code selected (e.g. 'cse')
  category text,                             -- reservation category (e.g. 'OC', 'BC_A')
  source text not null default 'predictor',  -- capture surface, for future placements
  page_url text,
  created_at timestamptz not null default now()
);

comment on table public.counselling_leads is
  'WhatsApp counselling-alert leads captured from public pages via /api/leads. Service-role access only.';

-- Service-role only: enable RLS, define no policies.
alter table public.counselling_leads enable row level security;

-- One row per phone per surface — re-submitting updates context instead of duplicating.
create unique index if not exists counselling_leads_phone_source_idx
  on public.counselling_leads (phone, source);

create index if not exists counselling_leads_created_idx
  on public.counselling_leads (created_at desc);
