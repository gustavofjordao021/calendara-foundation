# Feature: Birthday Tracker

> **Priority**: 3 (Phase 1)
> **Status**: To Build
> **Cozi Comparison**: Cozi Gold feature

---

## Overview

Dedicated birthday tracking with automatic yearly recurrence, age calculation, and countdown. Cozi includes this in Gold tier. We'll make it available to all users with smart features like reminder suggestions and gift list integration.

---

## User Stories

1. **As a parent**, I want to track all family birthdays in one place
2. **As a user**, I want automatic reminders before birthdays so I have time to plan
3. **As a user**, I want to see how old someone is turning
4. **As a parent**, I want to add my kids' friends' birthdays for party planning
5. **As a user**, I want a quick view of upcoming birthdays

---

## Design Specifications

### Birthday Entry Point

```
Settings > Family Members:
┌─────────────────────────────────────────────────────┐
│  👤 Sarah                                           │
│     sarah@email.com                                 │
│     Birthday: March 15 (Turning 12)          [Edit]│
└─────────────────────────────────────────────────────┘

Or from Calendar:
┌─────────────────────────────────────────────────────┐
│  [ + Add Event ]                                    │
│  [ 🎂 Add Birthday ]  ← Quick action               │
└─────────────────────────────────────────────────────┘
```

### Add Birthday Sheet

```
┌─────────────────────────────────────────────────────┐
│              Add Birthday                    [ × ]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Whose birthday?                                    │
│  ┌─────────────────────────────────────────────┐   │
│  │  [ Search or enter name...              ]   │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  FAMILY MEMBERS                                     │
│  ○ Sarah      ○ Jake      ○ Mom      ○ Dad        │
│                                                     │
│  ○ Someone else (friend, relative, etc.)          │
│                                                     │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  Birthday                                           │
│  [ March 15, 2014 ▼ ]                              │
│                                                     │
│  [ ] Include birth year (shows age)               │
│                                                     │
│  Remind me                                          │
│  [✓] 1 week before                                │
│  [✓] 1 day before                                 │
│  [ ] On the day                                    │
│                                                     │
│              [ Save Birthday ]                      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Birthday Event on Calendar

```
┌─────────────────────────────────────────────────────┐
│  March 15                                           │
├─────────────────────────────────────────────────────┤
│  🎂 Sarah's Birthday                               │
│     Turning 12!                                     │
│     All day                                         │
└─────────────────────────────────────────────────────┘
```

### Upcoming Birthdays Widget

```
Home Screen Section:
┌─────────────────────────────────────────────────────┐
│  🎂 UPCOMING BIRTHDAYS                              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Sarah's Birthday              Mar 15 (46 days)    │
│  Turning 12                                         │
│                                                     │
│  Jake's Birthday               Apr 22 (84 days)    │
│  Turning 8                                          │
│                                                     │
│  Mom's Birthday                May 3 (95 days)     │
│                                                     │
│              [ View All Birthdays ]                 │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Birthdays List View

```
┌─────────────────────────────────────────────────────┐
│  🎂 Birthdays                            [ + Add ] │
├─────────────────────────────────────────────────────┤
│                                                     │
│  COMING UP                                          │
│  ┌─────────────────────────────────────────────┐   │
│  │  🎂 Sarah              Mar 15 · 46 days     │   │
│  │     Turning 12                              │   │
│  └─────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────┐   │
│  │  🎂 Jake               Apr 22 · 84 days     │   │
│  │     Turning 8                               │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ALL BIRTHDAYS                                      │
│  ┌─────────────────────────────────────────────┐   │
│  │  January                                    │   │
│  │    Grandma            Jan 5                 │   │
│  │    Uncle Mike         Jan 18                │   │
│  │                                             │   │
│  │  February                                   │   │
│  │    Dad                Feb 28                │   │
│  │    ...                                      │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Technical Approach

### Data Model

```typescript
interface Birthday {
  id: string;
  familyId: string;
  name: string;
  date: string;           // MM-DD format (or full date if year known)
  birthYear?: number;     // Optional - for age calculation
  memberId?: string;      // Link to family member if applicable
  reminders: number[];    // Days before to remind [7, 1, 0]
  createdBy: string;
  createdAt: Date;
}

// Computed
interface BirthdayWithAge extends Birthday {
  nextOccurrence: Date;
  daysUntil: number;
  turningAge?: number;
}
```

### Database Schema

```sql
CREATE TABLE birthdays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,      -- Store full date, show only month/day if no year
  include_year BOOLEAN DEFAULT false,
  member_id UUID REFERENCES family_members(id),
  reminders INT[] DEFAULT ARRAY[7, 1],
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_birthdays_family ON birthdays(family_id);

