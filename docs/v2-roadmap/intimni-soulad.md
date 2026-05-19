# Cosmatch v2 — Intimní soulad sekce

**Status:** Naplánováno pro v2 Cosmatch Serious. NEIMPLEMENTOVÁNO v1 launchi.
**Updated:** Květen 2026
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

## Klíčové principy implementace (verze A+B+C, květen 2026)

### A) NIKDY anatomické self-disclosure

Self-reported anatomické údaje (velikost, prsa, atd.) jsou notoricky
nepravdivé:
- Muži často přepisují velikost nahoru (Reddit surveys 25-30 %)
- Ženy podceňují / přepisují kategorie postav
- Self-disclosure je nezávislé na realitě = filter nefunguje

**Cosmatch v2 NEPOUŽÍVÁ anatomická self-disclosure pole.** Pouze:
- Libido frekvence (denně / týdně / měsíčně / sporadicky)
- Role preference (dominant / switch / submissive / nezáleží)
- Sexuální styl (vanilla / kink-friendly / nezáleží)

To je „intimní soulad", ne „body matching".

### B) Volný text místo strukturovaných polí pro anatomické

Místo „Preferuju partnera s X velikostí" má uživatel volné textové
pole *Co je pro mě v intimní rovině důležité*. Příklad:

> „Hledám partnera, který má podobnou frekvenci sexu jako já.
> Tělo nehraje roli, charakter ano."

Tento text je SOUČÁSTÍ profilu (viditelné po mutual match), ne filteru.

### C) Reciprocity model

