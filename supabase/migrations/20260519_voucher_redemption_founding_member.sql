-- Voucher redemption + founding member badge
-- 19. 5. 2026

ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS redeemed_at TIMESTAMPTZ NULL;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS redeemed_by UUID NULL REFERENCES profiles(id) ON DELETE SET NULL;

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS voucher_code TEXT NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS voucher_redeemed_at TIMESTAMPTZ NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS life_path INTEGER NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS archetype TEXT NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_founding_member BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS founding_badge_visible BOOLEAN NOT NULL DEFAULT TRUE;

CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_voucher_code_unique
  ON profiles(voucher_code) WHERE voucher_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_waitlist_voucher_code
  ON waitlist(voucher_code) WHERE voucher_code IS NOT NULL;

CREATE OR REPLACE FUNCTION redeem_voucher(p_user_id UUID, p_code TEXT)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  w_row waitlist%ROWTYPE;
  v_founding boolean;
BEGIN
  IF p_code IS NULL OR length(trim(p_code)) = 0 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'voucher_empty');
  END IF;

  SELECT * INTO w_row FROM waitlist
   WHERE upper(trim(voucher_code)) = upper(trim(p_code))
   FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'voucher_not_found');
  END IF;

  IF w_row.redeemed_at IS NOT NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'voucher_already_redeemed');
  END IF;

  v_founding := (w_row.position IS NOT NULL AND w_row.position <= 1000);

  UPDATE waitlist SET redeemed_at = NOW(), redeemed_by = p_user_id WHERE id = w_row.id;

  UPDATE profiles SET
     voucher_code = w_row.voucher_code,
     voucher_redeemed_at = NOW(),
     life_path = COALESCE(profiles.life_path, w_row.life_path),
     archetype = COALESCE(profiles.archetype, w_row.archetype),
     is_founding_member = v_founding
   WHERE id = p_user_id;

  RETURN jsonb_build_object(
    'ok', true, 'is_founding_member', v_founding,
    'position', w_row.position, 'archetype', w_row.archetype, 'life_path', w_row.life_path
  );
END; $$;

REVOKE ALL ON FUNCTION redeem_voucher(UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION redeem_voucher(UUID, TEXT) TO authenticated, service_role;
