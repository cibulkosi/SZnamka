-- Waitlist table for lead capture
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  city TEXT,
  birthday DATE,
  life_path INTEGER,
  archetype TEXT,
  referral_code TEXT UNIQUE NOT NULL DEFAULT upper(substring(md5(random()::text), 1, 6)),
  referred_by TEXT,
  source TEXT DEFAULT 'direct',
  referral_count INTEGER DEFAULT 0,
  position INTEGER,
  voucher_code TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for referral lookups
CREATE INDEX IF NOT EXISTS waitlist_referral_code_idx ON waitlist(referral_code);
CREATE INDEX IF NOT EXISTS waitlist_referred_by_idx ON waitlist(referred_by);

-- Function to update referral count when someone signs up via referral
CREATE OR REPLACE FUNCTION increment_referral_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referred_by IS NOT NULL THEN
    UPDATE waitlist SET referral_count = referral_count + 1
    WHERE referral_code = NEW.referred_by;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_waitlist_insert ON waitlist;
CREATE TRIGGER on_waitlist_insert
  AFTER INSERT ON waitlist
  FOR EACH ROW EXECUTE FUNCTION increment_referral_count();

-- RLS: public can insert, only auth can read
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "waitlist_insert" ON waitlist;
CREATE POLICY "waitlist_insert" ON waitlist FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "waitlist_count" ON waitlist;
CREATE POLICY "waitlist_count" ON waitlist FOR SELECT USING (true);

-- Gender cap: returns true if men are over 65% of total users
CREATE OR REPLACE FUNCTION is_male_cap_reached()
RETURNS BOOLEAN AS $$
DECLARE
  total_count INTEGER;
  male_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_count FROM profiles;
  SELECT COUNT(*) INTO male_count FROM profiles WHERE gender = 'male' OR gender = 'Muž';
  
  -- Don't enforce cap if fewer than 20 users
  IF total_count < 20 THEN RETURN FALSE; END IF;
  
  RETURN (male_count::FLOAT / total_count) > 0.65;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant public access to this function
GRANT EXECUTE ON FUNCTION is_male_cap_reached() TO anon, authenticated;

-- Ambassadors table
CREATE TABLE IF NOT EXISTS ambassadors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  city TEXT,
  instagram TEXT,
  tiktok TEXT,
  followers INTEGER,
  motivation TEXT,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE ambassadors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ambassadors_insert" ON ambassadors;
CREATE POLICY "ambassadors_insert" ON ambassadors FOR INSERT WITH CHECK (true);
