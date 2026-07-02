# Feature: Month View Calendar

> **Priority**: 1 (Core)
> **Status**: Ready to Build
> **Cozi Comparison**: Cozi gates month view behind Gold ($39/yr)

---

## Overview

A visual month grid calendar view that shows events at a glance. Uses a **hybrid display** approach - showing event text for days with 1-2 events and switching to compact dots for busier days. Multi-day events display as **spanning bars** across day cells.

This is one of Cozi's most requested features and is paywalled in their free tier. We offer it to all users.

---

## User Stories

1. **As a parent**, I want to see the entire month at a glance so I can plan ahead
2. **As a family member**, I want to tap a day to see all events for that day
3. **As a user**, I want to swipe between months easily
4. **As a user**, I want to see color-coded events indicating which family members they belong to
5. **As a user**, I want to see multi-day events (vacations, trips) spanning across days visually

---

## Design Specifications

### Screen Layout

```
┌─────────────────────────────────────────────────────┐
│  ◀  January 2026  ▶                    [Today] [+] │
├─────────────────────────────────────────────────────┤
│  [ Agenda ]  [ Week ]  [ Month ]                    │  ← Segmented control
├─────────────────────────────────────────────────────┤
│                                                     │
│         MONTH GRID (fixed height)                   │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│         SELECTED DAY EVENTS (scrollable)            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Month Header

```
┌─────────────────────────────────────────────────────┐
│  ◀       January 2026       ▶         Today   +    │
└─────────────────────────────────────────────────────┘
     │              │              │         │     │
     │              │              │         │     └─ Create event on selected day
     │              │              │         └─ Jump to current date
     │              │              └─ Swipe or tap arrows
     │              └─ Current month/year (tap to open month picker)
     └─ Previous month
```

### View Switcher (Segmented Control)

```
┌─────────────────────────────────────────────────────┐
│  ┌──────────┬──────────┬──────────┐                │
│  │  Agenda  │   Week   │  Month   │                │
│  └──────────┴──────────┴──────────┘                │
│                              ↑                      │
│                        Active (filled)              │
└─────────────────────────────────────────────────────┘
```

### Month Grid

```
┌─────────────────────────────────────────────────────┐
│  Sun    Mon    Tue    Wed    Thu    Fri    Sat     │
│  ░░░                                         ░░░   │  ← Weekend tint
├─────────────────────────────────────────────────────┤
│  ░░░                          1      2      ░3░    │
│  ░░░                               Dentist  ░░░    │
│  ░░░                                        ░░░    │
├─────────────────────────────────────────────────────┤
│  ░4░     5      6      7      8      9     ░10░    │
│  ░░░          Team   Soccer               ░░░     │
│  ░░░          Mtg                          ░░░    │
├─────────────────────────────────────────────────────┤
│ ░11░   [12]    13     14     15     16    ░17░    │
│  ░░░   ●●●   Piano  ────────────────────  ░░░     │
│  ░░░                 Vacation ──────────  ░░░     │
├─────────────────────────────────────────────────────┤
│ ░18░    19     20     21     22     23    ░24░    │
│  ░░░   ─────────────────────  ●●          ░░░     │
│  ░░░                                       ░░░    │
└─────────────────────────────────────────────────────┘

Legend:
  [12]  = Today (filled primary color circle)
  ░░░   = Weekend background tint
  ───   = Multi-day event spanning bar
  ●●●   = Dots for 3+ events
```

### Day Cell States

```
REGULAR DAY (1-2 events - show text):
┌─────────┐
│    5    │  ← Date number
│  Team   │  ← Event title (truncated)
│  Mtg    │
└─────────┘

BUSY DAY (3+ events - show dots):
┌─────────┐
│   12    │
│  ● ● ●  │  ← Colored dots (max 3)
│  (+2)   │  ← Overflow indicator
└─────────┘

TODAY:
┌─────────┐
│  (12)   │  ← Date in filled circle (primary color)
│  ● ●    │
│         │
└─────────┘

SELECTED DAY:
┌─────────┐
│   15    │  ← Highlighted background
│  Dinner │
│         │
└─────────┘

PAST DAY:
┌─────────┐
│    3    │  ← Reduced opacity (0.5)
│         │
│         │
└─────────┘

WEEKEND:
┌─────────┐
│░░░ 4 ░░░│  ← Subtle gray background tint
│░░░   ░░░│
│░░░   ░░░│
└─────────┘
```

### Multi-Day Event Spanning Bars

```
Multi-day events span across the TOP of day cells:

           Mon    Tue    Wed    Thu    Fri
         ┌──────┬──────┬──────┬──────┬──────┐
         │  14  │  15  │  16  │  17  │  18  │
         │┌─────────────────────────────────┐│
         ││        Beach Vacation           ││ ← Spanning bar
         │└─────────────────────────────────┘│
         │      │      │      │      │      │
         └──────┴──────┴──────┴──────┴──────┘

