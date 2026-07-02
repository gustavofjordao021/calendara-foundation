# Feature: Week View

> **Priority**: 3 (Phase 1)
> **Status**: To Build
> **Cozi Comparison**: Cozi does NOT have week view - we're adding it!

---

## Overview

A 7-day calendar view showing events in a time-grid format. This is a feature Cozi doesn't offer, giving us an advantage for users who prefer seeing their week at a glance with time slots visible.

---

## User Stories

1. **As a busy parent**, I want to see my entire week with time slots so I can spot scheduling conflicts
2. **As a user**, I want to quickly compare what different days look like
3. **As a user**, I want to drag events between days to reschedule
4. **As a user**, I want to see all-day events at the top of each day

---

## Design Specifications

### View Switcher

```
Calendar Header:
┌─────────────────────────────────────────────────────┐
│  Calendar                        🔍    📅    [+]   │
│                                                     │
│  [ Agenda ] [ Week ] [ Month ]                      │
│                ↑                                    │
│           Active view                               │
└─────────────────────────────────────────────────────┘
```

### Week View Layout

```
┌─────────────────────────────────────────────────────┐
│  < Jan 26 - Feb 1, 2026 >                          │
├─────────────────────────────────────────────────────┤
│       Sun   Mon   Tue   Wed   Thu   Fri   Sat     │
│       26    27    28    29    30    31    1       │
├─────────────────────────────────────────────────────┤
│  ALL DAY                                            │
│       │     │  🎂  │     │     │     │     │      │
│       │     │Sarah │     │     │     │     │      │
├─────────────────────────────────────────────────────┤
│  8 AM │     │     │     │     │     │     │      │
│       │     │     │     │     │     │     │      │
│  9 AM │     │█████│     │     │     │█████│      │
│       │     │Team │     │     │     │Soccer      │
│       │     │Mtg  │     │     │     │      │      │
│ 10 AM │     │█████│     │     │     │█████│      │
│       │     │     │     │     │     │      │      │
│ 11 AM │     │     │     │     │     │     │      │
│       │     │     │     │     │     │     │      │
│ 12 PM │     │     │     │     │     │     │      │
│       │     │     │     │     │     │     │      │
│  1 PM │     │     │     │     │     │     │      │
│       │     │     │     │     │     │     │      │
│  2 PM │     │     │█████│     │     │     │      │
│       │     │     │Dent │     │     │     │      │
│  3 PM │     │█████│█████│     │     │     │      │
│       │     │Piano│     │     │     │     │      │
│  ...  │     │     │     │     │     │     │      │
└─────────────────────────────────────────────────────┘
```

### Event Block Detail

```
Event fills time slot with color based on assigned member:

┌─────────┐
│█████████│  ← Member color (e.g., Sarah = purple)
│ Soccer  │
│ Practice│
│ 9-11 AM │
│█████████│
└─────────┘
```

### Current Time Indicator

```
│  9 AM │     │█████│     │     │     │█████│      │
│───────│─────│─────│─────│─────│─────│─────│──────│
│ ↑                                                  │
│ Red line showing current time (9:23 AM)           │
```

### Tap Event Detail

```
Tapping an event shows quick preview:

┌─────────────────────────────────────────────────────┐
│  Soccer Practice                                    │
│  Saturday, Feb 1 · 9:00 AM - 11:00 AM              │
│  Sarah · Lincoln Park                               │
│                                                     │
│  [ View Details ]        [ Edit ]        [ × ]     │
└─────────────────────────────────────────────────────┘
```

---

## Technical Approach

### Data Structure

```typescript
interface WeekViewData {
  startDate: Date;  // Sunday of the week
  endDate: Date;    // Saturday of the week
  days: WeekDay[];
}

interface WeekDay {
  date: Date;
  isToday: boolean;
  allDayEvents: Event[];
  timedEvents: Event[];
}

interface TimeSlot {
  hour: number;     // 0-23
  events: Event[];  // Events that overlap this hour
}
```

### Week View Component

```typescript
import { ScrollView, View, Text, Pressable } from 'react-native';
import { useMemo, useRef } from 'react';

interface WeekViewProps {
  events: Event[];
  selectedDate: Date;
  onEventPress: (event: Event) => void;
  onDatePress: (date: Date) => void;
}

function WeekView({ events, selectedDate, onEventPress, onDatePress }: WeekViewProps) {
  const scrollRef = useRef<ScrollView>(null);

  const weekData = useMemo(() => {
    const startOfWeek = getStartOfWeek(selectedDate);
    return {
      days: Array.from({ length: 7 }, (_, i) => {
        const date = addDays(startOfWeek, i);
        const dayEvents = events.filter(e => isSameDay(e.startAt, date));
        return {
          date,
          isToday: isToday(date),
          allDayEvents: dayEvents.filter(e => e.allDay),
          timedEvents: dayEvents.filter(e => !e.allDay),
        };
      }),
    };
  }, [events, selectedDate]);

  // Scroll to current time on mount
  useEffect(() => {
    const currentHour = new Date().getHours();
    const yOffset = currentHour * HOUR_HEIGHT - 100;
    scrollRef.current?.scrollTo({ y: yOffset, animated: false });
  }, []);

  return (
    <View style={styles.container}>
      {/* Header with day names and dates */}
      <WeekHeader
        days={weekData.days}
        onDatePress={onDatePress}
      />

      {/* All-day events row */}
      <AllDayEventsRow
        days={weekData.days}
        onEventPress={onEventPress}
      />

      {/* Scrollable time grid */}
      <ScrollView ref={scrollRef} style={styles.timeGrid}>
        <TimeGridBackground />
        <CurrentTimeIndicator />
        {weekData.days.map((day, index) => (
          <DayColumn
            key={day.date.toISOString()}
            day={day}
            columnIndex={index}
            onEventPress={onEventPress}
          />
        ))}
      </ScrollView>
    </View>
  );
}
```

