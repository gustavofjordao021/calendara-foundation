# CLND-506 — Apple sync design note (spike outcome)

> Spike run 2026-08-20 (remote research phase). 6 of 8 must-resolves closed at
> decision-grade from Apple docs, SDK headers, and expo-calendar package source
> (three parallel research agents, every claim cited). The remaining 2 are
> on-device confirmations packaged in `harness/SpikeHarnessScreen.tsx` (~15 min).
> Companion: the "how Google sync works + where Apple plugs in" visual-explainer.

## Decisions

### MR1 · Recurring events — import as EXPANDED OCCURRENCES, composite key ✅ RESOLVED · DEVICE-CONFIRMED 2026-08-21

**Decision: expanded per-occurrence import, keyed `(binding, apple_event_id, occurrence_date)` — overriding the epic's master+exceptions default.**

The platform decided this for us: range queries return one `EKEvent` per occurrence ("EKEvent represents an *occurrence* of an event"); all occurrences share one identifier; `occurrenceDate` is the stable RECURRENCE-ID analogue ("remains the same even when the event has been detached"); `isDetached` flags exceptions. Reconstructing RRULE masters would be **lossy**: EventKit's rule model is a subset of RFC 5545 (single rule, no EXRULE), and deleted single occurrences surface only as *missing* occurrences — a master model would have to infer EXDATEs by diffing expected-vs-present, the exact bug-farm class CLND-299 taught us to avoid. Expanded import maps 1:1 onto what the device hands us, and single-occurrence edits (`isDetached` + `occurrenceDate`) mirror cleanly.

Consequences: CLND-508's unique key = `(binding_id, apple_event_id, occurrence_date)` (occurrence_date NULL for non-recurring); store the series' readable `recurrenceRule` as metadata on occurrences for series-aware cross-provider dedup (a Google master row shares its UID with all Apple occurrences of the same series); window-slide reconciliation per CLND-512 (entering occurrences import; exiting occurrences are never deletions). Divergence from Google's post-CLND-250 master model is accepted and documented — the two providers meet at the canonical events table, not at a shared storage model.

**Device result (P1, iPhone 15 Pro / iOS 26):** weekly ×8 → 8 occurrences, **1 distinct id**; `originalStartDate`, `isDetached`, and `recurrenceRule` (`{frequency:weekly, interval:1, occurrence:8}`) all readable; single-occurrence delete via `instanceStartDate` left 7 (count correct; *which* occurrence was removed not disambiguated — the 15.0.8 resolver bug remains a reason for SDK 55, not a blocker).

### MR2 · Native module — ONE module, three capabilities + the echo guard ✅ RESOLVED

**Decision: build `CalendaraEventKit` (Expo Modules API, Swift; draft in `native-module-draft/`) exposing:**
1. **`calendarItemExternalIdentifier`** per occurrence — now *critical*, not optional: for subscribed-feed events it is the ICS `VEVENT UID` ("as provided by the calendar server"; Apple's duplicate-cases list — "imported from an ICS file into multiple calendars" — proves the UID derivation). Our webcal feed emits `UID = events.id`, so **the webcal self-echo guard is: reject any import whose externalIdentifier matches an existing `events.id`** (equality first, substring fallback — macOS has been observed appending to UIDs).
2. `EKEventStoreChanged` subscription (no payload by design → triggers a window refetch) — foreground freshness for CLND-512.
3. Real `BGAppRefreshTask` scheduling for CLND-515 (expo-background-task schedules BGProcessingTask, the wrong primitive).
Plus `getCalendarNativeInfo()`: `isSubscribed` + `isImmutable` + native type — expo-calendar exposes neither `isSubscribed` nor external identifiers in ANY version (0 hits across 15.0.8 and 57.0.2 sources).

### MR3 · SDK strategy — UPGRADE TO SDK 55 FIRST, build on `expo-calendar/next` ✅ RESOLVED

**Decision: upgrade calendara-ios to Expo SDK 55 before CLND-511/512 code; build the sync surface on the new object-oriented API.**

The classic risk argument is already retired: **the app ships the New Architecture on SDK 54 today** (`newArchEnabled: true`, Fabric pods in the lockfile), so 54→55 collapses to routine minor bumps + one deliberate migration (google-signin 13→16; v13 is explicitly "do not use"). Zero New-Arch blockers across all ~30 native deps (posthog-react-native is JS-only; RevenueCat 9.x supports RN 0.83; the local Expo module recompiles). Meanwhile: SDK 54 support ends ~Sept 2026; SDK 55 keeps **iOS 15.1** while shipping the new API as `expo-calendar/next`; and SDK 54's legacy expo-calendar has a **verified occurrence-resolver bug** (inverted guard in `getEvent(with:startDate:)` — `instanceStartDate` updates/deletes frequently hit the *first* occurrence; fixed in v57's modules), plus v57 fixed a nil-calendar crash a sync sweep will hit. SDK 56/57 later reduces to one product question: raising the iOS floor from 15.1 to 16.4.

