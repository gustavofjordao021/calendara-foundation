# Calendara roadmap — pointer

> **Canonical source:** [Linear project "Release 2.0.0"](https://linear.app/gjordaodoteth/project/release-200-6c6ab190e3dd) (and its successors).
> **This file is a pointer, not a roadmap.** Last updated 2026-04-19.

## Why this file is a pointer

This path used to hold a full roadmap markdown (NOW / NEXT / LATER, Cozi-parity matrix, Hygge framing, the works). It drifted within 48 hours of being written — the markdown listed two-way Google Calendar sync as "NOW / committed" on April 19, when CLND-69 had already been marked Done in Linear on April 17. That is the two-sources-of-truth tax, and it is not affordable for a solo operator.

Going forward, **Linear is the single source of truth for roadmap sequencing and status.** Linear project descriptions carry the strategic framing. This file exists only so anyone landing at the old path knows where to look.

## What lives where now

- **Active roadmap (sequencing + status):** Linear Projects. [Release 2.0.0](https://linear.app/gjordaodoteth/project/release-200-6c6ab190e3dd) is the current iOS release. Future releases get their own Linear projects, each with a description doing the strategic framing.
- **Product vision, principles, competitive research, user research, SEO, GTM, landing copy, archives:** still markdown under `strategy/`. These are workshop files — research and long-form thinking — not decisions. They are supposed to be messy, bulk-edited, grep-able, and cross-linked.
- **Prior April roadmap (Hygge × Cozi-parity, two-track framing):** preserved in git history. Run `git log -- strategy/roadmap/product-roadmap-april-2026.md` to recover the full prior version. The Hygge pitch and the April competitive context that motivated it still hold; they just no longer live in a separate roadmap doc that can drift from Linear.

## The split, stated plainly

Linear is the decision layer. Git/markdown is the workshop layer. Workshop feeds decisions; decisions don't need a markdown mirror.

If you need to know what's shipping, open Linear.
If you need to know why, open the Linear project description. If that points you into `strategy/`, follow it there.

## Still-open items that lived in the April doc

These didn't have Linear tickets as of 2026-04-19 — they remain open questions, not commitments:

- Brand voice refresh (copy pass across app + landing)
- Weekly Family Digest email (Saturday recap)
- Family Streaks v1 (collective streak on home header)
- Comparison pages (`/vs-cozi`, `/vs-jam`)
- Apple Calendar two-way sync, mobile (infra-ready but no open ticket)
- Name the Glow; name the agent
- Consolidate SEO docs into a single current playbook
- Market sizing refresh (the `market/` docs are all January)

When any of these becomes committed work, file it in Linear. Do not re-open a parallel markdown roadmap.
