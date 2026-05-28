# Firebase Cloud Messaging setup — push notifikace pro Cosmatch Android

Tento návod Ti řekne, jak za **~10 minut** vytvořit Firebase projekt a propojit
ho s Cosmatch Android appkou, aby fungovaly push notifikace.

> **Pro iOS** vyřešíme později — vyžaduje APNs cert z Apple Developer Programu (které ještě nemáš).

---

## 1. Vytvořit Firebase projekt (5 min)

1. Otevři <https://console.firebase.google.com/>
2. Klikni **„Add project"**
3. Project name: **`cosmatch`** (nebo `cosmatch-dating`)
4. Google Analytics: vypni (zatím nepotřebujeme)
5. Klikni **Create project** → počkej 30 s

## 2. Přidat Android aplikaci do projektu (3 min)

1. V Firebase Console dashboard klikni **Android ikonu** („Add app")
2. Android package name: **`cz.cosmatch.app`** (přesně tento — odpovídá Capacitor config)
3. App nickname: `Cosmatch Android`
4. SHA-1: vyplnit později (z Tvého keystore — viz krok níže)
5. Klikni **Register app**
6. **Stáhni `google-services.json`** — uložit do `android/app/google-services.json` v projektu Cosmatch
7. Klikni **Next** → další → další (skip Gradle config — Capacitor to neřeší stejně)

## 3. SHA-1 z keystore (2 min)

```powershell
# V PowerShell (v Tvém Documents\cosmatch-secrets\ folder, nebo kde máš keystore):
keytool -list -v -keystore cosmatch-release.jks -alias cosmatch -storepass <heslo z creds>
```

Najdi řádek **SHA-1: AA:BB:CC:...** (40 znaků s dvojtečkami). Zkopíruj.

V Firebase Console → Project settings → Your apps → klik na Android app → **Add fingerprint** → vlož SHA-1.

## 4. Service account JSON pro Edge Function (2 min)

1. Firebase Console → ⚙️ Project settings → **Service accounts** tab
2. Klikni **Generate new private key** → **Generate key**
3. Stáhne se JSON soubor (např. `cosmatch-firebase-adminsdk-xxxxx.json`)
4. **Otevři ho** v textovém editoru, **zkopíruj celý obsah**
5. Otevři <https://supabase.com/dashboard/project/xdotpadgbchhecwitbpe/settings/functions>
6. **Edge Functions → Secrets** → New secret:
   - Name: `FIREBASE_SERVICE_ACCOUNT_JSON`
   - Value: vlož celý JSON (jeden řádek)
7. Druhý secret:
   - Name: `FIREBASE_PROJECT_ID`
   - Value: `cosmatch` (nebo přesné project_id z `cosmatch-firebase-adminsdk-xxxxx.json` ve fieldu `project_id`)

## 5. Capacitor sync (1 min)

Až budeš mít `google-services.json` v `android/app/` lokálně:

```powershell
cd C:\dev\cosmatch
git pull                  # stáhne push-notifications kód
npm install               # nainstaluje @capacitor/push-notifications
npm run cap:sync          # synchronizuje s android/
```

Capacitor sám detekuje `google-services.json` a aktivuje Firebase v Android buildu.

## 6. Build a vyzkoušej

GitHub Actions na nový push → vyrobí AAB. Upload do Play Console Internal testing track,
nainstaluj appku na telefon, otevři ji → po prvním matchi se objeví prompt
„Chceš dostávat upozornění?". Když povolíš, registruje device token v Supabase
`device_tokens` tabulce.

## Co se stane když uživatel dostane zprávu

1. INSERT do `messages` tabulky
2. Postgres trigger `notify_new_message_push` volá `send-push-notification` Edge Function
3. Edge Function:
   - Vyhledá příjemce (druhý partner v matche)
   - Najde jeho `device_tokens`
   - Vyrobí JWT pro FCM (RSA-SHA256 sign service account)
   - Pošle push na všech zařízení uživatele
4. Telefon vibruje a ukáže notifikaci „Tomáš Ti napsal: Nepojedeš se mnou…"
5. Klikne na notifikaci → otevře `/chat/thread?id=<matchId>`

## Co dělat když uživatel odinstaluje appku

Token zůstane v DB, ale FCM vrátí `UNREGISTERED` error. Edge Function ho
automaticky smaže z `device_tokens` tabulky.

## Náklady

- Firebase FCM: **zdarma** (neomezeno pro běžný objem)
- Žádné dodatečné Anthropic/Supabase volání
- 0 Kč
