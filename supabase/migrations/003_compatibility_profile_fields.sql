-- Migration: nová pole pro rozšířený algoritmus kompatibility
-- Cosmatch – Enhanced Compatibility Algorithm v2

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS family_plans       TEXT,     -- 'want_kids' | 'have_kids_want_more' | 'no_kids' | 'open'
  ADD COLUMN IF NOT EXISTS religion            TEXT,     -- 'none' | 'religious' | 'spiritual' | 'other'
  ADD COLUMN IF NOT EXISTS finances            TEXT,     -- 'saver' | 'spender' | 'balanced'
  ADD COLUMN IF NOT EXISTS relationship_type  TEXT,     -- 'serious' | 'casual' | 'open' | 'unsure'
  ADD COLUMN IF NOT EXISTS personality_role   TEXT,     -- 'visionary' | 'executor' | 'both'
  ADD COLUMN IF NOT EXISTS personality_schedule TEXT,   -- 'morning' | 'night' | 'flexible'
  ADD COLUMN IF NOT EXISTS personality_social  TEXT,    -- 'introvert' | 'extrovert' | 'ambivert'
  ADD COLUMN IF NOT EXISTS personality_conflict TEXT,   -- 'talk' | 'cool_down' | 'avoid'
  ADD COLUMN IF NOT EXISTS libido              INTEGER,  -- 1–5 (1=zřídka, 5=každý den)
  ADD COLUMN IF NOT EXISTS smoking             TEXT,     -- 'never' | 'sometimes' | 'often'
  ADD COLUMN IF NOT EXISTS alcohol             TEXT,     -- 'never' | 'socially' | 'regularly'
  ADD COLUMN IF NOT EXISTS diet                TEXT,     -- 'omnivore' | 'vegetarian' | 'vegan' | 'other'
  ADD COLUMN IF NOT EXISTS exercise            TEXT;     -- 'never' | 'sometimes' | 'regularly'

-- Index pro rychlé filtrování podle lifestyle
CREATE INDEX IF NOT EXISTS idx_profiles_smoking    ON profiles (smoking);
CREATE INDEX IF NOT EXISTS idx_profiles_family     ON profiles (family_plans);
CREATE INDEX IF NOT EXISTS idx_profiles_reltype    ON profiles (relationship_type);
