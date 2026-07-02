# Feature: Daily Agenda Emails

> **Priority**: 1 (Core)
> **Status**: To Build
> **Cozi Comparison**: "Cozi Today" is a beloved feature

---

## Overview

Automated daily email sent each morning to family members with the day's schedule. Cozi calls this "Cozi Today" and users love it - it's often cited as a key reason people stick with Cozi.

---

## User Stories

1. **As a parent**, I want to receive a morning email with today's schedule so I know what's happening without opening the app
2. **As a family member**, I want to customize when I receive the daily email
3. **As a parent**, I want to opt my kids in/out of receiving the daily email
4. **As a user**, I want to see a week summary on Sundays to plan ahead

---

## Design Specifications

### Email Template - Daily

```
Subject: Your Calendara Day - Tuesday, January 28

┌─────────────────────────────────────────────────────┐
│                     📅 Calendara                    │
│                                                     │
│           Good morning, [FirstName]!                │
│                                                     │
│              Tuesday, January 28                    │
│                 3 events today                      │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  TODAY'S SCHEDULE                                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ● 9:00 AM   Soccer Practice                       │
│              Sarah · Lincoln Park                   │
│                                                     │
│  ● 2:00 PM   Dentist Appointment                   │
│              Jake · Dr. Smith's Office              │
│                                                     │
│  ● 6:00 PM   Family Dinner                         │
│              Everyone · Home                        │
│                                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  COMING UP                                          │
├─────────────────────────────────────────────────────┤
│  Tomorrow:  2 events                                │
│  Thursday:  1 event                                 │
│  Friday:    3 events                                │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                                                     │
│              [ Open Calendara ]                     │
│                                                     │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  You're receiving this because you're part of the  │
│  [Family Name] family on Calendara.                │
│                                                     │
│  Manage email preferences | Unsubscribe            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Email Template - Weekly Summary (Sunday)

```
Subject: Your Week Ahead - Jan 26 - Feb 1

┌─────────────────────────────────────────────────────┐
│           📅 Your Week with Calendara              │
│                                                     │
│              Jan 26 - Feb 1, 2026                   │
│              12 events this week                    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  WEEK AT A GLANCE                                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Sunday 26     ─────────────────────────            │
│                No events                            │
│                                                     │
│  Monday 27     ─────────────────────────            │
│  ● 9:00 AM     Team Meeting                        │
│  ● 3:00 PM     Piano Lesson - Sarah                │
│                                                     │
│  Tuesday 28    ─────────────────────────            │
│  ● 9:00 AM     Soccer Practice                     │
│  ● 2:00 PM     Dentist - Jake                      │
│  ● 6:00 PM     Family Dinner                       │
│                                                     │
│  ... (continued for full week)                     │
│                                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  BUSIEST DAY: Tuesday (3 events)                   │
│  WHO'S BUSIEST: Sarah (5 events this week)         │
└─────────────────────────────────────────────────────┘
```

### Settings UI

```
┌─────────────────────────────────────────────────────┐
│  Daily Agenda Emails                                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Receive daily agenda          [Toggle ON]         │
│                                                     │
│  Delivery time                                      │
│  [ 7:00 AM ▼ ]                                     │
│                                                     │
│  Weekly summary (Sundays)      [Toggle ON]         │
│                                                     │
│  Include events for:                                │
│  [✓] All family members                            │
│  [ ] Only my events                                │
│  [ ] Selected members...                           │
│                                                     │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  Send test email                                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Technical Approach

### Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Supabase   │────▶│  Edge Func   │────▶│   SendGrid   │
│   Database   │     │  (Cron Job)  │     │   / Resend   │
└──────────────┘     └──────────────┘     └──────────────┘
                            │
                     Runs at each hour
                     (5am, 6am, 7am, 8am)
                            │
                     ┌──────▼──────┐
                     │ Query users │
                     │ with that   │
                     │ send time   │
                     └─────────────┘
