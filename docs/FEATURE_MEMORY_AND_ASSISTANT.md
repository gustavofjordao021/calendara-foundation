# Memory + Assistant (product grouping)

> **Status:** 1-page PRD (April 19, 2026) — product grouping spec, not implementation detail
> **Pair with:** [`strategy/vision/vision-hygge.md`](../strategy/vision/vision-hygge.md) (capability depth), [`strategy/roadmap/product-roadmap-april-2026.md`](../strategy/roadmap/product-roadmap-april-2026.md) (sequencing), [`strategy/competitive/competitive-research-april-2026.md`](../strategy/competitive/competitive-research-april-2026.md) (competitive framing)
> **Agent name:** TBD — see vision-hygge §Brand-and-agent-split. Below, "the agent" = the character; "Calendara" = the product.

---

## Problem

Calendara today is almost entirely **forward-looking**. Users interact with it to plan the week, snap a flyer into an event, share tomorrow's carpool. But the emotional relationship families have with their calendars is mostly **backward-looking** — "remember the first week of kindergarten?" "What did we do last Easter?" "Weren't we in Seattle around this time last year?"

The forward-looking experience lives behind a conversational agent (per the Hygge vision). The backward-looking experience is not yet a product — photos and events accumulate in the database, but there is no surface that hands them back to the family.

We also have an adjacent product issue: **we need a single, unified answer to "what's the AI part of Calendara?"** Right now it's fragmented — AI ingestion is a feature, the agent is a vision, Memory Lane is a roadmap note. Bundling them under one product group ("the part of Calendara that remembers for you") gives us one thing to market, one mental model for users, one moat that compounds with use.

## Goals

1. **Bundle the forward-looking agent and backward-looking recaps into a single product surface.** One mental model. One marketing story. One tab (candidate IA: a single "Memory" tab hosting chat + Memory Lane + memory queries).
2. **Ship a Memory Lane v0 that plugs into the agent's Phase 2 / Phase 3 capabilities** (see vision-hygge).
3. **Make memory queryable.** "What did we do last Easter?" should be answerable by Calendara, not by scrolling.
4. **Create a sharable artifact** (a recap card) as an organic-growth lever.

Non-goals (this PRD): picking the agent's name, the Glow's visual design, any social/multi-family features.

## Users and stories

**Primary persona:** "The family manager" (same as the landing page) — usually one parent who already carries the household's mental load.

- *As a family manager*, I want to look back at the last 4 weeks and see a soft, warm recap of what my family did, so the calendar feels like a keepsake, not a to-do list.
- *As a family manager*, I want to ask "what did we do for Emma's birthday last year?" and get an answer with the event, the photos, the location — without scrolling.
- *As a family manager*, I want a Saturday-morning email that shows me what happened last week and what's coming up, written like a friend would write it.
- *As a grandparent* (LATER — depends on Grandparent Mode), I want a monthly recap of the grandkids' week, sharable without installing anything.

## Scope — what's in the product group

### 1. Agent chat surface (forward-looking)

The conversational surface already specified in [`vision-hygge.md`](../strategy/vision/vision-hygge.md) §Phase 1–5. This PRD does not re-specify it; it only declares that chat lives in the same tab as Memory Lane and memory queries. One tab, one product idea.

### 2. Memory Lane (backward-looking)

Auto-generated recaps across three cadences:

- **Weekly digest** — Saturday-morning email (NOW item in April roadmap). Hygge-toned prose, 3–5 photo highlights, streak status, what's ahead. Email first, in-app card second.
- **Monthly recap** — in-app only to start. A scrollable card with a short prose summary, a photo collage, a "moments" list (events the family checked in to, birthdays, trips). Shareable as a single image.
- **Yearly recap** — a Spotify-Wrapped-style experience at end of school year and end of calendar year. Out of scope for v0; listed here as the 12-month target shape.

### 3. Memory queries (retrospective agent calls)

The agent, when asked retrospective questions ("What did we do last Easter?" "When did Emma start soccer?"), queries the family's own calendar + photo history and answers conversationally. These reuse the Phase 2 conversational memory infra from vision-hygge.

