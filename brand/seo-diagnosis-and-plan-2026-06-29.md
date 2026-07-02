# Calendara SEO — Diagnosis & Content Plan

**Date:** June 29, 2026 · **Window analyzed:** GSC last 3 months (Mar 28 – Jun 27), PostHog last 120 days
**Sources:** Google Search Console (pulled live), PostHog web analytics (usecalendara.com), archived Linear SEO docs (Jan Playbook, Mar Audit), repo blog content (47 posts), staged drafts in `brand/posts/`

---

## TL;DR

The drift is real, but it is **not** a keyword-strategy problem and **not** mainly a "we stopped blogging" problem. It has two root causes, in priority order:

1. **Indexation regressed.** Google now indexes **38 pages, down from 47 in March.** Thirty-one posts are "Crawled — currently not indexed" — Google saw them and decided they weren't worth indexing. That caps the impression ceiling no matter how much we publish. *What the user feels: a parent searches "best shared family calendar app," our post exists, but it's invisible — they never see Calendara and install a competitor instead.*
2. **We're seen but not clicked.** 199K impressions in 3 months but only **917 clicks (0.5% CTR)** at average position **9.4**. We rank just low enough (page-1 bottom / page-2 top) to miss the traffic, and a few page-1 results have title/snippet problems that bleed clicks.

The content engine is coasting on the Jan–Mar sprint: organic peaked in **May** and is now flat-to-down. The single clearest growth opening is an entire **"shared calendar app" cluster** (~6,000+ monthly impressions, ranking positions 14–28, near-zero clicks) that we have no strong page for.

**Do this order:** (0) unblock indexing, (1) fix CTR + climb on the winners we already have, (2) build the "shared calendar app" cluster, (3) turn the 2.0/AI vision into search content. Publishing more thin posts before fixing indexation will not move the needle.

---

# Part 1 — Diagnosis

## 1. Headline numbers: a plateau, not a collapse

| Metric (GSC, Mar 28 – Jun 27) | Value |
|---|---|
| Total clicks | 917 |
| Total impressions | 199,000 |
| Average CTR | 0.5% |
| Average position | 9.4 |
| Impressions/day | ~2,187 |

For context, the March audit recorded ~2,000–3,000 impressions/day right after the late-January domain breakthrough. **Five months later we're at ~2,187/day — essentially flat.** We broke through, then stopped climbing.

PostHog tells the same story from the traffic side (organic-search pageviews to usecalendara.com):

| Month | Organic PV | Note |
|---|---|---|
| March | 659 | |
| April | 688 | |
| May | 1,259 | **peak** |
| June (through 29th) | 1,106 | flat-to-down |

The Jan–Mar content matured and ranked, carrying organic up through May. With **nothing published since March 10**, the engine is now coasting and starting to fade. That's the "drift."

## 2. The real bottleneck: indexation went backwards

This is the most important finding, and it's technical.

| Page indexing (GSC, today) | Pages |
|---|---|
| **Indexed** | **38** |
| Not indexed (total) | 59 |
| — Crawled, currently not indexed | 31 |
| — Discovered, currently not indexed | 9 |
| — Page with redirect | 17 |
| — Redirect error | 2 |
| — noindex / 404 | 0 |

March had 47 indexed of 102. We now have **38 of 97 — fewer indexed pages than three months ago.**

The good news: the March audit's #1 fix (missing canonical tags sitewide) **has been done** — homepage, blog posts, `/features`, `/compare`, `/blog` all emit canonicals now. So "crawled — currently not indexed" is no longer a canonical bug. It's a **quality verdict**: on a ~1-year-old domain with 47 fairly similar "best family calendar / Cozi X / photo-to-X" posts (most 1,000–1,500 words, one image), Google indexes the strongest ~38 and ignores the rest as thin or near-duplicate.

The two **redirect errors are the same ones flagged in March** and are still live: `/blog/convert-image-to-calendar-event` and `/blog/ocr-calendar`.

*What the user feels: we wrote `/blog/ocr-calendar` to capture "OCR calendar" searchers; the redirect is broken, Google dropped it, and a student searching "turn screenshot into calendar" lands on a competitor. We did the work and get zero return on it.*

