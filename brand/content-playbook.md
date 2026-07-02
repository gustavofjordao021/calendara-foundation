# Calendara — Social Content Playbook (Instagram + TikTok)

*Companion to [`brand-book.md`](brand-book.md) (voice, palette) and [`image-system/image-prompts-storybook-glow.md`](image-system/image-prompts-storybook-glow.md) (art recipes). Drafted posts live in [`posts/`](posts/). Scheduling lives in [`content-calendar.md`](content-calendar.md).*

## The one-line strategy

Social is our **brand + proof** channel (SEO blog stays the acquisition engine). Every post does one of two jobs: make the family manager *feel seen* (emotional), or make the photo-to-calendar magic *undeniable* (proof). If a post does neither, don't post it.

## Content pillars

| # | Pillar | Job | Share of posts | Visual system |
|---|---|---|---|---|
| 1 | **The Magic** — photo → events demos | Proof. Our wedge vs Cozi/Maple. | ~30% | Screen recordings, UI screenshot + warm-wash + coral callout |
| 2 | **The Feeling** — togetherness, relief, "close the app" | Brand. The hygge promise. | ~20% | Storybook Glow renders |
| 3 | **The Mental Load** — naming the invisible work | Relatability → shares & saves. ICP magnet. | ~30% | Text slides on warm washes + Glow accents |
| 4 | **The Playbook** — practical family-coordination tips | Saves. Repurposes Cozi-ladder blog content. | ~15% | Text slides + hand-drawn line art |
| 5 | **Building Calendara** — solo-founder notes | Trust + TikTok-native authenticity. | ~5% | Raw/honest, talking-head or screen share |

Pillars 1+3 carry growth; 2 carries the brand; 4+5 round it out. The mental-load pillar is the most shareable with our ICP — a parent tags their partner, and that tag *is* the pitch.

## Format specs (verified June 2026)

**Instagram**
- Feed/carousel: **4:5 (1080×1350)**, up to 20 slides; **8–10 slides is the engagement sweet spot**. Profile grid crops to 3:4 — keep faces/text inside the center ~1012×1350 safe zone.
- All slides in a carousel must share one aspect ratio. Don't mix.
- Reels: 9:16, 5–20s for demos. Cover image designed for the 3:4 grid crop.

**TikTok**
- Photo mode (carousels): **9:16 (1080×1920)** native; 4:5 works but letterboxes. Up to 35 images; keep to 5–10.
- A trending sound on a photo carousel meaningfully boosts distribution — always add one.
- Video: same 9:16; rawer is better. The IG demo Reel cross-posts as-is; the Glow art posts need the 9:16 re-crop.

## Carousel composition — four recipes

Every carousel is assembled from four slide types, all Manrope, all on the v3.1 palette:

- **HOOK slide** — big display text (32–40pt equivalent, 700, −1.0) in espresso `#3D2418` on cream `#FFF8F2`, coral eyebrow line above (11pt, 700, +1.6 tracking, uppercase, `#C96442`). One visual element max. ≤ 10 words. Must survive the 3:4 grid crop.
- **TEXT slide** — one idea per slide, ≤ 15 words, body in espresso on alternating washes (peach `#FFEDDC` → cream `#FFF4EB` → apricot `#FFE4D1`), key phrase in coral. Generous margins — calm and breathable is the brand.
- **ART slide** — full-bleed Storybook Glow render (4:5 prompts in the prompt pack). No text on art, or one short line in a cream text block anchored bottom-third.
- **PROOF slide** — crisp UI screenshot on a warm wash with one hand-drawn coral callout (arrow or circle + 3–5 word annotation). Illustration carries the feeling; the screenshot carries the proof.

**Recipe A — Relatable list** (Pillar 3): HOOK → 5–7 TEXT slides (one item each) → ART (relief scene) → CTA. The workhorse.
**Recipe B — Magic demo** (Pillar 1): HOOK ("watch this flyer become a calendar") → photo of real flyer → PROOF ×3 (photo → extracted events → shared family view) → TEXT (one-line benefit) → CTA.
**Recipe C — Story arc** (Pillar 2): ART → ART → ART (morning chaos → one photo → evening together) with one short caption line per slide → CTA. Pure Glow, minimal words.
**Recipe D — Tip stack** (Pillar 4): HOOK ("save this") → 6–8 TEXT tips → CTA. Built to be saved.

