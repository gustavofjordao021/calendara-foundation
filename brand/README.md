# Calendara — Brand & Growth HQ

The single home for everything **Brand / Growth / Marketing / Content**. Canonical docs, recipes, and decisions live here in the repo — versioned, with the app, kept current by Claude (Cowork). The **full image & video library lives in Google Drive**, linked from here; the repo keeps just a few demo "selects" so they render on GitHub without bloating it.

> 👋 **New here?** Read [`START-HERE.md`](START-HERE.md) first, then [`brand-book.md`](brand-book.md).

## What lives where

| Layer | Home | Holds |
|---|---|---|
| Canonical docs · recipes · decisions | **this `brand/` folder (GitHub)** | brand book, image system + prompts, content calendar, a few demo assets |
| Full asset library (images, video) | **Google Drive** (linked below) | all full-res renders, source art, video |
| The work / cadence | **Linear** | Growth/Content initiatives, campaigns, tasks |
| Design source of truth | **Pencil** (`calendara.pen`) | UI design system, screens |
| Measurement | **PostHog** | acquisition, activation, retention |

**Rule of thumb:** decisions & recipes → repo · heavy files → Drive (linked) · a few demo "selects" → `assets/selects/` so they show on GitHub.

## Files in this folder

- [`START-HERE.md`](START-HERE.md) — 2-minute onboarding (especially for non-dev collaborators).
- [`brand-book.md`](brand-book.md) — voice, palette, tokens, type, illustration direction, do/don'ts.
- [`image-system/aesthetic-recommendation.html`](image-system/aesthetic-recommendation.html) — the full visual report behind "Storybook Glow."
- [`image-system/image-prompts-storybook-glow.md`](image-system/image-prompts-storybook-glow.md) — ready-to-paste Midjourney + Nano Banana recipes.
- [`content-calendar.md`](content-calendar.md) — what's shipping.
- [`assets/`](assets/) — a few demo "selects" + logos (full library in Drive).

## 📁 Asset library (Google Drive)

**Drive library → [`Calendara / _library`](https://drive.google.com/drive/folders/1RfHNykMEtiMetwWbhvCI_vJLZR1yJfyI)** · `01_illustration` · `02_app-store` · `03_ads` · `04_motion` · `05_brand-marks`

- Full-res renders, source files, and video live in **Drive**.
- Commit only a handful of small demo selects into `assets/selects/` (the keepers worth showing on GitHub).
- Reference a Drive file from any doc with a plain markdown link.
- Your Drive is **already connected** to Claude — once it's enabled in chat, Claude can read, search, and organize the library and keep these links fresh.

## How it stays updated

Ask Claude (Cowork): *"update the brand book with X,"* *"add this prompt to the image system,"* *"log this week's content,"* *"pull the latest renders from Drive into the selects."* Claude edits these files directly. An optional **weekly scheduled task** can keep the HQ tidy and links in sync.
