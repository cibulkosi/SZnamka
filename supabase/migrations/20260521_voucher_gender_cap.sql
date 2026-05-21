-- Voucher gender cap mechanism
-- 21. 5. 2026
--
-- Cíl:
--   1) Jednorádkový settings/config singleton (app_settings)
--   2) voucher_gender_cap INTEGER NULL (NULL = no cap; 1000 = max 1000 voucherů per gender)
--   3) Modifikovaný redeem_voucher RPC který respektuje cap
--   4) RPC helper admin_voucher_gender_stats() pro /admin widget
--
-- Default: cap je NULL (Opce 3 = gender-blind 2000 voucherů). Aktivuje se manuálně
-- z /admin při zjištění imbalance > 65/35.

-- ───────── 1. Singleton tabulka app_settings ─────────

CREATE TABLE IF NOT EXISTS app_settings (
  id BOOLEAN PRIMARY KEY DEFAULT TRUE,  -- single-row trick (jen 1 řádek možný)
  voucher_gender_cap INTEGER NULL,  -- NULL = disabled, 1000 = max per gender
  cap_activated_at TIMESTAMPTZ NULL,
  cap_activated_by UUID NULL REFERENCES profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT app_settings_singleton CHECK (id = TRUE)
);

-- Insert single row pokud neexistuje
INSERT INTO app_settings (id, voucher_gender_cap)
  VALUES (TRUE, NULL)
  ON CONFLICT (id) DO NOTHING;

-- RLS: jen service_role + admin čtou/píšou. Anon nemá přístup.
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS app_settings_admin_read ON app_settings;
CREATE POLICY app_settings_admin_read ON app_settings
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid()
            AND email = 'cibulkovasimona@gmail.com')
  );

DROP POLICY IF EXISTS app_settings_admin_write ON app_settings;
CREATE POLICY app_settings_admin_write ON app_settings
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid()
            AND email = 'cibulkovasimona@gmail.com')
  );

-- ───────── 2. Admin helper RPC: gender stats voucherů ─────────

CREATE OR REPLACE FUNCTION admin_voucher_gender_stats()
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_female_count INTEGER;
  v_male_count INTEGER;
  v_other_count INTEGER;
  v_total_redempce INTEGER;
  v_cap INTEGER;
  v_admin_email TEXT;
BEGIN
  -- Ověř že volající je admin
  SELECT email INTO v_admin_email FROM auth.users WHERE id = auth.uid();
  IF v_admin_email IS NULL OR v_admin_email <> 'cibulkovasimona@gmail.com' THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;

  SELECT voucher_gender_cap INTO v_cap FROM app_settings WHERE id = TRUE;

  SELECT
    COUNT(*) FILTER (WHERE gender IN ('female', 'Žena')),
    COUNT(*) FILTER (WHERE gender IN ('male', 'Muž')),
    COUNT(*) FILTER (WHERE gender NOT IN ('female', 'Žena', 'male', 'Muž') OR gender IS NULL),
    COUNT(*)
  INTO v_female_count, v_male_count, v_other_count, v_total_redempce
  FROM profiles
  WHERE voucher_redeemed_at IS NOT NULL;

  RETURN jsonb_build_object(
    'voucher_gender_cap', v_cap,
    'cap_active', v_cap IS NOT NULL,
    'female_count', v_female_count,
    'male_count', v_male_count,
    'other_count', v_other_count,
    'total_redempce', v_total_redempce,
    'female_pct', CASE WHEN v_total_redempce > 0 THEN ROUND(v_female_count * 100.0 / v_total_redempce, 1) ELSE NULL END,
    'male_pct', CASE WHEN v_total_redempce > 0 THEN ROUND(v_male_count * 100.0 / v_total_redempce, 1) ELSE NULL END,
    'female_cap_reached', v_cap IS NOT NULL AND v_female_count >= v_cap,
    'male_cap_reached', v_cap IS NOT NULL AND v_male_count >= v_cap
  );
END; $$;

REVOKE ALL ON FUNCTION admin_voucher_gender_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION admin_voucher_gender_stats() TO authenticated, service_role;

-- ───────── 3. Admin RPC: toggle cap ─────────

CREATE OR REPLACE FUNCTION admin_set_voucher_gender_cap(p_cap INTEGER)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_admin_email TEXT;
  v_admin_id UUID;
BEGIN
  SELECT email, id INTO v_admin_email, v_admin_id FROM auth.users WHERE id = auth.uid();
  IF v_admin_email IS NULL OR v_admin_email <> 'cibulkovasimona@gmail.com' THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;

  UPDATE app_settings
    SET voucher_gender_cap = p_cap,
        cap_activated_at = CASE WHEN p_cap IS NOT NULL THEN NOW() ELSE NULL END,
        cap_activated_by = CASE WHEN p_cap IS NOT NULL THEN v_admin_id ELSE NULL END,
        updated_at = NOW()
    WHERE id = TRUE;

  RETURN jsonb_build_object('ok', true, 'voucher_gender_cap', p_cap);
