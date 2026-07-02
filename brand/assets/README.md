# Assets

A few **demo "selects"** live in the repo so they render on GitHub. The **full library — full-res images, source files, and video — lives in Google Drive** (link in [`../README.md`](../README.md)).

## Rules
- **Commit only small demo selects** (~≤ 2 MB) into `selects/` — the keepers worth showing inline. Everything else → Drive.
- **Never commit video** to the repo (it bloats git history forever) — Drive / YouTube, linked.
- **Logos** (`logos/`) are small SVG/PNG and fine to commit; keep the Calendara mark in `primary #C96442` — don't recolor it.
- **Naming:** `surface_subject_vN.ext` — e.g. `hero_kitchen-family_v2.png`, `social_relief-parent_v1.png`, `logo_calendara_coral.svg`.

## How to reference an asset
- In-repo demo: `![hero](selects/hero_kitchen-family_v2.png)`
- Drive file (full-res / video): `[hero v2 — full res](<drive link>)`

## Structure
```
assets/
  selects/   demo keepers shown on GitHub (small)
  logos/     Calendara mark + lockups
  (full-res + source + video  →  Google Drive)
```

## Logo insertion (Nano Banana)
To composite the Calendara mark into a render: bring the chosen render + `logos/calendara_logo.svg` into Nano Banana (Gemini image) and prompt for placement/scale. Keep the mark in `primary #C96442`.
