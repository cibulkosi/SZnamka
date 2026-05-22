-- Contact messages from /kontakt/ form
-- Deployed via Supabase MCP, mirrored here for version control

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL CHECK (length(name) BETWEEN 1 AND 120),
  email text NOT NULL CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(email) <= 254),
  subject text NOT NULL CHECK (subject IN ('obecna', 'reklamace', 'gdpr', 'hlaseni', 'spoluprace', 'jine')),
  message text NOT NULL CHECK (length(message) BETWEEN 5 AND 5000),
  ip_hash text,
  user_agent text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'spam', 'archived')),
  replied_at timestamptz,
  admin_notes text,
  notification_sent_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages (status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_ip_hash ON public.contact_messages (ip_hash, created_at DESC);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
-- Žádná policy → defaultně všechno blocked pro anon
-- Service role obchází RLS, takže Edge Function + admin (přes service_role) bude fungovat

COMMENT ON TABLE public.contact_messages IS 'Zprávy z kontaktního formuláře /kontakt/. Vkládá Edge Function contact-form po Turnstile verifikaci. Čte admin přes service_role.';
