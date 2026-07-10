-- Every approved public-data change must be traceable to an official source.
ALTER TABLE public.edit_requests
  ADD COLUMN IF NOT EXISTS evidence_url text;

-- Existing rows predate this rule. New API submissions require the field;
-- keep the database migration deployable without inventing evidence for history.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'edit_requests_evidence_url_https'
  ) THEN
    ALTER TABLE public.edit_requests
      ADD CONSTRAINT edit_requests_evidence_url_https
      CHECK (evidence_url IS NULL OR evidence_url ~ '^https://');
  END IF;
END $$;
