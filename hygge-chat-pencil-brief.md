# Hygge Chat — Pencil design brief

> **Canonical status lives in Linear** (Hygge Agent — Phase 1 project) and in `calendara.pen` itself (wrapper `udc68`). This file is the design rationale + component map.

> Design directive for the Phase 1 Hygge chat surface. Pairs with `docs/FEATURE_HYGGE_AGENT_PHASE1.md`.
> Source of truth is `calendara.pen`. **Build from Kit instances — don't recreate primitives.** Back-port any new pattern into `Kit/Calendara-Design-System` (XRxYL) per the CLAUDE.md design-sync rule. New screen frames go under `NEW/Hygge-*`, built to the right/down of existing frames.
> Closest existing precedent to study first: the **AI Add — Flow (Capture to Save)** frame (`xiadM`) — its review cards, processing state, and success screens are the visual baseline; chat reuses them.

---

## First-pass status (2026-06-14) — iterate from here

Built in `calendara.pen` under the wrapper **"Hygge Chat — Flow (Phase 1)"** (`udc68`). Static export: `brand/hygge-chat-firstpass.png`.

- **Built:** `NEW/Hygge-Thread` (`gfyBh`) — query answer + move before→after + Confirm/Edit/Cancel; `NEW/Hygge-Attach` (`zmnyp`) — flyer → extracted stack routed to Emma's calendar.
- **New reusable components** (live, ready to back-port into Kit): `Hygge/Glow-Avatar` (`xnOe4`, the agent's ember presence) · `Hygge/Composer` (`G6WFBR`, attach + field + mic + send).
- **Calls made on canvas:** user bubble = **coral-solid** (`#C96442`, white text) · the **Glow is Hygge's avatar** (header + beside each agent turn).
- **Still open / TODO:** frames 1 (Empty/first-run), 7b (attach *processing* state), 5 (disambiguation), 9 (typing), 10 (low-confidence); the **tab-placement** fork (bar full at 5 slots — §Tab placement); and componentizing the message bubbles into the Kit.
- **To revisit:** coral-solid vs. soft-wash user bubble (§Open questions Q2); Glow-as-avatar (Q3).

Reusable component IDs for quick reference: Glow-Avatar `xnOe4` · Composer `G6WFBR` · Card-Default `K1ra8` · Card-Selected `fxqnl` · Add-Bar `Dz8Ev` · TabBar-Floating `Y0ut5X` · AI-CTA-Banner `hOvj4` · Empty-State-Card `U6GfHc`.

---

## Design language (v3.1 — grounded in the file)

**Type:** Manrope throughout (NOT Inter — the `AI-CTA-Banner` still uses legacy Inter; new frames use Manrope). Ramp: display 32/700/−1.0 · title 24/700 · heading 20/700 · bodyLg 16/500 · body 15/500 · caption 13/500 · eyebrow 11/700/+1.6 uppercase.

**Core tokens:** `primary` #c96442 · `primary-hover/accent` #b85a3b · coral gradient `gradient-start` #E88862 → `gradient-end` #C96442 (CTAs, AI badge) · `bg` #FFFFFF · `bg-warm` #FFF8F2 · `surface-soft` #FAF7F3 · `border` #F2E4D8 (warm) · text `#1C1C1E` / `#8E8E93` / `#6B6863` (warm secondary) / `#AEAEB2`.

**Washes (accents, member/status):** `wash-peach` #FFEDDC · `wash-apricot` #FFE4D1 · `wash-clay` #FFD9C2 · `wash-cream` #FFF4EB · plus member colors `accent-blue` / `accent-sage` / `gold` / `purple` with `-wash` pairs.

**Shape:** card radius 18–20, pill/bar radius 32, icon-chip radius 12–14. Warm 1px `border` strokes. Soft warm shadows (coral-tinted, e.g. `#C9644226`, y+6, blur 14). Icons: lucide, 18–22px.

**Components to reuse (Kit IDs):**
- `K1ra8` Card-Default — white, left icon-chip (44², wash-peach), title 15/600 + desc 13. **→ the proposed-action card base.**
- `fxqnl` Card-Selected — gradient wash + coral 1.5 border + coral check badge. **→ confirmed/accepted state.**
- `Dz8Ev` Add-Bar — white pill, radius 32, plus icon + placeholder. **→ the chat composer base.**
- `Y0ut5X` TabBar-Floating — 5 slots (Home, Calendar, center Add, Lists, Family). **→ where the chat tab slots.**
- `hOvj4` AI-CTA-Banner — sparkles badge + "Take a photo or paste it in" + Try pill. **→ attach/AI affordance language.**
- `U6GfHc` Empty-State-Card — Storybook Glow illustration + title + gradient CTA. **→ first-run state.**
- `shti1` Input · `s90XH` Btn-Primary · `f3RrH` Btn-Ghost · `L4fIO` Btn-Small · `KVliq`/`FGo6E` Chips · `gNbFT` List-Row · `P0PxXj` Banner.

---

## Frames to design (`NEW/Hygge-*`)

Phone frames, warm canvas (`bg-warm` #FFF8F2), floating tab bar overlaid. Each frame below is one screen/state.

### 1. `NEW/Hygge-Empty` — first run / empty thread
The introduction. `Empty-State-Card` (`U6GfHc`) pattern with a **Glow** illustration (Storybook Glow — a warm hearth/ember, the agent's visual presence). Heading: a warm hello in the agent's voice (placeholder name). Below: 3–4 **suggested-prompt chips** (`Chip-Inactive` `KVliq`) — "What's on this weekend?", "Move soccer to 4", "Add dentist Tuesday at 2", "📸 a flyer". Composer docked at bottom.
*What the user feels:* opening the tab feels like walking into a lit room, not a blank text box — it shows her what she can say.

### 2. `NEW/Hygge-Thread` — active conversation
Vertical message list, bottom-anchored, composer docked.
- **User bubble:** right-aligned, coral (gradient or solid `primary`) fill, `text-inverse`, radius 18 (tight on bottom-right).
- **Agent bubble:** left-aligned, `surface-soft`/`bg-warm` fill, `text-primary` body 15/500, radius 18, with a small **Glow avatar** (warm ember dot) to its left.
- Spacing generous (gap 12–16). Timestamps subtle (`text-tertiary` caption), grouped.
*Decision to make:* user bubble coral-solid vs. soft wash — see Open questions.

### 3. `NEW/Hygge-Propose-Create` — proposed event card (create)
Agent bubble + a **`Card-Default`** proposal showing the event (icon-chip in the member's wash color, title 15/600, time + location desc). Below the card: **[Confirm] [Edit] [Cancel]** — Confirm = `Btn-Primary` (coral gradient), Edit/Cancel = `Btn-Ghost`/`Btn-Small`. On confirm, the card swaps to **`Card-Selected`** (`fxqnl`, coral check) and the buttons collapse to a quiet "Added to Family calendar" caption.
*What the user feels:* the same review-card she already trusts from photo import, now mid-conversation.

### 4. `NEW/Hygge-Propose-Move` — update/move with before→after
Like #3 but the proposal card shows a **before→after**: "Emma's Soccer  3:00 → 4:00 PM today" (strike or arrow the old time; coral the new). Same Confirm/Edit/Cancel.
*What the user feels:* she sees exactly what changes before it changes — a wrong guess is one Cancel, never a silent move.

### 5. `NEW/Hygge-Disambiguate` — "which one?"
When entity resolution finds multiple matches: agent bubble asks, followed by 2–3 **selectable `Card-Default`** options (e.g. "Soccer — Tue 3pm" / "Soccer — Thu 5pm"). Tapping one promotes it to the proposal+confirm flow.
*What the user feels:* Hygge asks instead of guessing wrong.

### 6. `NEW/Hygge-Query` — read-only answer
Agent bubble answers in prose, then a compact **`List-Row` (`gNbFT`) stack** of the events ("Saturday: Dance 10am · Grocery run · Dinner at Mom's 6pm"), each with its member wash dot. No confirm — it's an answer, not an action.

### 7. `NEW/Hygge-Attach` — image/file in chat (the v0 add)
Three sub-states, stacked as one frame or three:
- **a. Composer with attachment:** the user bubble carries a **thumbnail chip** (flyer/PDF) + their text ("these are Emma's").
- **b. Processing:** agent "reading" state — reuse the AI-flow processing illustration + staged copy ("Reading your flyer…"). (Take-a-photo language only — never "snap".)
- **c. Extracted result:** a **stack of `Card-Default` proposals** (the extracted events) with a **light-routing chip** at the top — "→ Emma's calendar" — and a single **[Confirm all] / [Review]** action. Confirmed cards flip to `Card-Selected`.
*What the user feels:* she forwards the soccer flyer, types "these are Emma's," and gets a tidy stack already tagged to Emma — no separate import screen, no re-picking the calendar six times.

### 8. `NEW/Hygge-Composer` (component) — the input bar
Extend **`Add-Bar`** (`Dz8Ev`): left **attach/camera** icon (opens picker → routes to `/api/ai/process`), text field ("Tell Hygge…"), right a **mic** (keyboard dictation = free voice) and a coral **send** button. Back-port as `Kit/Hygge-Composer`.

### 9. `NEW/Hygge-Typing` — agent thinking
Small left-aligned agent bubble with a three-dot / soft Glow-pulse indicator while `/api/chat` runs.

### 10. `NEW/Hygge-LowConfidence` — graceful failure
Agent bubble: "I'm not sure I caught that — want to try again?" with a rephrase chip. No card, no write.

---

## Tab placement (resolve first — see Open questions)
The `TabBar-Floating` already holds 5 slots at 340px wide. A 6th (chat) crowds it. Options to evaluate on canvas: widen the bar to 6 icons; fold chat into the center **Add** pill (chat becomes the primary create surface, `AddMenu-Sheet` `UgLv5` restyled); or swap a lower-traffic tab. Suggested chat icon: `message-circle` (active = coral) or a small Glow mark.

## Copy & naming rules
- **Never "snap."** "Take a photo" / "Add a photo" / "share a flyer." (Banned everywhere.)
- Agent voice is warm, present, calm — no productivity verbs. Placeholder name until the naming spike resolves (Nook/Wren/etc.); don't bake a final name into frames yet.
- Manrope on everything new.

## Open questions for the design pass
1. **Tab vs. Add-pill** for the chat entry (above) — the one real IA fork.
2. **User bubble:** coral-solid (`text-inverse`) vs. soft wash (`wash-peach`, `text-primary`). Warmth vs. contrast.
3. **The Glow as the agent avatar** — does Hygge's presence in chat reuse the Glow (ember/hearth), tying chat to the Phase 2–3 widget? Recommended yes.
4. **Confirmed-state cards** staying in the thread (audit trail) vs. collapsing to a one-line receipt.
