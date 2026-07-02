# Calendara — Brand Book

*Canonical. v3.1 tokens. Last updated by Claude. If something here is stale, tell Claude and it'll fix it.*

## What we are
The AI-powered family calendar. Take a photo of a flyer, schedule, or printed calendar and AI turns it into shared events, lists, and tasks — so families spend less time coordinating and more time together. iOS app (React Native) + companion web/API. Evolving toward **Hygge**, a conversational family-coordination agent.

## Who it's for
The household's "family manager" — the parent who carries the mental load of everyone's schedule. Modern alternative to Cozi / FamilyWall. Diverse family shapes are the default (two-parent, single-parent, co-parenting, multigenerational, blended).

## Voice & tone
Warm, unpretentious, lightly playful. Short and concrete. We help families **coordinate**, not "optimize their lives." Avoid corporate/productivity jargon. No exclamation points unless earned.

- ✅ "Take a photo, we'll handle the rest." · "Your family's week, in one place." · "Close the app, be with them."
- ❌ "Maximize household productivity." · "Sync your life's operating system." · the word **"snap"** in any form — banned everywhere (2026-06-11); use "take a photo" / "one photo"

## Palette (v3.1 design tokens)
Warm, earthy, hygge — coral-forward on cream. Cool tones fight it.

| Token | Hex | Use |
|---|---|---|
| primary | `#C96442` | the coral accent — actions, brand moments |
| primaryHover | `#B85A3B` | hover/pressed |
| textPrimary | `#1C1C1E` | ink / linework |
| espresso | `#3D2418` | deep warm shadow/line |
| surface (bg-warm) | `#FFF8F2` | warm surface |
| surfaceSoft | `#FAF7F3` | soft surface |
| border | `#F2E4D8` | warm hairline |
| sand | `#F2E4D8` | dominant warm neutral |
| sage | `#5B8C3F` | success / green accent |
| gold | `#D4A82A` | warm highlight |
| blue | `#4A90D9` | the *only* cool note, used sparingly |
| purple | `#8B5CF6` | secondary accent ("coming soon") |
| washes | peach `#FFEDDC` · apricot `#FFE4D1` · clay `#FFD9C2` · cream `#FFF4EB` | section backgrounds |

## Type
**Manrope** throughout. Ramp: display 32 / 700 / −1.0 · title 24 / 700 / −0.6 · heading 20 / 700 · bodyLg 16 / 500 · body 15 / 500 · caption 13 / 500 · eyebrow 11 / 700 / +1.6 (uppercase, in accent color). Radii 14–32; 4 pt spacing.

## Illustration direction — "Storybook Glow"
**Decision (June 2026):** lead with a **warm, painterly storybook illustration** style for the emotional ~20% of surfaces; it's the only direction that puts our hygge voice into a picture and breaks from flat-SaaS sameness. Full rationale + scoring: `image-system/aesthetic-recommendation.html`. Recipes: `image-system/image-prompts-storybook-glow.md`.

- **Lead (emotional):** Storybook painterly — families *together*, warm light as the hero (the "Glow"), domestic settings, sensory props. Use for hero, social, onboarding, "memory/recap" moments.
- **Support (everyday):** warm hand-drawn **line** illustration — blog headers, section texture, empty states. Cheaper to scale.
- **Functional (product):** keep the crisp **UI screenshot + warm-wash + hand-drawn callout** system. Illustration carries the feeling; the screenshot carries the proof.

### Do / Don't
- **Do** recolor any generated art to the palette above (coral/sand/sage/gold; dusty blue as the only cool). Families together, diverse configs. Calm and breathable. Keep it grown-up (modern picture-book, not Saturday-morning cartoon).
- **Don't** go cool/busy/childish. Don't illustrate what a screenshot can show. **Don't generate any third-party IP** (no Pokémon, Disney/Pixar, or other studio characters) — style references are for *style* only; production uses original characters and scenes.

## Links
- Live site: https://usecalendara.com · Design SoT: `calendara.pen` (Pencil) · Roadmap: Linear · Analytics: PostHog
