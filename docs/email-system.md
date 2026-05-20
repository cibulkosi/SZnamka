# Cosmatch email system

Stav: 19. 5. 2026 — 5 must-have transakčních e-mailů + voucher redemption + zakládající členové.

## Architektura

```
Frontend / DB trigger
  ↓
Supabase Edge Function (Deno)
  ↓
Resend API (AmazonSES outbound)
  ↓
End user inbox
```

DNS routing pro inbound (ahoj@, gdpr@) jde přes Cloudflare Email Routing → Simona's Gmail.

## 5 Edge Functions

| Funkce | Trigger | Příjemci | Rate limit |
|--------|---------|----------|------------|
| `waitlist-welcome` | POST z `/test`, `/waitlist` | 1 (uživatel) | none — řízeno frontendem |
| `match-notification` | DB trigger po INSERT do `matches` | 2 (oba uživatelé) | none |
| `message-notification` | DB trigger po INSERT do `messages` | 1 (příjemce) | 5 min / vlákno (tabulka `email_log`) |
| `payment-confirmation` | PSP webhook po úspěšné platbě | 1 (platící) | none |
| `account-deletion-confirmation` | POST po žádosti o smazání | 1 (mazaný) | none |

## Shared modules

- `supabase/functions/_shared/resend.ts` — sendEmail() přes Resend API
- `supabase/functions/_shared/email-layout.ts` — branded HTML layout (cream bg, Georgia, Saturn inline SVG)
- `supabase/functions/_shared/czech.ts` — vocative, instrumental, sSe, past (gender-aware verb forms)

## Czech declension

Heuristika pokrývá ~90 % běžných českých jmen:
- **vocative** (5. pád): „Ahoj Simono, / Petře, / Tomáši,"
- **instrumental** (7. pád): „s Petrem, se Simonou, s Tomášem"
- **sSe**: vrátí „s X" nebo „se X" podle prvního písmena (se před s/z/š/ž)
- **past**: gender-aware sloveso („napsal" pro muže, „napsala" pro ženu, „napsal/a" pro neznámý gender)

Foreign jména (Tony, Hugo, Marie, Lucie) → necháno v nominativu.

## Voucher mechanika

Po nasazení migrace `20260519_voucher_redemption_founding_member.sql`:

1. Uživatel na `/test` / `/waitlist` dostane 8znakový unique kód.
2. Pří registraci zadá kód v `/register` → frontend zavolá `supabase.rpc('redeem_voucher', { p_user_id, p_code })`.
3. RPC funkce atomicky:
   - Najde kód v `waitlist` (FOR UPDATE lock).
   - Ověří `redeemed_at IS NULL`.
   - Označí `waitlist.redeemed_at` + `redeemed_by`.
   - Propíše do `profiles.voucher_code`, `voucher_redeemed_at`, `life_path`, `archetype`.
   - Nastaví `is_founding_member = TRUE` pokud `waitlist.position <= 1000`.
4. Po schválení PSP (Comgate / jiný) se voucher mapuje na 3 měsíce zdarma.

## Zakládající člen — odznak

- `profiles.is_founding_member` — automaticky TRUE jen pro waitlist.position ≤ 1000
- `profiles.founding_badge_visible` — toggle (default TRUE, user může opt-out v `/profile`)
- UI render: `<FoundingBadge isFoundingMember={...} visible={...} />`

## Resend secrets (Supabase Edge Function secrets)

| Klíč | Hodnota |
|------|---------|
| `RESEND_API_KEY` | re_TqCBrtcH_... |
| `RESEND_FROM` | Cosmatch <ahoj@cosmatch.cz> (default v kódu) |

## DNS (Cloudflare)

```
TXT _dmarc.cosmatch.cz   v=DMARC1; p=none;
TXT cosmatch.cz          v=spf1 include:amazonses.com include:_spf.mx.cloudflare.net ~all
TXT resend._domainkey.cosmatch.cz   (DKIM, viz Resend dashboard)
MX cosmatch.cz           63 route1.mx.cloudflare.net (Cloudflare Email Routing)
                         63 route2.mx.cloudflare.net
                         72 route3.mx.cloudflare.net
```
