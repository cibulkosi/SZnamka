-- Server-side daily swipe rate limit (Europe/Prague TZ midnight reset)
-- Deployed via Supabase MCP, mirrored here for version control

-- 1) Helper function used by RLS policy
CREATE OR REPLACE FUNCTION public.daily_swipe_limit_ok(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_premium boolean := false;
  v_count int;
  v_today_start timestamptz;
  v_limit int := 5;
BEGIN
  IF p_user_id IS NULL THEN
    RETURN false;
  END IF;

  SELECT COALESCE(premium, false)
         AND (premium_until IS NULL OR premium_until > now())
    INTO v_premium
  FROM public.profiles
  WHERE id = p_user_id;

  IF v_premium THEN
    RETURN true;
  END IF;

  v_today_start := date_trunc('day', now() AT TIME ZONE 'Europe/Prague') AT TIME ZONE 'Europe/Prague';

  SELECT COUNT(*) INTO v_count
  FROM public.likes
  WHERE from_user = p_user_id
    AND created_at >= v_today_start;

  RETURN v_count < v_limit;
END;
$$;

REVOKE ALL ON FUNCTION public.daily_swipe_limit_ok(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.daily_swipe_limit_ok(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.daily_swipe_limit_ok(uuid) TO service_role;

-- 2) RPC for UI counter
CREATE OR REPLACE FUNCTION public.my_daily_swipes_remaining()
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_premium boolean := false;
  v_count int;
  v_today_start timestamptz;
  v_tomorrow_start timestamptz;
  v_limit int := 5;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('error', 'not_authenticated');
  END IF;

  v_today_start := date_trunc('day', now() AT TIME ZONE 'Europe/Prague') AT TIME ZONE 'Europe/Prague';
  v_tomorrow_start := v_today_start + interval '1 day';

  SELECT COALESCE(premium, false)
         AND (premium_until IS NULL OR premium_until > now())
    INTO v_premium
  FROM public.profiles
  WHERE id = v_user_id;

  IF v_premium THEN
    RETURN jsonb_build_object('premium', true, 'unlimited', true, 'reset_at', v_tomorrow_start);
  END IF;

  SELECT COUNT(*) INTO v_count
  FROM public.likes
  WHERE from_user = v_user_id
    AND created_at >= v_today_start;

  RETURN jsonb_build_object(
    'premium', false,
    'used', v_count,
    'limit', v_limit,
    'remaining', GREATEST(v_limit - v_count, 0),
    'limit_reached', v_count >= v_limit,
    'reset_at', v_tomorrow_start
  );
END;
$$;

REVOKE ALL ON FUNCTION public.my_daily_swipes_remaining() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.my_daily_swipes_remaining() TO authenticated;

-- 3) RLS policy — INSERT into likes requires daily_swipe_limit_ok
DROP POLICY IF EXISTS likes_insert_own ON public.likes;
CREATE POLICY likes_insert_own ON public.likes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = from_user
    AND public.daily_swipe_limit_ok(auth.uid())
  );

COMMENT ON FUNCTION public.daily_swipe_limit_ok IS 'Returns true if user can swipe today (Europe/Prague TZ). Premium = unlimited. Free = 5/day. Used in likes RLS policy.';
COMMENT ON FUNCTION public.my_daily_swipes_remaining IS 'RPC: returns jsonb with used/limit/remaining/reset_at for current user. Premium returns unlimited=true.';