**Implication:** more volume makes this worse, not better. The lever is to consolidate/strengthen what we have, prune true dead weight, and request indexing for the keepers — *then* publish selectively.

## 3. CTR: we're impression-rich and click-poor

A 0.5% CTR at position 9.4 has two distinct sub-problems:

**(a) Page-2 rankings that need to climb.** High impressions, low position, almost no clicks:

| Query | Impressions | Clicks | Position |
|---|---|---|---|
| best shared calendar app | 2,639 | 1 | 14.4 |
| shared calendar app | 1,550 | 0 | 26.2 |
| cozi vs google calendar | 1,420 | 4 | 33.1 |
| family calendar app | 741 | 1 | 26.0 |

**(b) Page-1 results with weak titles/snippets** — ranking fine, still not clicked:

| Query | Impressions | Clicks | Position | Likely cause |
|---|---|---|---|---|
| cozi gold pricing 2026 | 239 | 0 | **1.4** | Snippet answers the price inline → no click needed |
| best family calendar apps 2026 | 414 | 0 | 8.8 | Title not compelling / AI Overview eating clicks |
| best shared calendar apps for couples 2026 | 328 | 0 | 8.4 | No couples-specific landing, generic title |
| find a smart calendar app that parses school newsletters automatically | 258 | 0 | 7.0 | Conversational/AI-Overview query, no optimized answer |

Type (b) is the faster win: same ranking, just rewrite the title + meta to earn the click. "cozi gold pricing 2026" sitting at **position 1.4 with zero clicks** is the poster child — we own the SERP and bank nothing.

## 4. What's working vs. what's decaying (page-level organic, Mar→Jun)

**Growing (feed these):**

| Post | Mar → Jun organic PV | Cluster |
|---|---|---|
| 7-best-family-calendar-apps-2026 | 26 → 80 | best-family-calendar |
| cozi-review-2026 | 26 → 53 | Cozi |
| photo-to-todo-list | 0 → 27 | photo-to-X |
| free-ai-calendar | 2 → 16 | AI |

**Decaying from their peak (the drift):**

| Post | Pattern | Cluster |
|---|---|---|
| photo-to-google-calendar | 62 (May) → 38 | photo-to-X |
| photo-to-calendar | 62 (May) → 30 | photo-to-X |
| family-calendar-app-comparison-2026 | 42 (May) → 13 | comparison |
| cozi-vs-google-calendar-for-families | steady decline to 9 | comparison |
| shared-family-calendar-google | **123 (Mar) → 25** | shared-calendar |

The **photo-to-X cluster peaked in May and is fading** — it's the biggest contributor to the feeling that things are slipping. `shared-family-calendar-google` lost a big position (123 → 25) and is worth investigating directly in GSC.

## 5. The biggest untapped opportunity: the "shared calendar app" cluster

Sorted by impressions, a whole family of high-volume queries shows us ranking on page 2–3 with essentially zero clicks and **no strong dedicated page**:

| Query | Impressions | Clicks | Position |
|---|---|---|---|
| best shared calendar app | 2,639 | 1 | 14.4 |
| shared calendar app | 1,550 | 0 | 26.2 |
| best shared calendar | 845 | 0 | 23.8 |
| shared family calendar app | 694 | 0 | 22.5 |
| shareable calendar app | 631 | 0 | 27.5 |
| best calendar sharing app | 610 | 1 | 28.5 |
| calendar sharing app | 524 | 0 | 27.5 |

That's **~7,500 combined monthly impressions** we're already eligible for but converting at ~0%. Two adjacent sub-clusters appear too:

- **Couples:** "best shared calendar apps for couples 2026" (328 impr, pos 8.4, 0 clicks) — a persona we don't address.
- **Conversational / AI-extraction:** "find a smart calendar app that parses school newsletters automatically" (258 impr, pos 7.0, 0 clicks) — *our exact core feature*, phrased the way people now ask AI search. Strong validation of the photo-to-calendar positioning, and a content format we don't yet write for.

The Jan playbook called "shared family calendar" our medium-difficulty sweet spot. The live data confirms it's **still open** — we just never built the pillar.

