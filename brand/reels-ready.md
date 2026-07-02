# TikTok → IG Reels — adaptation kit

The reels we render for TikTok work on IG Reels **with no re-render** (same 1080×1920, no watermark). The only real work is an **IG-specific caption** — IG indexes captions for search and rewards *sends*, so a copy-paste of the TikTok caption underperforms.

## Mechanics checklist (the "do we need descriptions, etc." answer)

1. **Video file:** reuse the **clean Remotion `.mp4`** from `content-studio/out/` or Drive `ready-to-post/`. **Never** upload a clip downloaded from TikTok — it carries the TikTok logo + handle, and IG suppresses reels with another app's watermark.
2. **Upload natively** in the IG app. Don't use TikTok's "share to Instagram" (adds the watermark).
3. **Dimensions:** already correct. Our captions sit **center-frame**, which clears IG's UI (caption + handle bottom-left, action buttons right). No safe-zone fix needed.
4. **Audio:** add **IG-trending audio in-app** at upload — the track with the ↗ "trending" arrow — at low volume (our video is silent). Use a **Creator account** to access trending audio. This is a reach lever *and* an audio hook in second one; same role as on TikTok.
5. **Caption: yes, always.** First line is the hook (it shows before "…more") and should **front-load keywords** (family calendar, mental load, co-parenting) because IG search indexes captions now.
6. **CTA = the reach lever.** IG carries reels to non-followers on **sends + watch time** (sends are 3–5× likes). So end with a **send/tag** line for relatable posts, a **save** line for value posts.
7. **Hashtags:** 3–5 relevant, for categorization. They don't expand reach much anymore — don't stuff.
8. **Link:** no clickable links in captions → **"link in bio"** (`usecalendara.com/ig`).
9. **Cover frame:** pick a clean cover (matters for your grid, unlike TikTok). The first scene frame works; a text cover is better once we make one.
10. **Trial Reels** (test on non-followers first) needs ~1,000 followers — not yet. Graduate into it.

## Reusable caption formula (any future reel)

```
[Line 1 — scroll-stopping hook, keywords front-loaded]
[Line 2–3 — the story / payoff in plain language]
[Line 4 — SEND or SAVE CTA: "tag a parent who…" / "send to your co-parent" / "save for Sunday"]
📲 Calendara — the AI family calendar. Link in bio.
#3to5 #relevant #hashtags
```

Pick IG-trending audio in-app · choose a cover frame · post natively.

---

## Ready to post

### Reel 1 — Mental-load hook
**File:** `content-studio/out/hook-load-1080x1920.mp4` (same as Drive `ready-to-post/tiktok-hook-mentalload/hook-load-scenes-1080x1920.mp4`) · 10s

**Caption:**
> You're not disorganized — you're just the only one holding the whole family's schedule in your head.
>
> The practices, the parties, the early-dismissal flyer living at the bottom of your bag… that's a full-time job nobody sees. Now you take a photo of the chaos and the whole house gets the same calendar.
>
> Tag the parent who's secretly the family calendar 👇 — or send this to your co-parent as a gentle hint.
>
> 📲 It's called Calendara, the AI family calendar — link in bio.

**Hashtags:** `#mentalload #momtok #familycalendar #parentinghacks #invisiblelabor`
**Audio:** warm, relatable trending track (low volume). **Cover:** the pain first frame.

### Reel 2 — POV "5 things" (value bomb)
**File:** Drive `ready-to-post/tiktok-pov-5things/pov-5things-1080x1920.mp4` · 11.8s

**Caption:**
> 5 things to take off your mental load this week 🧡 (save this one)
>
> If you're the one tracking everyone's schedule, keep this for Sunday planning. Small swaps, less living in your head.
>
> Which are you doing first? 👇
>
> 📲 Calendara turns a photo of any flyer into a shared family calendar — link in bio.

**Hashtags:** `#mentalload #familyorganization #parentingtips #momlife #familycalendar`
**Audio:** calm, trending (low volume). **Cover:** a clean list frame (or a "5 things…" text cover).

---

## Note on cross-posting

Post the **same file** to both platforms, but **tailor caption + audio per platform** — TikTok caption stays short/punchy; IG caption front-loads keywords and asks for a send/save. Space the posts (don't fire both in the same minute). The 0:01 watch-time discipline applies on IG too — watch time is the #1 Reel signal.