### Event Positioning

```typescript
const HOUR_HEIGHT = 60; // pixels per hour
const COLUMN_WIDTH = (SCREEN_WIDTH - TIME_GUTTER) / 7;

function calculateEventPosition(event: Event, columnIndex: number) {
  const startHour = event.startAt.getHours() + event.startAt.getMinutes() / 60;
  const endHour = event.endAt.getHours() + event.endAt.getMinutes() / 60;
  const duration = endHour - startHour;

  return {
    top: startHour * HOUR_HEIGHT,
    height: Math.max(duration * HOUR_HEIGHT, MIN_EVENT_HEIGHT),
    left: TIME_GUTTER + (columnIndex * COLUMN_WIDTH) + 2,
    width: COLUMN_WIDTH - 4,
  };
}

// Handle overlapping events
function layoutOverlappingEvents(events: Event[]) {
  // Sort by start time
  const sorted = [...events].sort((a, b) =>
    a.startAt.getTime() - b.startAt.getTime()
  );

  const columns: Event[][] = [];

  for (const event of sorted) {
    // Find first column where event doesn't overlap
    let placed = false;
    for (let col = 0; col < columns.length; col++) {
      const lastInColumn = columns[col][columns[col].length - 1];
      if (lastInColumn.endAt <= event.startAt) {
        columns[col].push(event);
        placed = true;
        break;
      }
    }
    if (!placed) {
      columns.push([event]);
    }
  }

  return columns;
}
```

### Gestures

```typescript
// Swipe to change week
const panResponder = useMemo(() => PanResponder.create({
  onMoveShouldSetPanResponder: (_, gestureState) => {
    return Math.abs(gestureState.dx) > 20;
  },
  onPanResponderRelease: (_, gestureState) => {
    if (gestureState.dx > 50) {
      // Swipe right - previous week
      setSelectedDate(prev => addDays(prev, -7));
    } else if (gestureState.dx < -50) {
      // Swipe left - next week
      setSelectedDate(prev => addDays(prev, 7));
    }
  },
}), []);

// Long press to create event at time slot
const handleLongPress = (date: Date, hour: number) => {
  const startTime = setHours(date, hour);
  navigation.navigate('CreateEvent', {
    initialDate: startTime,
    initialDuration: 60 // 1 hour default
  });
};
```

---

## Navigation Integration

```typescript
// Calendar screen with view switcher
function CalendarScreen() {
  const [viewMode, setViewMode] = useState<'agenda' | 'week' | 'month'>('agenda');

  return (
    <View>
      <ViewSwitcher
        value={viewMode}
        onChange={setViewMode}
        options={[
          { value: 'agenda', label: 'Agenda' },
          { value: 'week', label: 'Week' },
          { value: 'month', label: 'Month' },
        ]}
      />

      {viewMode === 'agenda' && <AgendaView />}
      {viewMode === 'week' && <WeekView />}
      {viewMode === 'month' && <MonthView />}
    </View>
  );
}
```

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| Event spans multiple days | Show in all-day section or split across columns |
| Many overlapping events | Stack side-by-side, reduce width |
| Event too short to show text | Show only colored block, tap for details |
| Weekend vs weekday | Same treatment, no special styling |
| Week containing month boundary | Show correct dates, month label in header |
| Timezone change mid-week | Recalculate event times |

---

## Performance Considerations

| Concern | Solution |
|---------|----------|
| Many events | Virtualize day columns, only render visible hours |
| Smooth scrolling | Use native driver for animations |
| Quick week changes | Pre-fetch adjacent weeks |
| Memory | Limit rendered events to visible time range |

---

## Cozi Comparison

| Aspect | Cozi | Calendara |
|--------|------|-----------|
| Week view | ❌ Not available | **✅** |
| Time grid | ❌ | **✅** |
| Visual conflicts | ❌ | **✅** |
| Drag to reschedule | ❌ | **✅ Future** |
| Current time line | ❌ | **✅** |

This is a **unique differentiator** - Cozi only offers Agenda and Month views.

---

## Acceptance Criteria

- [ ] Week view shows 7 days with time grid
- [ ] Swipe left/right to change weeks
- [ ] Events positioned correctly by time
- [ ] Overlapping events displayed side-by-side
- [ ] All-day events shown at top
- [ ] Current time indicator visible
- [ ] Tap event shows preview
- [ ] Tap empty slot suggests creating event
- [ ] Family member colors on events
- [ ] Week view persists when navigating away and back

---

## Future Enhancements

1. **Drag to reschedule** - Drag events to new time/day
2. **Pinch to zoom** - Adjust hour height
3. **3-day view** - Alternative compact view
4. **Work hours highlight** - Shade non-work hours
5. **Availability overlay** - Show when family members are free
6. **Landscape mode** - Full-width week view
