# Midjourney Video Prompt Pack · Wave 1 — motion for the reels

*Sibling to [`image-prompts-wave-2.md`](image-prompts-wave-2.md). These are **motion** prompts: you animate an approved Glow still (image-to-video), you don't re-roll the look. The source still carries Storybook Glow + character canon — the animate pass does **not** take `--sref`/`--oref`.*

## How our MJ video pipeline works

1. Start from an **approved still** (one already QA'd as an image) → Animate / image-to-video.
2. **Manual** motion prompt + **Low motion** setting. 9:16 is inherited from the source.
3. ~5s clip is plenty — the templates use ~2.4s per beat.
4. Save the `.mp4` to `content-studio/qa-inbox/`, tell me **"review &lt;name&gt;"**, I run the harness (below) and verdict it.
5. On pass: it moves to `content-studio/public/` and I change that beat's `bg` from `.png` → `.mp4` in `src/Root.tsx`. Live motion replaces the Ken-Burns.

## Global motion rules (every clip)

- **Verbs to use:** gentle, subtle, slow, ambient, soft, faint, drift, sway, breathe, glow. **Banned:** fast, zoom, push-in, whip, spin, dramatic, dynamic, action, camera shake.
- **One or two things move.** Light, steam, a curtain, a single slow blink. Everything else holds. Big motion is what makes MJ morph.
- **Faces: minimal.** A slow blink at most. Never prompt expression changes ("smiles", "laughs", "turns to look") — that's what triggers face melt / dot-eye drift.
- **Camera: locked.** Say "no camera movement / static camera" explicitly. A drifting camera warps the room.
- **No new text, signage, logos, watermark.** Never the word "snap."

---

## Tier 1 — animate the 3 live mental-load beats (drop-in upgrade to the posted reel)

Animate each existing still; keep the same filename stem with `.mp4`. The hook beat is the highest-value one to animate (frame-one motion = the scroll-stop).

| Beat | Source still | Motion prompt (paste into Animate · Low motion) | Output |
|---|---|---|---|
| **pain** (hook) | `hook-load-1-pain.png` | `ambient only: slow warm lamplight flicker overhead, faint dust motes drifting in the window light, the person breathes and gives one slow blink, a loose paper edge lifts slightly in a draft. static camera, everything else perfectly still, gentle and slow` | `hook-load-1-pain.mp4` |
| **shared** | `hook-load-2-shared.png` | `ambient only: soft morning light shifting slowly across the table, the hanging plant's leaves sway faintly, thin steam off the mug, the child gives one slow blink. static camera, calm and warm, no fast motion` | `hook-load-2-shared.mp4` |
| **together** | `hook-load-3-together.png` | `ambient only: warm lamp glow pulses softly brighter then dimmer, thin steam rising from the mugs, gentle slow blinks, a faint curtain breath at the window. static camera, cozy and unhurried` | `hook-load-3-together.mp4` |

After all three pass QA I swap them in and re-render — the reel becomes fully live-motion with the same captions/timing.

## Tier 2 — faceless ambient B-roll (safest; generate these FIRST)

No faces = no canon risk, so these are your most reliable first generations and they're reusable across GlowReel "Feeling" posts, Story backgrounds, and as breathers between beats.

| Name | Source | Motion prompt |
|---|---|---|
| `glow-broll-steam` | `glow-sunrise.png` (or a mugs-on-table still) | `two mugs on a sunlit table, slow curling steam rising, a gentle warm light shift, no people, static camera` |
| `glow-broll-curtain` | a warm-window still (W9) | `a warm kitchen window, sheer curtain breathing softly in a light breeze, plant-leaf shadows swaying gently on the wall, no people, static camera` |
| `glow-broll-flyer` | a fridge-flyer still (W13) | `a child's flyer pinned to a fridge, a soft shimmer of warm light passing slowly over it like gentle magic, no people, static camera` — the photo→calendar motif |
| `glow-broll-lamp-dusk` | a cozy-kitchen still | `an empty cozy kitchen at dusk, a hanging lamp glowing slowly warmer then softer, faint dust in the light, no people, static camera` |

*No matching still yet?* Generate it first as an image with the standard faceless Glow formula (`… --ar 9:16 --sref 2013954648 293616715 --sw 120 --stylize 150 --no text, logos, watermark, ui`), QA it, then animate with the line above.

## Tier 3 — next hook scene-sets (still → animate)

Generate the **still** first (full formula, faces need `--oref <kitchen-render-url>`), QA the image, then animate it with the matching motion line. Two ready scripts:

### "Camp chaos" hook
Captions (for HookReel): *being the only one who knows the **camp schedule** is exhausting* → *now I just photograph the **flyer*** → *and the **whole house** has the summer*

1. **pain** still: `a frazzled parent in a sunlit kitchen surrounded by camp flyers, a swim bag and sunscreen on the counter, holding a phone, overwhelmed, large warm glossy eyes --oref <url> --ar 9:16 --sref 2013954648 293616715 --sw 120 --stylize 150 --no text, logos, watermark, ui`
   · motion: `ambient: warm light shift, one slow blink, a flyer edge lifts in a draft, static camera`
2. **aha** still: `a parent photographing a colorful camp schedule flyer with a phone, a soft warm glow lifting off the page like gentle magic, kitchen morning light, large warm glossy eyes --oref <url> --ar 9:16 --sref 2013954648 293616715 --sw 120 --stylize 150 --no text, logos, watermark, ui`
   · motion: `ambient: the soft glow around the phone pulses gently, faint dust in the light, static camera`
3. **relief** still: `two kids and a parent calm at a kitchen table in summer light, a single tidy phone calendar between them, unhurried, large warm glossy eyes --oref <url> --ar 9:16 --sref 2013954648 293616715 --sw 120 --stylize 150 --no text, logos, watermark, ui`
   · motion: `ambient: gentle blinks, soft curtain breath, warm light, static camera`

### "Partner can't see it" hook
Captions: *I was the **only one** who knew the schedule* → *so now my partner sees **the same calendar*** → *and no one asks me **"what's today?"** anymore*

1. **pain** still: `one parent alone at night at a kitchen table, phone glowing on their face, a wall of sticky notes behind, the rest of the house dark and quiet, large warm glossy eyes --oref <url> --ar 9:16 --sref 2013954648 293616715 --sw 120 --stylize 150 --no text, logos, watermark, ui`
   · motion: `ambient: the phone glow flickers softly on the face, one slow blink, static camera, very still`
2. **turn** still: `two parents on a couch under warm lamplight both looking at the same phone calendar, relieved and easy, large warm glossy eyes --oref <url> --ar 9:16 --sref 2013954648 293616715 --sw 120 --stylize 150 --no text, logos, watermark, ui`
   · motion: `ambient: soft lamp glow shift, gentle blinks, static camera`
3. **payoff** still: `a family glancing at a shared calendar on the fridge as they pass through a bright morning kitchen, large warm glossy eyes --oref <url> --ar 9:16 --sref 2013954648 293616715 --sw 120 --stylize 150 --no text, logos, watermark, ui`
   · motion: `ambient: morning light shift, a curtain breath, static camera`

---

## The QA bar — what I check, frame by frame

A clip **passes** only if all hold across every sampled frame:

- **Faces on-canon** — large warm glossy eyes throughout; no dot-eyes, no melting, no identity change between frames.
- **Hands & fingers intact** — no extra/merging digits, no warping where a hand moves.
- **Objects stable** — nothing spawns, vanishes, or morphs (mugs, phones, flyers, plants).
- **Motion is ambient, not jumpy** — the harness flags abrupt-change frames; a continuous shot should show **zero** flags.
- **No hallucinated text / logos / watermark**, no "snap" text in-frame.
- **Clean 9:16**, no black bars, no edge artifacts; first vs last frame still looks like the same scene (no drift).

Fail = I give you the timestamp(s) and the problem, you re-roll (usually Low motion, or a calmer motion line). Don't fight a bad roll — re-roll.

## Run the harness

```
bash content-studio/tools/video-qa.sh content-studio/qa-inbox/<clip>.mp4 [cadence_fps]
```

Writes `_qa/<clip>/`: `meta.txt` (size/fps/frames/duration), `jumps.txt` (abrupt-change timestamps), `sheet_NN.png` (contact sheets — every sampled frame), `first.png` / `last.png` (drift check). Default samples 3 fps; I bump it to zoom in on a flagged window. Then I read the sheets and verdict.