## Requirements (v0 — the NOW scope)

Must-have for v0 (ship with the Brand voice refresh in NOW):

- **Weekly digest email** sending Saturday 9am local family timezone.
- **Content pulled from:** last 7 days of events the family attended, photos attached to events, completed list items (qualitative only — not a productivity report), any birthdays that happened.
- **Voice:** Hygge-tone. No productivity verbs. Written per the voice guide (TBD — will live as a sub-doc under `docs/DESIGN_SYSTEM.md` once the voice refresh is done).
- **Deliverability:** Resend + React Email (infra per vision-hygge §Infrastructure).

Must-have for v0.5 (NEXT scope):

- **In-app Memory Lane card** on the home screen or in the Memory tab — a "last week" recap tile that opens into the full digest.
- **Memory query support** in the agent — for the question templates: "what did we do for [event type] last [time]?" "show me our [season/year]." "when did [family member] start [thing]?"
- **One sharable recap format** — a single image a parent can save or text to a grandparent.

Nice-to-have for v1:

- **Monthly recap cadence.**
- **Yearly recap** (school year + calendar year).
- **Memory search UI** (the queries above, but as a chip-based UI for people who don't like chatting).

## Success metrics

- **Weekly digest open rate** ≥ 40% after 30 days of sending (consumer email benchmark ~25%; Hygge tone + family content should beat it).
- **Weekly digest CTR into app** ≥ 12% among openers — signal that the recap is pulling people back in, not replacing the app.
- **Share rate on monthly recap cards** ≥ 8% of families produce ≥1 share per month. This is the organic-growth signal.
- **Memory query success rate** ≥ 80% of retrospective queries get a correct, useful answer on first turn (measured on an internal eval set, not production).
- **App Store reviews** mentioning the words "memory," "remember," "recap," "lane," "warm," "cozy" — qualitative Hygge signal.

## Out of scope (v0)

- Auto-posting to any social platform. Calendara is not a social product; sharing is user-initiated, target is iMessage/WhatsApp-to-grandparents.
- Multi-family memory (our house + our in-laws in one recap). Interesting LATER, dangerous now.
- AI-generated photos. We surface photos the family already took — we don't create new imagery.
- A separate "Memory" paywall tier. Memory is part of the $5 household plan.

## Open questions

- **Tab IA:** Is Memory one tab with three surfaces (chat, recaps, search)? Or a chat tab with a "Memory Lane" subroute? Needs a design review.
- **Name of the product group.** "Memory + Assistant" is a working label; the shippable name should be warmer. Candidates: "The Memory," "Lane," "Evenings." Tied to the agent naming decision.
- **Privacy on shared recaps.** If I share the monthly recap with my mom, and it contains a photo of my niece, did the niece's parent consent? Need a policy.
- **LLM cost modeling.** Memory queries are more expensive than event creation (broader context window). Need per-family cost ceiling.
- **Relationship to the Glow.** The Glow acknowledges *presence* (family activity now). Memory Lane acknowledges *accumulation* (family activity over time). Are they two displays of one underlying "family warmth" signal, or two separate systems? Design question.

## Why this is the right bundle

- **One story for the market.** "Calendara is the family calendar that remembers for you." That line spans the agent, the digest, and the recaps. Without the bundle, we have three features and no narrative.
- **The moat compounds.** The agent gets smarter the more you use it. Memory Lane gets richer the longer you've used Calendara. They share the same training signal: your family's events and photos over time. Grouping them makes the accumulation intelligible to the user.
- **Pricing cohesion.** One product group under the $5 household plan. No separate "AI tier."
- **Defensive positioning.** Maple has AI ingestion. Jam has email forwarding. Nobody has the accumulated-memory surface. This is a differentiator we can build in months and that gets harder for competitors to replicate every month (cold-start problem — new Maple users have no history to recap).

---

*Pairs with the Brand voice refresh (NOW), Memory Lane (NEXT), and the agent Phase 2–3 rollout (NEXT). Sequencing and dependencies live in the April roadmap, not here.*
