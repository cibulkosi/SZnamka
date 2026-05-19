# Cosmatch v2 — Intimní soulad sekce

**Status:** Naplánováno pro v2 Cosmatch Serious. NEIMPLEMENTOVÁNO v1 launchi.
**Created:** Květen 2026
**Owner:** Simona Cibulková

---

## Účel

Doplnit pro vážné dating uživatele Cosmatch Serious (v2) možnost
vyjádřit a filtrovat podle intimních / sexuálních preferencí způsobem,
který je legálně bezpečný, brand-safe a respektuje uživatele.

Současné dating apps (Tinder, Bumble, Hinge) toto téma ignorují
a uživatelé tedy zažívají frustraci, když po několika rande zjistí
intimní inkompatibilitu. Cosmatch jako "premium-but-honest" platform
může tohle řešit profesionálně a citlivě.

## Klíčové principy implementace

1. **Opt-in extended profile** — uživatel sekci aktivuje volitelně
   v nastavení profilu. Není povinné k registraci, není povinné
   pro Cosmatch+.

2. **Mutual reveal only** — sekce není viditelná v Discover.
   Stává se viditelnou až po vzájemném lajku obou stran (mutual match).

3. **Funguje jako filtr, NIKDY jako součást skóre** — preference
   skryjí profily mimo tvoje preference, ale neovlivňují CCS skóre
   ostatních uživatelů.

4. **Article 9 GDPR compliance** — explicit consent při zapnutí
   sekce. Možnost kdykoli odvolat. Data uložena v separátní tabulce
   s šifrováním na klíč uživatele.

5. **Brand-safety** — Manifest důvěry princip III-C říká:
   "Cosmatch nikdy nehodnotí přitažlivost — fyzické a intimní
   preference jsou pouze filtry, které si nastavíš sám."

## Datová struktura

### Tabulka `intimate_profiles` (separátní od `profiles`)

```sql
CREATE TABLE intimate_profiles (
  user_id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Pouze pokud uživatel sekci aktivně zapne
  enabled           BOOLEAN NOT NULL DEFAULT FALSE,
  consented_at      TIMESTAMPTZ,
  consent_version   TEXT,                    -- verze consent textu (audit trail)

  -- A. Libido / frekvence (ideální stav)
  libido_frequency  TEXT,                    -- 'daily' | 'multiple_weekly' | 'weekly' | 'monthly' | 'sporadic'

  -- B. Role (kdo má rád)
  role_preference   TEXT,                    -- 'dominant' | 'switch' | 'submissive' | 'no_preference'

  -- C. Sexuální styl
  sexual_style      TEXT,                    -- 'vanilla' | 'kink_friendly' | 'open' | 'no_preference'

  -- D. Anatomické preference (preferovaný partner)
  partner_pref_size_male    TEXT,            -- 'small' | 'average' | 'above_average' | 'no_preference' (NULL pokud nehledá muže)
  partner_pref_chest_female TEXT,            -- 'petite' | 'average' | 'curvy' | 'no_preference' (NULL pokud nehledá ženu)
  partner_pref_body_general TEXT,            -- volný text limit 200 znaků

  -- Pro vlastní self-disclosure (NEPOVINNÉ, nikdy filter)
  self_size_male            TEXT,            -- pouze pokud uživatel chce sdílet
  self_chest_female         TEXT,

  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: pouze vlastník + uživatel s mutual match
CREATE POLICY "Vlastník vidí vše" ON intimate_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Mutual match vidí jen po like obou stran" ON intimate_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM matches WHERE
        (user_a = auth.uid() AND user_b = intimate_profiles.user_id) OR
        (user_b = auth.uid() AND user_a = intimate_profiles.user_id)
    )
  );
```

## UI Flow

### 1. Aktivace sekce (v `/profile` nastavení)

```
[ Settings ]
> Intimní soulad
  [ Aktivovat sekci ]

[Modal opens]
"Cosmatch nabízí volitelnou sekci 'Intimní soulad' pro uživatele,
 kteří chtějí vyjádřit svoje sexuální / intimní preference.

 Důležité:
 • Sekce je VIDITELNÁ JEN po vzájemném lajku — nikdy v Discover
 • Preference SLOUŽÍ JEN jako filtr, nesnižují skóre nikomu
 • Tvoje data jsou šifrovaná na klíč tvojí relace
 • Můžeš sekci kdykoli vypnout — data se smažou

 Souhlasím se zpracováním údajů o sexuálních preferencích
 (čl. 9 odst. 2 písm. a) GDPR — výslovný souhlas)?

 [ ] Souhlasím (vyžadováno)
 [ Zavřít ]  [ Aktivovat ]"
```

