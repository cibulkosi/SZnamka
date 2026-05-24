-- ────────────────────────────────────────────────────────────────
-- Learning loop infrastructure pro Cosmatch algoritmus v5 (D'')
-- Datum: 2026-05-24
-- ────────────────────────────────────────────────────────────────
-- Účel: sběr dat o reálných downstream events (like → match → message
--       → IRL meeting → 30-day couple), aby se po 6 měsících daly
--       kalibrovat váhy vrstev podle skutečných outcome dat,
--       ne ručně-nastavené heuristiky.
--
-- Co se loguje:
--   - match_score v okamžiku mutual like
--   - book_score (Crawford & Sullivan vrstva I)
--   - timestamps key events
--
-- Kdo zapisuje: 4 Edge Function triggery (mutual like, first message,
-- "We Met" tlačítko, 30-day check pg_cron job)
-- ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS match_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_b_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Algoritmus skóre v okamžiku mutual like (snapshot pro learning)
  match_score      INTEGER CHECK (match_score BETWEEN 0 AND 100),
  book_score       INTEGER CHECK (book_score BETWEEN 0 AND 100),
  intent_match     TEXT,   -- 'same_serious' | 'same_casual' | 'compatible' | 'conflict'
  algorithm_version TEXT DEFAULT 'D_v5_2026_05_24',

  -- Funnel timestamps
  mutual_like_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  first_message_at    TIMESTAMPTZ,
  fifth_message_at    TIMESTAMPTZ,
  met_irl_at          TIMESTAMPTZ,
  thirty_day_couple_at TIMESTAMPTZ,
  unmatch_at          TIMESTAMPTZ,
  unmatch_reason      TEXT,   -- 'no_chemistry' | 'no_reply' | 'red_flag' | 'other'

  -- Constraint: jeden záznam na pár (oba směry zachycuje jedna řada)
  CONSTRAINT match_events_pair_unique UNIQUE (user_a_id, user_b_id),
  CONSTRAINT match_events_ordered_pair CHECK (user_a_id < user_b_id)
);

-- Indexy pro analytické dotazy
CREATE INDEX IF NOT EXISTS match_events_match_score_idx ON match_events (match_score) WHERE thirty_day_couple_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS match_events_funnel_idx ON match_events (mutual_like_at DESC);
CREATE INDEX IF NOT EXISTS match_events_couples_idx ON match_events (thirty_day_couple_at) WHERE thirty_day_couple_at IS NOT NULL;

-- RLS: admin-only (učení je interní analytika)
ALTER TABLE match_events ENABLE ROW LEVEL SECURITY;

-- Service role full access (Edge Functions)
CREATE POLICY match_events_service_role_all
  ON match_events
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Authenticated users mohou číst jen své vlastní (pro budoucí "your match journey" feature)
CREATE POLICY match_events_user_read_own
  ON match_events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

COMMENT ON TABLE match_events IS 'Learning loop pro Cosmatch algoritmus v5 (D''''). Loguje match_score + funnel events pro post-launch kalibraci vah vrstev.';
COMMENT ON COLUMN match_events.algorithm_version IS 'Verze algoritmu v okamžiku zápisu. Aktuálně D_v5_2026_05_24 = D''''. Změnit při změně vah.';

-- ────────────────────────────────────────────────────────────────
-- View pro snadnou analýzu funnelu (admin dashboard)
-- ────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW match_events_funnel
WITH (security_invoker = on)
AS
SELECT
  algorithm_version,
  match_score / 10 AS score_bucket,  -- 10-bodové bins
  COUNT(*) AS mutual_likes,
  COUNT(first_message_at) AS first_messages,
  COUNT(fifth_message_at) AS five_messages,
  COUNT(met_irl_at) AS met_irl,
  COUNT(thirty_day_couple_at) AS couples_30d,
  ROUND(COUNT(first_message_at)::numeric / NULLIF(COUNT(*),0) * 100, 1) AS msg_rate_pct,
  ROUND(COUNT(met_irl_at)::numeric / NULLIF(COUNT(*),0) * 100, 1) AS irl_rate_pct,
  ROUND(COUNT(thirty_day_couple_at)::numeric / NULLIF(COUNT(*),0) * 100, 1) AS couple_rate_pct
FROM match_events
WHERE mutual_like_at >= NOW() - INTERVAL '180 days'
GROUP BY algorithm_version, match_score / 10
ORDER BY algorithm_version, score_bucket DESC;

COMMENT ON VIEW match_events_funnel IS 'Funnel analytics pro learning loop: match_score buckets × downstream conversion. Po 50+ řádcích na bucket dá smysl pro váhové ladění.';
