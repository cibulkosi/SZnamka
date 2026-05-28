# Lokální Next.js build na Windows — troubleshooting

Pokud na Windows `npm run build` selže s erorem typu:

```
Export encountered an error on /premium/page: /premium, exiting the build.
Next.js build worker exited with code: 1
at getOrInstantiateModuleFromParent (.next\server\chunks\ssr\[turbopack]_runtime.js:...)
```

**Build funguje na Linuxu** (Cloudflare Pages + GitHub Actions). Problém je
specifický pro Windows + Turbopack (Next.js 16 default bundler).

## Quick fix — clean reset

```powershell
cd C:\dev\cosmatch
Remove-Item -Recurse -Force node_modules, .next, .turbo -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm install
npm run build
```

## Alternativní fix — vypnout Turbopack

Turbopack na Windows má občas issue s long paths. Webpack je stabilnější:

```powershell
# Spustí build bez turbopack (použije Webpack)
npx next build --no-experimental-turbopack
```

(Pro novější Next.js: `next build --no-turbopack`.)

Pokud Ti to funguje, můžeš si přidat do `package.json`:

```json
"scripts": {
  "build": "next build --no-turbopack",
  ...
}
```

## Windows long path support

Next.js v node_modules dělá symlinks které občas přesahují Windows MAX_PATH (260 znaků).
Aktivuj long path support (potřebuje admin práva):

1. Otevři **PowerShell jako Administrator**
2. Spusť:

```powershell
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
```

3. Restartuj počítač

## Není potřeba — Linux builds fungují

**Pokud Ti lokální build prostě nejde:**
- Pro produkci stačí GitHub Actions (Linux) — buildí AAB i debug APK
- Pro live dev můžeš použít `npm run dev` (development mode obvykle funguje
  i když production build padá)
- Lokální produkční build je jen pro hodně rychlou iteraci — není kritický