**CTA slide (standard, reuse everywhere):** Glow mark art on cream + "Calendara — the AI-powered family calendar" + "Take a photo, we'll handle the rest." + App Store mention. No exclamation points.

## Caption formula

1. **First line = the hook** (it's all that shows before "…more"). Mirror or extend slide 1, don't repeat it verbatim.
2. 2–4 short lines, voice per brand book: warm, concrete, lightly playful. We help families *coordinate*, never "optimize."
3. One soft CTA: "Link in bio" / "Tag the person who carries the family calendar."
4. 3–5 niche hashtags, not 20: `#mentalload #defaultparent #familycalendar #familyorganization #momlife` (rotate; add `#coparenting`, `#dadlife`, `#backtoschool` seasonally).

## TikTok adaptation rules

- **Don't run IG strategy on TikTok.** Reuse the *content*, change the *energy*: hooks become POV/voiceover ("POV: the school sent home another flyer"), text gets more conversational, raw beats polished.
- Demo videos are the TikTok core (Pillar 1): real hands, real fridge, real flyer, screen recording of the extraction. 7–15 seconds. The magic must be visible in the first 2 seconds.
- Photo-mode carousels: re-export the IG text slides at 9:16, add trending audio.
- Pillar 5 (founder notes) lives mostly here — "I'm building a calendar app for the parent who carries everyone's schedule" is a TikTok-native storyline.

## Cadence (solo-operator honest)

| Channel | Per week | What |
|---|---|---|
| Instagram | 3 | 1 carousel (Recipe A/B/D rotating) · 1 Reel demo · 1 single Glow image |
| TikTok | 2 | 1 demo video (the Reel, re-energized) · 1 photo carousel (recycled IG slides) |

**Batch monthly, not daily:** one Midjourney session (refresh the 6–8 master scenes), one screen-recording session (cut into 3–4 demos), one writing session (all captions + slides for the month). Video assembly is templated in `content-studio/` (Remotion: GlowReel, DemoReel, SlideshowReel — see its README); static slides live in `calendara.pen` under `Social/`. Lock `--sw 120 / --stylize 150` across the set per the prompt pack so the feed reads as one world.

## Measurement

- **Saves and shares > likes** — saves signal Pillar 3/4 working; shares (partner tags) are the pitch happening.
- Track profile-visit → link-tap → App Store. *Caveat: referrer/UTM attribution on `app_store_cta_clicked` is broken until CLND-221 lands — treat social-attributed installs as undercounted; lean on App Store referrer + "how did you hear about us."*
- Review monthly alongside the analytics review; kill the weakest pillar share, double the strongest.

## Guardrails (non-negotiable)

- Original art only — never third-party IP, in tests or production (prompt-pack rule).
- Recolor all generated art to palette; dusty blue is the only cool note.
- Diverse family shapes by default across the month — two-parent, single-parent, co-parenting, multigenerational, blended.
- The word "snap" is banned in all copy, every surface (decided 2026-06-11) — use "take a photo" or "one photo".
- **Format fit beats reuse (2026-06-11):** if an image doesn't suit the format, skip it — don't force it. Landscape (16:9) renders never go in vertical no-copy frames or full-bleed 4:5 (bare letterboxes and edge-sliced people are both rejected). Landscape earns a vertical slot only inside a copy-led composition (framed art panel + headline, like the "One photo" ad). Render master scenes in both 4:5 and 16:9 so every surface has a native option.
- **Channel-format rule (Gustavo, 2026-06-11):** blog and email are the *only* channels that take 16:9 — every other surface follows IG formats: 4:5, 1:1, or 9:16, full stop. (IG's 1.91:1 underperforms; TikTok has no landscape slot.) 16:9 assets are filed under `Web/` in Pencil, never `Social/`.
- No exclamation points unless earned. No productivity jargon. Calm, not chaotic — even "chaos" posts resolve into calm.