## 6. Channel context

Social referral pageviews collapsed over the window (84 in March → 33 in June). Blog/SEO is carrying acquisition almost alone right now — which raises the stakes on fixing the indexation ceiling. (Consistent with the standing read that organic Cozi-ladder SEO is the primary acquisition engine.)

---

# Part 2 — The Plan

Priority tiers. Tier 0 gates the rest.

## Tier 0 — Unblock indexing (do first; it caps everything)

This is higher ROI than any single new post. Nothing we publish ranks if Google won't index it.

1. **Fix the 2 redirect errors** — `/blog/convert-image-to-calendar-event` and `/blog/ocr-calendar`. (Flagged in March, still broken. ~30 min.)
2. **Triage the 31 "crawled — not indexed" posts.** Pull the list from GSC (Page indexing → "Crawled - currently not indexed"). For each: **consolidate** thin near-duplicates into one stronger post (e.g., the overlapping photo-to-X and "best shared X" variants), **improve** the keepers (add depth, original data/screenshots, more images with keyword alt text, internal links), or **prune** genuine dead weight. Then **Request Indexing** on the keepers via URL Inspection.
3. **Re-verify canonicals resolve to `www`** and the sitemap URL in `robots.txt` points to `www` (March flagged a non-www mismatch). Canonicals themselves are now in place — confirm they're correct, not just present.

*What the user feels: today, half of what we wrote is invisible. Clearing the index backlog is like turning on lights in rooms we already furnished — existing work starts earning.*

## Tier 1 — Fix CTR and climb on the pages we already have (refresh, don't rewrite)

Fastest clicks per hour of effort. These already rank; we're leaving clicks on the table.

| Page / target query | Now | Action | Why |
|---|---|---|---|
| 7-best-family-calendar-apps-2026 → "best family calendar app" | pos 10.9, 2,614 impr, 1.1% CTR | Shorten the over-long title (<60 chars), strengthen intro, refresh "2026" data, add internal links from related posts to push it onto page 1 | Single biggest head term; moving 10.9 → top 5 roughly multiplies its clicks |
| cozi-pricing-2026 → "cozi gold pricing / cost" cluster | pos 1–9, but ~0–10 clicks across the cluster | **CTR rewrite**: title + meta that give a reason to click beyond the price (comparison hook, "what changed in 2026"). Trim the 240-char meta. | We already rank #1–6; we just don't earn the click. "cozi gold pricing 2026" = pos 1.4 / 0 clicks. |
| photo-to-google-calendar + photo-to-calendar | peaked May, now declining | Freshness refresh: new screenshots, updated steps, FAQ expansion, re-request indexing | Reverse the decay on two former top performers before they slide further |
| cozi-vs-google-calendar-for-families → "cozi vs google calendar" | pos 33.1, 1,420 impr | Rework or rebuild; it's ranking too low to ever earn the 1,420 impressions | High-impression query, currently wasted |

## Tier 2 — Build the "shared calendar app" cluster (the main new-content bet)

The clearest gap. Build a small, tightly interlinked cluster rather than scattered posts.

| New piece | Primary query | Intent | Why now | Internal links |
|---|---|---|---|---|
| **Pillar: "Best Shared Calendar Apps (2026)"** | best shared calendar app / shared calendar app / calendar sharing app | Commercial | ~7,500 impr/mo already, pos 14–28, no strong page | Link to/from 7-best, best-shared-family, photo-to-calendar |
| "Best Shared Calendar Apps for Couples (2026)" | best shared calendar apps for couples 2026 | Commercial | pos 8.4, 0 clicks, no couples page | From pillar + cozi-vs-google |
| Refresh `best-shared-family-calendar-apps` | shared family calendar app | Commercial | already growing (78 in May); make it the family node of the cluster | Hub of the cluster |
| Investigate + rebuild `shared-family-calendar-google` | shared family calendar google | Long-tail, "easy" KD | lost a big position (123 → 25); easy win to recover | From pillar |

Note: these "shared calendar" queries skew slightly beyond *family* (couples, teams, groups). Lead the pillar with sharing as the job-to-be-done, then route family/couples readers to the right node — and make the AI photo-extraction angle the differentiator (no competitor in this cluster has it).

