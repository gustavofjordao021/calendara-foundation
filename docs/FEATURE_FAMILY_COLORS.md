# Feature: Color-Coded Family Members

> **Priority**: 1 (Core)
> **Status**: To Build
> **Cozi Comparison**: Core Cozi feature, loved by users

---

## Overview

Each family member gets a unique color that appears on their events throughout the calendar. This is THE defining visual feature of family calendars - it lets you see "who's doing what, when" at a glance.

---

## User Stories

1. **As a parent**, I want each family member to have their own color so I can quickly see whose events are whose
2. **As a user**, I want to choose/change my color to personalize my experience
3. **As a parent**, I want to assign colors to my kids when setting up the family
4. **As a user**, I want to filter the calendar by family member to see just one person's schedule

---

## Design Specifications

### Color Palette

Provide 8-10 carefully chosen colors that:
- Are distinct from each other
- Work on both light and dark backgrounds
- Are accessible (sufficient contrast)
- Feel warm and family-friendly

```
Suggested Palette:
┌────────────────────────────────────────────────────┐
│  🔴 Coral      #E57373   (Primary brand adjacent)  │
│  🔵 Ocean      #64B5F6                             │
│  🟢 Sage       #81C784                             │
│  🟣 Lavender   #BA68C8                             │
│  🟠 Sunset     #FFB74D                             │
│  🔷 Teal       #4DB6AC                             │
│  🩷 Rose       #F48FB1                             │
│  🟤 Sienna     #A1887F                             │
│  🌊 Indigo     #7986CB                             │
│  🌿 Mint       #4DD0E1                             │
└────────────────────────────────────────────────────┘
```

### Color Assignment Flow

**During Family Setup:**
```
┌─────────────────────────────────────────────┐
│           Add Family Member                 │
├─────────────────────────────────────────────┤
│                                             │
│  Name: [  Sarah                    ]        │
│                                             │
│  Email: [ sarah@email.com          ]        │
│                                             │
│  Color:                                     │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐            │
│  │ ● │ │ ● │ │ ● │ │ ● │ │ ● │            │
│  │ ✓ │ │   │ │   │ │   │ │   │            │
│  └───┘ └───┘ └───┘ └───┘ └───┘            │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐            │
│  │ ● │ │ ● │ │ ● │ │ ● │ │ ● │            │
│  └───┘ └───┘ └───┘ └───┘ └───┘            │
│                                             │
│           [ Add Member ]                    │
└─────────────────────────────────────────────┘
```

### Color Display Locations

| Location | Implementation |
|----------|----------------|
| Event card | Left border stripe (4px) |
| Month view dots | Colored dots below date |
| Agenda view | Color indicator next to event |
| Event detail | Header background tint |
| Family member list | Avatar background/ring |
| Filter chips | Chip background color |

### Event Card with Color

```
┌─────────────────────────────────────────────┐
│█                                            │
│█  Soccer Practice                           │
│█  9:00 AM - 10:30 AM                       │
│█  Sarah · Lincoln Park Field               │
│█                                            │
└─────────────────────────────────────────────┘
 ↑
 4px colored stripe (Sarah's color)
```

### Multi-Person Events

When an event has multiple family members assigned:

```
┌─────────────────────────────────────────────┐
│█  Family Dinner                             │
│█  6:00 PM                                   │
│█  👤👤👤 Mom, Dad, Sarah, Jake              │
└─────────────────────────────────────────────┘
 ↑
 Gradient or stacked colors (primary assignee first)
```

**Option A**: Show primary person's color + avatar stack
**Option B**: Gradient stripe with all colors
**Option C**: Gray "family" color for multi-person events

### Family Filter Bar

```
┌─────────────────────────────────────────────┐
│ [All] [●Mom] [●Dad] [●Sarah] [●Jake]       │
└─────────────────────────────────────────────┘
```

Tapping a chip filters calendar to show only that person's events.

---

## Technical Approach

### Data Model

```typescript
interface FamilyMember {
  id: string;
  name: string;
  email: string;
  color: string;        // Hex color code
  avatarUrl?: string;
  role: 'admin' | 'member' | 'child';
}

interface Event {
  id: string;
  title: string;
  // ... other fields
  assignedTo: string[];  // Array of family member IDs
}
```

### Color Assignment Logic

```typescript
const DEFAULT_COLORS = [
  '#E57373', '#64B5F6', '#81C784', '#BA68C8',
  '#FFB74D', '#4DB6AC', '#F48FB1', '#A1887F'
];

function assignColor(existingMembers: FamilyMember[]): string {
  const usedColors = existingMembers.map(m => m.color);
  const availableColors = DEFAULT_COLORS.filter(c => !usedColors.includes(c));

  if (availableColors.length > 0) {
    return availableColors[0]; // First available
  }
  // If all colors used, cycle back
  return DEFAULT_COLORS[existingMembers.length % DEFAULT_COLORS.length];
}
```

### Color Utilities

```typescript
// Get contrasting text color
function getTextColor(bgColor: string): string {
  const luminance = getLuminance(bgColor);
  return luminance > 0.5 ? '#1C1C1E' : '#FFFFFF';
}

// Get lighter tint for backgrounds
function getTintColor(color: string, opacity: number = 0.1): string {
  return `${color}${Math.round(opacity * 255).toString(16)}`;
}
```

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| 10+ family members | Colors will repeat, that's okay |
| Color-blind users | Add pattern/icon option in accessibility settings |
| Unassigned event | Use neutral gray color |
| Member changes color | Update all their events in UI |
| Member leaves family | Keep historical events, gray out color |

---

## Accessibility

1. **Don't rely on color alone** - Always include name/initials
2. **Sufficient contrast** - All colors pass WCAG AA
3. **Color-blind modes** - Optional patterns or shapes
4. **Screen readers** - Announce "Sarah's event" not "coral event"

---

## Cozi Comparison

| Aspect | Cozi | Calendara |
|--------|------|-----------|
| Color assignment | Auto + manual | Auto + manual |
| Color palette | ~8 colors | 10 colors |
| Color in month view | ⚠️ Users complain it's hard to see | Clear dots |
| Filter by person | ✅ | ✅ |
| Multi-person events | Primary color only | Gradient/stack option |

---

## Acceptance Criteria

- [ ] Each family member can be assigned a unique color
- [ ] Colors appear on event cards (left stripe)
- [ ] Colors appear as dots in month view
- [ ] Users can change their color in settings
- [ ] New members auto-assigned first available color
- [ ] Filter chips allow viewing one person's events
- [ ] Colors are accessible (contrast ratio ≥ 4.5:1)
- [ ] Works in dark mode

---

## Future Enhancements

1. **Custom colors** - Color picker for power users
2. **Color themes** - Pre-set family color themes (Ocean, Forest, Sunset)
3. **Patterns** - For accessibility, add patterns to colors
4. **Avatar integration** - Show photo + color ring
