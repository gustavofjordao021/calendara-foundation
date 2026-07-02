# Calendara strategy — pointer

> **Canonical source:** [Linear](https://linear.app/gjordaodoteth).
> **This directory is a shell now, not a strategy tree.** Last updated 2026-04-19.

## Why this is a pointer

On 2026-04-19 the `strategy/` markdown tree was migrated into Linear. The roadmap had already drifted inside 48 hours of being rewritten here — "workshop in markdown, decisions in Linear" didn't survive contact with a solo-operator workflow. One source of truth beats grep-ability when drift is the real cost.

Going forward:

- **Linear Projects** own roadmap sequencing and status. [Release 2.0.0](https://linear.app/gjordaodoteth/project/release-200-6c6ab190e3dd) is the current iOS release; future releases get their own Linear project, each with a description doing the strategic framing.
- **Linear Documents** own the workshop layer: vision, product principles, competitive research, market sizing, user research, GTM, outreach, SEO, ASO, onboarding analysis. Attached to the [Strategy & Research](https://linear.app/gjordaodoteth) project (or to specific issues when the research is ticket-scoped).
- **This repo** keeps only: Next.js-rendered content (blog posts, landing MDX), binary assets (.xlsx, .pptx, .docx, .pdf, screenshots), and code (`calendara-main/`, `CalendaraMobile/`).

## Where the old files went

| Was at | Now lives as |
|--------|--------------|
| `vision/vision-hygge.md` | Linear Document: Vision — Hygge: The Family Coordination Agent |
| `vision/product-principles.md` | Linear Document: Principles — Product Principles |
| `competitive/competitive-research-april-2026.md` | Linear Document: Competitive Research — April 2026 |
| `competitive/cozi-deep-dive-jan-2026.md` | Linear Document: Competitive — Cozi Deep Dive (January 2026) |
| `competitive/onboarding-competitive-assessment-april-2026.md` | Linear Document attached to issue CLND-143 |
| `market/family-app-market-jan-2026.md` | Linear Document: Market — Family App Market Landscape (January 2026) |
| `market/market-opportunity-jan-2026.md` | Linear Document: Market — Opportunity Analysis (January 2026) |
| `market/user-research-jan-2026.md` | Linear Document: Market — User Research (January 2026) |
| `gtm/go-to-market-jan-2026.md` | Linear Document: GTM — Go-to-Market Strategy (January 2026) |
| `gtm/outreach-emails.md` | Linear Document: GTM — Blog Outreach Emails & UTM Playbook |
| `growth/aso-guide.md` | Linear Document: Growth — ASO Guide (March 2026) |
| `growth/onboarding-analysis-april-2026.md` | Linear Document: Growth — Onboarding & Growth Analysis (April 2026) |
| `growth/seo-audit-march-2026.md` | Linear Document: Growth — SEO Audit (March 2026) |
| `growth/seo-playbook-jan-2026.md` | Linear Document: Growth — SEO Playbook (January 2026) |
| `growth/seo-workflow-with-mcp-tools.md` | Linear Document: Growth — SEO Workflow with MCP Tools |

## What's still in this directory, and why

- **`gtm/landing-page-copy-current.md`** — stays as a file because the Next.js site renders it at build time. Delete only after the Hygge copy rewrite ships and replaces it.
- **`growth/*.docx` and `briefs/*.docx`** — binaries can't live as Linear Documents. Stay in repo.
- **`roadmap/product-roadmap-april-2026.md`** — pointer file, not a roadmap. Points to Linear Release 2.0.0.
- **`archive/`** — superseded material kept for git-log context. No urgency to migrate.

## How to use this

- "What's shipping?" → open the current Linear Release project.
- "What's the vision / why does X exist?" → open the corresponding Linear Document.
- "Let me grep the strategy tree." → git history has it. Run `git log -- strategy/` to find the pre-migration versions.
- "Where should I file new strategic thinking?" → Linear Documents, under the Strategy & Research project (or attached to the relevant issue). Do not create new markdown files under `strategy/` for strategy content.