### 2. Editace preferencí (po aktivaci)

5 podsekcí s jasným branding:

**A. Libido**
"Jak často bys ideálně chtěl/a intimitu?"
- Denně
- Několikrát týdně
- Týdně
- Měsíčně
- Sporadicky / nezáleží mi
- Raději neuvádím

**B. Role**
"Jakou roli máš rád/a v intimních chvílích?"
- Spíš vedoucí (dominant)
- Záleží na náladě (switch)
- Spíš následující (submissive)
- Nezáleží mi
- Raději neuvádím

**C. Sexuální styl**
"Jak bys popsal/a svůj přístup k intimitě?"
- Tradiční (vanilla)
- Otevřený experimentu (kink-friendly)
- Otevřený vztah / non-monogamy
- Nezáleží mi
- Raději neuvádím

**D. Preferovaný partner — anatomicky**
Frame: "Tyto preference filtrují, koho ti ukážeme v Discover po mutual
match. Nesnižujeme tím skóre nikomu — jen pomáháme tobě."

(Zobrazí se jen relevantní podle toho koho hledá uživatel)

Pokud hledá MUŽE:
"Preferovaná anatomická velikost partnera"
- Malé
- Průměrné
- Větší
- Nezáleží mi

Pokud hledá ŽENU:
"Preferovaná velikost prsou partnerky"
- Drobné
- Průměrné
- Plnější
- Nezáleží mi

**E. O mně (volitelné — self-disclosure)**
Frame: "Pokud chceš, můžeš sdílet vlastní anatomické rysy.
Toto se zobrazí JEN po vzájemném lajku partnerovi, který tě bude lajknut.
Není povinné."

### 3. Po mutual match (v chatu)

Když oba uživatelé lajknou a vznikne match:
- V chat header objeví se nová sekce "Intimní soulad" (pokud oba ji mají aktivovanou)
- Klik → zobrazí side-by-side comparison preferencí
- Soft labels: "Oba preferujete tradiční přístup", "Vaše libido frekvence se shodují"

## Filter logika

```typescript
// V discover po mutual match check, navíc:

function isOutsideIntimatePrefs(viewer: IntimateProfile, candidate: IntimateProfile): boolean {
  if (!viewer.enabled || !candidate.enabled) return false  // pokud sekci nemají, nefiltruj

  // Anatomické preference (pokud viewer chce filtrovat)
  if (viewer.partner_pref_size_male && viewer.partner_pref_size_male !== 'no_preference') {
    if (candidate.self_size_male && candidate.self_size_male !== viewer.partner_pref_size_male) {
      return true
    }
  }
  if (viewer.partner_pref_chest_female && viewer.partner_pref_chest_female !== 'no_preference') {
    if (candidate.self_chest_female && candidate.self_chest_female !== viewer.partner_pref_chest_female) {
      return true
    }
  }

  return false
}
```

## Risk mitigace

| Risk | Mitigace |
|---|---|
| GDPR Article 9 sankce | Explicit opt-in consent, separátní table, šifrování, audit trail |
| Anti-diskriminační žaloba | Preference jsou symetrické (každý si volí), nepenalizují, jsou filter not score |
| Tinder-style FTC settlement | Žádná hidden scoring, plně transparentní v UI a Manifest důvěry |
| PR riziko ("dating app pro úchyly") | Brand jako "premium serious dating", access jen ve Cosmatch Serious tier |
| Underage abuse | Sekce dostupná jen pro plně 18+ verified users (KYC), age verification přes iDenfy |

## Pre-launch checklist (před spuštěním v2)

- [ ] DPIA (Data Protection Impact Assessment) review s právníkem
- [ ] Šifrování AES-256 dat v `intimate_profiles` table
- [ ] Audit trail pro consent (verze + timestamp + user_agent)
- [ ] Test mutual reveal logiky — žádné leaking dat před mutual
- [ ] User research: 20+ rozhovorů zda uživatelé Sekci skutečně chtějí
- [ ] Brand-safety review s Manifest důvěry konzistentní
- [ ] Marketing copy review (žádné explicitní termíny, citlivá komunikace)
- [ ] iDenfy KYC integrace (Serious tier requirement)

## Estimated effort

- Backend: 2 dny (DB schema, RLS, edge functions)
- Frontend UI: 3 dny (Settings flow, mutual reveal UI, filter logic)
- Compliance: 1 den (DPIA, consent flows, audit)
- Total: ~6 dny developer time + 2 týdny user research

**Implementace AŽ PO** dosažení 1 000 platících uživatelů Cosmatch+
nebo 6 měsíců od launchu (cokoli přijde dřív).