END; $$;

REVOKE ALL ON FUNCTION admin_set_voucher_gender_cap(INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION admin_set_voucher_gender_cap(INTEGER) TO authenticated, service_role;

-- ───────── 4. Modifikovaný redeem_voucher RPC s gender cap check ─────────

CREATE OR REPLACE FUNCTION redeem_voucher(p_user_id UUID, p_code TEXT)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  w_row waitlist%ROWTYPE;
  v_founding BOOLEAN := FALSE;
  v_trial BOOLEAN := FALSE;
  v_premium_until TIMESTAMPTZ := NULL;
  v_premium_source TEXT := NULL;
  v_existing_profile profiles%ROWTYPE;
  v_user_gender TEXT;
  v_cap INTEGER;
  v_my_gender_count INTEGER;
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

  -- Gender cap check: pokud je aktivní, ověříme že počet voucherů pro pohlaví uživatele
  -- ještě nepřekročil limit.
  SELECT gender INTO v_user_gender FROM profiles WHERE id = p_user_id;
  SELECT voucher_gender_cap INTO v_cap FROM app_settings WHERE id = TRUE;

  IF v_cap IS NOT NULL THEN
    SELECT COUNT(*) INTO v_my_gender_count
      FROM profiles
     WHERE voucher_redeemed_at IS NOT NULL
       AND gender = v_user_gender;

    IF v_my_gender_count >= v_cap THEN
      RETURN jsonb_build_object(
        'ok', false,
        'error', 'voucher_gender_cap_reached',
        'my_gender', v_user_gender,
        'cap', v_cap,
        'current_count', v_my_gender_count
      );
    END IF;
  END IF;

  -- Branch podle pořadí na waitlistu
  IF w_row.position IS NOT NULL AND w_row.position <= 1000 THEN
    v_founding := TRUE;
    v_premium_until := NOW() + INTERVAL '3 months';
    v_premium_source := 'founding';
  ELSIF w_row.position IS NOT NULL AND w_row.position <= 2000 THEN
    v_trial := TRUE;
    v_premium_until := NOW() + INTERVAL '7 days';
    v_premium_source := 'trial';
  END IF;

  -- Pokud uživatel už má placené Cosmatch+ (premium_source = 'paid'), trial nepřemažeme.
  SELECT * INTO v_existing_profile FROM profiles WHERE id = p_user_id;
  IF v_existing_profile.premium_source = 'paid' AND v_existing_profile.premium_until > NOW() THEN
    UPDATE waitlist SET redeemed_at = NOW(), redeemed_by = p_user_id WHERE id = w_row.id;
    UPDATE profiles SET
       voucher_code = w_row.voucher_code,
       voucher_redeemed_at = NOW(),
       life_path = COALESCE(profiles.life_path, w_row.life_path),
       archetype = COALESCE(profiles.archetype, w_row.archetype),
       is_founding_member = v_founding
     WHERE id = p_user_id;
    RETURN jsonb_build_object(
      'ok', true,
      'is_founding_member', v_founding,
      'is_trial', FALSE,
      'position', w_row.position,
      'archetype', w_row.archetype,
      'life_path', w_row.life_path,
      'premium_until', v_existing_profile.premium_until,
      'note', 'voucher_recorded_paid_subscription_unchanged'
    );
  END IF;

  UPDATE waitlist SET redeemed_at = NOW(), redeemed_by = p_user_id WHERE id = w_row.id;

  UPDATE profiles SET
     voucher_code = w_row.voucher_code,
     voucher_redeemed_at = NOW(),
     life_path = COALESCE(profiles.life_path, w_row.life_path),
     archetype = COALESCE(profiles.archetype, w_row.archetype),
     is_founding_member = v_founding,
     premium = CASE WHEN v_premium_until IS NOT NULL THEN TRUE ELSE COALESCE(premium, FALSE) END,
     premium_until = CASE WHEN v_premium_until IS NOT NULL THEN v_premium_until ELSE premium_until END,
     premium_source = CASE WHEN v_premium_source IS NOT NULL THEN v_premium_source ELSE premium_source END,
     trial_started_at = CASE WHEN v_trial THEN NOW() ELSE trial_started_at END
   WHERE id = p_user_id;

  RETURN jsonb_build_object(
    'ok', true,
    'is_founding_member', v_founding,
    'is_trial', v_trial,
    'position', w_row.position,
    'archetype', w_row.archetype,
    'life_path', w_row.life_path,
    'premium_until', v_premium_until,
    'premium_source', v_premium_source
  );
END; $$;

REVOKE ALL ON FUNCTION redeem_voucher(UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION redeem_voucher(UUID, TEXT) TO authenticated, service_role;