## Tier 3 — Turn the 2.0 / Hygge / AI vision into search content

Where recent learnings and the product vision become SEO.

| New piece | Primary query | Angle |
|---|---|---|
| **AI pillar — consolidate, don't add** | ai calendar app / smart calendar app | We already have *three* thin, low-traffic AI posts (`ai-calendar-app` 12 PV, `best-ai-calendar-app` 13 PV, `free-ai-calendar` 52 PV). Merge the two weak ones into one strong pillar, keep `free-ai-calendar` (it's growing) as a node, 301 the loser. This *is* a Tier 0 consolidation — it fixes duplication and builds the pillar in one move. |
| "A smart calendar that reads your school newsletters" | find a smart calendar app that parses school newsletters automatically (+ variants) | Answer the conversational/AI-Overview query directly; this is literally our core feature, ranking pos 7 with 0 clicks. New format we don't write for yet. |
| **Ship staged draft → replaces existing `calendara-vs-cozi`** | calendara vs cozi / cozi alternative | Heads up: a `calendara-vs-cozi` post already exists but gets only ~10 PV and the query isn't in our top results. The staged draft is stronger and on-convention — **publish it over the old one** (refresh, not net-new) so we don't create a duplicate. Low volume but high intent; fold into the Cozi cluster. |
| **Ship staged draft:** `calendara-2-0` launch post | brand / freshness | Ends the 3.5-month publishing gap, signals an active site to Google, gives social something to point at |

Both staged drafts are good to go pending the fact-checks already noted in them (re-confirm Cozi Gold price/sync direction the week they ship).

## Suggested cadence (solo-operator realistic)

You're one person plus Claude — capacity-plan accordingly, no team handoffs.

- **Week 1 — Indexation sprint (Tier 0).** Fix redirects, triage the 31, request indexing. Ship the 2.0 launch post to break the silence. *No new SEO posts this week.*
- **Week 2 — Tier 1 CTR pass.** Title/meta rewrites on the best-family-calendar + Cozi-pricing winners; refresh the two decaying photo-to-X posts. Ship the `calendara-vs-cozi` draft.
- **Weeks 3–4 — Shared-calendar pillar (Tier 2).** Pillar + couples node + refresh the family node, fully interlinked.
- **Weeks 5–6 — AI pillar (Tier 3).** AI calendar pillar + the school-newsletter conversational answer.
- Then re-measure before deciding the next batch.

---

# Part 3 — Measurement

Watch these, not vanity pageviews:

- **Indexed page count** (today: 38) — the Tier 0 success metric. Target: recover past 47 and climb.
- **CTR** (today: 0.5%) — the Tier 1 metric. Even 0.5% → 1.0% roughly doubles clicks at current impressions.
- **Cluster positions** for "best shared calendar app," "best family calendar app," and the couples/AI queries — the Tier 2/3 metric.
- **Clicks** (today: 917/3mo) — the bottom line.

Recommend a recurring weekly GSC + PostHog pulse so we catch the next decay (like the May photo-to-X peak) while it's happening instead of months later. I can set that up to run automatically.

---

# Appendix — Supporting data

### A1. Top queries by clicks (GSC, 3 mo)

| Query | Clicks | Impr | CTR | Pos |
|---|---|---|---|---|
| calendara | 41 | 117 | 35% | 3.4 |
| best family calendar app | 29 | 2,614 | 1.1% | 10.9 |
| cozi gold cost | 10 | 248 | 4% | 5.9 |
| cozi app review | 5 | 402 | 1.2% | 8.4 |
| cozi summer planner 2026 | 5 | 199 | 2.5% | 7.6 |
| cozi review | 5 | 61 | 8.2% | 7.3 |
| cozi vs google calendar | 4 | 1,420 | 0.3% | 33.1 |
| best family calendar app free | 4 | 371 | 1.1% | 13.1 |
| cozi family organizer review | 4 | 189 | 2.1% | 8.6 |
| cozi reviews | 4 | 134 | 3% | 8.8 |

### A2. Top 30 queries by impressions (GSC, 3 mo)