Filter funguje JEN když OBA uživatelé sekci Intimní soulad aktivovali.
Pokud user A má sekci ZAP a user B VYP, A vidí B beze změny (žádné
„neviditelné penalizace"). Tím se eliminuje „tichá penalizace".

## UI Flow

### 1. Aktivace sekce (v `/profile` nastavení)

```
[ Settings ]
> Intimní soulad
  [ Aktivovat sekci ]

[Modal opens]
"Cosmatch nabízí volitelnou sekci 'Intimní soulad' pro uživatele,
 kteří chtějí vyjádřit svoje intimní preference.

 Důležité:
 - Sekce je VIDITELNÁ JEN po vzájemném lajku — nikdy v Discover
 - Filtruje JEN profily, kteří mají sekci taky aktivní (reciprocity)
 - Tvoje data jsou šifrovaná na klíč tvojí relace
 - Můžeš sekci kdykoli vypnout — data se smažou

 Souhlasím se zpracováním údajů o intimních preferencích
 (čl. 9 odst. 2 písm. a) GDPR — výslovný souhlas)?

 [ ] Souhlasím (vyžadováno)
 [ Zavřít ]  [ Aktivovat ]"
```

### 2. Editace preferencí (po aktivaci)

3 strukturované podsekce + 1 volný text:

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

**D. Volný text (max 200 znaků)**
"Co je pro tebe v intimní rovině důležité?"
*Doporučení: konkrétní, autentické, žádné anatomické nároky.*

ŽÁDNÉ pole pro anatomické self-disclosure (velikost atd.).
ŽÁDNÉ pole pro anatomické preference partnera.

### 3. Po mutual match (v chatu)

Když oba uživatelé lajknou a vznikne match:
- Pokud OBA mají sekci aktivovanou → v chat header se objeví nová
  sekce "Intimní soulad"
- Klik → side-by-side comparison strukturovaných preferencí
  (libido frekvence, role, styl)
- + volný text obou uživatelů
- Pokud jen jeden má sekci aktivovanou → druhý nevidí nic (reciprocity)

### 4. Filter logika (na mutual matches)

```typescript
// Filter funguje JEN když OBA uživatelé sekci aktivovali (reciprocity)
function intimateMatch(viewer: IntimateProfile, candidate: IntimateProfile): boolean {
  if (!viewer.enabled || !candidate.enabled) return true  // reciprocity — kdokoli nemá sekci, nefiltrujeme

  // Pouze libido frekvence + role + styl (strukturované preference)
  // Volný text (D) NENÍ ve filtru — jen pro lidský úsudek po match

  // Libido tolerance: rozdíl 0 = 100, rozdíl 4 = 0
  const libidoDiff = Math.abs(libidoToNumber(viewer.libido_frequency) - libidoToNumber(candidate.libido_frequency))
  if (libidoDiff >= 4) return false  // diametrální rozdíl = skryj

  return true
}
```

## Datová struktura

```sql
CREATE TABLE intimate_profiles (
  user_id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Pouze pokud uživatel sekci aktivně zapne
  enabled           BOOLEAN NOT NULL DEFAULT FALSE,
  consented_at      TIMESTAMPTZ,
  consent_version   TEXT,                    -- verze consent textu (audit trail)

  -- A. Libido / frekvence (ideální stav)
  libido_frequency  TEXT,                    -- 'daily' | 'multiple_weekly' | 'weekly' | 'monthly' | 'sporadic' | 'prefer_not_say'

  -- B. Role (kdo má rád)
  role_preference   TEXT,                    -- 'dominant' | 'switch' | 'submissive' | 'no_preference' | 'prefer_not_say'

  -- C. Sexuální styl
  sexual_style      TEXT,                    -- 'vanilla' | 'kink_friendly' | 'open' | 'no_preference' | 'prefer_not_say'

  -- D. Volný text (max 200 znaků)
  important_to_me   VARCHAR(200),            -- "Co je pro mě v intimní rovině důležité"

  -- ŽÁDNÁ anatomická self-disclosure pole (A+B+C decision)
  -- ŽÁDNÁ anatomická preference pole

  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: pouze vlastník + uživatel s mutual match (a oba mají sekci aktivovanou)
CREATE POLICY "Vlastník vidí vše" ON intimate_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Mutual match s reciprocity vidí" ON intimate_profiles
  FOR SELECT USING (
    -- Druhý user má mutual match
    EXISTS (
      SELECT 1 FROM matches WHERE
        (user_a = auth.uid() AND user_b = intimate_profiles.user_id) OR
        (user_b = auth.uid() AND user_a = intimate_profiles.user_id)
    )
    AND
    -- A já také mám sekci aktivovanou (reciprocity)
    EXISTS (
      SELECT 1 FROM intimate_profiles WHERE user_id = auth.uid() AND enabled = TRUE
    )
    AND
    -- A cílový profil ji má aktivovanou
    intimate_profiles.enabled = TRUE
  );
```

## Risk mitigace

| Risk | Mitigace |
|---|---|
| GDPR Article 9 sankce | Explicit opt-in consent, separátní table, šifrování, audit trail |
| Anti-diskriminační žaloba | Žádné anatomické filtry — sexuální preference jsou symetrické |
| Self-disclosure nepravdivost | ŘEŠENO — neexistují anatomická self-disclosure pole |
| Tinder-style FTC settlement | Žádná hidden scoring, plně transparentní v UI + Manifest III-C |
| PR riziko ("dating app pro fetišisty") | Brand jako "premium serious dating", focus na soulad ne body |
| Tichá penalizace | ŘEŠENO — reciprocity model: filter funguje jen když OBA aktivovali |

## Pre-launch checklist (před spuštěním v2)

- [ ] DPIA review s právníkem
- [ ] Šifrování AES-256 dat v `intimate_profiles` table
- [ ] Audit trail pro consent (verze + timestamp)
- [ ] Test reciprocity logiky — kde jeden user nemá sekci, druhý ho vidí normálně
- [ ] User research: 20+ rozhovorů zda uživatelé Sekci skutečně chtějí
- [ ] Brand-safety review s Manifest III-C konzistentní
- [ ] Marketing copy review (žádné explicitní termíny, citlivá komunikace)

## Estimated effort

- Backend: 1.5 dne (DB schema, RLS, reciprocity)
- Frontend UI: 2 dny (Settings flow, mutual reveal UI, filter logic)
- Compliance: 1 den (DPIA, consent flows, audit)
- Total: ~4.5 dne developer time + 2 týdny user research

**Implementace AŽ PO** dosažení 1 000 platících uživatelů Cosmatch+
nebo 6 měsíců od launchu (cokoli přijde dřív).