### MR4 · Subscription-calendar exclusion — `allowsModifications=false` (JS) + `isSubscribed` (native), title heuristic, UID backstop ✅ RESOLVED · DEVICE-CONFIRMED 2026-08-21

**Facts:** No public API exposes a subscribed calendar's feed URL — definitive (complete EKCalendar/EKSource property surfaces enumerated; `externalURI`/`publishURL` exist only as App-Store-rejectable private API). And the type filter is a trap: **CalDAV-hosted subscriptions (e.g. iCloud "US Holidays") report `type == .calDAV` with `isSubscribed == true`** — filtering on `.subscription` alone misses them.

**Decision (CLND-511 picker + CLND-512 importer):**
- Default-exclude every calendar with `isSubscribed == true` (native module) or `type ∈ {subscribed, birthdays}` (JS fallback). Subscribed/birthday calendars are content-read-only anyway (`allowsContentModifications == false`).
- Secondary heuristic: title match on our feed's `X-WR-CALNAME` ("Calendara") → hard-exclude, plus the CLND-511 removal prompt.
- **Structural backstop (always on, server-side): the MR2 UID echo guard** — works even if the user force-includes the feed calendar. This is the layer that actually protects the 18-owner webcal cohort.
- Non-Calendara subscriptions (Holidays etc.) may be user-included: import-only is safe (read-only sources can't echo).

### MR5 · lastModifiedDate semantics — ✅ RESOLVED · DEVICE-MEASURED 2026-08-21 (two runs)

**Device result (P5 run 1):** snapshot of 354 events across 14 calendars saved; **own writes bump `lastModifiedDate`** (create 19:55:34.416Z → edit 19:55:34.424Z) — so M2 write-back must re-baseline after its own saves (the Google PUT-response pattern). **Run 2 (~8 min later, after the harness's own P1/P8 writes had triggered iCloud syncs):** 1 of 354 events changed `lastModifiedDate` — an event *in progress* at the time (start 20:00Z, bumped 20:03:19Z), the signature of a legitimate remote edit on a Google-hosted calendar, not a spurious re-sync bump; the other 353 were untouched. **Conclusion: no mass-drift behavior; rare single-event bumps happen and are indistinguishable from real edits.** Caveat: the interval was minutes, not hours — M1 telemetry (conflict rows whose payloads are content-identical) is the cheap long-horizon measurement. Docs give no semantics. Design defenses stand: the trigger-proof `apple_updated_at` baseline + `last_synced_at` + tolerance (the shipped CLND-546 pattern) absorbs self-skew; own-write bumps are measured by the harness; if iCloud re-syncs bump timestamps without edits, widen tolerance and add the (title,start) content-equality check before minting conflict rows (CLND-514's flood defenses already require dedup/suppression).

### MR6 · Multi-device v1 — SINGLE ACTIVE BINDING DEVICE ✅ RESOLVED

Confirmed: `eventIdentifier`/`calendarItemIdentifier` are device-local and lossy ("a full sync with the calendar will lose this identifier"); `calendarItemExternalIdentifier` is the cross-device key but is Exchange-unstable and shareable across items. **v1: one active binding device per user (CLND-508 constraint); second device gets a clear "already connected on another device" replace-binding flow (CLND-511). v2 path: external-identifier dedup, iCloud sources only.**

### MR7 · Shared-core consumption — THE SERVER DECIDES; NO SHARED PACKAGE ✅ RESOLVED

**Decision: the phone gathers and applies; the server owns every decision.** The import payload carries raw EventKit facts (identifier tuple, occurrence_date, externalIdentifier, lastModifiedDate, isAllDay, recurrence metadata); the CLND-509 endpoint owns transform-to-canonical, all-day noon-UTC normalization, conflict decision (`apple_updated_at` vs `last_synced_at`), dedup (UID echo guard, `unique_user_event_instance`-as-signal, cross-provider), and `family_member_id` stamping. CLND-507's extracted core stays server-side only — no shared npm package, no duplicated TS port, nothing for the device to consume. This keeps the store-binary surface thin (contracts fossilize; logic shouldn't) and makes every sync rule hotfixable server-side.