Bar styling:
- Rounded corners on start/end days
- Flat edges on middle days
- Color matches assigned family member
- Text shows on first visible day only
- Height: ~16px
- Can stack 2 bars max, then overflow indicator
```

### Selected Day Event List (Below Calendar)

```
┌─────────────────────────────────────────────────────┐
│  Wednesday, January 15                     3 events │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ● 9:00 AM · Soccer Practice · Lincoln Park        │
│    └─ Sarah                                        │
│                                                     │
│  ● 2:00 PM · Dentist · Dr. Smith's Office         │
│    └─ Jake                                         │
│                                                     │
│  ● 6:00 PM · Family Dinner · Home                 │
│    └─ Everyone                                     │
│                                                     │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  ALL DAY                                            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  ┃ Beach Vacation (Day 2 of 5)                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                     │
└─────────────────────────────────────────────────────┘

Event row format:
● {time} · {title} · {location}
  └─ {assigned member(s)}

- Color dot (●) matches family member color
- Tap event row → navigate to event detail
- All-day events shown separately at bottom with bar styling
```

### Empty State (No Events on Selected Day)

```
┌─────────────────────────────────────────────────────┐
│  Wednesday, January 15                              │
├─────────────────────────────────────────────────────┤
│                                                     │
│                    📅                               │
│                                                     │
│              No events scheduled                    │
│                                                     │
│            [ + Add Event ]                          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Interactions

| Action | Result |
|--------|--------|
| Tap day | Select day, show events in list below |
| Swipe left on grid | Navigate to next month |
| Swipe right on grid | Navigate to previous month |
| Tap month/year title | Open month/year picker |
| Tap "Today" button | Jump to current date, select it |
| Tap "+" button | Open EventCreateScreen with selected date |
| Tap event in list | Navigate to EventDetailScreen |
| Long press on day | Haptic feedback + open EventCreateScreen |
| Pull down on event list | Refresh events from server |
| Tap segment control | Switch between Agenda/Week/Month views |

---

## Technical Approach

### Component Structure

```
src/components/calendar/
├── MonthView/
│   ├── index.tsx              # Main container
│   ├── MonthHeader.tsx        # Month title, arrows, Today/+ buttons
│   ├── ViewSwitcher.tsx       # Segmented control (Agenda/Week/Month)
│   ├── MonthGrid.tsx          # 6 weeks × 7 days grid
│   ├── WeekdayHeader.tsx      # Sun-Sat labels
│   ├── DayCell.tsx            # Individual day with events/dots
│   ├── SpanningEventBar.tsx   # Multi-day event bar
│   ├── SelectedDayEvents.tsx  # Event list for selected day
│   ├── EventRow.tsx           # Single event in the list
│   └── styles.ts              # Shared styles
```

### State Management

```typescript
interface MonthViewState {
  currentMonth: Date;           // Month being displayed
  selectedDate: Date;           // Currently selected day (default: today)
  viewMode: 'agenda' | 'week' | 'month';
}

// Events fetched via existing hooks
interface EventsByDate {
  [dateKey: string]: Event[];   // 'YYYY-MM-DD' → Event[]
}

interface MultiDayEvent extends Event {
  spanStart: Date;
  spanEnd: Date;
  dayIndex: number;  // Which day of the span (1, 2, 3...)
  totalDays: number; // Total days in span
}
```

### Props Interface

```typescript
interface MonthViewProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onEventPress: (event: Event) => void;
  onCreateEvent: (date: Date) => void;
  events: Event[];
  familyMembers: FamilyMember[];
  isRefreshing?: boolean;
  onRefresh?: () => void;
}

interface DayCellProps {
  date: Date;
  events: Event[];
  multiDayEvents: MultiDayEvent[];
  isToday: boolean;
  isSelected: boolean;
  isPast: boolean;
  isWeekend: boolean;
  onPress: () => void;
  onLongPress: () => void;
}
```

### Event Grouping Logic

```typescript
function groupEventsByDate(events: Event[]): EventsByDate {
  const grouped: EventsByDate = {};

  for (const event of events) {
    const startDate = startOfDay(event.startAt);
    const endDate = startOfDay(event.endAt);

    // Single-day event
    if (isSameDay(startDate, endDate)) {
      const key = format(startDate, 'yyyy-MM-dd');
      grouped[key] = [...(grouped[key] || []), event];
    } else {
      // Multi-day event: add to each day
      let current = startDate;
      let dayIndex = 1;
      const totalDays = differenceInDays(endDate, startDate) + 1;

      while (current <= endDate) {
        const key = format(current, 'yyyy-MM-dd');
        grouped[key] = [...(grouped[key] || []), {
          ...event,
          _isMultiDay: true,
          _dayIndex: dayIndex,
          _totalDays: totalDays,
          _isFirstDay: dayIndex === 1,
          _isLastDay: current.getTime() === endDate.getTime(),
        }];
        current = addDays(current, 1);
        dayIndex++;
      }
    }
  }

  return grouped;
}
```

