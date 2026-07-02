# Website Illustration Plan — Storybook Glow on usecalendara.com

*Audit date 2026-06-11. Repo: `calendara-main`. Principle unchanged from the playbook: illustration carries the feeling, screenshots carry the proof — so demos/how-it-works keep their UI, and Glow art replaces the anonymous gradient washes and stock photos in every* emotional *slot.*

## Current state

- Landing sections use abstract gradient webp washes (`public/landing/landing_1–10.webp`) — on-palette but anonymous; zero humans, zero warmth.
- Features page: `empathy-section.webp` + 2 highlight photos (stock-feel). About: team photos (keep — real faces beat illustration for trust). Blog: only the 4 Cozi posts have images; ~20 posts are walls of text.
- No `public/illustrations/` directory yet.

## Placement map — homepage

| Section | Today | Replace with | Asset status |
|---|---|---|---|
| Hero | gradient + demo | **keep as-is** (proof zone; hero redesign is its own track) | — |
| `problem-section` | text/washes | relief render in a text-left/art-right split — the mental-load moment | ✅ have (4:5 works in 2-col) |
| `family-hub-section` | washes | baking (multigen) or W1 dinner in split layout | ✅ baking · W1 pending |
| `who-its-for-section` | gradient cards | one scene per persona card: co-parents → carseat · sports family → sideline (W2) · multigen → baking · school-age chaos → school-morning | ✅ 3 of 4 · W2 pending |
| `cozi-comparison` | functional | keep table; optional W12 (two tables) as section intro | W12 to render |
| `footer-cta` | gradient | sunrise glow behind the CTA — same close as every carousel/video | ✅ (top-half crop) |
| `how-it-works`, `demo-showcase`, `pricing`, `integration-logos` | UI/proof | **no illustration** — proof stays crisp | — |

## Other pages

- **Features** — `empathy-section.webp` → bedtime scene (W8, pending) or relief; `features-cta` → sunrise. Feature highlights stay screenshots.
- **About** — `mission-section` → kitchen-table canon **16:9** (we have it); team photos untouched.
- **Compare** — W12 header once rendered.
- **Download / invite** — sunrise + the new 2-step invite welcome screenshot side by side (ties to 2.0 story).

## Blog headers (16:9 rule applies)

| Post cluster | Header | Status |
|---|---|---|
| photo-to-calendar cluster (`convert-image-to-calendar-event`, `ocr-calendar`, `ai-powered-event-extraction`, `extract-data-from-photos…`) | W13 flyer-magic | render |
| Cozi cluster (keep existing PNGs or upgrade) | W12 two-tables | render |
| parenting/organization cluster (`5-ways-to-organize…`, `calendar-app-for-parents`, `shared-family-calendar-iphone`) | relief / school-morning **16:9 re-renders** | render |
| camp/summer (future posts) | camp flat-lay — center crop to 16:9 is safe (faceless) | ✅ |
| 2.0 launch + vs-Cozi drafts | W11 / W12 | render |

Plus: **OG images** — blog posts share one generic `og-image.png`. The 2:1 email headers (W16–W18) are within a hair of OG's 1.91:1 — one render serves both. Per-post OG with Glow art is free CTR on every share.

## The unlock

Everything blocked traces to one Midjourney session: **the wave-2 landscape block (W11–W18) + W2 sideline + W1 dinner.** All prompts are copy-paste ready in the pack. The portrait set is already sufficient for every split-layout slot.

## Implementation notes (when we build)

- New dir `public/illustrations/`, webp at sensible widths (≤200KB each — these are 6MB PNGs, must compress), Next `<Image>` with real alt text.
- Swap order (impact-first): footer-cta → problem-section → who-its-for cards → features empathy → about mission → blog headers as renders land.
- No layout rewrites required for phase 1 — these are asset swaps inside existing sections. The two-column "art panel + copy" pattern (the approved D3 grammar) covers any section that's currently full-bleed wash.
- "What the user feels": a parent landing from a Cozi search currently sees gradients and a brown hero; after this, every scroll lands on a family that looks like theirs, drawn in the same world they'll later recognize in our IG feed — one brand, everywhere.
