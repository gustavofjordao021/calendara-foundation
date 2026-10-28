# Calendara — shared conventions (calendara-ios + calendara-main)

This file lives in the common parent of the Calendara repos and is **auto-loaded by Claude Code in both** `calendara-ios/` (Expo mobile app; `CalendaraMobile/` is a retired copy — do not edit it) and `calendara-main/` (Next.js web app + API + the Google-sync engine, deployed on Vercel). Claude Code walks up the directory tree from the cwd, so anything here applies when working in either repo.

Put **cross-repo** conventions here so they live in one place; keep repo-specific guidance in each repo's own `CLAUDE.md`.

**Cloud sessions never see this file.** A cloud session (claude.ai/code, the mobile app, `claude --cloud`, routines) clones one repo, not this parent folder. So this file is mirrored verbatim into both repos as `.claude/rules/calendara-shared-conventions.md`, alongside the `/build` and `/spec` skills and the `executor` agent. **After editing this file, run `node scripts/sync-agent-config.mjs` in calendara-main and commit the mirrors in both repos.** Locally, `claudeMdExcludes` in `~/.claude/settings.json` skips the mirrors under this folder, so these rules don't load twice.

## Always pair technical detail with user-facing impact

Every explanation of a bug, error, log finding, investigation result, or code change MUST state **both**:

1. **The technical mechanism** — what's happening and where (`file:line`, table, query, root cause).
2. **The user-facing impact** — what an end user actually experiences, in plain UX language, with a **concrete example** (a persona doing a real action and what they see/feel).

This applies everywhere we communicate change: TL;DRs, PR and commit descriptions, Linear tickets, `visual-explainer` reports, and `/build` / `/spec` output. A purely technical writeup is incomplete here — translate it.

- **Format:** a short "What the user feels" line/block beside the technical one. Example: *"The broken trigger means a coach who shares the team practice calendar with 15 parents sees '0 opens' forever, even as all 15 subscribe and refresh it daily."*
- **No user impact? Say so.** If a change is operator / analytics / infra-only with zero end-user effect, state that explicitly ("no user-facing impact — analytics-only") rather than leaving it out. The reader should never have to infer the UX consequence.
- **Why:** align technical and product understanding in one pass — the user-facing impact is usually what decides priority.

## System Explainers (backend / data / workflow)

When explaining how a system works — backend/API changes, data/schema investigations, the Google-sync engine, or the findings of a multi-agent `workflow` — the communication artifact is a **`visual-explainer` "how it works" HTML report**, not prose or ASCII tables. This is the non-UI counterpart to the mobile repo's `ui-fidelity-review` flow: where UI work aligns on a screenshot-vs-design comparison, system work aligns on a "how it works + is it correct" explainer.

- **What it contains:** end-to-end current behavior; Mermaid architecture/sequence/flow diagrams; **live supporting data embedded as real tables** (actual SQL results / `file:line`, never prose-only or guessed); a per-behavior **"is this correct?"** verdict; and an appendix of candidate tickets. Ground every claim in a query you actually ran or a `file:line` you read. Write reports to `~/.agent/diagrams/` (self-contained, shareable). Use the `visual-explainer` skill.
- **Exemplar:** the Google-sync investigation — `~/.agent/diagrams/calendara-gcal-sync.html` (text source `calendara-ios/gcal-sync-investigation.md`), which became epic **CLND-299**.
- **When to produce one:** explaining how a backend/data system works, diagnosing a data issue's root cause, designing a backend feature — and **always as the deliverable of a `workflow`-driven investigation.**
- **`/spec` on a backend/data/workflow ticket:** the "How it works / current state" section must be (or link to) a `visual-explainer` report, so reviewers align on current behavior before the change is scoped — the analogue of naming `ui-fidelity-review` as the gate for UI specs.
- **`/build` on backend/data/workflow changes:** in Phase 5 (Verify), generate a `visual-explainer` "how it works now" (or before/after) report for the touched system instead of relying on a text summary — the analogue of running `ui-fidelity-review` on touched screens.

## Design lives on Claude canvases — copy every approved round to Drive

Since 2026-10-28, all new design work happens on **Claude canvases**: claude.ai Artifacts of type "Design", with artboards as `.dc.html` files on a canvas. **Pencil is frozen** (owner decision, no pen.dev subscription). `calendara.pen` and `calendara-marketing.pen` are a read-only archive, and agents can't reach them: the `pencil` MCP is removed and `mcp__pencil` is denied. The **permanent copy** of every design is the owner's Google Drive folder `My Drive/Digital/Calendara/Design/`, synced on the Mac under `~/Library/CloudStorage/GoogleDrive-<account>/`. **Read its `INDEX.md` first** to find any design.

