# Cosmatch — Follow-up úkoly (nezávislé na launch)

Tahle poznámka shromažďuje úkoly, které **nedělají dnes**, ale jsou v backlogu pro pozdější iteraci. Aktualizováno: 24. 5. 2026.

---

## Lead Magnety / Quiz Funnels

### P0 (po launchi nebo souběžně s ním)

#### 1. Reskin/vylepšení `/test/` kvízu

Kvíz technicky funguje (Canvas 1080×1920 share, voucher capture, 12 archetypů). Co přidat:

- **1:1 share karta** (1080×1080) — pro Instagram Post + TikTok cover, navíc k existující 9:16 Story kartě
- **Social proof counter v intro** — „Už X lidí zjistilo svůj archetyp" (auto-counter z `waitlist.count()`)
- **Per-archetype permalink** `cosmatch.cz/archetypy/<jmeno>` s Open Graph image (1200×630) pro share link previews
- **Animace reveal** — fade-in/slide-up při zobrazení archetypu
- **Friend invite link** — pre-filled URL s UTM tagem pro tracking referral
- **Comparison teaser** — „Tvůj archetyp má X % populace"

Effort: ~3–5 dní dohromady.

### P1 — Attachment Style Quiz

- Nový tool `/attachment-styl/`
- 8 otázek z ECR-S (Brennan-Clark-Shaver Experiences in Close Relationships - Short)
- 4 styly výsledku (secure / anxious / avoidant / disorganized) + krátké popisy
- Email gate → full PDF report
- Redirect na app waitlist po výsledku

Effort: ~3–4 dny.

Důvod: Attachment Project (USA) má 500 k+ dokončení. Psychology quizy konvertují líp než compatibility (40–60 % opt-in vs. 30–40 %). Plus máme Attachment už v algoritmu (Vrstva III), takže back-end logika je hotová.

### P2 — 144 SEO stránek znamení × znamení

- Generated z templates: `/kompatibilita/beran-stir/`, `/kompatibilita/lev-vah/`, atd.
- Krátký text per kombinace (5 odstavců) + CTA na app
- Long-tail SEO traffic (low search volume, ale 144 dlouhých URL)
- Žádný copyright risk (kombinace znamení nejsou IP)

Effort: ~2–3 dny.

---

## Social Media Content Strategy

### Realita

Cosmatch potřebuje **3–6 měsíců denního obsahu** na IG + TikTok pro rozjezd. Bez tohohle žádný quiz funnel nepoběží na české scéně, kde dominuje Tinder (112 k MAU, Sensor Tower Q2/2025) a Bumble (20 k).

### Content kalendář — 7 hlavních témat

| Téma | Počet pieces | Formát | Priorita |
|---|---|---|---|
| 12 archetypů (deep-dive každý 3× — intro, příklady, kompatibilita) | 36 | IG Carousel + TikTok Reel + IG Story | P0 |
| Compatibility deep-dives (např. „Co se stane když potkají 1 a 9") | 30 | TikTok Reel s konkrétními výsledky | P0 |
| Cosmatch story (Simona + Saturn brand + proč jsem to postavila) | 15 | IG Reels + Stories | P0 |
| Educational (numerology basics, attachment styles, Sound Relationship House) | 30 | IG Carousel | P1 |
| Anti-Tinder narativ („proč Hinge designed to be deleted, my taky") | 20 | TikTok Reels (snappy) | P1 |
| User testimonials (po launchi) | průběžné | Stories, Reels | P1 |
| Polemiky a memy o online datingu | 15 | Memes na IG/TikTok | P2 |

**Total:** ~146 unikátních pieces. Každý se může recyklovat na 2–3 platformách → ~400 postů. Pokryje ~4 měsíce při 3 postech/den.

### Příprava

Před launch:
- Definovat **content pillars** (5–7 hlavních témat)
- **30-day kalendář** s konkrétními tématy/dny
- **Asset library** (Saturn brand grafika, fonty, color palette)
- **Tone-of-voice guide** (česky, bez anglikanismů, Hinge-style „designed to be deleted")

V průběhu launch (M1–M3):
- Denní posting 1–3× per platform
- A/B testing hook headlines („Tvůj archetyp odhalí…" vs „Která z 12 jsi Ty…")
- Analytics weekly review (saves, shares, reach, profile visits)

Po launch (M4+):
- Snižit denní volume když máme data o tom, co funguje
- Doublovat na nejlépe performující témata
- Začít influencer outreach (ambasadorky)

---

## Co JIŽ máme

- ✓ Cosmatch Saturn brandmark (4 velikosti PNG + SVG)
- ✓ Cream/pink color palette (`#FAF6F0` + `#ec4899` + `#f9a8d4`)
- ✓ Fraunces (serif headline) + Inter (sans body) fonts
- ✓ 12 archetypů s detailním obsahem (description, traits, love, shadow, compatible)
- ✓ Canvas share karta v `/test/` (9:16 PNG generator)
- ✓ Waitlist + voucher capture mechanika