```

### Database Schema

```sql
-- User email preferences
CREATE TABLE email_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  daily_agenda_enabled BOOLEAN DEFAULT true,
  weekly_summary_enabled BOOLEAN DEFAULT true,
  send_time TIME DEFAULT '07:00',
  timezone TEXT DEFAULT 'America/New_York',
  include_all_family BOOLEAN DEFAULT true,
  selected_member_ids UUID[] DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email send log (for debugging/analytics)
CREATE TABLE email_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  email_type TEXT, -- 'daily' | 'weekly'
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT, -- 'sent' | 'failed' | 'bounced'
  event_count INT
);
```

### Cron Job Logic

```typescript
// Runs every hour at :00
async function sendDailyAgendas() {
  const currentHour = new Date().getUTCHours();

  // Find users whose local time matches their preferred send time
  const users = await supabase
    .from('email_preferences')
    .select('*, user:users(*), family:families(*)')
    .eq('daily_agenda_enabled', true)
    .filter('send_time_utc', 'eq', currentHour);

  for (const user of users) {
    const events = await getEventsForDate(user.family_id, new Date());
    const html = renderDailyEmail(user, events);

    await sendEmail({
      to: user.email,
      subject: `Your Calendara Day - ${formatDate(new Date())}`,
      html
    });
  }
}
```

### Email Service Options

| Service | Pros | Cons | Cost |
|---------|------|------|------|
| **Resend** | Modern API, React Email support | Newer | Free tier, then $20/mo |
| **SendGrid** | Battle-tested, reliable | Complex | Free 100/day |
| **Postmark** | Great deliverability | Pricier | $15/mo for 10k |
| **AWS SES** | Cheapest at scale | Complex setup | $0.10/1000 |

**Recommendation**: Start with Resend for modern DX and React Email templates.

---

## Email Template (React Email)

```tsx
// emails/DailyAgenda.tsx
import { Html, Head, Body, Container, Section, Text, Button } from '@react-email/components';

interface DailyAgendaProps {
  firstName: string;
  date: string;
  events: Event[];
  upcomingDays: { date: string; count: number }[];
}

export function DailyAgenda({ firstName, date, events, upcomingDays }: DailyAgendaProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>📅 Calendara</Text>
            <Text style={greeting}>Good morning, {firstName}!</Text>
            <Text style={dateText}>{date}</Text>
            <Text style={eventCount}>{events.length} events today</Text>
          </Section>

          <Section style={scheduleSection}>
            <Text style={sectionTitle}>TODAY'S SCHEDULE</Text>
            {events.map(event => (
              <EventRow key={event.id} event={event} />
            ))}
          </Section>

          <Button href="https://app.calendara.com" style={ctaButton}>
            Open Calendara
          </Button>
        </Container>
      </Body>
    </Html>
  );
}
```

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| No events today | Send anyway with "Nothing scheduled - enjoy your day!" |
| User in different timezone | Store and respect user's timezone |
| Email bounces | Log and disable after 3 bounces |
| Family member leaves | Remove from email list |
| New member joins | Default to receiving emails |

---

## Cozi Comparison

| Aspect | Cozi | Calendara |
|--------|------|-----------|
| Daily email | ✅ "Cozi Today" | ✅ |
| Weekly summary | ✅ | ✅ |
| Customizable time | ❌ Fixed time | ✅ User chooses |
| Filter by person | ❌ | ✅ |
| Design | Dated | Modern, branded |

---

## Acceptance Criteria

- [ ] Users can enable/disable daily agenda emails
- [ ] Users can choose their preferred delivery time
- [ ] Emails are delivered within 5 minutes of scheduled time
- [ ] Events are correctly grouped by date
- [ ] Family member colors appear in email
- [ ] Weekly summary sent on Sundays
- [ ] Unsubscribe link works
- [ ] Emails render correctly in Gmail, Apple Mail, Outlook

---

## Future Enhancements

1. **Push notifications** - In addition to email
2. **Smart timing** - Send earlier on busy days
3. **Personalized insights** - "You have 3 back-to-back meetings"
4. **Weather integration** - Include weather for outdoor events
5. **Travel time** - "Leave by 8:30 AM for 9:00 meeting"