- **Never re-enable Pencil yourself.** Don't run `claude mcp add pencil`, and don't edit `~/.claude/settings.json` (including the `mcp__pencil` deny entry). Only the owner does that, by hand, on export day. If a task seems to need Pencil, stop and ask the owner.
- **Applies to every UI surface, mobile AND website:** the mobile app (`calendara-ios`) and the website (`calendara-main`: the `(paperline)/` marketing routes and `src/components/landing-page/`). Both repos auto-load this file.
- **Design first:** on a UI ticket the first deliverable is canvas boards, not a PR.
  - Put each proposal beside a board of today's screen. Name boards `<ticket> · TODAY|PROPOSAL|OPTION X|SHIPPED · <what>`, e.g. `972 · OPTION A · family line folded into the block`.
  - Each round is a page. Record approval status in the page name and in the `INDEX.md` Status column.
  - Get the owner's explicit approval before writing code.
  - Name each canvas `CLND-xxx <topic>`, one per ticket or area.
- **Boards show test data only.** Use the fixture family (the Bennetts) and never real users' names, emails, photos or children's details. Never show invite, magic-link, dev-auth or calendar-subscribe URLs, tokens or keys. Crop or redact before uploading a screenshot.
- **Sizes:** phone boards are **402×874** (iPhone 17 Pro, the simulator rig), plus **375×667** (iPhone SE) when the layout is tight. Set `w` and `h` explicitly in `canvas.json`; these sizes override the Design type's 390×844 default. Web pages are fluid artboards, 1280–1440 wide.
  - Boards at other sizes, such as 390×844, are legacy: compare them by content with the iPhone 17 Pro simulator.
  - App Store screenshots stay on their existing exact-size PNG masters: canvas export offers only 0.5×, 1×, 2× and 4×, with no 3×.
- **Bidirectional fidelity:**
  - **Build → design gate.** Mobile runs `ui-fidelity-review`: simulator screenshots against the approved boards. Web uses a `claude-in-chrome` screenshot of the running page against the canvas web-page board. PASS = zero major.
  - Exporting or screenshotting a board for this gate is the gate itself, so the Design type's "never verify" authoring rule doesn't apply to it.
  - **Design → shipped back-port.** When code makes or changes a design decision (a deviation, a refinement, a copy or layout fix, a `/spec` override), update the board, or add a `SHIPPED · …` board, so the approved design matches what shipped.
  - **A screen with no canvas board yet** (designed before the freeze) is gated against its archived Pencil PNG, which exists only after export day. Until then, use a `TODAY` board made from a simulator screenshot, or ask the owner to export the frame by hand. Back-port by adding a `SHIPPED` board to the ticket's canvas; create the canvas if there isn't one.
  - Both directions must hold, and the Drive copy must be current, before a UI ticket is Done.
- **Copy to Drive (not optional):** canvases have no version history and no stated retention, and a republish overwrites them.
  - **When:** after every approved round, and before the ticket is marked Done.
  - **Where:** `Design/canvases/<date>_<tickets>-<name>/`, where `<date>` is the day the canvas was created. A later round goes into the same folder: find it in `INDEX.md`.
  - **Steps:**
    1. Artifact `list` the canvas files and assets, and record the version it reports.
    2. `read` every `project/**` file (up to 256 paths per call), then read each asset by its id, one call each.
    3. List again at the end. If the version changed, re-read whatever changed and note it in `meta.json` as `versionNote`.
    4. Check assets against the sha256 in the assets listing, and project files against the bytes in the files listing.
    5. After copying, run `shasum -a 256` on the Drive files.
    6. Write `blobs.json` (which board uses which image), then write `meta.json` and `INDEX.md` last, so a folder without `meta.json` is known to be partial. Use the same `meta.json` keys as the existing copies.
  - **Only add or replace inside `Design/`.** Never delete or move a canvas copy, `INDEX.md` or `pencil-archive/` without the owner. If a new copy has fewer files or boards than its `meta.json` records, stop and ask.
  - **Never edit, rename, move or delete anything in a `Design/_freeze-*` folder.** Drive mirrors deletions and keeps old versions only about 30 days.
  - **Never put designs in the public `calendara-foundation` repo.**
- **References:**
  - Linear tickets carry one line: `Design: <canvas URL> · board <File.dc.html> · copy Design/canvases/<folder>/`.
  - Board file names are permanent once referenced; titles may change.
  - Old Pencil frame ids in code, tests and tickets resolve through `Design/pencil-archive/manifest.json` (after the one-time export day) or the owner opening Pencil by hand.
- **Cloud sessions** can edit canvases (the Artifact tool), but they can't see the Drive folder.
  - Do the board back-port in the cloud when it needs no simulator screenshot.
  - Mark the Drive copy and the `INDEX.md` update **PENDING (local)**, and post the Linear `Design:` line with `copy: PENDING (local)`.
  - Never mark the ticket Done while a copy is owed.

## User-facing copy conventions

These apply to **all** user-facing copy in **both repos** (the mobile app and the website) and **override the source design** (the canvas board, or an archived Pencil/Figma frame) when they conflict.