### Day Cell Rendering Logic

```typescript
function DayCell({ date, events, isToday, isSelected, isPast, isWeekend, onPress, onLongPress }: DayCellProps) {
  const { colors } = useTheme();

  // Separate multi-day and single-day events
  const multiDayEvents = events.filter(e => e._isMultiDay);
  const singleDayEvents = events.filter(e => !e._isMultiDay);

  // Hybrid display: text for 1-2, dots for 3+
  const showEventText = singleDayEvents.length <= 2;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={[
        styles.dayCell,
        isWeekend && styles.weekendCell,
        isSelected && styles.selectedCell,
        isPast && styles.pastCell,
      ]}
    >
      {/* Multi-day spanning bars at top */}
      <View style={styles.spanningBarsContainer}>
        {multiDayEvents.slice(0, 2).map(event => (
          <SpanningEventBar key={event.id} event={event} />
        ))}
        {multiDayEvents.length > 2 && (
          <Text style={styles.overflowText}>+{multiDayEvents.length - 2}</Text>
        )}
      </View>

      {/* Date number */}
      <View style={[
        styles.dateContainer,
        isToday && { backgroundColor: colors.primary, borderRadius: 999 }
      ]}>
        <Text style={[
          styles.dateText,
          isToday && { color: colors.background },
          isPast && { opacity: 0.5 },
        ]}>
          {date.getDate()}
        </Text>
      </View>

      {/* Events: text or dots */}
      {showEventText ? (
        <View style={styles.eventTextContainer}>
          {singleDayEvents.slice(0, 2).map(event => (
            <Text
              key={event.id}
              style={[styles.eventText, { color: event.memberColor }]}
              numberOfLines={1}
            >
              {event.title}
            </Text>
          ))}
        </View>
      ) : (
        <View style={styles.dotsContainer}>
          {singleDayEvents.slice(0, 3).map((event, i) => (
            <View
              key={i}
              style={[styles.dot, { backgroundColor: event.memberColor }]}
            />
          ))}
          {singleDayEvents.length > 3 && (
            <Text style={styles.overflowText}>+{singleDayEvents.length - 3}</Text>
          )}
        </View>
      )}
    </Pressable>
  );
}
```

### Month Navigation

```typescript
function useMonthNavigation(initialDate: Date = new Date()) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(initialDate));

  const goToPreviousMonth = useCallback(() => {
    setCurrentMonth(prev => subMonths(prev, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentMonth(prev => addMonths(prev, 1));
  }, []);

  const goToToday = useCallback(() => {
    setCurrentMonth(startOfMonth(new Date()));
  }, []);

  // Swipe gesture handler
  const panResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, { dx }) => Math.abs(dx) > 20,
    onPanResponderRelease: (_, { dx }) => {
      if (dx > 50) goToPreviousMonth();
      else if (dx < -50) goToNextMonth();
    },
  }), [goToPreviousMonth, goToNextMonth]);

  return {
    currentMonth,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    panResponder,
  };
}
```

### Integration with EventCreateScreen

```typescript
// Add initialDate param support to EventCreateScreen
// In route params:
export type EventCreateParams = {
  calendarId?: string;
  initialDate?: string;  // ISO date string
};

// In MonthView:
const handleCreateEvent = (date: Date) => {
  navigation.navigate('EventCreate', {
    initialDate: date.toISOString(),
  });
};

// In EventCreateScreen, update default values:
const route = useRoute<any>();
const initialDate = route.params?.initialDate
  ? new Date(route.params.initialDate)
  : new Date();

const defaultValues = getDefaultEventFormData(initialDate);
```

---

## Visual Design Tokens

```typescript
const monthViewStyles = {
  // Grid
  gridHeight: 320,                    // Fixed height for month grid
  cellPadding: 2,
  cellMinHeight: 48,

  // Today indicator
  todayCircleSize: 28,

  // Dots
  dotSize: 6,
  dotSpacing: 2,
  maxVisibleDots: 3,

  // Spanning bars
  barHeight: 16,
  barBorderRadius: 4,
  maxVisibleBars: 2,

  // Event text
  eventTextFontSize: 10,
  eventTextLineHeight: 12,
  maxEventTextLines: 2,

  // Weekend tint
  weekendBackgroundOpacity: 0.04,  // Very subtle

  // Past day opacity
  pastDayOpacity: 0.5,

  // Selected day
  selectedBackgroundOpacity: 0.1,
};
```

---

## Performance Considerations

