-- Rozšíření lifestyle dealbreakers — alkohol + marihuana
-- Deployed via Supabase MCP, mirrored here for version control

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS smoking_dealbreaker boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS alcohol_dealbreaker boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS marijuana text CHECK (marijuana IN ('never', 'rarely', 'sometimes', 'regularly') OR marijuana IS NULL),
  ADD COLUMN IF NOT EXISTS marijuana_dealbreaker boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.profiles.smoking_dealbreaker IS 'Pokud true a uživatel je smoking=never, profily s smoking=regularly se vyfiltrují (HARD FILTER).';
COMMENT ON COLUMN public.profiles.alcohol_dealbreaker IS 'Pokud true a uživatel je alcohol=never, profily s alcohol=regularly se vyfiltrují (HARD FILTER).';
COMMENT ON COLUMN public.profiles.marijuana IS 'Frekvence užívání marihuany: never / rarely / sometimes / regularly.';
COMMENT ON COLUMN public.profiles.marijuana_dealbreaker IS 'Pokud true a uživatel je marijuana=never, profily s marijuana=regularly se vyfiltrují (HARD FILTER).';