### MR8 · Write-back source pinning (M2) — DEFAULT SOURCE → iCLOUD → LOCAL-ONLY-IF-NO-REMOTE ✅ RESOLVED · DEVICE-CONFIRMED 2026-08-21

**Facts:** the `.local`-while-iCloud-on trap is Apple-documented (QA1926: empty local calendars are *hidden* from the Calendar app and from `calendars(for:)` — the "silently disappears" failure is real). Creating calendars in a **Google CalDAV source fails structurally** (Google's CalDAV endpoint doesn't support `MKCALENDAR`) and Exchange creation is unsupported — so the feared "silent CalDAV echo via calendar creation" mostly manifests as a *creation failure*, which we must catch with fallback UX. iCloud source detection by title is user-editable-fragile → cache `sourceIdentifier` after first resolution.

**Device result (P8):** default calendar source = iCloud (caldav); `createCalendarAsync` in the iCloud source succeeded; **the `.local` source is not present at all while iCloud Calendar is on** (QA1926 in its strongest form — the fallback branch is only reachable on no-iCloud devices). Sources seen: iCloud, Gmail (caldav), a Google Workspace account (caldav), Subscribed Calendars, Birthdays (whose source id is a placeholder string — never key on it). Manual check: the iCloud-created "CLND506 Spike (iCloud CalDAV)" calendar **is visible in Apple Calendar** and persisted — the model works end to end.

**Decision chain (CLND-513):** `defaultCalendarForNewEvents.source` if iCloud/local → CalDAV source titled "iCloud" → `.local` **only when no remote calendar account is active** → else explicit "no writable home for the Calendara calendar" UX. Cache source + title for adopt-don't-recreate.

## Cross-cutting riders

- **BGAppRefreshTask is best-effort, officially:** Apple DTS (iOS 26 era): "counting on background execution every 15 min … you will be disappointed." CLND-515's freshness story and CLND-516's copy must be written from measured telemetry, never cadence assumptions. iOS 26 added `BGContinuedProcessingTask` (user-initiated, visible progress) — a possible future "Sync now that keeps going" affordance, not a heartbeat.
- **iOS 26 changed nothing in EventKit permissions** (release-notes scan: zero EventKit mentions); the iOS 17 model + both plist keys stand. Nothing announced for iOS 27 yet — re-check at WWDC26.
- **expo-calendar/next watch-outs for implementers:** `creationDate ?? Date()` serialization fallback (nil becomes "now" — don't trust creationDate blindly, relevant to CLND-427); `ExpoCalendarEvent.get()` uses the eventIdentifier-keyed native lookup while ids are calendarItemIdentifiers; 4-year predicate cap; results unordered.

## Ticket impacts

| Ticket | Change |
| --- | --- |
| CLND-505 | Decision 7 updated: expanded occurrences + composite key (spike override of the master+exceptions default) |
| CLND-508 | Key shape: `(binding_id, apple_event_id, occurrence_date)`; store recurrence metadata; externalIdentifier column on the import side |
| CLND-509 | Import payload adds `external_identifier`, `occurrence_date`, `is_detached`, recurrence metadata; UID echo-guard server-side |
| CLND-511 | Picker filter = `isSubscribed` (native) / type-strings (JS fallback), title heuristic, removal prompt unchanged |
| CLND-512 | Build on `expo-calendar/next` post-SDK-55 upgrade; store-changed listener via native module |
| CLND-513 | Source chain per MR8; creation-failure fallback UX; cache sourceIdentifier |
| CLND-515 | Rescope language to best-effort; native BGAppRefreshTask via CalendaraEventKit |
| NEW | SDK 55 upgrade ticket precedes CLND-511/512 (small, well-trodden; google-signin 13→16 is the one real migration) |

## Status: CLOSED 2026-08-21 — all 8 must-resolves decided, 4 device-confirmed

Raw device results: `results/2026-08-21-device-run-1.json`, `results/2026-08-21-device-run-2.json`. Harness branch: `calendara-ios` `gustavojordao021/clnd-506-spike-harness` (keep behind `__DEV__` for M1 testing or delete).
