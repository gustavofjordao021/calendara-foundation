# Asset Manifest — migrating `content/` → Drive library

> **Status (2026-06-08): ✅ migrated & verified.** `content/_library` uploaded to Google Drive **[`Calendara / _library`](https://drive.google.com/drive/folders/1RfHNykMEtiMetwWbhvCI_vJLZR1yJfyI)** and the files were confirmed present; **`content/` removed from the repo** (was 448 MB). Heavy media now lives in Drive — this file is the index. Earlier cleanup: removed 344 MB `node_modules` + duplicates + `.DS_Store`; Remotion source + rendered video archived into `04_motion/`.

Review of the old `content/` folder (2026-06-07). It's a **media junk-drawer** (lots of duplication) plus the Product Hunt video build projects — **no brand text/docs**. Per the HQ model, heavy media goes to the **Google Drive library** (linked), not the repo; the repo keeps only small brand marks + demo selects. This manifest captures *what exists and where it should go* so nothing is lost in the move.

**Status legend:** ✅ current · 🗄️ archive (retired style) · ♻️ duplicate · 🗑️ discard candidate · 🔧 code (not brand)

## What's in `content/`

| Group | Files | ~Size | Status | → Destination |
|---|---|---|---|---|
| App Store assets (AppIcon, Subscription, Preview 6.5 + 6.7 — 6 screens each) | 14 | 4.3 MB | ✅ current | Drive `02_app-store/` |
| Brand animations (`calendara-animation-1/2`, `202601121252.mp4`) | 3 | 5.4 MB | ✅ | Drive `04_motion/` |
| Ads (`ad_A/C/D/E/F_v1.png`, `ad_B_v1.mp4`) | 6 | 2.4 MB | ✅ review which are live | Drive `03_ads/` |
| **Glow / hygge-sun mark** (`image 13.png`) | 1 | 1.2 MB | ✅ current → **pulled into repo** as `assets/logos/glow-sun.webp` | repo + Drive `05_brand-marks/` |
| Legacy character illustrations (`calendara-illustration-1..7`, png+webp) | 14 | ~5 MB | 🗄️ retired style | Drive `01_illustration/legacy/` |
| Midjourney flat set (`gjordao.eth_a_flat_illustration_*`) | 7 | ~17 MB | 🗄️ retired reference | Drive `01_illustration/legacy/` |
| Old throwaway gens (`Generated Image Sep 2025 *.webp`) | 4 | 0.1 MB | 🗑️ discard | — |
| Product Hunt video — HTML/JSX build (`Product Hunt video/`) | ~40 | 6 MB | 🔧 marketing-eng + ♻️ dups | rendered video → Drive `04_motion/`; code → archive |
| Product Hunt video export (`Product Hunt video.zip`, 75 files) | 1 | 21.9 MB | ♻️ archive export | Drive `04_motion/` or discard if superseded |
| Remotion project (`product-hunt-remotion/`) | src + deps | **356 MB** | 🔧 **code, NOT brand** | see flag below |

## Duplication (confirmed by md5)
The `Product Hunt video/assets/` folder re-bundles top-level files under new names:
- `image 13.png` ≡ `Product Hunt video/assets/hygge-sun.png`
- `AppStore/Preview/6.5/01-hero.png` ≡ `…/assets/screen-01-hero.png` (all 6 App Store screens copied in)
- `calendara-illustration-1.webp` ≡ `…/assets/hero-dashboard.webp`

→ When migrating, keep **one** canonical copy per asset in Drive; don't carry the PH-folder duplicates.

## 🔧 Flag: the Remotion project (356 MB)
`product-hunt-remotion/` is **344 MB of `node_modules`** with **no `.gitignore`** — that should never live in the repo. Recommendation: add a `.gitignore` (`node_modules/`, `out/`), keep only `src/*.tsx` + config, and treat it as **marketing-engineering** (its own folder/repo), not brand. The *rendered video* it produces goes to Drive `04_motion/`.

## Proposed Drive library structure
```
Calendara Asset Library/            (Google Drive — link in ../README.md)
  01_illustration/
    storybook-glow/   ← NEW direction: Midjourney "selects" (the future)
    legacy/           ← retired character + flat sets (archive)
  02_app-store/       ← AppIcon, Subscription, Preview 6.5 + 6.7
  03_ads/             ← ad creatives
  04_motion/          ← animations + Product Hunt renders
  05_brand-marks/     ← glow-sun, logo sources
  _inbox/             ← drop zone for new raw renders
```

## Migration plan
1. **Enable Google Drive in chat** (it's already connected).
2. Claude creates the structure above and uploads the ✅/🗄️ media (de-duplicated).
3. Update `../README.md` + docs to link the Drive folders.
4. With your OK, clear `content/` of the migrated + ♻️ + 🗑️ files, leaving the Remotion code (now git-ignored).

*Nothing is deleted until it's safely in Drive and you've confirmed.*
