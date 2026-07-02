# Screen-Recording Demo — the native test (format · record · cut)

**Why this exists:** our illustrated reels *reach* but die at ~2s on both TikTok and IG (see `project_social_reach_vs_retention`). This is the opposite-medium test — a real phone doing the real thing, value visible in second one. It's wrapped by `DemoReel` **native mode** (`fullBleed: true`), already pre-wired in `src/Root.tsx`. If this holds attention past 2s, we've found the lane.

## 1. The format (what we're making)

9:16, ~11s. The **live screen recording fills the whole frame** — no intro card, no phone mockup. A short hook is overlaid for the first ~2s, three step-captions narrate the magic, and a 2.5s Calendara CTA closes it. **The screen is the hook:** a flyer becoming calendar events is visible immediately.

Timeline (captions already set, easy to nudge):

| Time | On screen | Caption |
|---|---|---|
| 0.0–2.3s | you start the flow | *hook (top):* "watch a flyer become a calendar" |
| 2.4–4.6s | photographing the flyer | "one photo of the flyer 📸" |
| 4.8–6.8s | AI processing → events appear | "AI reads every date" |
| 7.0–9.0s | shared family calendar | "→ on everyone's calendar" (coral) |
| 9.0–11.5s | — | CTA card: "Take a photo, we'll handle the rest." |

## 2. How to record — real-world hands (recommended) ⭐

The strongest version isn't a screen recording at all: a **second phone films real hands** — yours or Louise's — laying a real flyer on the table and running the scan on your iPad/phone. Hands are human and authentic **without a face**, the paper→calendar moment is tactile, it costs nothing, and it reads *native* instead of "an ad." It drops into the same template (any 9:16 `.mp4` in `public/` → `rec-flyer.mp4`).

**Setup:** a real flyer (school / camp / birthday), Calendara open on the iPad or phone, a second phone to film, good window light, a tidy surface (a kitchen table matches our world). Two people is easiest — one operates, one films; film each other's hands.

**Frame it (9:16):** top-down or over-the-shoulder so you see hands + flyer + the device screen. The top-down "flat-lay with hands" look is clean and native.

**The take (~8–12s):** a hand lays the flyer down → picks up the device, opens Calendara → photographs the flyer → **hold ~1.5s while the events populate (the magic — don't rush it)** → tilt to the shared family calendar. Slow, deliberate hands.

**Three things that make or break it:**
- **Glare** — angle the device so the window doesn't reflect in its screen, and turn screen brightness all the way up so it reads on camera.
- **Focus** — tap the filming phone to lock focus on the device screen; move slowly so it doesn't hunt.
- **Steady + the pause** — prop the filming phone (lean it, or a cheap mini tripod) and hold a beat on the events appearing. That beat is the payoff.

**Hybrid (if the screen is hard to read on camera):** shoot the tactile beats externally (hands, paper, the tap) and a clean **screen recording** of just the events populating; I intercut them — external for warmth, screen-rec for the crisp payoff. Send both.

Save it to `public/` as `rec-flyer.mp4` and tell me.

## Screen-capture alternative (iPhone, ~2 min)

**Prep**
- Have a real flyer ready — school / camp / birthday-party — on the table, or as an image in Photos.
- Turn on **Focus / Do Not Disturb** (a notification banner mid-take ruins the clip). Brightness up.
- Open Calendara to the start screen and do **one practice run** so the taps are smooth.
- Use a **demo family / calendar** — no real personal info on screen (we're posting this publicly).

**Record** (Control Center → Screen Recording; start it before you open the app)
The flow to capture, deliberately, ~8–10s:
1. Start on the calendar/home (~0.5s) → tap **Add / the AI button**.
2. **Take a photo** of the flyer (or pick it from the library). Hold the flyer clearly in frame ~1s.
3. **Let the AI process — pause here ~1–1.5s** so the "events appear" moment reads. This is the magic beat; don't rush it.
4. The extracted events show → **confirm / save**.
5. Land on the **shared family calendar** with the new events. Hold ~1s.

**Tips**
- Move deliberately; pause on the magic moment (events populating).
- If you fumble a tap, just keep going or restart — send me the **raw** file, I'll trim to the clean take.
- 8–15s of raw is plenty (we use ~9s). **Audio doesn't matter** — DemoReel mutes it; we add a trending sound at upload.
- Portrait only.

**Send it to me**
- AirDrop / save the `.mp4` to the Mac → drop it in `content-studio/public/` as **`rec-flyer.mp4`**.
- If you recorded extra, tell me roughly where the good take starts/ends (or I'll find the action).

## 3. How I cut it (already wired — it's basically one step)

`DemoReel` is pre-set to native mode with the hook + 3 captions + CTA above. Once `rec-flyer.mp4` is in `public/`, I:
1. Set `recordingSrc: 'rec-flyer.mp4'`, **trim** to the clean take, set `recordingSeconds` to its length.
2. Nudge the 3 caption timestamps to line up with what's actually on screen (photo → processing → calendar).
3. Render full-res 1080×1920.
4. **QA it frame-by-frame** with `tools/video-qa.sh` — confirm captions sync to the action, no personal info visible, clean edges.
5. Hand you the final mp4. You add a **trending sound** + the caption at upload (IG → send/save CTA; TikTok → short + punchy).

## Tweakable
If your flow differs (e.g. you paste a screenshot instead of photographing paper), tell me and I'll match the captions. Hook alternates: *"turn any flyer into a calendar"* · *"the school sends 4 of these a week 👇"* · *"POV: paper chaos → one shared calendar"*.