- **Never use the word "Snap."** Always use **"Take a photo"** (or a context-appropriate equivalent like "Add a photo"). "Snap" reads as slangy and off-brand — this is absolute. Applies to onboarding, button labels, tip cards, banners, share-sheet text, AND marketing/website surfaces. Search new/changed copy for "snap" before shipping, and back-port the fix into the matching canvas board, or a `SHIPPED` board for a screen that has none (see the design rule above). Exemplar: `Kit/AI-CTA-Banner` sub-copy "Take a photo or paste it in" (CLND-391/393); CLND-367 aLuJP.

## App icon — one source of truth

`calendara-ios/assets/icon.png` (the `app.config.js` `icon`, 1024×1024, opaque, full-bleed) **is** the Calendara app icon. Never hand-draw a stand-in tile (a glyph on a gradient) wherever a surface presents "the app".

- **Website:** render it only through `<AppIcon>` (`calendara-main/src/components/brand/app-icon.tsx`). When the iOS icon changes, run `node scripts/sync-app-icon.mjs` in calendara-main. It re-derives `public/assets/app-icon/*`, `apple-touch-icon.png`, the favicons, the brand lockups (`calendara_logoAndName_{dark,white}.{png,webp}`, squircle mark + the wordmark from `scripts/brand-src/`) and `og-image.png`. It also re-pins `APP_ICON_SOURCE_MD5`, which busts the year-long favicon cache via `?v=`.
- **Canvas:** upload `calendara-ios/assets/icon.png` itself as an image on any board that shows the app; never redraw it. When the icon changes, re-upload it to every canvas that shows it. The frozen Pencil `Kit/App-Icon` is history only.
- **Mobile:** `src/components/ui/AppIcon.tsx` (CLND-368) reads the same file directly.
- **Email:** email art lives in `calendara-main/public/assets/email/v<N>/` and is never overwritten, so an email already delivered keeps the look it arrived with. When the icon or wordmark changes, run `node scripts/build-email-assets.mjs` to publish the next version folder and point `src/lib/emails/components/assets.ts` at it; `sync-app-icon.mjs` does not do this.
- **Why:** CLND-826. The website's sticky download bar shipped a sparkle tile as "the app icon", and the favicons kept a pre-June crop for months.

## Migration backup / audit tables (RLS + tracking)

One-shot cleanup/backfill migrations often snapshot rows into a backup or audit table before an irreversible DELETE/UPDATE. Three rules, learned the hard way from CLND-317 (4 RLS-off PII tables flagged `rls_disabled_in_public` at **ERROR**, created via untracked `execute_sql`):

1. **Never leave such a table RLS-off in `public`.** `CREATE TABLE … AS SELECT e.*` inherits **no** RLS, so it's anon/authenticated-readable via PostgREST — i.e. event PII (titles, locations, attendees) exposed to any logged-in account. Either `ALTER TABLE … ENABLE ROW LEVEL SECURITY` with a deny-all policy, **or** create it in a non-public `migration_artifacts` schema (PostgREST doesn't expose non-public schemas).
2. **Create it via a tracked migration, never raw `execute_sql`.** Untracked DDL skips review and never lands in `supabase_migrations.schema_migrations` — exactly how the RLS-off backups (and the broken `calendar_shares` trigger in CLND-205) shipped unnoticed.
3. **Drop it when its parent ticket closes.** A backup/audit table is rollback insurance for one migration; once that work is Done + verified, drop it via a tracked `DROP TABLE IF EXISTS` migration (export to a non-repo file first if there's no PITR) — don't let PII linger.

## iOS Simulators — clean up after yourself

Every session that touches the simulator must leave the Mac the way it found it. Booted simulators, Simulator.app and stray dev servers keep eating RAM long after the task ends.

1. **Reuse, don't create.** Run `xcrun simctl list devices` and boot an existing device (the named rigs first, e.g. `CLND-774 rig`, `CLND-828 Pro new`). Only `simctl create` a new one when the ticket truly needs a fresh, separate device state. If you do create one, `xcrun simctl delete <udid>` it once the ticket is Done.
2. **Shut down when the task ends.** As the last step of any task that booted a simulator (including `ui-fidelity-review` runs and `/build` Phase 5): `xcrun simctl shutdown all`, then `osascript -e 'quit app "Simulator"'`.
3. **Stop what you started.** Kill any Metro / `expo start` / `npm exec expo` / `xcodebuild` process you launched. Don't leave background `node` processes behind.
4. **Prune occasionally.** `xcrun simctl delete unavailable` removes simulators left behind by old runtimes.

- **What the user feels:** none in the app; this is dev-machine hygiene. The owner feels it: the whole Mac slows down when swap fills up.
- **Why:** Oct 2026. Two simulators had been booted for 2 days, alongside leftover agent sessions and dev servers, pushing a 32 GB Mac into 11.5 GB of swap. There were 27 simulators (about 28 GB on disk), and 17 of them had never been booted.
