# Calendara — shared conventions (CalendaraMobile + calendara-main)

This file lives in the common parent of the Calendara repos and is **auto-loaded by Claude Code in both** `CalendaraMobile/` (Expo mobile app) and `calendara-main/` (Next.js web app + API + the Google-sync engine, deployed on Vercel). Claude Code walks up the directory tree from the cwd, so anything here applies when working in either repo.

Put **cross-repo** conventions here so they live in one place; keep repo-specific guidance in each repo's own `CLAUDE.md`.

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
- **Exemplar:** the Google-sync investigation — `~/.agent/diagrams/calendara-gcal-sync.html` (text source `CalendaraMobile/gcal-sync-investigation.md`), which became epic **CLND-299**.
- **When to produce one:** explaining how a backend/data system works, diagnosing a data issue's root cause, designing a backend feature — and **always as the deliverable of a `workflow`-driven investigation.**
- **`/spec` on a backend/data/workflow ticket:** the "How it works / current state" section must be (or link to) a `visual-explainer` report, so reviewers align on current behavior before the change is scoped — the analogue of naming `ui-fidelity-review` as the gate for UI specs.
- **`/build` on backend/data/workflow changes:** in Phase 5 (Verify), generate a `visual-explainer` "how it works now" (or before/after) report for the touched system instead of relying on a text summary — the analogue of running `ui-fidelity-review` on touched screens.

## Keep design and code in sync — back-port every decision to Pencil

`calendara.pen` (Pencil) is the **design source of truth**. Whenever a UI/design decision is **made or changed in code** — a deliberate deviation, a refinement, or the resolution of a design-vs-code discrepancy — go back to Pencil and update the matching component/frame so the two never drift.

- **Applies to every UI surface in `calendara.pen` — mobile AND website:** the **mobile app** (`CalendaraMobile`, `NEW/*` screen frames) and the **website** (`calendara-main`, `NEW/Landing-*` frames + the `(public)/` marketing routes / `components/landing-page/`). Both repos auto-load this file, so the rule holds in either.
- **Bidirectional fidelity:** the build-vs-design gate aligns build → design (mobile: `ui-fidelity-review`, sim-vs-Pencil; web: a `claude-in-chrome` screenshot of the running page vs the exported Pencil `Landing-*` frame); the back-port closes the loop design → shipped (the frames match what actually shipped). Both directions must hold before a UI ticket is Done.
- **When:** as the closing step of the work — `/build` Phase 5 (Verify), after the fidelity gate passes — and any time a `/spec` decision overrides the design (font, label, variant, layout, copy).
- **How:** use the `pencil` MCP (`batch_get` to re-read, `batch_design` to edit, `export_nodes`/`get_screenshot` to compare). The .pen is multiplayer — **re-read nodes first and update them in place; never recreate frames.** Screenshot the reconciled nodes and attach them to the ticket.
- **Exemplars:** CLND-256, CLND-269, CLND-368 (D11: `Inter`→`Manrope`, Hybrid labels, realign `tBBpj`/`ngdAi` to shipped variants).

## User-facing copy conventions

These apply to **all** user-facing copy in **both repos** (the mobile app and the website) and **override the source design** (Pencil/Figma) when they conflict.

- **Never use the word "Snap."** Always use **"Take a photo"** (or a context-appropriate equivalent like "Add a photo"). "Snap" reads as slangy and off-brand — this is absolute. Applies to onboarding, button labels, tip cards, banners, share-sheet text, AND marketing/website surfaces. Search new/changed copy for "snap" before shipping, and back-port the fix into the matching Pencil frame (see the back-port rule above). Exemplar: `Kit/AI-CTA-Banner` sub-copy "Take a photo or paste it in" (CLND-391/393); CLND-367 aLuJP.

## Migration backup / audit tables (RLS + tracking)

One-shot cleanup/backfill migrations often snapshot rows into a backup or audit table before an irreversible DELETE/UPDATE. Three rules, learned the hard way from CLND-317 (4 RLS-off PII tables flagged `rls_disabled_in_public` at **ERROR**, created via untracked `execute_sql`):

1. **Never leave such a table RLS-off in `public`.** `CREATE TABLE … AS SELECT e.*` inherits **no** RLS, so it's anon/authenticated-readable via PostgREST — i.e. event PII (titles, locations, attendees) exposed to any logged-in account. Either `ALTER TABLE … ENABLE ROW LEVEL SECURITY` with a deny-all policy, **or** create it in a non-public `migration_artifacts` schema (PostgREST doesn't expose non-public schemas).
2. **Create it via a tracked migration, never raw `execute_sql`.** Untracked DDL skips review and never lands in `supabase_migrations.schema_migrations` — exactly how the RLS-off backups (and the broken `calendar_shares` trigger in CLND-205) shipped unnoticed.
3. **Drop it when its parent ticket closes.** A backup/audit table is rollback insurance for one migration; once that work is Done + verified, drop it via a tracked `DROP TABLE IF EXISTS` migration (export to a non-repo file first if there's no PITR) — don't let PII linger.
