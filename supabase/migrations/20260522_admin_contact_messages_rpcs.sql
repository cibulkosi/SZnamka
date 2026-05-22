-- Admin RPC funkce pro contact_messages
-- Deployed via Supabase MCP, mirrored here for version control

CREATE OR REPLACE FUNCTION public.admin_list_contact_messages(
  p_limit int DEFAULT 100,
  p_status text DEFAULT NULL
)
RETURNS TABLE(
  id uuid,
  created_at timestamptz,
  name text,
  email text,
  subject text,
  message text,
  status text,
  replied_at timestamptz,
  notification_sent_at timestamptz,
  admin_notes text,
  ip_hash_short text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email text;
BEGIN
  v_email := lower(coalesce(auth.jwt() ->> 'email', ''));
  IF v_email NOT IN ('cibulkovasimona@gmail.com') THEN
    RAISE EXCEPTION 'Forbidden: %', v_email;
  END IF;
  RETURN QUERY
  SELECT
    cm.id, cm.created_at, cm.name, cm.email, cm.subject, cm.message,
    cm.status, cm.replied_at, cm.notification_sent_at, cm.admin_notes,
    CASE WHEN length(cm.ip_hash) > 12 THEN substring(cm.ip_hash, 1, 12) || '…' ELSE cm.ip_hash END as ip_hash_short
  FROM public.contact_messages cm
  WHERE (p_status IS NULL OR cm.status = p_status)
  ORDER BY cm.created_at DESC
  LIMIT GREATEST(p_limit, 0);
END;
$$;

REVOKE ALL ON FUNCTION public.admin_list_contact_messages(int, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_list_contact_messages(int, text) TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_update_contact_message(
  p_id uuid,
  p_status text DEFAULT NULL,
  p_notes text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email text;
  v_now timestamptz := now();
BEGIN
  v_email := lower(coalesce(auth.jwt() ->> 'email', ''));
  IF v_email NOT IN ('cibulkovasimona@gmail.com') THEN
    RAISE EXCEPTION 'Forbidden: %', v_email;
  END IF;
  IF p_status IS NOT NULL AND p_status NOT IN ('new', 'read', 'replied', 'spam', 'archived') THEN
    RAISE EXCEPTION 'Invalid status: %', p_status;
  END IF;
  UPDATE public.contact_messages
  SET 
    status = COALESCE(p_status, status),
    replied_at = CASE WHEN p_status = 'replied' AND replied_at IS NULL THEN v_now ELSE replied_at END,
    admin_notes = COALESCE(p_notes, admin_notes)
  WHERE id = p_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'not_found');
  END IF;
  RETURN jsonb_build_object('ok', true);
END;
$$;

REVOKE ALL ON FUNCTION public.admin_update_contact_message(uuid, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_update_contact_message(uuid, text, text) TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_contact_messages_count(
  p_status text DEFAULT 'new'
)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
  v_email text;
  v_count int;
BEGIN
  v_email := lower(coalesce(auth.jwt() ->> 'email', ''));
  IF v_email NOT IN ('cibulkovasimona@gmail.com') THEN
    RAISE EXCEPTION 'Forbidden: %', v_email;
  END IF;
  SELECT count(*) INTO v_count FROM public.contact_messages WHERE status = p_status;
  RETURN v_count;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_contact_messages_count(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_contact_messages_count(text) TO authenticated;
