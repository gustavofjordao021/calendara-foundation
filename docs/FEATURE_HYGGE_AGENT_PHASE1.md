# Hygge Agent — Phase 1 Build Plan (Create · Query · Move · Image-in-chat)

> **Canonical status & decisions live in Linear** — the [Hygge Agent — Phase 1 project](https://linear.app/gjordaodoteth/project/hygge-agent-phase-1-9e33525ec42c). This file is architecture + rationale; update it via dated amendment sections, not in-place status edits.
> **Status:** Phase 1 implementation plan (June 14, 2026; strategic posture added July 2, 2026). Scoping + architecture, grounded in a cross-repo code audit. Not yet ticketed — parked behind Release 2.0.0 by decision below.
> **Pair with:** Linear Document *Vision — Hygge: The Family Coordination Agent* (the long-term phased track), [`FEATURE_MEMORY_AND_ASSISTANT.md`](./FEATURE_MEMORY_AND_ASSISTANT.md) (the backward-looking half), [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) (v3.1 tokens the chat UI inherits).
> **Agent name: DECIDED 2026-06-26 — the agent is named _Hygge_.** The brand/agent split (vision §Brand-and-agent-split) is collapsed: the product and the character share one name. No placeholder needed — build with "Hygge" as the display name. (Closed CLND-435.)

---

## Decisions captured (June 14, 2026)

These set the scope of everything below.

1. **Capability cut:** v0 ships **Create + Query + Update/Move** — including entity resolution ("move soccer to 4pm"). Delete, lists, and multi-action-per-message are deferred to v0.5.
2. **Cost posture:** **uncapped** at launch. No per-user message limit; instead instrument token spend and monitor. (No ceiling exists today regardless — see §7.)
3. **Sequencing:** work **starts after Release 2.0.0 ships.** The reskin/parity/Glow load owns the solo-operator's focus until then.
4. **Name:** ~~deferred~~ **decided 2026-06-26 — the agent is named _Hygge_** (brand/agent split collapsed; no placeholder).
5. **Harness:** the **Vercel AI SDK** runs the agent loop *and* the model waterfall — **not** the Claude Agent SDK. See the Harness section below.
6. **Image/file input:** chat accepts photos/PDFs in v0, routed to the existing AI-extraction pipeline, with light routing (an accompanying sentence picks the destination calendar / family member). See the Image & file input section below.

---

## Strategic posture (added 2026-07-02)

Five corrections from the July strategy review. These shape how Phase 1 is framed, measured, and marketed — the build scope in §2 is unchanged except where noted.

**1. Proactivity is where the promise is cashed — pull the briefing forward (Phase 1.5).** A reactive agent doesn't reduce mental load; it relocates it — Maria still has to *remember to ask*. The "Hygge carries it for you" promise is only fulfilled by proactivity: the morning briefing, "Emma's birthday is in 5 days," conflict heads-ups. So Phase 1 (chat) is short and instrumental, and **Phase 1.5 = the Hygge morning briefing** — an interactive push, in Hygge's voice, reusing the agenda-email content pipeline (CLND-172) and the existing push infra — ships *before* the v0.5 extras (delete/lists/multi-action). It's plausibly the highest-retention feature in the whole track: a daily touchpoint that costs the user zero effort. Relatedly, **Query is the daily-habit intent** ("what's on today?" is asked every day; "move soccer" weekly) — the briefing is Query made proactive. Create/Move sell the demo; Query and the briefing build the habit.

**2. The chat tab is the workshop, not the product.** Our wedge is "one photo → done" — the opposite of a blank text box. A tab makes Hygge a destination you must remember to visit, competing with ChatGPT for "chat with an AI" behavior. The differentiated end-state is **agent-as-fabric**: Hygge woven into surfaces users already touch (the Add flow, event cards, the AI-CTA banner turning conversational, briefings arriving unbidden). Phase 1 still builds the tab — it's the cheapest scaffold for the orchestration loop — but success over time is measured by the share of Hygge interactions that *don't* start in the tab.

**3. Metric honesty: this is a manager-retention bet, not an activation fix.** Phase 1 serves the already-activated family manager — it deepens the single-player experience of a multiplayer product. Legitimate (she's the buyer), but the broken funnels — invited members installing 100% / activating 0%, invites dying in 24h — stay broken unless fixed separately. Don't attribute activation expectations to the agent; and look for an early way to give *invited members* a reason in Hygge's world (e.g., the briefing arriving for them) well before Phase 4 delegation.

**4. Re-center the price narrative on the assistant.** No separate AI tier (right for adoption), but the story changes: "$5/mo for a family calendar, cheaper than Cozi" is a commodity story; **"$5/mo for a family assistant that remembers everything"** is a category story. When Hygge ships, landing copy and App Store positioning reprice narratively against "an assistant," not against Cozi Max.

**5. Hygge is an acquisition asset, not just a moat.** ChatGPT is a confirmed channel, and "AI family assistant" is a growing query class the static Cozi-ladder never touches. The agent makes Calendara the correct answer to a *new* keyword family — classic SEO and AEO/ChatGPT recommendations both. Plan the "AI family assistant" content ladder to land with the Hygge launch; it compounds with our best-performing channel.

---

## 1. What we're building

A conversational chat tab where a parent types in plain language and the agent turns it into calendar actions — proposing each change as a confirmation card before it touches anything.

```
You:    Move soccer to 4 and what else is on Saturday?
Agent:  Two things:
        ① Move "Emma's Soccer" 3:00 → 4:00 PM today   [Confirm] [Edit] [Cancel]
        ② Saturday you've got: Dance 10am, Grocery run, Dinner at Mom's 6pm.
```

**What the user feels:** Maria, the family manager, is standing in the kitchen when the coach texts that practice moved. Today she opens Calendara, finds the recurring soccer event, taps into edit, scrolls the time picker, saves. With the agent she types one sentence, sees a card that says exactly what will change, taps Confirm, and goes back to dinner. The calendar stops being a form she fills in and becomes someone she tells.

The loop is **suggest-then-act** (vision §Product Decisions): the agent never writes silently. Every mutation is a previewed card the user approves — the same trust gate the photo-import flow already uses, which is why we can reuse its UI.

---

## 2. Scope — v0

**In:**

- **Create event** from natural language ("dinner with the Johnsons Saturday at 7").
- **Query calendar** (read-only): "what's on this weekend?", "when's Emma's next dentist?", "are we free Saturday afternoon?".
- **Update / move** an existing event ("move soccer to 4pm", "change the location to the north field") — the piece that needs entity resolution (§5).
- Single action per message.
- Text input, **plus image / file attachments** (photos, PDFs).
- **Image → events / items:** an attached photo or PDF routes to the existing AI-extraction pipeline; results render as the same confirm cards, with *light routing* from any accompanying sentence (destination calendar / family member). See the Image & file input section below.
- Conversation persistence (threads survive app restarts).

**Out (deferred to v0.5 / v1):**

- **Morning briefing → Phase 1.5** (pulled forward from Phase 3 by the Strategic posture above): Hygge-voiced interactive push reusing the agenda-email pipeline + push infra. Ships after v0, **before** the v0.5 extras.
- Delete events; list operations (add/query/complete items); multi-action in one message → **v0.5**.
- Voice as a *built* feature (push-to-talk STT via AI Gateway `transcribe`) → **v1**. Note: **keyboard dictation is not a build item** — the iOS keyboard mic works on any text input for free, so v0 users can already "speak" to Hygge through the composer on day one.
- Remaining proactivity (conflict detection, pattern suggestions), cross-member delegation, multi-channel → **Phase 2–5**, unchanged.

**Why this cut:** Create and Query are the lowest-risk, highest-reuse intents — Create rides the existing extraction schema and confirm gate; Query is read-only and can't break data. Update/Move is in v0 by your call because "move soccer to 4pm" is the line that *sells* the agent — but it's also where wrong guesses live, so §5 treats resolution as the central risk, not a detail.

---

## 3. Architecture — what we reuse vs. build

The audit (2026-06-14, both repos) confirmed the extraction spine is production-grade. The agent is mostly **orchestration on top of assets that already exist**, not new ML plumbing.

| Capability | Status | Evidence | Use in Phase 1 |
|---|---|---|---|
| Structured LLM output (`generateObject` + Zod) | ✅ exists | `extraction-service.ts`; `EventExtractionSchema` in `ai-sdk-types.ts` | Base pattern for the action schema |
| Multi-provider waterfall (Gemini 2.5 Flash Lite → Claude Haiku 4.5 → GPT-4.1 Nano) | ✅ exists | `provider-config.ts`, `model-registry.ts`, `extraction-service.ts` | Agent calls the same gateway/fallback |
| Event CRUD service layer | ✅ exists | `event-service.ts` (`createEvent`, `fetchUserEvents`, `updateEvent`, `deleteEvent`) | The agent's "hands" — execute confirmed actions through these |
| Calendar / list CRUD routes | ✅ exists | `/api/events`, `/api/calendars`, `/api/lists` | Create/Query targets (lists in v0.5) |
| Family member model (names, colors, roles) | ✅ exists | `family_members` table; `lookupFamilyMemberId` in `event-service.ts` | Context injection + entity resolution |
| SSE streaming | ✅ exists | `/api/ai/stream/[id]/route.ts` | Stream the agent's reply / "thinking" state |
| Reusable confirmation card | ✅ exists (app) | `ReviewEventCard`, destination picker in `AIProcessorScreen.tsx` | The action card the user confirms |
| AI photo/file extraction pipeline | ✅ exists | `/api/ai/process`, `ai-cache-service.ts` (dedup), `/api/events/batch` (provenance) | Chat attachments route here unchanged (Image & file input below) |
| Tab insertion + design tokens | ✅ ready (app) | `MainNavigator.tsx`; `theme/index.ts` (v3.1) | New chat tab, warm styling for free |
| Push infra | ✅ exists (app) | `usePushNotifications.ts`, `push_tokens` | Phase 3 briefings, not now |
| `/api/chat` endpoint | ❌ build | — | New |
| `conversations` / `messages` tables | ❌ build | — | New (§6) |
| Orchestration layer (interpret → propose → execute → reply) | ❌ build | — | New (§4) |
| Entity resolution (vague reference → specific event) | ❌ build | — | New (§5) — the hard part |
| Chat UI (bubbles, thread, input bar) | ❌ build (app) | none exist | New |
| `chrono-node` date parsing | ⚠️ unused | in deps, no imports | **Skip** — the LLM already resolves dates |

**One mental model:** the agent does not get its own data path. It interprets language into the *same* validated actions the UI already performs, then runs them through the *same* service layer (vision §Architecture Principle 1). That keeps the visual calendar and the agent permanently consistent.

**What the user feels:** because the agent reuses the real CRUD layer, an event Hygge creates is indistinguishable from one Maria tapped in by hand — it shows up on the family calendar, syncs to Google, respects busy-block privacy. There's no "AI events live somewhere weird" failure mode.

---

## Harness — Vercel AI SDK

**Decision:** the **Vercel AI SDK** (already in the repo) is the agent harness *and* the model router. We are **not** adopting the Claude Agent SDK for Phase 1.

> **Version note (2026-07):** the repo carries `ai` 6.0.70; **AI SDK 7 is now current**, and the voice capabilities we've earmarked (`transcribe` for v1 push-to-talk, realtime for the Phase 3/4 fork) are v7-only. Plan the v6→v7 upgrade as part of ticket #2 (the `/api/chat` build) rather than discovering it mid-voice-work — check the v7 changelog for `generateText`/tool API changes when the build starts.

**Why (short version).** The Claude Agent SDK is Claude-only — whatever owns the loop owns model selection, so putting it in charge would run every turn on Claude and bypass the Gemini 2.5 Flash Lite–primary waterfall. That waterfall is the reason the §7 "uncapped" cost decision is safe; a Claude-only loop quietly removes it. It's also built as a long-running, stateful process (native binary, container/Sandbox-oriented), which fights our short-lived Vercel `/api/chat` function — and its headline features (bash, file edits, autonomous loops, subagents, permissions) are dead weight for a structured calendar assistant. The Vercel AI SDK, by contrast, already powers the extraction backbone, keeps the waterfall via AI Gateway, runs natively serverless, and as of v6 ships a real agent loop (`stopWhen` loop control + tool calling) — so it's a harness, not just a router.

**This is a deliberate Phase 4 reconsideration, not a no.** When genuine multi-step autonomy appears — delegation like "who can pick up Emma? → check three schedules → message Sarah → relay the answer" — revisit the Claude Agent SDK then, accepting Claude-primary for those flows. We already carry `fastmcp` + the Postgres MCP server in deps, so that door stays open.

### How v0 scope maps onto the AI SDK

One chat turn = one `generateText` call with a small set of **typed tools**, bounded by `stopWhen: stepCountIs(3)` — a "use a tool or two, then answer" posture, not open autonomy. Tool inputs are Zod-validated (reusing the `EventExtractionSchema` shape). The key move: **write tools return *proposals*, they never execute.** They emit the action card; the actual write happens only on a second, user-confirmed call into `event-service`. That's how suggest-then-act falls straight out of the harness instead of being bolted on.

- **Query** ("what's on Saturday?") → a `queryEvents` tool wraps `fetchUserEvents`; the model calls it, gets the rows, answers in prose. Read-only, nothing to confirm.
- **Create** ("dinner with the Johnsons Saturday at 7") → `proposeCreateEvent` returns a validated event draft → rendered as a confirm card → on Confirm, `event-service.createEvent`.
- **Move/Update** ("move soccer to 4pm") → `findEvents` (resolution, §5) returns candidates from context; the model either asks to disambiguate or calls `proposeUpdateEvent` with the chosen id + change → before→after card → on Confirm, `event-service.updateEvent`.

Family members, timezone, and the next ~7 days of events are injected into the system prompt per turn (§4 step 1). The existing multi-provider config (`provider-config.ts`) carries over untouched — Flash Lite stays primary, the Claude/OpenAI fallbacks stay as the safety net — so there's no new inference plumbing and the §7 cost profile is unchanged.

Illustrative shape (not final code):

```ts
const result = await generateText({
  model: hyggeModel,                  // existing AI Gateway waterfall
  system: buildFamilyContext(user),   // events (7d), members, tz, default calendar
  messages,
  stopWhen: stepCountIs(3),
  tools: {
    queryEvents:        tool({ inputSchema: QueryZod,  execute: readOnly }),
    findEvents:         tool({ inputSchema: FindZod,   execute: resolveCandidates }),
    proposeCreateEvent: tool({ inputSchema: EventZod,  execute: returnProposalOnly }),
    proposeUpdateEvent: tool({ inputSchema: UpdateZod, execute: returnProposalOnly }),
  },
});
```

The harness gives us the loop, tool routing, and the waterfall for free; everything Calendara-specific lives in those four small tools and the confirm path.

---

## Image & file input (chat → existing pipeline)

Chat isn't only for sentences — a parent can attach a school flyer or a PDF schedule and Hygge turns it into the same proposed-action cards. This puts the product's signature capability (photo → events) *inside* the conversation.

**Reuse, don't rebuild.** When a message carries an attachment, it routes to the existing `/api/ai/process` endpoint — unchanged — and the returned events/items render as the same `ReviewEventCard` proposals inline. That inherits everything already battle-tested: client-side compression for the 4.5 MB Vercel limit (`expo-image-manipulator`, CLND-173), SHA-256 caching/dedup (`ai-cache-service.ts`), the SSE progress stream, the `events | list-items | auto` extraction types, and the `/api/events/batch` save path with provenance tagging. The Vercel AI SDK *could* ingest the image directly as message content, but that throws away the purpose-built extraction prompt, the caching, and the save provenance — not worth it for v0.

**Deterministic, not a tool-call.** If a message has an attachment, the user obviously wants it read — route to extraction deterministically rather than paying an LLM round-trip to "decide" to extract. The model is invoked only for the accompanying text.

**Light routing is where the agent earns its keep (v0).** Raw extraction already works on the dedicated screen. In chat, the agent reads any accompanying sentence and applies it to the result set before showing cards. So the flow is: attachment → existing pipeline extracts → agent applies the text instruction (destination calendar / family member) → confirm cards → existing batch save. Subset filtering ("only the soccer ones") is the v0.5 extension.

**What the user feels:** Maria forwards the soccer flyer into the chat and types "these are Emma's." Hygge reads the flyer, tags every event to Emma's calendar, and shows her the stack to confirm — no separate import screen, no re-picking the calendar six times.

**Plumbing notes.** The `messages` row stores a *reference* to the `ai_imports` record (id / file hash), not the image bytes (§6). Chat-origin imports are tagged distinctly (`creation_method = 'ai_import'`, `source = 'chat'`) so analytics can separate chat-driven imports from the dedicated AIProcessor flow. Cost sits in the same class as today's photo import (vision-model extraction already runs); the `token_usage` instrumentation (§7) covers it.

---

## 4. The orchestration loop

A single `POST /api/chat` turn does five things:

1. **Assemble context** — fetch the user's next ~7 days of events, family members (names/colors/roles), default calendar, timezone, and last N messages. Per-request, never stored in the model (vision §Principle 3).
2. **Interpret** — one `generateObject` call classifies intent (`create | query | update`) and extracts entities into a Zod-validated action proposal: `{ intent, target?, params, confidence }`.
3. **Resolve** — for `update`, map the vague target ("soccer") to a specific event (§5). For `query`, run the read against the event service.
4. **Respond** — return a structured payload: a natural-language reply **plus** zero or more proposed-action cards. Nothing is written yet.
5. **Execute on confirm** — a separate confirmed-action call runs the change through `event-service` and persists both the user and agent messages.

**Design guardrail:** structured output only, never free text piped to the DB (vision §Principle 2), and graceful degradation — low confidence ⇒ "I'm not sure I caught that, can you rephrase?" rather than a wrong write (§Principle 5).

---

## 5. Entity resolution — the risk you bought into v0

"Move soccer to 4pm" only works if the agent reliably finds *the right* soccer event. This is where trust is won or lost, so it gets explicit handling rather than hoping the LLM guesses.

**Approach (layered, cheapest first):**

- **Candidate fetch:** pull the user's upcoming events into context (already assembled in step 1) and let the model match against real titles, not invent one.
- **Confidence + disambiguation:** if exactly one strong match → propose the change on a card. If multiple plausible matches ("you have soccer Tue and Thu — which one?") → ask, don't guess. If none → say so.
- **The card is the safety net:** even a confident match is shown as a before→after preview ("Emma's Soccer, 3:00 → 4:00 PM today") that the user must confirm. A wrong resolution is a one-tap Cancel, never a silent corruption.

**What the user feels:** the failure mode is a clarifying question or an obviously-wrong card she cancels — never "the app moved the wrong practice and I found out when we showed up an hour late." That asymmetry is the whole reason Move sits behind a hard confirm.

**Eval gate:** before Move ships, build a small internal eval set of resolution prompts (recurring vs. one-off, ambiguous names, "the dentist", relative dates) and hold ≥ the vision's 80% first-turn-correct bar. This is the gate that decides Move is ready, not a vibe check.

---

## 6. Data model (new)

Two tables, RLS-scoped to the user (per vision §Principle 4 — each member's thread is private to them):

- **`conversations`** — `id`, `user_id`, `family_id`, `created_at`, `last_message_at`, `title?`.
- **`messages`** — `id`, `conversation_id`, `role` (`user | agent`), `content`, `attachment_ref?` (the `ai_imports` id / file hash, for image-bearing messages), `proposed_actions` (jsonb), `executed_actions` (jsonb), `model`, `token_usage` (jsonb), `created_at`.

Storing `proposed_actions` / `executed_actions` on the message gives a clean audit trail (what was offered vs. what the user accepted) and feeds the eval set in §5. `token_usage` here is what powers the monitoring in §7. Realtime can ride the existing Supabase channel pattern (`useRealtimeListItems` is the template) if we want live multi-device threads later.

---

## 7. Cost & monitoring (uncapped)

Today there is **no cost ceiling on AI**: the quota service was deprecated to "unlimited for paid," and the rate-limiter (`rate-limiter.ts`) is wired only to iCal/public endpoints, not AI. One-shot extraction made that acceptable; open-ended chat is more expensive (broader context, multi-turn).

Per your decision we **stay uncapped** but make the spend visible — the current gap is that `ai_imports.token_usage` exists but is never populated:

- **Instrument:** write real token counts to `messages.token_usage` on every turn (the column the extraction path currently leaves empty).
- **Monitor:** a daily/weekly cost pull (the existing PostHog/analytics review cadence) tracking tokens-per-conversation and cost-per-active-user, with a heads-up threshold.
- **Escape hatch ready, not armed:** keep the per-user daily cap as a one-line config flip on `rate-limiter` if a single heavy or adversarial user spikes spend — designed in, switched off.

**No user-facing impact** — this is operator/cost instrumentation only. The escape hatch exists precisely so the *first* sign of a cost problem isn't a surprise invoice.

---

## 8. App surface

- **New "Chat" tab** in `MainNavigator.tsx`, slotted next to the center Add pill; styled from `theme/index.ts` v3.1 tokens (warm terracotta `#c96442`, Manrope) so it matches 2.0.0 for free.
- **Chat screen** — message thread + input bar (built new; no chat components exist today), wrapped in the standard `ScreenLayout`.
- **Action cards** — reuse the `ReviewEventCard` + destination-picker pattern from `AIProcessorScreen.tsx` so a proposed event looks and behaves like the photo-import review the user already knows.
- **Attachment affordance** — an attach / camera control on the input bar (reuse the picker logic from `AIProcessorScreen.tsx`); attached photos/PDFs route to `/api/ai/process` and render as inline proposal cards (see Image & file input).
- **API client** — extend `api-client.ts` with `sendChatMessage()` following the existing Bearer-auth `{ success, data }` pattern.
- **Pencil frames: DONE (first pass, 2026-06-14).** Full 8-screen set + component library live in `calendara.pen` under wrapper **"Hygge Chat — Flow (Phase 1)"** (`udc68`): Thread, Attach, Empty, Create, Disambiguate, Attach-Reading, States, Components-Board; reusable `Hygge/*` components (Glow-Avatar, Composer, Bubbles, Chips, Typing, TabBar-6). Brief: `hygge-chat-pencil-brief.md`. **Outstanding:** back-port `Hygge/*` into `Kit/Calendara-Design-System` (`XRxYL`), and resolve whether the tab bar persists inside the thread (Empty shows it; Thread hides it — currently inconsistent, needs a call).

---

## Chat UX best-practices (ref: shadcn chat components, June 2026)

shadcn shipped a chat-component layer (`MessageScroller`, `Message`, `Bubble`, `Attachment`, `Marker`, plus `scroll-fade` / `shimmer` utilities and a headless `@shadcn/react`) that codifies how a good streaming chat should behave. The components are **React/web (shadcn/ui)** — directly usable on a future web-chat surface (Phase 5; `calendara-main` already runs shadcn), but **not** a drop-in for the React Native app. For the mobile build, treat them as the **spec for behavior and decomposition**, not as a dependency.

**Decomposition — keep our Kit aligned to these boundaries.** Their split validates ours almost 1:1: `Bubble` ≈ `Hygge/Bubble-Agent` / `Bubble-User`, `Message` ≈ our agent row/column, `Attachment` ≈ our file chip, `Marker` ≈ our day divider + processing steps. Keep these as separate composable primitives so a bubble change never ripples into scroll logic.

**MessageScroller behavior = the thread's acceptance criteria.** The scroll container is the part "that's easy to get wrong"; these are the behaviors the RN thread must implement and be tested against:

- Anchored turns — a new user turn pins toward the top of the viewport as the reply streams in.
- Stream without jumping — the thread doesn't lurch while the agent's reply grows.
- Auto-follow with escape — stick to the bottom while streaming, but stop the instant the user scrolls up.
- Restore on reopen — reopening a saved thread lands where you left off.
- Prepend history without scroll jump — loading older messages doesn't move the viewport.
- Jump-to-message, scroll-to-bottom control, and visibility tracking.

**What the user feels:** Maria asks a question, Hygge's reply streams in, and the screen stays put instead of bouncing around — the single thing that most makes a chat feel broken (shadcn's own demo leads with exactly this complaint). It's invisible when right and infuriating when wrong, so it earns explicit acceptance tests, not a "looks fine."

**Status & markers.** Use a shimmer text treatment for live status ("Thinking…", "Reading your flyer…") and a Marker pattern for system notes, streaming/tool state, and date breaks — the roles our `Hygge/Typing` and day-divider already play. Keep status ephemeral; never persist "Thinking…" into the saved thread.

**Web surface.** If the Phase 5 web-chat channel ships, adopt the shadcn chat components directly in `calendara-main` rather than rebuilding — same brand tokens, far less custom scroll code. Reference: shadcn/ui changelog, "Components for Chat Interfaces" (June 2026).

---

## Surfaces roadmap

The chat tab is Phase 1's only surface, but it should not be the *last* one — and the most important surface decision is architectural, not visual.

**Principle: build the agent as a channel, not a screen.** The orchestration loop lives behind `/api/chat` as a **channel-agnostic service** — every surface is a thin client that sends text/intent in and renders a reply + action cards out. Build that once and the chat tab, a widget button, and "Hey Siri" all hit the same brain. Phase 1 already builds it this way; the payoff is that later surfaces are a new *front door*, not a new agent.

**What the user feels:** the same sentence — "move soccer to 4" — works whether Maria types it in the app, dictates it from the keyboard, or later says it to Siri while driving. One Hygge, many doors; she never relearns it.

| Surface | How it's used | Best for | iOS / RN reality | Phase |
|---|---|---|---|---|
| In-app chat tab | Type; tap action cards | Full conversation, history, confirm flow | Pure RN; reuses `ReviewEventCard` | **1** |
| Keyboard dictation | iOS keyboard mic in the chat input | "Voice" with zero new infra | Free — text into the same input | **1 / v1** |
| Push (interactive) | Morning briefing, inline reply | Proactive reach | Expo push already wired | 3 |
| Home/Lock widget | Glow presence + "Talk to Hygge" button | Ambient warmth + a launch point | Native Swift WidgetKit target via Expo config plugin | 2–3 |
| Siri / App Intents / Shortcuts | "Hey Siri, ask Hygge what's on Saturday" | True hands-free voice | Native App Intents; map to structured actions | 3–4 |
| Live Activity / Dynamic Island | In-progress action, today glance | Glanceable status | Native | later |
| Watch / iMessage / external | — | Multi-channel reach | Native / integrations | 5 |

### The voice reality

A constraint hides inside "iOS widgets for voice": **a widget can't record audio.** Home/Lock-screen widgets are glanceable and (since iOS 17) can hold a button (an App Intent) — but that button *launches* something, it doesn't capture a sentence. So voice has three shapes, in rising native cost:

- **Keyboard dictation (≈ free):** the iOS keyboard mic turns speech into text that flows into the same `/api/chat` call. This is the vision's "tap-to-dictate" and needs zero STT work — the right v1 voice MVP.
- **In-app push-to-talk:** record on device → transcribe → text → same endpoint, if keyboard dictation feels clumsy. Cleanest path is **AI Gateway `transcribe`** (speech-to-text, shipped Jun 2026 in AI SDK 7) — it runs on the *same* Gateway, key, and spend controls our text waterfall already uses, so there's no third-party STT library and it's a simple record-and-upload in RN. Doesn't change the interaction model (still dictation → the confirm-card loop).
- **Hands-free (Siri + App Intents):** "talk to Hygge without opening the app." A widget button or a Shortcut kicks off capture. This is **native Swift work layered on the React Native app** — a genuine project, not a config flag, which matters for a solo operator.

### Realtime voice — a later, strategic option (Phase 3/4+)

All three shapes above treat voice as *input*: speech becomes text, then runs the normal confirm-card loop. **Realtime voice** (AI Gateway / AI SDK 7, e.g. `openai/gpt-realtime-2`) is a different product — two-way spoken audio where Hygge *speaks back*, the user can interrupt it (barge-in via server-VAD turn detection), and it can call tools mid-conversation. That's "talk *with* Hygge" (a hands-free / kitchen-mode surface), not dictation. Compelling, but a Phase 3/4+ decision with three real caveats:

- **It breaks the cost waterfall.** Realtime models are OpenAI/xAI-only today — no Gemini/Claude — so it bypasses the Flash-Lite-primary routing that makes §7's "uncapped" safe. Realtime audio is premium and metered; it needs its **own capped cost posture**, unlike text.
- **The React hook isn't ours to use.** `useRealtime` is browser-only (WebSocket + mic + playback in the DOM). The RN app needs the lower-level path (`getWebSocketConfig` / `serializeClientEvent` / `parseServerEvent`) plus native audio — real work, consistent with voice being later-phase native effort. Plain `transcribe` STT, by contrast, is a simple upload.
- **Suggest-then-act doesn't map cleanly to pure voice.** Our whole trust model is the visual confirm card; a spoken-only flow needs a different confirmation pattern ("Want me to move it? Say yes."). That's a design question, not a library swap.

Upside on record: because we already route through AI Gateway, both `transcribe` (now) and realtime (later) land in the same place — same key, observability, and spend controls — so neither is a new vendor integration.

### Recommended surface sequence

Chat tab + keyboard dictation (Phase 1) → in-app push-to-talk via AI Gateway `transcribe` (v1) → the Glow as an ambient widget with a tap-to-open-chat button (Phase 2–3, riding the Glow work already on the roadmap) → Siri/App Intents for hands-free voice, with **realtime voice** as the parallel fork (Phase 3–4). The widget does double duty — it's the Glow's home *and* the launch point for voice — so it's worth doing once the Glow ships, not as a separate effort. Each new surface is a thin client on the Phase 1 service; none of them re-implement the agent.

---

## 9. Sequencing & dependencies

**Starts after Release 2.0.0 ships.** Rationale: the agent has zero existing tickets and 2.0.0 is fully loaded with the v3.1 reskin, parity hygiene, the Glow, and Memory Lane email; as a solo operator, splitting focus now would slow the differentiator *and* the floor. The backend is isolated enough that it *could* run in parallel, but the decision is to protect 2.0.0's finish line first.

**Soft dependency, not blocking:** the chat tab inherits the v3.1 design system, so building the UI after the reskin lands means it's styled correctly the first time rather than reworked.

**When it starts**, the critical path is: tables + `/api/chat` (Create) → app chat tab + Create card → Query → Update/Move + entity-resolution eval gate.

---

## 10. Proposed Linear breakdown (ticket when 2.0.0 ships)

The project exists: **[Hygge Agent — Phase 1](https://linear.app/gjordaodoteth/project/hygge-agent-phase-1-9e33525ec42c)** (created 2026-06-14, Backlog, start Q3 2026) — deliberately without tickets until 2.0.0 nears, per the anti-drift convention. When it starts, cut this child set. Per house convention, the epic's "how it works / current state" should be a `visual-explainer` report (see §11), and every ticket pairs the technical change with its user-felt impact.

1. **Schema:** `conversations` + `messages` tables, RLS, migration (tracked, not raw `execute_sql` — CLND-317 lesson).
2. **`POST /api/chat` — interpret + propose (Create):** context assembly, `generateObject` action schema, structured reply. No execute yet.
3. **Confirm + execute path:** run confirmed actions through `event-service`; persist messages + actions.
4. **App: Chat tab + thread UI:** navigator entry, message bubbles, input bar, v3.1 styling.
5. **App: action card + confirm flow:** reuse `ReviewEventCard`; wire Confirm/Edit/Cancel to the execute path.
6. **Query intent:** read-only calendar answers ("what's on this weekend?").
7. **Image / file input in chat:** route attachments to `/api/ai/process`; render extracted events/items as inline proposal cards; apply light routing (destination calendar / family member) from accompanying text; tag `source = 'chat'`.
8. **Update/Move + entity resolution:** disambiguation flow + the eval set/gate (§5).
9. **Cost instrumentation:** populate `token_usage`; monitoring pull + alert threshold (§7).
10. **Pencil:** ~~design~~ (done — `udc68` set) + back-port the `Hygge/*` components into the Kit and reconcile final shipped UI to the frames.
11. **Phase 1.5 — Hygge morning briefing:** interactive push in Hygge's voice; content from the agenda-email pipeline (CLND-172); tap-through opens the chat thread with the briefing as the first agent turn. Ships after v0, before v0.5.

---

## 11. Open decisions / next steps

- **Name the agent** — ✅ **decided 2026-06-26: the agent is named _Hygge_** (the parked candidates — Nook, Linnea, Sigrid, Tove, Wren, Daisy — were dropped; the brand/agent split is collapsed, so product = character name). Unblocks finished copy and the chat UI's display name. Tracked as CLND-435 (closed).
- **Onboarding** — how does the agent introduce itself on first run? Bootstrap from existing family data, or a first-turn "tell me about your week"? (vision Open Question.)
- **`visual-explainer` current-state report** — per the cross-repo CLAUDE.md, the `/spec` for this backend work should ground "how it works today" in a `visual-explainer` HTML report (the analog of `ui-fidelity-review` for UI). The §3 reuse map is the raw material; the report is the next artifact when this moves to `/spec`.
- **Child accounts** — can kids talk to the agent, and with what autonomy? Defer, but flag before any public launch.

---

*This plan turns the vision's Phase 1 into a buildable v0 grounded in what the code actually has today. Sequencing lives here as "after 2.0.0"; when it starts, the canonical status moves to the Linear project, not this file.*