| Query | Impr | Clicks | Pos |
|---|---|---|---|
| best shared calendar app | 2,639 | 1 | 14.4 |
| best family calendar app | 2,614 | 29 | 10.9 |
| shared calendar app | 1,550 | 0 | 26.2 |
| cozi vs google calendar | 1,420 | 4 | 33.1 |
| best shared calendar | 845 | 0 | 23.8 |
| family calendar app | 741 | 1 | 26.0 |
| shared family calendar app | 694 | 0 | 22.5 |
| shareable calendar app | 631 | 0 | 27.5 |
| best calendar sharing app | 610 | 1 | 28.5 |
| calendar sharing app | 524 | 0 | 27.5 |
| best family calendar apps 2026 | 414 | 0 | 8.8 |
| cozi app review | 402 | 5 | 8.4 |
| best family calendar app free | 371 | 4 | 13.1 |
| best shared calendar apps for couples 2026 | 328 | 0 | 8.4 |
| is cozi free | 318 | 2 | 6.7 |
| best shared calendar app for families | 313 | 1 | 12.5 |
| best family calendar apps | 291 | 3 | 11.4 |
| best shareable calendar app | 284 | 1 | 21.6 |
| best shared family calendar app | 258 | 1 | 18.2 |
| find a smart calendar app that parses school newsletters automatically | 258 | 0 | 7.0 |
| cozi pricing | 253 | 0 | 7.4 |
| cozi gold cost | 248 | 10 | 5.9 |
| how much is cozi gold | 242 | 3 | 5.9 |
| cozi gold pricing 2026 | 239 | 0 | 1.4 |
| cozi gold pricing official | 235 | 0 | 6.0 |
| cozi app cost | 233 | 2 | 7.6 |
| google family calendar | 227 | 0 | 25.1 |
| best calendar app for families | 224 | 0 | 13.9 |
| best family calendar apps 2025 2026 | 222 | 0 | 10.7 |
| cozi family organizer cost | 217 | 0 | 8.9 |

### A3. Page-level organic pageviews by month (PostHog)

| Post | Mar | Apr | May | Jun | Read |
|---|---|---|---|---|---|
| 7-best-family-calendar-apps-2026 | 26 | 38 | 43 | 80 | growing |
| cozi-review-2026 | 26 | 24 | 37 | 53 | growing |
| best-shared-family-calendar-apps | 20 | 23 | 78 | 67 | strong, slight dip |
| photo-to-google-calendar | 20 | 48 | 62 | 38 | peaked May, declining |
| photo-to-calendar | 5 | 19 | 62 | 30 | peaked May, declining |
| cozi-pricing-2026 | 32 | 32 | 29 | 34 | flat (CTR-capped) |
| photo-to-todo-list | 0 | 1 | 13 | 27 | growing |
| free-ai-calendar | 2 | 10 | 13 | 16 | growing |
| familywall-pricing-2026 | 4 | 4 | 10 | 12 | growing |
| best-cozi-alternative-2026 | 8 | 14 | 7 | 15 | flat |
| family-calendar-app-comparison-2026 | 5 | 13 | 42 | 13 | spiked then crashed |
| cozi-vs-google-calendar-for-families | 11 | 16 | 9 | 9 | decaying |
| shared-calendar-for-divorced-parents | 2 | 5 | 13 | 7 | peaked May |
| photo-to-shopping-list | 5 | 1 | 10 | 16 | recovering |
| family-command-center-app | 2 | 3 | 16 | 4 | spiked then crashed |
| shared-family-calendar-google | 123 | 4 | 0 | 25 | lost position, partial recovery |

### A4. Caveats

- GSC view is the default 3-month window; trend read leans on PostHog's 4-month monthly series. A longer GSC comparison would sharpen the exact inflection but doesn't change the conclusion.
- PostHog channel attribution undercounts (CLND-221); organic is identified by referring domain, which is reliable for search but the absolute split vs. direct is approximate.
- Keyword *volumes* aren't in this pull (GSC shows our impressions, not total market volume). The Jan playbook's Ahrefs figures are the best available reference until an SEO tool is connected.
