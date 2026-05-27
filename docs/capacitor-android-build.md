# Build Android AAB — GitHub Actions workflow

Cosmatch Android appka se buildí **automaticky v GitHub Actions** (Ubuntu runner
v cloudu), takže nemusíš nic instalovat na svém PC.

## Jak to funguje

1. Push do `main` (nebo manuální spuštění z GitHub UI) → workflow se rozjede
2. Workflow stáhne kód, nainstaluje Java + Android SDK + npm deps
3. Vybuilduje Next.js → `next build` → `cap sync android`
4. Podepíše AAB pomocí keystore z GitHub Secrets
5. AAB je k dispozici ke stažení v Actions artifacts (30 dní)

## Setup (jednorázově)

V GitHub repu **Settings → Secrets and variables → Actions** přidat 4 secrets:

| Secret | Hodnota |
|---|---|
| `KEYSTORE_BASE64` | obsah `cosmatch-release.jks` zakódovaný jako base64 (na jednom řádku) |
| `KEY_ALIAS` | `cosmatch` |
| `KEY_PASSWORD` | heslo z `cosmatch-keystore-creds.txt` |
| `STORE_PASSWORD` | stejné heslo |

Všechny 4 hodnoty máš v `cosmatch-keystore-creds.txt` (vygenerovaném souboru).

## Spuštění buildu

**Automaticky:** každý push do `main`, který mění `app/`, `components/`,
`lib/`, `public/`, `android/`, `capacitor.config.json`, `package.json` nebo
`package-lock.json`.

**Manuálně:** otevři <https://github.com/cibulkosi/SZnamka/actions>, klikni
"Build Android AAB" → "Run workflow" → vyber `main` → "Run workflow".

## Stažení AAB

1. Otevři <https://github.com/cibulkosi/SZnamka/actions>
2. Klikni na nejnovější zelený "Build Android AAB" run
3. Dole najdeš sekci "Artifacts" → klikni "cosmatch-release-aab"
4. Stáhne se ZIP — uvnitř je `app-release.aab`

## Upload do Play Console

1. <https://play.google.com/console> → Cosmatch
2. **Testing → Internal testing → Create new release**
3. Drag-and-drop `app-release.aab`
4. Release name: např. `0.1.0-internal`
5. Release notes: pár vět co testovat
6. **Save → Review release → Roll out**

## Časté problémy

### Build selhal: "Keystore was tampered with"
Špatně zkopírovaná hodnota `KEYSTORE_BASE64` (chybí znak, je v ní mezera nebo
nový řádek). Zkopíruj znovu — musí to být **jeden dlouhý řádek bez mezer**.

### Build selhal: "wrong password"
`KEY_PASSWORD` / `STORE_PASSWORD` neodpovídá tomu, co je v keystore. Ověř,
že obě hodnoty jsou stejné jako v `cosmatch-keystore-creds.txt`.

### "Could not find google-services.json"
Build poznámka, ne chyba — push notifications zatím nejsou aktivní, doplníme
později. AAB se vyrobí bez problémů.

### "Play Console: Account verification required"
Než ti Google verifikuje identitu, můžeš nahrávat jen do **Internal testing**
tracku (ne do closed/open/production). Internal je první track, kde se to
testuje. Stačí čekat na Google e-mail.

## Lokální dev (volitelné)

Pokud chceš v budoucnu spouštět appku v emulátoru bez GitHub Actions:
1. Stáhnout Android Studio
2. `npm install` + `npm run cap:open`
3. V Android Studiu Run → vybrat emulator
