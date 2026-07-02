# Feature: Multiple Reminders

> **Priority**: 2 (Power Feature)
> **Status**: To Build
> **Cozi Comparison**: Cozi Free = 1 reminder, Gold = 3 reminders

---

## Overview

Allow users to set multiple reminders per event (up to 3-5). Cozi gates this behind their paid tier - we'll offer it to all users or as part of our more affordable subscription.

---

## User Stories

1. **As a parent**, I want multiple reminders so I don't forget important events
2. **As a user**, I want reminders at different intervals (1 week, 1 day, 1 hour before)
3. **As a user**, I want to choose between push notifications and email reminders
4. **As a user**, I want default reminder settings that apply to all new events

---

## Design Specifications

### Event Creation/Edit UI

```
┌─────────────────────────────────────────────────────┐
│  Reminders                                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  🔔 1 day before                           [ × ]   │
│                                                     │
│  🔔 1 hour before                          [ × ]   │
│                                                     │
│  [ + Add Reminder ]                                 │
│                                                     │
│  ─────────────────────────────────────────────────  │
│  Max 5 reminders per event                          │
└─────────────────────────────────────────────────────┘
```

### Add Reminder Sheet

```
┌─────────────────────────────────────────────────────┐
│              Add Reminder                    [ × ]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  When                                               │
│  ┌─────────────────────────────────────────────┐   │
│  │  At time of event                           │   │
│  │  5 minutes before                           │   │
│  │  15 minutes before                          │   │
│  │  30 minutes before                          │   │
│  │  1 hour before                        ✓     │   │
│  │  2 hours before                             │   │
│  │  1 day before                               │   │
│  │  2 days before                              │   │
│  │  1 week before                              │   │
│  │  Custom...                                  │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  How                                                │
│  ┌─────────────────────────────────────────────┐   │
│  │  🔔 Push notification               ✓       │   │
│  │  📧 Email                                   │   │
│  │  Both                                       │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│              [ Add Reminder ]                       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Default Reminders Setting

```
┌─────────────────────────────────────────────────────┐
│  Default Reminders                                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Automatically add to new events:                   │
│                                                     │
│  [ ] No default reminders                          │
│  [✓] 1 day before                                  │
│  [✓] 1 hour before                                 │
│  [ ] 15 minutes before                             │
│                                                     │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  All-day events:                                    │
│  [✓] 9:00 AM on the day                           │
│  [✓] 9:00 AM day before                           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Technical Approach

### Data Model

```typescript
interface EventReminder {
  id: string;
  eventId: string;
  offsetMinutes: number;    // Minutes before event (negative = after)
  type: 'push' | 'email' | 'both';
  sent: boolean;
  sentAt?: Date;
}

// Preset options
const REMINDER_PRESETS = [
  { label: 'At time of event', minutes: 0 },
  { label: '5 minutes before', minutes: 5 },
  { label: '15 minutes before', minutes: 15 },
  { label: '30 minutes before', minutes: 30 },
  { label: '1 hour before', minutes: 60 },
  { label: '2 hours before', minutes: 120 },
  { label: '1 day before', minutes: 1440 },
  { label: '2 days before', minutes: 2880 },
  { label: '1 week before', minutes: 10080 },
];
```

### Database Schema

```sql
CREATE TABLE event_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  offset_minutes INT NOT NULL,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('push', 'email', 'both')),
  sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reminders_pending ON event_reminders(event_id, sent)
  WHERE sent = false;

-- User default preferences
CREATE TABLE user_reminder_defaults (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  default_reminders INT[] DEFAULT ARRAY[1440, 60], -- 1 day, 1 hour
  default_type TEXT DEFAULT 'push',
  allday_reminders INT[] DEFAULT ARRAY[0], -- Same day at 9am
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Reminder Processing

```typescript
// Cron job runs every minute
async function processReminders() {
  const now = new Date();

  // Find reminders that should fire now
  const dueReminders = await supabase
    .from('event_reminders')
    .select(`
      *,
      event:events(*),
      event.user:users(*)
    `)
    .eq('sent', false)
    .lte('fire_at', now);

  for (const reminder of dueReminders) {
    if (reminder.reminder_type === 'push' || reminder.reminder_type === 'both') {
      await sendPushNotification(reminder);
    }
    if (reminder.reminder_type === 'email' || reminder.reminder_type === 'both') {
      await sendReminderEmail(reminder);
    }

    await supabase
      .from('event_reminders')
      .update({ sent: true, sent_at: now })
      .eq('id', reminder.id);
  }
}
```

### Push Notification

```typescript
import * as Notifications from 'expo-notifications';

async function sendPushNotification(reminder: EventReminder) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: reminder.event.title,
      body: getTimeUntilText(reminder), // "In 1 hour" or "Tomorrow at 9:00 AM"
      data: { eventId: reminder.event.id },
    },
    trigger: null, // Send immediately (already calculated)
  });
}

function getTimeUntilText(reminder: EventReminder): string {
  const minutes = reminder.offsetMinutes;
  if (minutes === 0) return 'Starting now';
  if (minutes === 5) return 'In 5 minutes';
  if (minutes === 15) return 'In 15 minutes';
  if (minutes === 30) return 'In 30 minutes';
  if (minutes === 60) return 'In 1 hour';
  if (minutes === 1440) return 'Tomorrow';
  if (minutes === 10080) return 'In 1 week';
  return `In ${formatDuration(minutes)}`;
}
```

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| Event time changed | Recalculate all reminder fire times |
| Event deleted | Cascade delete reminders |
| Duplicate reminder times | Prevent adding same time twice |
| Past event | Don't show reminder options |
| All-day event | Calculate based on start of day |
| Timezone change | Recalculate based on new timezone |

---

## Cozi Comparison

| Aspect | Cozi Free | Cozi Gold | Calendara |
|--------|-----------|-----------|-----------|
| Max reminders | 1 | 3 | **5** |
| Custom times | ❌ | ❌ | **✅** |
| Email reminders | ✅ | ✅ | ✅ |
| Push notifications | ✅ | ✅ | ✅ |
| Default settings | ❌ | ❌ | **✅** |

---

## Acceptance Criteria

- [ ] Users can add up to 5 reminders per event
- [ ] Preset time options available (5min, 15min, 1hr, 1 day, etc.)
- [ ] Custom time picker for non-preset times
- [ ] Push notifications delivered on time (±1 minute)
- [ ] Email reminders sent on time
- [ ] Users can set default reminders in settings
- [ ] Reminders sync across devices
- [ ] Reminder badge shows count on event card

---

## Future Enhancements

1. **Smart reminders** - AI suggests based on event type/location
2. **Snooze** - Snooze reminder for 10 min / 1 hour
3. **Location-based** - "Leave now" based on travel time
4. **Family reminders** - Remind specific family members
5. **Escalation** - If not acknowledged, remind again
