# Calendara — Midjourney Prompt Pack · "Storybook Glow"

Style direction: candidate #3 (storybook painterly). Carries the *feeling* Calendara's voice already promises — warmth, togetherness, memory, the "Glow."

**Style reference:** `--sref 2013954648 293616715`
**Last validated:** Midjourney syntax current as of June 2026.

> ⚠️ **Use original content only.** The reference frame contains Pikachu — the `--sref` carries *style only* (palette, grain, light, brushwork), never subject. Never prompt Pokémon, Disney/Pixar, or any studio IP, in production or in tests.

---

## Parameter cheat-sheet

| Param | Use | Notes |
|---|---|---|
| `--sref 2013954648 293616715` | the style | blend of your two codes |
| `--sw` | style strength | 0–1000, default 100. Sweet spot **65–175**. ↑ = more storybook grain/texture |
| `--stylize` (`--s`) | MJ's own aesthetic | default 100. **Lower (80–100) = truer to your named colors**; higher = more painterly drift |
| `--ar` | aspect ratio | per surface, see below |
| `--no text, logos, watermark, ui` | cleanup | stops garbled signage/UI |
| `--sv 4` | **compatibility** | sref codes minted **before June 2025 need this** to render their original look. If output drifts from the reference frame, add it. |

**Aspect ratios by surface:** web hero `16:9` (or `3:2`) · App Store / phone `9:16` · social feed `4:5` · social square `1:1` · blog header `3:1` or `2:1` · onboarding welcome `9:16` · empty-state spot `1:1`.

---

## The reusable formula

```
[family, together, doing something] + [home setting + time-of-day light]
+ [cozy props] + [palette: warm coral, cream, sage, golden glow]
--sref 2013954648 293616715 --sw 120 --ar [surface] --stylize 150
```

Let the **sref carry the style.** Spend the prompt words on **who + what + light + palette**, not on style adjectives.

**Palette nudge (always include some):** warm coral / terracotta `#C96442`, cream / sand `#F2E4D8`, sage `#5B8C3F`, golden glow, with dusty blue as the *only* cool note. This pulls the reference's greener cast toward Calendara's warm brand palette.

---

## Prompts by surface

### Web hero — family together
```
a mother, father and two kids gathered around a wooden kitchen table under a warm hanging lamp, evening light through the window, mugs and a fruit bowl, a small wall calendar behind them, cozy and unhurried, warm coral cream and sage palette, golden glow --sref 2013954648 293616715 --sw 120 --ar 16:9 --stylize 150
```

### The product's soul — AI-photo "magic"
```
a parent smiling while photographing a colorful school flyer on the fridge with a phone, morning kitchen light, a child eating breakfast behind, a soft sprinkle of warm light around the phone like gentle magic, coral butter-yellow and sage palette --sref 2013954648 293616715 --sw 110 --ar 4:5 --stylize 150
```

### Relief — "close the app, be with them"
```
two parents relaxing on a soft couch with tea while two kids play on the rug nearby, lamplight, blankets and houseplants, a calm unhurried evening at home, warm terracotta and cream with sage accents, gentle golden light --sref 2013954648 293616715 --sw 120 --ar 3:2 --stylize 150
```

### Diverse family config — single dad + kid
```
a single dad and his young daughter planting flowers in a sunny backyard at golden hour, watering can and garden tools, relaxed and joyful, warm coral green and gold tones --sref 2013954648 293616715 --sw 120 --ar 3:2 --stylize 150
```

### Multigenerational — grandparents + grandkids
```
grandparents and two grandchildren baking together in a warm kitchen, flour on the counter, soft afternoon light through the window, cozy and loving, terracotta apron, cream and sage palette, golden glow --sref 2013954648 293616715 --sw 120 --ar 16:9 --stylize 150
```

### Calm school-morning coordination (not chaos)
```
a calm family morning by the front door, a mom handing a lunchbox to a kid with a backpack, a teen glancing at a shared wall calendar, soft morning light, warm and organized, coral sand and sage tones --sref 2013954648 293616715 --sw 115 --ar 4:5 --stylize 150
```

### Onboarding welcome (phone, room for headline)
```
a cozy family home at dusk, warm lamplight in the windows, a softly glowing little sunrise above the rooftop, inviting and gentle, coral cream and sage palette, lots of soft sky and empty space at the top --sref 2013954648 293616715 --sw 130 --ar 9:16 --stylize 160
```

### Social — the "mental load lifted"
```
a tired-but-relieved parent exhaling with a soft smile as warm light gathers around them, a calm home in soft focus behind, the feeling of a weight lifted, warm coral amber and cream, gentle grain --sref 2013954648 293616715 --sw 120 --ar 4:5 --stylize 150
```

### Seasonal — autumn family walk
```
a family of four walking together on a leafy path in autumn, holding hands, warm low sun, scarves and boots, cozy and connected, coral amber and sage palette, soft painterly light --sref 2013954648 293616715 --sw 120 --ar 16:9 --stylize 150
```

### Empty-state spot — single warm object
```
a single softly glowing wall calendar with a tiny sunrise icon, a few floating leaves and warm light around it, simple and friendly, cream background, coral and sage accents, lots of empty space --sref 2013954648 293616715 --sw 120 --ar 1:1 --stylize 130
```

### Brand abstraction — the "Glow" mark
```
a warm radiant glow shaped like a soft sunrise resting gently over a small family home, simple and symbolic, cream sky, coral and gold light, sage rooftops, minimal and calm --sref 2013954648 293616715 --sw 140 --ar 16:9 --stylize 160
```

### Blog / SEO header (lighter, wide)
```
a warm flat-lay of a family kitchen counter — a wall calendar, a coffee mug, a school flyer, a few crayons and a sprig of herbs, soft morning light, tidy and inviting, coral cream and sage palette --sref 2013954648 293616715 --sw 110 --ar 3:1 --stylize 130
```

---

## Knobs to turn

- **More storybook grain/texture:** raise `--sw` to 150–175.
- **Truer brand color:** lower `--stylize` to 80–100 (and name the hexes' colors explicitly).
- **Cleaner output:** append `--no text, logos, watermark, ui`.
- **Understand your blend:** run each code solo once (`--sref 2013954648`, then `--sref 293616715`) to see what each contributes before blending.
- **Style drift from the reference?** add `--sv 4`.

## Consistency (for a repeatable library)

- Lock **one** `--sw` + `--stylize` across the whole set; vary only the scene text.
- Reuse the exact phrasing scaffold (formula above) so framing stays coherent.
- For a **recurring hero family**, anchor one good render with `--oref` (v7 omni-reference) or `--cref`, then reuse it across scenes.
- Generate in pairs/quads and keep a "selects" board; aim for 6–8 master scenes you can reuse rather than endless one-offs (the solo-operator-friendly path).

## Where each lands (recap)

Lead with these painterly scenes for the **emotional ~20%** — hero, social, onboarding, "memory/recap" moments. Keep the crisp **UI + warm-wash + callout** system (your v3.1 App Store look) for anything that explains the product. Illustration carries the feeling; the screenshot carries the proof.