-- Function to get upcoming birthdays
CREATE OR REPLACE FUNCTION get_upcoming_birthdays(
  family_id_param UUID,
  days_ahead INT DEFAULT 90
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  next_occurrence DATE,
  days_until INT,
  turning_age INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    b.id,
    b.name,
    -- Calculate next occurrence
    CASE
      WHEN make_date(EXTRACT(YEAR FROM NOW())::INT,
                     EXTRACT(MONTH FROM b.birth_date)::INT,
                     EXTRACT(DAY FROM b.birth_date)::INT) >= CURRENT_DATE
      THEN make_date(EXTRACT(YEAR FROM NOW())::INT,
                     EXTRACT(MONTH FROM b.birth_date)::INT,
                     EXTRACT(DAY FROM b.birth_date)::INT)
      ELSE make_date(EXTRACT(YEAR FROM NOW())::INT + 1,
                     EXTRACT(MONTH FROM b.birth_date)::INT,
                     EXTRACT(DAY FROM b.birth_date)::INT)
    END AS next_occurrence,
    -- Days until
    CASE
      WHEN make_date(EXTRACT(YEAR FROM NOW())::INT,
                     EXTRACT(MONTH FROM b.birth_date)::INT,
                     EXTRACT(DAY FROM b.birth_date)::INT) >= CURRENT_DATE
      THEN make_date(EXTRACT(YEAR FROM NOW())::INT,
                     EXTRACT(MONTH FROM b.birth_date)::INT,
                     EXTRACT(DAY FROM b.birth_date)::INT) - CURRENT_DATE
      ELSE make_date(EXTRACT(YEAR FROM NOW())::INT + 1,
                     EXTRACT(MONTH FROM b.birth_date)::INT,
                     EXTRACT(DAY FROM b.birth_date)::INT) - CURRENT_DATE
    END AS days_until,
    -- Age they're turning (if year known)
    CASE
      WHEN b.include_year THEN
        EXTRACT(YEAR FROM NOW())::INT - EXTRACT(YEAR FROM b.birth_date)::INT +
        CASE WHEN make_date(EXTRACT(YEAR FROM NOW())::INT,
                           EXTRACT(MONTH FROM b.birth_date)::INT,
                           EXTRACT(DAY FROM b.birth_date)::INT) < CURRENT_DATE
        THEN 1 ELSE 0 END
      ELSE NULL
    END AS turning_age
  FROM birthdays b
  WHERE b.family_id = family_id_param
  ORDER BY days_until ASC
  LIMIT 20;
END;
$$ LANGUAGE plpgsql;
```

### Auto-create Calendar Events

```typescript
// When birthday is created, create recurring yearly event
async function createBirthdayEvent(birthday: Birthday) {
  const { data, error } = await supabase
    .from('events')
    .insert({
      family_id: birthday.familyId,
      title: `${birthday.name}'s Birthday`,
      description: birthday.birthYear
        ? `Turning ${calculateAge(birthday.birthYear)}!`
        : null,
      start_at: getNextBirthdayDate(birthday.date),
      all_day: true,
      recurrence_rule: 'FREQ=YEARLY',
      event_type: 'birthday',
      birthday_id: birthday.id,  // Link to birthday record
      created_by: birthday.createdBy,
    });

  // Create reminders
  for (const daysBefore of birthday.reminders) {
    await createReminder(data.id, daysBefore * 24 * 60);
  }
}
```

### Birthday Hook

```typescript
function useBirthdays(familyId: string) {
  const [birthdays, setBirthdays] = useState<BirthdayWithAge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBirthdays() {
      const { data } = await supabase
        .rpc('get_upcoming_birthdays', {
          family_id_param: familyId,
          days_ahead: 365
        });

      setBirthdays(data || []);
      setLoading(false);
    }

    fetchBirthdays();
  }, [familyId]);

  const addBirthday = async (birthday: Omit<Birthday, 'id'>) => {
    const { data, error } = await supabase
      .from('birthdays')
      .insert(birthday)
      .select()
      .single();

    if (data) {
      await createBirthdayEvent(data);
    }

    return { data, error };
  };

  return { birthdays, loading, addBirthday };
}
```

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| Feb 29 birthday (leap year) | Show on Feb 28 in non-leap years |
| No birth year provided | Don't show age, just date |
| Birthday today | Highlight prominently, show "Today!" |
| Past birthday this year | Show next year's occurrence |
| Duplicate birthday | Allow (might track same person in different contexts) |
| Family member deleted | Keep birthday but unlink from member |

---

## Cozi Comparison

| Aspect | Cozi Free | Cozi Gold | Calendara |
|--------|-----------|-----------|-----------|
| Birthday tracking | ❌ | ✅ | **✅ All users** |
| Age calculation | ❌ | ✅ | **✅** |
| Custom reminders | ❌ | 1 | **Multiple** |
| Countdown | ❌ | ❌ | **✅** |
| Upcoming list | ❌ | ❌ | **✅** |
| Gift list link | ❌ | ❌ | **✅ Future** |

---

## Acceptance Criteria

- [ ] Users can add birthdays for family members
- [ ] Users can add birthdays for non-family (friends, relatives)
- [ ] Birthday appears on calendar as all-day event
- [ ] Birthday automatically recurs yearly
- [ ] Age is calculated and shown (if year provided)
- [ ] Days until countdown shown in list view
- [ ] Upcoming birthdays widget on home screen
- [ ] Reminders sent based on user preferences
- [ ] Birthdays synced across family members

---

## Future Enhancements

1. **Gift list integration** - Link to shopping list for gifts
2. **Party planning** - Create party event with RSVP
3. **Birthday cards** - Send digital cards to family
4. **Photo memories** - Show photos from past birthdays
5. **Age milestones** - Special treatment for 1st, 10th, 16th, 18th, 21st, etc.
6. **Import from contacts** - Pull birthdays from phone contacts
