# Content Calendar — Instagram + TikTok (unified)

Single source for what posts, where, when. Strategy: [`content-playbook.md`](content-playbook.md) · IG files + full captions to grab-and-upload: [`ready-to-post.md`](ready-to-post.md) · post drafts: [`posts/2026-06-batch-01.md`](posts/2026-06-batch-01.md).

**The division of labor:** Instagram runs our **own** content — Storybook Glow carousels, singles, screen-recording demos, all on-brand from Pencil. TikTok runs **two free faceless lanes** — Remotion `POVReel` videos (text hook + accumulating list over Glow) and screen-recording demos — plus photo-mode re-exports of our IG carousels. No Fastlane, no budget, no face. Cadence: **IG 3×/week, TikTok 4×/week** (TikTok rewards volume; below 3 it de-prioritizes). Full TikTok engine + posting steps: [`tiktok-playbook.md`](tiktok-playbook.md).

## Weekly grid (rebased to start Thu Jun 18)

| Date | Instagram (our content) | TikTok (faceless: POVReel + demos + photo-mode) |
|---|---|---|
| **Thu Jun 18** | ▶ #01 Mental Load carousel — *live today* | POVReel — "5 things to take off your brain" (value bomb) ✅ rendered |
| **Sat Jun 20** | #03 "Close the app" single | #01 carousel → photo-mode, trending audio |
| Tue Jun 23 | #04 Camp Season carousel ⭐ | POVReel — camp-season chaos (POV) |
| Thu Jun 25 | #06 Partner carousel | screen-rec demo (when recorded) |
| Sat Jun 27 | #09 Tips carousel | #09 carousel → photo-mode, trending audio |
| Sun Jun 28 | — | POVReel — "partner can't see it" (POV) |
| Tue Jul 1 | SetA single (relief or beach — breather) | POVReel — missed-event anxiety |
| Thu Jul 3 | #02 flyer demo Reel — *if R1 recorded* | cross-post the demo Reel |
| Sat Jul 4 | Seasonal single (road-trip / beach) | photo-mode of a seasonal single |

TikTok target is 4/week — fill gaps with more POVReels (one props edit each; angle library in [`fastlane-brief.md`](fastlane-brief.md) §⑦). Reassess against the analytics review — double the pillar earning saves/shares, cut the weakest.

---

## Instagram — our content

**Mechanics.** Carousels post in filename order (01→08). Post ~7–9am or ~8–10pm local (parents before/after the day). Reply to every comment in the first hour. Hashtags in caption or first comment — either works; first-comment keeps the caption clean. Saves and shares matter more than likes (a partner-tag *is* the pitch).

**The queue** (assets built in Pencil; files + captions staged in [`ready-to-post.md`](ready-to-post.md)):

1. **#01 Mental Load** (Jun 18, live) — *"If everyone's schedule lives in your head, you never really clock out… Tag the person who carries the family calendar."* `#mentalload #defaultparent #familycalendar #familyorganization`
2. **#03 Close the app** (Jun 20) — *"The point of a family calendar isn't the calendar. It's this. Close the app, be with them."* `#hygge #familytime #familycalendar`
3. **#04 Camp Season** (Jun 23) ⭐ — *"Camp schedules are designed to be printed, stuck on the fridge, and memorized by one parent. We'd like a word. Photograph each one…"* `#summercamp #campmom #familycalendar #summerwithkids`
4. **#06 Partner** (Jun 25) — *"Half of family-calendar chaos is one person doing the seeing for two. Share the calendar, split the seeing. Send this to your other half — gently."* `#coparenting #parentingpartner #mentalload`
5. **#09 Tips** (Jun 27) — *"Small systems, fewer 3am 'did I forget something' spirals. Save for Sunday."* `#familyorganization #parentinghacks #mentalload`

Export status: #01 done. #03–#09 need a Pencil-exporter pass (restart the app → I export + drop them here as cards).

---

## TikTok — faceless engine (free)

Two lanes, both free, both faceless. Full detail: [`tiktok-playbook.md`](tiktok-playbook.md).

**Lane B — Remotion `POVReel` (the volume engine).** Text hook + accumulating list over a Glow background, 9:16, closes on the brand card. Each new video is a props edit in `content-studio/src/Root.tsx` (`hook`, `items`, `bg`, `eyebrow`), then `npm run render:pov`. Angle library to draw from: [`fastlane-brief.md`](fastlane-brief.md) §⑦. Batch 4–6 in one sitting.

**Lane A — screen-recording demos.** Phone screen-record the photo→calendar magic (hands + app only, no face); wrap with captions + brand end card via the `DemoReel` template.

**Plus photo-mode** — re-export our IG carousels (#01, #09) to 9:16, upload as a TikTok photo carousel, add trending audio.

### Non-negotiables (what drives TikTok reach)
- **Payoff visible in second 1** — the hook text lands immediately.
- **Trending sound on every post** — our renders ship silent on purpose; add the sound in-app at upload (+52% shares, and a discovery lane).
- **Optimize for saves + shares**, not likes — value-bomb lists earn saves; POV/relatable earns the partner-share.
- Bio link = `usecalendara.com/tiktok`.

### How to post a Remotion video on TikTok
1. On your Mac: `cd content-studio && npm run render:pov` → `out/pov-reel.mp4` (full 1080×1920).
2. Move it to your phone (AirDrop is easiest). Post from the **phone app**, not desktop — mobile uploads get better FYP treatment.
3. TikTok app → **+** → **Upload** → pick the mp4.
4. Tap **Sounds** → add a **trending** sound (our video has no audio, so it just plays under). Browse the "trending" tab, favor sounds with a rising arrow.
5. (Optional) **Captions** → auto-generate; our text is already on-screen so this is just for accessibility.
6. Set the **cover** to the hook frame.
7. Caption + 3–5 niche hashtags (e.g. `#mentalload #defaultparent #momsoftiktok`). Keep the first line a hook.
8. Post in an evening window; reply to every comment in the first hour.

---

## Blog + Email track (2.0 launch)

| When | Channel | Piece | Asset |
|---|---|---|---|
| 2.0 release day | Blog | "Calendara 2.0: the family calendar that feels like home" | [draft](posts/blog/2026-06-calendara-2-0-launch.md) · art W11 |
| 2.0 release day | Email | 2.0 announcement — all users | [draft](posts/email/2026-06-v2-announcement.md) · art W16 |
| release + ~3d | Blog (Cozi-ladder SEO) | "Calendara vs Cozi: the photo difference" | [draft](posts/blog/2026-06-calendara-vs-cozi.md) · art W12 · verify Cozi facts |
| release + ~7d | Email | Invited-user win-back (install-stall cohort) | [draft](posts/email/2026-06-invited-winback.md) · art W17 |

**Channels in play:** Cozi-ladder SEO blog (primary acquisition), Instagram, TikTok, App Store, email (Resend), Product Hunt.
**Status flow:** Idea → Drafting → Ready → Scheduled → Live → Recap.
**Attribution note:** bio links → App Store campaign links with per-channel tokens (`instagram_bio`, `tiktok_bio`) — installs attribute in App Store Connect despite CLND-221.
