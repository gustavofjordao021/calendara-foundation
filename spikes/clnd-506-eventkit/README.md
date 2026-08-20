# CLND-506 spike — EventKit capabilities + Apple sync design

Deliverables of the [CLND-506](https://linear.app/gjordaodoteth/issue/CLND-506) spike
(Apple Calendar Sync project, milestone M0). The **design note** lives as a Linear
document on the project; the **visual-explainer** ("how Google sync works today +
where Apple plugs in") is linked from CLND-506. This directory holds the code
deliverables:

## `harness/SpikeHarnessScreen.tsx` — the 15-minute device run

The two must-resolves that genuinely need hardware (#5 `lastModifiedDate`
semantics, plus on-device confirmation of #1 recurring identifiers and #8 source
pinning) are packaged as a tap-through screen.

**Setup (in `calendara-ios`):**

1. `npx expo install expo-calendar`
2. `app.config.js` → `ios.infoPlist`: add
   `NSCalendarsFullAccessUsageDescription` **and** `NSCalendarsUsageDescription`
   (both — deployment target is 15.1; missing the legacy key crashes iOS 15/16
   at the prompt).
3. Copy `harness/SpikeHarnessScreen.tsx` to `src/screens/dev/`, mount behind a
   dev-only route, `npx expo prebuild && npx expo run:ios --device`.
4. Run on a **real iPhone signed into iCloud**, ideally one that still has the
   old Calendara webcal subscription (P4 checks its detectability).

**Run order:** P4 → P8 → P1 → P5 → (hours later, after an iCloud sync) P5 again
→ Share JSON → paste into the design note → Cleanup.

| Probe | Answers | Expected per current evidence |
| --- | --- | --- |
| P4 calendars | #4 subscription detectability | subscription calendars visible with `type`, **no feed URL exposed**. ⚠️ expo-calendar exposes only the `type` string — iCloud-hosted subscriptions (e.g. "US Holidays") report `caldav`, not `subscribed`; only the native module's `isSubscribed` catches them. Note what YOUR webcal feed reports. |
| P8 sources | #8 write-back pinning | iCloud CalDAV create OK; `.local` create disappears/never syncs while iCloud on |
| P1 recurring | #1 identifier sharing | N occurrences, **1 distinct id** → composite key / master model required |
| P5 lastModified | #5 self-bump semantics | own-writes bump it; the second-run diff shows whether iCloud re-syncs do too |

## `native-module-draft/` — CalendaraEventKit (Expo Modules API, Swift)

The three gaps expo-calendar leaves (verified absent through v57.0.0), one module
(pattern: `modules/apple-ads-attribution`):

- `getEventIdentity(calendarIds, startISO, endISO)` — per-occurrence
  `eventIdentifier` + **`calendarItemExternalIdentifier`** + `occurrenceDate` +
  `isDetached` + recurrence flag: everything CLND-508's composite key and the
  UID echo-guard need.
- `getCalendarNativeInfo()` — native `EKCalendarType` including the
  `subscription`/`birthday` split expo-calendar collapses, plus `isSubscribed`
  and `isImmutable` for CLND-511's picker exclusions.
- `onStoreChanged` event — `EKEventStoreChanged` subscription (foreground
  freshness for CLND-512).
- `scheduleAppRefresh(identifier, earliestSeconds)` — real **BGAppRefreshTask**
  scheduling for CLND-515 (expo-background-task schedules BGProcessingTask, the
  wrong primitive). ⚠️ Draft caveat: `BGTaskScheduler.register` must run at app
  launch — final implementation moves registration into an AppDelegate
  subscriber; `BGTaskSchedulerPermittedIdentifiers` + `UIBackgroundModes` land
  via `app.config.js` (CNG — never edit `ios/` directly).

Status: draft (compiles-by-inspection, not yet built). Destination:
`calendara-ios/modules/calendara-eventkit/` when CLND-511/512 development starts.
