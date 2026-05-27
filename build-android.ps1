# Cosmatch — one-click Android build prep
# Run: pravým klikni → "Run with PowerShell" NEBO v PowerShellu: ./build-android.ps1
#
# Co to dělá:
#   1. git pull (stáhne nejnovější změny)
#   2. npm install (jen pokud node_modules chybí)
#   3. npm run cap:sync (next build + zkopírování do android/)
#   4. otevře Android Studio s android/ projektem
#
# Pak v Android Studiu klikneš:
#   Build → Generate Signed Bundle / APK → Android App Bundle → vyplnit keystore

$ErrorActionPreference = 'Stop'
$ProjectDir = $PSScriptRoot
Set-Location $ProjectDir

Write-Host "`n=== Cosmatch Android build ===" -ForegroundColor Magenta
Write-Host "Projekt: $ProjectDir`n" -ForegroundColor Gray

# Krok 1: git pull
Write-Host "[1/4] git pull..." -ForegroundColor Cyan
git pull --rebase
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ git pull selhal. Vyřeš konflikt a spusť znovu." -ForegroundColor Red
    exit 1
}

# Krok 2: npm install (pouze pokud node_modules neexistuje nebo je package-lock novější)
Write-Host "`n[2/4] npm install..." -ForegroundColor Cyan
if (-not (Test-Path "node_modules") -or
    (Get-Item "package-lock.json").LastWriteTime -gt (Get-Item "node_modules" -ErrorAction SilentlyContinue).LastWriteTime) {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ npm install selhal." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "  ✓ node_modules je aktuální, přeskakuju" -ForegroundColor Green
}

# Krok 3: cap sync (next build + cap sync android)
Write-Host "`n[3/4] npm run cap:sync (next build + cap sync)..." -ForegroundColor Cyan
npm run cap:sync
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ cap:sync selhal." -ForegroundColor Red
    exit 1
}

# Krok 4: otevři Android Studio
Write-Host "`n[4/4] Otevírám Android Studio..." -ForegroundColor Cyan
npm run cap:open

Write-Host "`n✓ Hotovo. V Android Studiu počkej na Gradle sync, pak:" -ForegroundColor Green
Write-Host "  Build → Generate Signed Bundle / APK → Android App Bundle" -ForegroundColor White
Write-Host "  → při prvním buildu: Create new keystore (ulož do C:\Users\scibu\Documents\cosmatch-secrets\cosmatch-release.jks)" -ForegroundColor White
Write-Host "  → po dokončení: AAB najdeš v android\app\release\app-release.aab" -ForegroundColor White
