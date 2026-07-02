# CLND-475 — Triage: crawled-not-indexed posts

**Date:** June 29, 2026 · For epic CLND-473, Tier 0.
**Method:** repo blog files (45 MDX) cross-referenced against organic pageviews (PostHog, 120 days). Near-zero-organic posts correlate with GSC's 31 "crawled-not-indexed" + 9 "discovered-not-indexed." Spot-check this list against GSC's actual export before deleting anything.

**How to read it:** each post is tagged **CODE** (a redirect / config change → run through `/spec` + `/build`), **CONTENT** (rewrite/expand, no code), or **PRUNE?** (delete — needs your explicit OK). Winners (kept as merge targets) are in **bold**.

---

## First, the two Tier 0 siblings — no code needed

- **CLND-474 (redirect errors):** `/blog/ocr-calendar` and `/blog/convert-image-to-calendar-event` both return **HTTP 200, zero redirects, correct www canonical** when fetched live. GSC's "Redirect error" is stale. **Action: Request Indexing in GSC. No code change.**
- **CLND-476 (canonical + sitemap):** live `robots.txt` points to `https://www.usecalendara.com/sitemap.xml` (www), `metadataBase` is www, blog canonicals self-reference www. **Already correct. No code change** — optionally confirm the Vercel `NEXT_PUBLIC_APP_URL` env var is the www form.

So the only Tier 0 work with commits is this triage (CLND-475).

---

## Group A — Consolidate (CODE: 301s in `next.config.mjs` + merge content)

These are thin/near-duplicate pages competing with a stronger sibling. Fold any unique content into the winner, then 301 the loser. Each 301 is the code change; the content merge is content work.

### A1. Photo / OCR / extraction variants → the two photo winners

| Loser (slug) | Organic 120d | → 301 destination |
|---|---|---|
| convert-image-to-calendar-event | 0 | **photo-to-calendar** |
| screenshot-to-calendar | 2 | **photo-to-calendar** |
| ocr-calendar | 1 | **photo-to-calendar** |
| extract-data-from-photos-for-families | 2 | **photo-to-calendar** |
| photo-to-grocery-list | 1 | **photo-to-shopping-list** (near-duplicate intent) |

Keep & strengthen as the targets: **photo-to-calendar** (116), **photo-to-google-calendar** (168), **photo-to-shopping-list** (32), **photo-to-todo-list** (41). `photo-to-recipe` (0) — see Group B (recipe is a distinct feature, improve rather than merge).

### A2. Persona-extraction variants → one keeper

| Loser (slug) | Organic 120d | → 301 destination |
|---|---|---|
| professionals-extract-calendar-events-meeting | 0 | **parents-extract-calendar-events-school-flyer** |
| students-extract-calendar-events-syllabus | 0 (no traffic at all) | **parents-extract-calendar-events-school-flyer** |

Keep **parents-extract-calendar-events-school-flyer** (5) as the single "extract events from a photo" guide, with sections for school/syllabus/work use cases folded in.

### A3. Orphaned old slugs → 301 (verify they 404 first)

These appear in analytics but have **no MDX file and no redirect rule** — likely renamed posts now 404ing.

| Orphan slug | → 301 destination |
|---|---|
| best-family-calendar-app | **7-best-family-calendar-apps-2026** |
| best-shared-family-calendar-apps-in-2026-a-complete-comparison | **best-shared-family-calendar-apps** |

### A4. AI cluster → one pillar (this is also CLND-485)

| Loser (slug) | Organic 120d | → destination |
|---|---|---|
| ai-family-hub | 0 | **ai-calendar-app** (the pillar) |
| best-ai-calendar-app | 14 | **ai-calendar-app** (the pillar) |

Merge into one strong **ai-calendar-app** pillar; keep **free-ai-calendar** (41, growing) as a node. Track under CLND-485 so this isn't done twice.

---

## Group B — Improve & re-index (CONTENT only, no code)

Real posts with genuine intent that are just thin/unindexed. Add depth, original screenshots/data, more images with keyword alt text, internal links from the winners, then Request Indexing. No redirect.

| Post | Organic 120d | Note |
|---|---|---|
| familywall-review-2026 | 1 | FamilyWall has no blog — we should own this; it's underweight |
| best-familywall-alternative-2026 | 2 | same cluster, thin |
| switch-from-cozi-to-calendara | 1 | high-intent migration page, underbuilt |
| shared-family-calendar-iphone | 1 | "easy KD" quick win flagged in the Jan playbook |
| cozi-30-day-limit-explained | 5 | high-intent Cozi-exodus page |
| photo-to-recipe | 0 | distinct feature — improve, don't merge |
| 5-ways-to-organize-family-schedule | 5 | generic but fine; strengthen or fold into a hub |
| soccer-mom-calendar-hacks | 1 | check tone vs brand; improve or prune |

---

## Group C — Prune candidates (PRUNE? — needs your explicit OK)

Thin and off-strategy; improving them may not be worth it. I would **not** delete without your call. If kept, they move to Group B.

| Post | Organic 120d | Why considered |
|---|---|---|
| what-is-calendara | 0 | thin brand page; the homepage/2.0 post cover this better |
| tired-of-typing-school-calendar | 0 | overlaps the school-flyer + photo-to-calendar posts |

---

## The code change, in one place (for `/spec`)

Everything CODE above is the same single edit: **append 301 redirects to the `redirects()` array in `next.config.mjs`** (alongside the existing CLND-97 block), `permanent: true`. Proposed map, pending your approval of the merges:

```
/blog/convert-image-to-calendar-event          → /blog/photo-to-calendar
/blog/screenshot-to-calendar                   → /blog/photo-to-calendar
/blog/ocr-calendar                             → /blog/photo-to-calendar
/blog/extract-data-from-photos-for-families    → /blog/photo-to-calendar
/blog/photo-to-grocery-list                    → /blog/photo-to-shopping-list
/blog/professionals-extract-calendar-events-meeting → /blog/parents-extract-calendar-events-school-flyer
/blog/students-extract-calendar-events-syllabus     → /blog/parents-extract-calendar-events-school-flyer
/blog/best-family-calendar-app                 → /blog/7-best-family-calendar-apps-2026
/blog/best-shared-family-calendar-apps-in-2026-a-complete-comparison → /blog/best-shared-family-calendar-apps
/blog/ai-family-hub                            → /blog/ai-calendar-app
/blog/best-ai-calendar-app                     → /blog/ai-calendar-app
```

Then delete the corresponding MDX files (after folding any unique content into the targets) and update internal links that point at the old slugs (several posts link to `/blog/ocr-calendar` and `/blog/convert-image-to-calendar-event`).

**Sequence:** fold content → add 301s → delete MDX → fix internal links → Request Indexing on the survivors. The redirect + file-delete + link-fix is the `/spec` + `/build` unit; the content folding is the writing.
