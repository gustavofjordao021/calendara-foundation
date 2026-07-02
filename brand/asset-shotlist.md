# Asset Shotlist — June Batch 01

Everything **Gustavo** generates; Claude assembles the rest (Pencil slides, Remotion cuts, captions). Ordered by publish date in [`content-calendar.md`](content-calendar.md). Prompts from [`image-system/image-prompts-storybook-glow.md`](image-system/image-prompts-storybook-glow.md) — keep `--sref 2013954648 293616715 --sw 120 --stylize 150` locked.

## 1 · Midjourney stills (one session, ~30 min)

**Character consistency rule (learned 2026-06-10):** the first batch drifted to flat dot eyes vs. the kitchen art's glossy highlighted eyes. Canon = the kitchen-table render. On any scene **with faces**, anchor it: add `--oref <kitchen render URL>` and explicit subject anchors ("a mother in her late 30s, large warm glossy eyes"). Faceless scenes don't need the anchor.

| # | For | Due | Prompt |
|---|---|---|---|
| S1 ⚠️ re-roll | #01 carousel slide 7 + #05 reuse (first roll returned a child, not a parent) | Jun 11 | `a tired-but-relieved mother in her late 30s exhaling with a soft smile as warm light gathers around her, large warm glossy eyes, a calm home in soft focus behind, the feeling of a weight lifted, warm coral amber and cream, gentle grain --sref 2013954648 293616715 --oref <kitchen-render-url> --sw 120 --ar 4:5 --stylize 150` |
| S2 — parked | #03 single (kitchen-table art covers it; first roll: eye drift + mom reads worried, not relieved) | — | re-roll only if wanted, with the anchor rule above |
| S3 ✅ done | #04 carousel slide 2 — approved 2026-06-10 (sage-leaning but on-palette; no faces) | Jun 16 | — |
| S4 ✅ done | #06 carousel slide 7 — approved 2026-06-10 (canon eyes; teen absent, acceptable) | Jun 23 | — |
| S5 ✅ done | #08 single — approved 2026-06-10 (Grandpa not Grandma; caption updated in batch doc) | Jun 20 | — |
| S6 ✅ done | CTA art — seaside-cottage sunburst approved 2026-06-11. Filed: Drive `_library/01_illustration/2026-06_glow-sunrise-cta_1x1.png` + working copy `glow-sunrise.png` in repo root. Use top half only (sunburst + coral sky); scrim hides the busy beach foreground. | — | — |

Tips: append `--no text, logos, watermark, ui`; add `--sv 4` if output drifts from the reference; render 16:9 variants of S1/S2/S5 too (web + GlowReel crops).

| S7 ✅ done | Covered by W1 (wave-2 pack) — 4:5 dinner scene approved 2026-06-11; three-person family, fine per diverse-configs default. Also approved same session: W2 sideline, W3 car-seat handoff. | — | — |

## 2 · Midjourney video loops (image-to-video on selects)

| # | Source | Use |
|---|---|---|
| V1 | Kitchen-table scene (existing `image.png`) | GlowReel #03 — set `isVideo: true` |
| V2 | S1 relief select | GlowReel for #01/#05 TikTok |

4–6s, subtle motion (light shifting, steam). Drop MP4s in `content-studio/public/`.

## 3 · Screen recordings (one phone session, ~10 min)

| # | For | Due | Shot |
|---|---|---|---|
| R1 | #02 Reel/TikTok | Jun 12 | Real school/camp flyer on the fridge → open Calendara → photo → extraction → events appear. Vertical screen recording + 2s handheld shot of the flyer first. Raw — no polish. |
| R2 | #07 Reel/TikTok | Jun 18 | Same flow with a **handwritten** practice schedule (the hard-mode proof). Hold the paper up to camera first. |

Drop in `content-studio/public/` → I cut them in DemoReel (captions + end card pre-loaded).

## 4 · Founder video (optional, week 3)

| # | For | Due | Shot |
|---|---|---|---|
| F1 | #10 TikTok | Jun 24 | 30–45s talking head, script in [`posts/2026-06-batch-01.md`](posts/2026-06-batch-01.md) §10. One take is fine — raw wins here. |

## Already covered (no action)

- All PROOF/UI slides — built in `calendara.pen` (`Social/Proof-*`)
- #03 feed + story posts — built (`Social/Glow-03-*`)
- Text-slide carousels #01/#05/#09 — Claude builds in Pencil from batch doc
- Video assembly — `content-studio/` Remotion templates, tested
- Captions/hashtags — drafted in the batch doc
