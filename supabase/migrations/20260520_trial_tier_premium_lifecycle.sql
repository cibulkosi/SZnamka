-- Premium lifecycle: trial + founding + paid
-- 20. 5. 2026
--
-- Cíl:
--   1) Sjednotit premium stav přes `premium_until` + `premium_source`
--   2) Tier 2 voucher (waitlist position 1001-2000) = 7denní trial Cosmatch+
--   3) Tier 1 voucher (position ≤ 1000) = 3 měsíce Cosmatch+ (founding)
--   4) Auto-downgrade přes pg_cron, když premium_until < now()
--   5) Legal consent timestamp dle § 1837 písm. l) OZ

-- ───────── 1. Schema ─────────

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS premium_until TIMESTAMPTZ NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS premium_source TEXT NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS trial_started_at TIMESTAMPTZ NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS legal_consent_immediate_service_at TIMESTAMPTZ NULL;

-- Check constraint pro premium_source (PostgreSQL ALTER neumí IF NOT EXISTS u check)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
     WHERE constraint_name = 'profiles_premium_source_check'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_premium_source_check
      CHECK (premium_source IS NULL OR premium_source IN ('founding', 'trial', 'paid'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_profiles_premium_until
  ON profiles(premium_until) WHERE premium_until IS NOT NULL;

-- ───────── 2. Backfill existujících founding members ─────────
-- Kdo už voucher redeemnul jako founding (position ≤ 1000), dostane 3 měsíce
-- od redemption času. Pokud už mu Paddle nastavil premium, neměníme.
UPDATE profiles
   SET premium = TRUE,
       premium_until = voucher_redeemed_at + INTERVAL '3 months',
       premium_source = 'founding'
 WHERE is_founding_member = TRUE
   AND voucher_redeemed_at IS NOT NULL
   AND (premium_until IS NULL)
   AND (premium_source IS NULL);

-- ───────── 3. Aktualizovaný redeem_voucher RPC ─────────
-- Branchuje podle position:
--   * 1-1000   → founding, premium 3 měsíce
--   * 1001-2000 → trial, premium 7 dní
--   * 2001+    → jen redeem, žádné premium (welcome 14denní není ani potřeba — free se může používat)

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
    -- Mark voucher as redeemed pro audit, ale neaktualizuj premium.
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

-- ───────── 4. Auto-downgrade RPC ─────────
-- Spouští se denně přes pg_cron. Pokud premium_until < NOW() a source != 'paid'
-- (tj. trial nebo founding), nastaví premium=FALSE.
-- Pro 'paid' tier se downgrade musí dít přes Paddle webhook (subscription.canceled).

CREATE OR REPLACE FUNCTION expire_premium_trials()
RETURNS TABLE(downgraded_count INTEGER)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  cnt INTEGER;
BEGIN
  WITH expired AS (
    UPDATE profiles
       SET premium = FALSE
     WHERE premium = TRUE
       AND premium_until IS NOT NULL
       AND premium_until < NOW()
       AND premium_source IN ('founding', 'trial')
    RETURNING id
  )
  SELECT COUNT(*) INTO cnt FROM expired;
  RETURN QUERY SELECT cnt;
END; $$;

REVOKE ALL ON FUNCTION expire_premium_trials() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION expire_premium_trials() TO service_role;

-- ───────── 5. pg_cron schedule (denně v 03:00 UTC) ─────────
-- pg_cron extension musí být zapnutý (Database → Extensions v Supabase Dashboardu)

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.unschedule('expire-premium-trials');
    PERFORM cron.schedule(
      'expire-premium-trials',
      '0 3 * * *',  -- denně v 03:00 UTC
      $cron$ SELECT expire_premium_trials(); $cron$
    );
  END IF;
EXCEPTION WHEN OTHERS THEN
  -- pg_cron neexistuje nebo schedule selhal, ignoruj — manuální setup později
  RAISE NOTICE 'pg_cron not available or already scheduled: %', SQLERRM;
END $$;

-- ───────── 6. Helper view pro admin dashboard ─────────
CREATE OR REPLACE VIEW admin_premium_summary AS
SELECT
  premium_source,
  COUNT(*) AS users,
  COUNT(*) FILTER (WHERE premium = TRUE) AS active,
  COUNT(*) FILTER (WHERE premium_until < NOW()) AS expired,
  COUNT(*) FILTER (WHERE premium_until BETWEEN NOW() AND NOW() + INTERVAL '3 days') AS expiring_soon
FROM profiles
WHERE premium_source IS NOT NULL
GROUP BY premium_source;

GRANT SELECT ON admin_premium_summary TO authenticated, service_role;