| Concern | Solution |
|---------|----------|
| Many events | Pre-compute `eventsByDate` map on data fetch |
| Month navigation | Prefetch adjacent months' events |
| Re-renders | Memoize DayCell, use `React.memo` |
| Event list scrolling | Use `FlashList` for event list |
| Spanning bars | Calculate positions once per month change |

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| Day with 10+ events | Show 3 dots + "+7" indicator |
| Multi-day event spanning months | Show bar portion in each month |
| All-day events | Display in event list with special styling |
| No events in month | Normal grid, empty state when day selected |
| Timezone changes | Recalculate all event positions |
| Feb 29 (leap year) | Grid adjusts automatically |
| Month with 4/5/6 weeks | Always show 6 rows for consistent height |

---

## Accessibility

| Feature | Implementation |
|---------|----------------|
| VoiceOver/TalkBack | Each day announces: "January 15, 3 events, tap to view" |
| Reduce Motion | Disable swipe animations if enabled |
| Dynamic Type | Event text scales with system font size |
| Color blind | Don't rely on color alone - use icons/patterns |
| Tap targets | Minimum 44×44pt for all interactive elements |

---

## Cozi Comparison

| Aspect | Cozi Free | Cozi Gold | Calendara |
|--------|-----------|-----------|-----------|
| Month view | ❌ Paywalled | ✅ | **✅ All users** |
| Event text in cells | ❌ | ❌ | **✅ Hybrid** |
| Spanning bars | ❌ | ❌ | **✅** |
| Family color coding | Partial | Partial | **✅ Full** |
| View switcher | ❌ | ❌ | **✅ Agenda/Week/Month** |
| Pull to refresh | ❌ | ❌ | **✅** |
| Weekend highlighting | ❌ | ❌ | **✅** |

---

## Acceptance Criteria

### Grid Display
- [ ] Month grid displays 6 week rows consistently
- [ ] Today has filled primary-color circle behind date number
- [ ] Weekends have subtle gray background tint
- [ ] Past days have reduced opacity (0.5)
- [ ] Selected day has highlighted background

### Event Display (Hybrid)
- [ ] Days with 1-2 events show event title text
- [ ] Days with 3+ events show colored dots (max 3) + overflow count
- [ ] Event text/dots colored by assigned family member

### Multi-Day Events
- [ ] Spanning bars display across top of day cells
- [ ] Bars have rounded corners on first/last day, flat on middle days
- [ ] Event title shown on first visible day only
- [ ] Maximum 2 bars visible per row, then overflow indicator

### Navigation
- [ ] Swipe left/right navigates between months smoothly
- [ ] Tap arrows navigates months
- [ ] "Today" button jumps to current date and selects it
- [ ] Segmented control switches between Agenda/Week/Month views

### Event List
- [ ] Tapping a day shows events below calendar
- [ ] Events show: time · title · location + assigned member
- [ ] All-day events grouped separately
- [ ] Tapping event navigates to detail screen
- [ ] Empty state shows "No events" + Add button

### Event Creation
- [ ] "+" button opens EventCreateScreen with selected date pre-filled
- [ ] Long press on day opens EventCreateScreen with that date

### Pull to Refresh
- [ ] Pulling down on event list triggers refresh
- [ ] Loading indicator shown during refresh
- [ ] Events update after refresh completes

### Performance
- [ ] Month navigation < 100ms
- [ ] No frame drops during swipe (60fps)
- [ ] Event list scrolls smoothly with 50+ events

### Accessibility
- [ ] All days accessible via VoiceOver/TalkBack
- [ ] Proper labels for screen readers
- [ ] Minimum 44pt tap targets

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/components/calendar/MonthView/index.tsx` | Create | Main container |
| `src/components/calendar/MonthView/MonthHeader.tsx` | Create | Header with nav |
| `src/components/calendar/MonthView/ViewSwitcher.tsx` | Create | Segmented control |
| `src/components/calendar/MonthView/MonthGrid.tsx` | Create | 6×7 grid |
| `src/components/calendar/MonthView/DayCell.tsx` | Create | Day with events |
| `src/components/calendar/MonthView/SpanningEventBar.tsx` | Create | Multi-day bar |
| `src/components/calendar/MonthView/SelectedDayEvents.tsx` | Create | Event list |
| `src/screens/calendar/CalendarScreen.tsx` | Modify | Add view switcher |
| `src/screens/events/EventCreateScreen.tsx` | Modify | Accept initialDate |

---

## Future Enhancements

1. **Week view integration** - Share components with week view
2. **3-month overview** - Pinch out to see quarter
3. **Drag to reschedule** - Drag events between days
4. **Heat map mode** - Color intensity by busyness
5. **Mini calendar widget** - iOS home screen widget
6. **Month picker** - Tap month title to jump to any month
