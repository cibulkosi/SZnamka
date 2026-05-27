# Capacitor → Android AAB build

Tento návod ti řekne, jak z `android/` projektu vyrobit signed AAB pro upload do
Google Play Console.

## Co máš v repozitáři

| Soubor / složka | Co to je |
| --- | --- |
| `capacitor.config.json` | Konfigurace appky (server.url = `cosmatch.cz`, splash, status bar) |
| `android/` | Gradle projekt pro Android Studio |
| `package.json` scripts | `cap:sync`, `cap:open`, `cap:run` |

## Strategie wrap mode

Appka běží v **server mode** — otevírá se přímo na `https://cosmatch.cz`. Výhody:

- **Okamžité aktualizace** — když pushneš na `main`, deployne se přes Cloudflare
  Pages, a app to vidí při příštím otevření.
- **Žádný dvojí deploy** — měníš jen web, ne native build.

Nevýhoda: při výpadku sítě uvidí uživatel error page (zatím). Později můžeme
přidat offline fallback z bundled `out/`.

Apple/Google **musí** vidět nativní funkce, jinak appku zamítnou jako "wrapper".
Co je v plánu doplnit před production launch:

1. **Play Integrity API** — anti-abuse (proti emulátorům, rootu, modifikovaným
   APK). Bez toho Google může appku zařadit do kategorie "low quality".
2. **Push Notifications** — pro nové matche a zprávy. Capacitor plugin
   `@capacitor/push-notifications` + Firebase Cloud Messaging.
3. **In-App Purchase** (RevenueCat) — Cosmatch+ předplatné přes Google Play
   Billing.
4. **Native Sign in with Google** — místo OAuth redirectu v WebView.

Tyto věci přidáme **po prvním upload do internal test** (žádný blocker pro
test).

## První build — krok za krokem

### 0. Předpoklady (jednorázově)

1. **Android Studio** — stáhni z <https://developer.android.com/studio>.
   Při instalaci nech checkboxy default (SDK + Platform-tools + Emulator).
2. **JDK 21** — Android Studio si ho stáhne sám. Pokud ne, ručně z
   <https://adoptium.net/temurin/releases/?version=21>.
3. Otevři Android Studio → **SDK Manager** → ověř, že máš:
   - Android SDK Platform 36 (Android 14)
   - Android SDK Build-Tools 36
   - Android SDK Platform-Tools

### 1. Stáhni nejnovější repo lokálně

```bash
cd C:\path\where\you\want\it
git clone https://github.com/cibulkosi/SZnamka.git cosmatch
cd cosmatch
npm install
```

### 2. Sync Capacitor

```bash
npm run cap:sync
```

To udělá: `next build` → `npx cap sync android` (zkopíruje `out/` do
`android/app/src/main/assets/public/` + zapíše config).

### 3. Otevři projekt v Android Studio

```bash
npm run cap:open
```

(Otevře `android/` v Android Studio. Počkej, až dokončí **Gradle sync** — vlevo
dole status bar. Při prvním spuštění to může trvat ~5 min, stahuje Gradle a
deps.)

### 4. Vygeneruj signing keystore

**DŮLEŽITÉ:** Tímto klíčem se podepisují všechny budoucí buildy. **Když ho
ztratíš, ztratíš schopnost vydávat updaty appky** — musela bys publikovat novou
appku s novým package ID.

V Android Studio: **Build → Generate Signed Bundle / APK → Android App Bundle →
Next**. Pak:

- **Key store path:** klikni **Create new…**
- Path: `C:\Users\scibu\Documents\cosmatch-secrets\cosmatch-release.jks`
  (mimo repo, do `cosmatch-secrets/` jako tokens)
- Password: vymysli silné heslo, ulož do `tokens.md`
- Alias: `cosmatch`
- Validity: `25 years` (Play Store doporučení)
- Certificate fields: vyplň minimálně First and Last Name → "Simona Cibulková"
  a Country code → `CZ`. Ostatní volitelné.
- **Click OK**

Android Studio vytvoří `.jks` a uloží ho na zvolené místo.

### 5. Build release AAB

V tom samém dialogu:

- **Build Variant:** `release`
- **Signature Versions:** zaškrtni `V1 Jar Signature` + `V2 Full APK Signature`
- **Click Finish**

Vlevo dole se objeví notifikace **"Generate Signed Bundle … Successful"**.
Output: `android/app/release/app-release.aab`.

### 6. Upload do Play Console

1. Otevři <https://play.google.com/console>
2. Vyber aplikaci **Cosmatch**
3. **Testing → Internal testing → Create new release**
4. **Upload** → drag-and-drop `app-release.aab`
5. Release name: `0.1.0 internal` (default by mělo stačit)
6. Release notes: pár vět, co testovat
7. **Next → Save → Review release → Roll out**

Internal test track je okamžitý — pozve si pak max. 100 testerů přes
e-mailovou listinu. Pro produkci musíš nejdřív projít **closed test ≥ 14 dní s
≥ 12 testery**.

## Časté problémy

### "SDK location not found"

Android Studio nemá nastavený SDK path. **File → Settings → Languages &
Frameworks → Android SDK → Android SDK Location.**

### "Gradle build failed: minSdkVersion too low"

Některý plugin vyžaduje vyšší minSdk. Edituj `android/variables.gradle`
(`minSdkVersion`).

### "App not installed" při instalaci debug APK

Konflikt s existující appkou se stejným `applicationId`. Odinstaluj předchozí
verzi z telefonu.

### Splash screen je bílý, ne cream

`android/app/src/main/res/drawable/splash.xml` musí ukazovat na barvu
`@color/ic_launcher_background` (= `#F0EBE3`). Sync přes `npm run cap:sync`.

## Co dál po prvním uploadu

1. **Pozvi 12 testerů přes Play Console** (Internal testing → Testers → Create
   email list). Použij e-maily z waitlist + pár přátel.
2. **Spusť 14denní closed test** (Testing → Closed testing → Create release).
3. **Vyplň Data safety form** (App content → Data safety) — vznikne separátní
   docs.
4. **Mezitím přidat native funkce** (Play Integrity, FCM Push, RevenueCat).
5. Po 14 dnech s ≥ 12 aktivními testery: požádej o **Production access**.

---

Když narazíš na cokoli — pošli mi error message a vyřešíme.
