# TikTok niche pulse — save-bait & family-calendar space (Jul 2, 2026)

Source: Apify `clockworks/tiktok-scraper`, 60 posts across 3 search queries ("back to school checklist", "family calendar", "mental load mom"). Cost ~$0.25. Save counts = TikTok `collectCount`.

## Headline: our thesis is externally validated — and the bar is visible
Tiny accounts win this exact lane with checklist **slideshows**. Save rates on winners run **3–6% of plays** (we're at 0 — so the gap is content, not account size).

| Account | Fans | Post | Plays | Saves | Save% |
|---|---|---|---|---|---|
| @julsthehustlingstudent | 42k | BTS checklist (slideshow) | 3.3M | 108,642 | 3.3% |
| @pinkkideass | **4.3k** | school supplies (slideshow) | 1.6M | 75,143 | **4.7%** |
| @yloives | 7k | what to pack for school | 2.9M | 97,373 | 3.4% |
| @imakiaraa | 13k | school essentials (slideshow) | 1.5M | 43,001 | 2.9% |
| @kreamynotes | 66k | semester reset checklist (slideshow) | 338k | 19,822 | **5.9%** |
| @themomsketch | **2.6k** | mental-load sketch slideshows | 186–337k | 2,162–6,013 | ~1.5% |

**@themomsketch is the exemplar to study:** 2.6k followers, our exact ICP (moms/mental load), slideshow format, hand-drawn sketch style, caption stack = "Save this for later 🤍 / Share it with a partner / Follow for daily motherhood content." That's our playbook, executed and working.

## What the winners do that we don't (yet)
1. **Visual-first slides.** The mega-save checklists are product-photo collages, aesthetic flatlays, or hand-drawn sketches — NOT typographic lists on brand color. Our decks are typographic. → test an art-led deck (Glow) next.
2. **Comment-bait as standard practice:** "did I forget anything? 👇" (8k saves post), "what would you add?", "tell me what color to do next". → we just added this; keep it.
3. **Stacked CTA:** save + share-to-partner + follow-for-daily, all three, every caption.
4. **Student-skewed mega-posts:** the biggest checklists target students, not parents. Bigger pool, but off-ICP for us — stay on parents; @themomsketch proves the parent lane works.

## Family-calendar competitive space (on TikTok)
- **Owned by hardware:** Skylight Frame + Hearth Display dominate with ads + UGC (Hearth's own account: 3.8M plays on one post; constant sponsored UGC). Their framing IS our framing: mental load, "send this to the skeptical husband," "I'm not the keeper of all family information anymore."
- **App competitors are weak here:** Jam Family Calendar (direct app competitor) doing gifted micro-influencer posts → ~1k plays. Nobody owns the *app* lane on TikTok.
- **Wedge for Calendara:** they sell $300 wall hardware; we're the free app with photo→calendar magic. Same pain language, 100× cheaper CTA. Also: DIY/DAKBOARD content earns big saves (14.7k) — "system" content wins.

## Mental-load space
- @sheisapaigeturner (391k) owns talking-head validation; 2.1M-play posts earn 40k+ saves. Appetite for this theme is enormous and durable.
- Small accounts break in via **slideshows** (@themomsketch, @summerandbash 5.8k fans → 171k plays).
- A husband's hand-drawn "mental load map" hit 201k plays / **9.6k shares** — a visual artifact of the load itself is highly shareable.

## Actions fed into the test ladder
1. Art-led (Glow/sketch-style) checklist deck — visual-first is the winners' pattern. [next build]
2. Keep comment-bait + stacked save/share/follow CTA in every caption. [done as of Jul 2]
3. IG framing "send this to the partner who needs it" — shares are the currency; the map post proves partner-sharing works.
4. A "mental load map"-style visual artifact deck (the thing itself, drawn) — high share potential, on-brand for us.
5. Re-run this pulse monthly; next: scrape comments of top 3 winners for language mining.

## Addendum (Jul 2): heyollie + growmaple — it's PAID, not organic
Gustavo sees both "everywhere" on TikTok/IG. Scraped both: **@growmaple = 256 followers, dormant since Jul 2024** (best-ever post 38k plays, rest in the hundreds — captions read like ours: "Do you ever feel like an admin assistant to your kids?"). **@heyollie = no findable TikTok presence at all** (profile empty; user-search returns only unrelated family vlogs/pet accounts).

⇒ Their feed presence is **ad spend** (Spark/dark posts don't need a living profile). Two implications: (1) the organic app lane on TikTok remains **unowned** — our opening stands; (2) their ad creative is free R&D — a creative that keeps running for weeks is a creative that converts. Study it via **Meta Ad Library** (public, shows all active FB/IG ads incl. Ollie's) and TikTok's ad transparency. Also: Gustavo's feed is heavily category-personalized — "everywhere in MY feed" ≠ everywhere in a normal mom's feed.

## Meta Ad Library sweep (Jul 2) — 110 active US ads across "family calendar app", "Skylight Calendar", "Hearth Display", "mental load"
Actor: `curious_coder/facebook-ads-library-scraper` (~$0.08).

**Advertiser census:** Skylight ≈30 active ads (dominant; UGC/creator videos, #skylightpartner, plus DCO catalog ads). Hearth Display ≈13. **Podz: Family & Group Organizer = the most aggressive APP advertiser (7 ads)** — a competitor we didn't have on the radar. Cozi is actively advertising (legacy defense). FamilyWall + Family Meet run DCO ads (Family Meet's has run since **Jan 2025** = 17 months = converting). **Ollie & Maple: absent** at these keywords — their spend is likely TikTok-side or under different copy (follow-up: pull their pages directly by page ID).

**Copy patterns that are demonstrably converting (long-running ads):**
1. **Podz's winner (running since Apr 2, five duplicates):** an entire ad that is just an App Store review — *"'We started using Podz a couple months ago and we aren't looking back!… ' — BusyMom2024. Join thousands of families who ditched the chaos. Free on the App Store."* Title: **"Your Group Chat Deserves an Upgrade"** → positioned against the *group chat/texting*, not against paper calendars. Independently converges with our lists-demo hook ("I'm not texting him the supply list again") — the texting-chaos enemy is a validated angle.
2. **Google Gemini is running mental-load creative**: *"Who else wakes up with a running mental to-do list that's already stressing them out?"* (creator-voice video). When Google buys the mental-load framing, the framing is validated at scale.
3. **Skylight's nostalgia reframe:** "The 90s fridge calendar just got a major upgrade."
4. Standard mechanics: "Free on the App Store" + direct App Store link; static IMAGE ads work (Podz's winner is a static image).

**White space:** across all 110 ads, **nobody sells "photo → calendar" AI magic.** Calendara's core demo is an unclaimed message in the paid space too.

**Steal-list for our organic (no spend needed):** (a) testimonial-as-post — a real App Store review as a slideshow slide/deck; (b) "your family group chat deserves an upgrade" as a hook angle; (c) keep owning photo→calendar since no one else claims it.
