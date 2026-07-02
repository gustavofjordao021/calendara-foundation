# Feature: Event Privacy Controls

> **Priority**: 2 (Power Feature)
> **Status**: To Build
> **Cozi Comparison**: Cozi has NO privacy controls - major user complaint
> **See also**: [PRODUCT_PRINCIPLES.md](./PRODUCT_PRINCIPLES.md) — Core calendar model and visibility defaults

---

## Overview

Allow users to mark events as private (hidden from certain family members) or create events only visible to specific people. This is a gap in Cozi that users frequently complain about - parents can't hide surprise parties from kids, couples can't hide gift shopping, etc.

> **Important**: The base privacy model is defined in [PRODUCT_PRINCIPLES.md](./PRODUCT_PRINCIPLES.md). Events created in Calendara are family-visible by default. Imported external events (Google, Apple) are always shown as busy blocks. This spec covers **granular** privacy controls on top of that foundation (adults-only, selected members, etc.).

---

## User Stories

1. **As a parent**, I want to hide certain events from my kids (surprise party, gift shopping)
2. **As a spouse**, I want some events visible only to my partner, not the whole family
3. **As a user**, I want a "private" event that only I can see
4. **As an admin**, I want to control who can see sensitive family events

---

## Design Specifications

### Privacy Options

```
┌─────────────────────────────────────────────────────┐
│  Event Visibility                                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ○ Everyone in family                              │
│    All family members can see this event            │
│                                                     │
│  ○ Only adults                                     │
│    Hidden from members marked as "child"            │
│                                                     │
│  ○ Selected members only                           │
│    Choose who can see                               │
│    ┌─────────────────────────────────────────┐     │
│    │ [✓] Mom    [✓] Dad    [ ] Sarah  [ ] Jake │  │
│    └─────────────────────────────────────────┘     │
│                                                     │
│  ○ Only me                                         │
│    Private - no one else can see                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Event Card - Private Indicator

```
┌─────────────────────────────────────────────────────┐
│█                                              🔒    │
│█  Jake's Birthday Present Shopping                  │
│█  2:00 PM - 4:00 PM                                │
│█  Mall                                             │
│█                                          Adults    │
└─────────────────────────────────────────────────────┘
                                             ↑
                                   Privacy badge
```

### Family Member Roles

```
┌─────────────────────────────────────────────────────┐
│  Family Members                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  👤 Mom (You)                          Admin        │
│     gustavo@email.com                               │
│                                                     │
│  👤 Dad                                Admin        │
│     dad@email.com                                   │
│                                                     │
│  👤 Sarah                              Child        │
│     sarah@email.com                                 │
│                                                     │
│  👤 Jake                               Child        │
│     jake@email.com                                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### What Kids See

When an event is hidden from a child, they simply don't see it:

**Parent's View:**
```
Tuesday, January 28
├── 9:00 AM  School Drop-off
├── 2:00 PM  🔒 Jake's Surprise Party Planning (Adults)
└── 6:00 PM  Family Dinner
```

**Child's View (Jake):**
```
Tuesday, January 28
├── 9:00 AM  School Drop-off
└── 6:00 PM  Family Dinner
```

---

## Technical Approach

### Data Model

```typescript
interface Event {
  id: string;
  title: string;
  // ... other fields
  visibility: 'everyone' | 'adults' | 'selected' | 'private';
  visibleTo?: string[];  // Array of member IDs (for 'selected')
  createdBy: string;     // Always visible to creator
}

interface FamilyMember {
  id: string;
  name: string;
  role: 'admin' | 'member' | 'child';
  // ...
}
```

### Database Schema

```sql
-- Add to events table
ALTER TABLE events ADD COLUMN visibility TEXT DEFAULT 'everyone'
  CHECK (visibility IN ('everyone', 'adults', 'selected', 'private'));

ALTER TABLE events ADD COLUMN visible_to UUID[] DEFAULT NULL;

-- Ensure creator can always see their events
CREATE POLICY "Users can see their own events"
  ON events FOR SELECT
  USING (created_by = auth.uid());

-- Visibility-based access
CREATE POLICY "Event visibility policy"
  ON events FOR SELECT
  USING (
    visibility = 'everyone'
    OR (visibility = 'adults' AND is_adult_member(auth.uid(), family_id))
    OR (visibility = 'selected' AND auth.uid() = ANY(visible_to))
    OR (visibility = 'private' AND created_by = auth.uid())
  );
```

### Query Logic

```typescript
async function getVisibleEvents(userId: string, familyId: string) {
  const member = await getMemberInfo(userId, familyId);

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('family_id', familyId)
    .or(`
      visibility.eq.everyone,
      and(visibility.eq.adults,member_role.neq.child),
      and(visibility.eq.selected,visible_to.cs.{${userId}}),
      and(visibility.eq.private,created_by.eq.${userId})
    `);

  return events;
}
```

---

## Privacy Scenarios

| Scenario | Visibility Setting | Who Sees |
|----------|-------------------|----------|
| Surprise party for Jake | Adults only | Mom, Dad (not Jake, Sarah) |
| Gift shopping | Only me | Just the creator |
| Parent date night | Selected (Mom + Dad) | Only the parents |
| Doctor appointment | Everyone | Whole family |
| Therapy session | Only me | Just the person |

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| Child tries to create private event | Allow - they can have privacy too |
| Admin demoted to member | Keep their existing private events |
| Member leaves family | Remove from all `visible_to` arrays |
| Editing someone else's private event | Not allowed - only creator can edit |
| Recurring event with privacy | Apply same privacy to all instances |

---

## Security Considerations

1. **Server-side enforcement** - Privacy must be enforced in database policies, not just UI
2. **API protection** - API endpoints must respect visibility rules
3. **Push notifications** - Don't leak private event titles in notifications to wrong people
4. **Search** - Private events shouldn't appear in search for unauthorized users
5. **Agenda emails** - Respect privacy in email content

---

## Cozi Comparison

| Aspect | Cozi | Calendara |
|--------|------|-----------|
| Private events | ❌ None | **✅** |
| Adults-only events | ❌ | **✅** |
| Selected members | ❌ | **✅** |
| Child role | ❌ No concept | **✅** |
| Admin controls | ❌ "Kids can delete" | **✅** |

This is a **major differentiator** - Cozi users frequently complain about lack of privacy.

---

## Acceptance Criteria

- [ ] Events can be set to: Everyone, Adults only, Selected members, Only me
- [ ] Hidden events don't appear in any view for unauthorized members
- [ ] Privacy indicator (🔒) shown on private events
- [ ] Only event creator can change privacy settings
- [ ] Push notifications respect privacy (don't leak to wrong people)
- [ ] Agenda emails respect privacy
- [ ] Search respects privacy
- [ ] Calendar sync doesn't expose private events

---

## Future Enhancements

1. **Busy/Free only** - Show time blocked but not event details
2. **Request access** - "Ask to see this event"
3. **Temporary visibility** - "Hide until Dec 25" (for surprises)
4. **Audit log** - See who viewed private events (for admins)
5. **Privacy templates** - Quick presets for common scenarios
