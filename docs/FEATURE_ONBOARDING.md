# Feature Spec: iOS Onboarding Flow

> **Last Updated**: February 2026
> **Status**: Ready to Build
> **Effort**: Medium (3-5 days)
> **Priority**: P0 — Pre-App Store Submission
> **Author**: Gustavo + Claude

---

## Problem Statement

After Google OAuth login, Calendara drops users directly into the Home tab with no context, no guidance, and no "aha moment." Users don't understand what makes Calendara different from any other calendar app, never discover the AI photo extraction (our core differentiator), and have no prompt to set up their family — the feature that drives 50%+ better D30 retention. The current flow is: Login → Empty Home Screen. This is leaving retention and activation on the table.

**Evidence**:

- User research shows parents don't even know photo-to-calendar tools exist (awareness gap)
- Competitor analysis: Cozi and TimeTree both guide users through family setup on first run
- Industry data: Users who complete onboarding are 2.6x more likely to remain active at 90 days
- Family apps with 2+ members in the household show 50%+ better 30-day retention
- 77% of users abandon apps within 3 days without proper onboarding

**Cost of not solving**: Low activation rates, poor D7/D30 retention, wasted App Store marketing spend driving installs that churn immediately.

---

## Goals

1. **Time to "aha moment" < 60 seconds** — User sees their family calendar with color-coded members OR sees AI extract events from a photo within the first minute
2. **Onboarding completion rate > 75%** — At least 3 of 4 users complete the core onboarding flow
3. **Family creation rate > 60%** — Most new users create a family during onboarding (vs. discovering it later)
4. **D7 retention improvement > 30%** — Onboarded users retain significantly better than current baseline
5. **Camera permission grant rate > 70%** — Contextual ask during AI demo drives high grant rates

---

## Non-Goals

1. **A/B testing framework** — Not building experiment infrastructure now. Ship one good flow, iterate based on analytics later.
2. **Pre-auth onboarding with anonymous state** — While "auth after value" is ideal long-term, for this version we use a lighter approach: 2-3 static value screens BEFORE the Google OAuth button, then interactive onboarding AFTER auth. This avoids building anonymous/guest user state in Supabase.
3. **Personalization questions** ("How many kids?", "What age?") — Adds complexity for marginal gain at this stage. Defer to v2.
4. **Continuous onboarding (week 2-4 feature drips)** — Great idea, but requires push notification infrastructure (Phase 4). Defer.
5. **Android onboarding** — iOS-first. Android will inherit the same flow when we ship it.

---

## Architecture Decision: Auth Timing

**Decision**: Hybrid approach — Pre-auth value screens + Post-auth interactive onboarding.

**Why not full pre-auth interactive?** Calendara's backend (Supabase) requires authentication for all data operations. Building an anonymous user state, then merging it with a real account, adds 2-3 days of backend work and introduces edge cases (failed merges, duplicate families, orphaned data). Not worth it for v1.

**The hybrid approach**:

```
┌─────────────────────────────────────────────────────────┐
│                    PRE-AUTH (static)                     │
│                                                         │
│  ValueScreen1 → ValueScreen2 → ValueScreen3 → LoginScreen │
│  "For families"  "AI extraction"  "Shared lists"  "Sign in" │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                   POST-AUTH (interactive)                │
│                                                         │
│  FamilySetup → AIDemo → NotificationAsk → Done!         │
│  "Name family,   "Try photo    "Stay in       → Tabs    │
│   add member"    extraction"    the loop"                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

This gives us the "value before commitment" benefit (3 screens showing why Calendara is worth signing up for) while keeping the interactive onboarding simple (authenticated user, real data, no merge logic).

---

## User Stories

### Pre-Auth Flow

**US-1**: As a new user opening the app for the first time, I want to see what makes Calendara special before being asked to sign in, so that I'm motivated to create an account.

**US-2**: As a parent evaluating calendar apps, I want to understand that this is a family-focused app with AI features, so that I can decide if it's worth my time.

### Post-Auth Onboarding

**US-3**: As a newly signed-in user, I want to set up my family with member names and colors, so that my calendar is personalized and ready for sharing from day one.

**US-4**: As a new user, I want to try the AI photo extraction feature during onboarding, so that I experience the app's core differentiator and understand its value.

**US-5**: As a new user, I want to be asked for camera permission with clear context about why, so that I understand the benefit and grant access confidently.

**US-6**: As a returning user, I want to skip onboarding entirely, so that I go straight to my calendar without friction.

**US-7**: As a new user who doesn't want to complete onboarding, I want to skip at any point, so that I can explore the app on my own terms.

---

## Screen-by-Screen Specification

### Screen 0: App Launch (Existing → Modified)

**Current behavior**: App opens → LoginScreen with Google OAuth button.

**New behavior**: App opens → Check `hasCompletedOnboarding` flag in AsyncStorage.
- If `true` → LoginScreen (existing)
- If `false` (or missing) → ValuePagerScreen (new)

**Implementation**: Add check in the root navigator (`AppNavigator` or equivalent auth-state handler).

---

### Screen 1: ValuePagerScreen (NEW — Pre-Auth)

A horizontal pager with 3 slides + a CTA. No authentication required. Pure UI.

**Slide 1 — "Your family calendar, simplified"**
- Hero illustration or Lottie animation: Family members with color-coded dots around a calendar
- Headline: "Your family calendar, simplified"
- Subhead: "See everyone's schedule in one place. Color-coded, always in sync."
- Visual: Show a mock family calendar with colored events (Soccer — blue, Dance — pink, Work — gray busy block)

**Slide 2 — "Snap a photo, skip the typing"**
- Hero: Phone camera pointed at a school flyer → calendar events appearing
- Headline: "Snap a photo, skip the typing"
- Subhead: "Point your camera at any flyer, schedule, or screenshot. AI does the rest."
- Visual: Before/after — flyer image → extracted events list

**Slide 3 — "Lists your whole family can share"**
- Hero: Shopping list with checkmarks, multiple member avatars
- Headline: "Lists your whole family can share"
- Subhead: "Shopping lists, to-dos, and chores — updated in real time for everyone."
- Visual: Shopping list with items being checked off by different colored members

**Bottom CTA (persistent across all slides)**:
- Primary button: "Get Started" (navigates to LoginScreen)
- Secondary text link: "Already have an account? Sign in"
- Page dots indicator (3 dots)

**Skip behavior**: Swiping through all 3 or tapping "Get Started" at any point → LoginScreen.

**Technical notes**:
- Use `react-native-pager-view` or `FlatList` with horizontal paging
- Store illustrations as local assets (no network dependency)
- Animations optional (Lottie) — static illustrations work fine for v1
- No network calls, no auth, pure client-side

**Acceptance Criteria**:
- [ ] 3 slides render with correct content
- [ ] Horizontal swipe navigates between slides
- [ ] Page dots update on swipe
- [ ] "Get Started" navigates to LoginScreen
- [ ] "Already have an account?" navigates to LoginScreen
- [ ] Slide content is accessible (VoiceOver labels)

---

### Screen 2: LoginScreen (EXISTING — Minor Modification)

**Changes**:
- Update headline from "Welcome back" → "Create your account" (for new users coming from onboarding) OR keep "Welcome back" (for returning users)
- Detect via navigation param: `{ isNewUser: true }` → "Create your account" copy
- After successful auth: check if user has a family → if no family, route to `OnboardingFamilySetup`. If has family → route to `Tabs` (normal flow).

**Acceptance Criteria**:
- [ ] New users from onboarding see "Create your account" headline
- [ ] Returning users see "Welcome back" headline
- [ ] After auth, new users (no family) → OnboardingFamilySetup
- [ ] After auth, existing users (has family) → Tabs

---

### Screen 3: OnboardingFamilySetup (NEW — Post-Auth, Interactive)

**Purpose**: Get the user to create their family and add at least one member. This is the single most important activation event for retention.

**Layout**:

```
┌──────────────────────────────────┐
│  Step 1 of 3        [Skip →]    │
│                                  │
│  ┌────────────────────────────┐  │
│  │     👨‍👩‍👧‍👦 (family icon)      │  │
│  └────────────────────────────┘  │
│                                  │
│  Name your family                │
│  This is how it'll appear for    │
│  everyone.                       │
│                                  │
│  ┌────────────────────────────┐  │
│  │ The Jordão Family          │  │
│  └────────────────────────────┘  │
│  (Pre-filled from Google name)   │
│                                  │
│  Your display name               │
│  ┌────────────────────────────┐  │
│  │ Gustavo                    │  │
│  └────────────────────────────┘  │
│                                  │
│  Your color                      │
│  [🔴] [🟠] [🟡] [🟢] [🔵] [🟣]  │
│   ↑ selected                     │
│                                  │
│                                  │
│  ┌────────────────────────────┐  │
│  │    Continue                │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

**Behavior**:
- Pre-fill family name: `"The {lastName} Family"` from Google profile (user can edit)
- Pre-fill display name from Google profile first name
- Show color picker (reuse existing `ColorPicker` component from family flow)
- Auto-select first available color
- "Continue" → Creates family in Supabase (reuse existing `useFamily.createFamily` hook) → navigates to OnboardingAIDemo
- "Skip" → Navigates to OnboardingAIDemo (family creation skipped, can do later from Family tab)

**Data flow**: This screen calls the same family creation API that `FamilyCreateScreen` uses. No new backend work.

**Acceptance Criteria**:
- [ ] Family name pre-filled from Google profile
- [ ] Display name pre-filled from Google first name
- [ ] Color picker shows 12 colors, first auto-selected
- [ ] "Continue" creates family + member in Supabase
- [ ] "Continue" shows loading state during API call
- [ ] Error state displayed if family creation fails
- [ ] "Skip" bypasses family creation, navigates forward
- [ ] Step indicator shows "1 of 3"

---

### Screen 4: OnboardingAIDemo (NEW — Post-Auth, Interactive)

**Purpose**: Let the user experience the AI photo extraction — Calendara's #1 differentiator. This is the "aha moment."

**Layout**:

```
┌──────────────────────────────────┐
│  Step 2 of 3        [Skip →]    │
│                                  │
│  ┌────────────────────────────┐  │
│  │     📸 (sparkles icon)     │  │
│  └────────────────────────────┘  │
│                                  │
│  Turn any photo into events      │
│  Point your camera at a flyer,   │
│  screenshot, or schedule.        │
│                                  │
│  ┌────────────────────────────┐  │
│  │  ┌──────────────────────┐  │  │
│  │  │                      │  │  │
│  │  │  [sample flyer image]│  │  │
│  │  │                      │  │  │
│  │  └──────────────────────┘  │  │
│  │                            │  │
│  │  ✨ 3 events found:        │  │
│  │  📅 Soccer Practice        │  │
│  │     Tue 3:30 PM            │  │
│  │  📅 Parent-Teacher Conf    │  │
│  │     Thu 6:00 PM            │  │
│  │  📅 School Play            │  │
│  │     Fri 7:00 PM            │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │  📷  Try it yourself       │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │    Continue                │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

**Two modes**:

**Mode A — Demo mode (default)**:
- Show a pre-loaded sample image (school flyer) with pre-extracted events
- Animate the extraction: image appears → sparkle animation → events slide in one by one
- This works without camera permission and demonstrates value instantly

**Mode B — Try it yourself**:
- User taps "Try it yourself" → Triggers camera permission request (iOS system dialog)
- If granted → Opens camera (reuse existing `ImageProcessorScreen` flow)
- If denied → Show friendly message: "No worries! You can always use this from the Home screen."
- After extraction completes → Returns to this screen with their real extracted events shown
- Events are saved to their calendar (real data!)

**Camera permission strategy**:
- The system dialog appears ONLY when user taps "Try it yourself" — not automatically
- Context is clear: they just saw a demo of extraction, they understand why camera is needed
- This is the optimal time to ask — right after demonstrating value

**Continue behavior**:
- If they tried extraction → "Continue" (events already saved)
- If they skipped → "Continue" moves to next step
- Step indicator: "2 of 3"

**Acceptance Criteria**:
- [ ] Demo animation plays on screen mount (sample image → extracted events)
- [ ] "Try it yourself" requests camera permission
- [ ] Camera permission granted → opens camera flow
- [ ] Camera permission denied → friendly fallback message
- [ ] Extracted events from "try it" are saved to user's calendar
- [ ] "Skip" and "Continue" both navigate to next screen
- [ ] Demo works without any permissions

---

### Screen 5: OnboardingComplete (NEW — Post-Auth)

**Purpose**: Wrap up, ask for notification permission (contextually), and launch user into the app.

**Layout**:

```
┌──────────────────────────────────┐
│  Step 3 of 3                     │
│                                  │
│  ┌────────────────────────────┐  │
│  │     ✅ (checkmark icon)    │  │
│  └────────────────────────────┘  │
│                                  │
│  You're all set!                 │
│                                  │
│  ┌ Summary Card ──────────────┐  │
│  │ 👨‍👩‍👧 The Jordão Family       │  │
│  │    (or "Set up family later"│  │
│  │     if skipped)             │  │
│  │                            │  │
│  │ 📸 AI extraction ready     │  │
│  │    (or "Camera: not yet"   │  │
│  │     if denied)              │  │
│  │                            │  │
│  │ 📅 X events on calendar    │  │
│  │    (if they tried extract) │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌ Notification Card ─────────┐  │
│  │ 🔔 Never miss a family     │  │
│  │    event                   │  │
│  │                            │  │
│  │ Get a morning summary of   │  │
│  │ today's events for your    │  │
│  │ whole family.              │  │
│  │                            │  │
│  │ [Enable notifications]     │  │
│  │ [Maybe later]              │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │  Go to my calendar  →      │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

**Behavior**:
- Show summary of what was set up (family name if created, events if extracted)
- Notification permission request with clear value prop ("morning summary of family events")
- "Enable notifications" → iOS permission dialog → regardless of result, user can continue
- "Maybe later" → Skip notification permission
- "Go to my calendar" → Sets `hasCompletedOnboarding = true` in AsyncStorage → navigates to `Tabs`

**Notification permission strategy**:
- Contextual ask with clear benefit (morning family digest)
- Not blocking — user can skip
- If push notification infrastructure isn't ready yet (Phase 4), this card can be hidden behind a feature flag

**Acceptance Criteria**:
- [ ] Summary card shows family name (if created) or "Set up later" prompt
- [ ] Summary card shows extraction status
- [ ] "Enable notifications" triggers iOS notification permission dialog
- [ ] Permission result (granted/denied) does not block flow
- [ ] "Maybe later" skips notification permission
- [ ] "Go to my calendar" sets `hasCompletedOnboarding` flag
- [ ] "Go to my calendar" navigates to Tabs (main app)
- [ ] Returning users never see onboarding again

---

## Navigation Changes

### New Navigation Structure

```
RootNavigator (existing)
├── Auth check (existing)
│   ├── Not authenticated:
│   │   ├── hasCompletedOnboarding === false:
│   │   │   └── ValuePagerScreen → LoginScreen
│   │   └── hasCompletedOnboarding === true:
│   │       └── LoginScreen
│   │
│   └── Authenticated:
│       ├── isNewUser (no family, just signed up):
│       │   └── OnboardingStack:
│       │       ├── OnboardingFamilySetup
│       │       ├── OnboardingAIDemo
│       │       └── OnboardingComplete → Tabs
│       │
│       └── Existing user (has family or completed onboarding):
│           └── MainNavigator (existing Tabs + Stack)
```

### New Screens to Register

Add to `MainStackParamList`:

```typescript
// Onboarding screens
OnboardingFamilySetup: undefined;
OnboardingAIDemo: undefined;
OnboardingComplete: {
  familyCreated: boolean;
  familyName?: string;
  eventsExtracted: number;
  cameraGranted: boolean;
};
```

Add to pre-auth navigator:

```typescript
ValuePager: undefined;
```

### AsyncStorage Keys

```typescript
const ONBOARDING_KEYS = {
  HAS_SEEN_VALUE_SCREENS: '@calendara/hasSeenValueScreens',
  HAS_COMPLETED_ONBOARDING: '@calendara/hasCompletedOnboarding',
};
```

---

## New Files to Create

```
src/
├── screens/
│   └── onboarding/
│       ├── index.ts                    # Barrel export
│       ├── ValuePagerScreen.tsx        # Pre-auth: 3 value slides
│       ├── OnboardingFamilySetup.tsx   # Post-auth: Family creation
│       ├── OnboardingAIDemo.tsx        # Post-auth: AI extraction demo
│       └── OnboardingComplete.tsx      # Post-auth: Summary + notifications
├── components/
│   └── onboarding/
│       ├── index.ts
│       ├── ValueSlide.tsx              # Reusable slide component
│       ├── StepIndicator.tsx           # "Step 1 of 3" + progress bar
│       ├── DemoExtractionCard.tsx      # Animated extraction demo
│       └── OnboardingSummaryCard.tsx   # Summary of setup progress
├── lib/
│   └── hooks/
│       └── useOnboarding.ts           # Onboarding state management
└── assets/
    └── onboarding/
        ├── family-calendar.png         # Slide 1 illustration
        ├── photo-extraction.png        # Slide 2 illustration
        ├── shared-lists.png            # Slide 3 illustration
        └── sample-flyer.jpg            # Demo extraction source image
```

---

## Reusable Components (Already Built)

| Component | Location | Used In |
|-----------|----------|---------|
| `Button` | `components/ui/Button` | All screens |
| `Card` | `components/ui/Card` | Summary cards |
| `Icon` | `components/ui/Icon` | Icons throughout |
| `Input` | `components/ui/Input` | Family name input |
| `ColorPicker` | `components/family/ColorPicker` | Color selection |
| `ScreenLayout` | `components/ui/ScreenLayout` | Screen wrapper |
| `useFamily` | `lib/hooks/useFamily` | Family creation |
| `useAuth` | `lib/hooks/useAuth` | Auth state |
| `ImageProcessorScreen` | `screens/processing/` | AI extraction flow |

---

## Implementation Order (3-5 Day Plan)

### Day 0 (Half-Day): PostHog Mobile Analytics Setup

1. Install `posthog-react-native` SDK
2. Create `src/lib/services/posthog.ts` (init with API key)
3. Create `src/lib/services/analytics.ts` (typed event helpers)
4. Wrap app root with `PostHogProvider`
5. Add `identifyUser` call after auth succeeds
6. Add basic `mobile_app_opened` and `mobile_screen_viewed` events
7. Verify events appear in PostHog dashboard

### Day 1: Foundation + Value Screens

1. Create `useOnboarding` hook (AsyncStorage read/write for onboarding state)
2. Build `ValueSlide` component (reusable slide with image, headline, subhead)
3. Build `ValuePagerScreen` with 3 slides + CTA
4. Update root navigator to check onboarding state
5. Create placeholder illustrations (can be refined later)

### Day 2: Family Setup Screen

1. Build `StepIndicator` component
2. Build `OnboardingFamilySetup` screen
3. Wire up to existing `useFamily.createFamily` hook
4. Pre-fill from Google profile data
5. Add skip behavior

### Day 3: AI Demo Screen

1. Build `DemoExtractionCard` component (animated demo with sample data)
2. Build `OnboardingAIDemo` screen
3. Wire "Try it yourself" to camera permission + existing ImageProcessor
4. Handle permission granted/denied states

### Day 4: Completion Screen + Integration

1. Build `OnboardingComplete` screen
2. Add notification permission request
3. Wire full navigation flow end-to-end
4. Test: New user flow (no family → onboarding → tabs)
5. Test: Returning user flow (has family → skip onboarding → tabs)
6. Test: Skip at each step

### Day 5: Polish + Testing

1. Refine illustrations/animations
2. Add accessibility labels (VoiceOver)
3. Edge cases: offline, API failures, back navigation
4. Write tests for `useOnboarding` hook
5. Write tests for navigation routing logic

---

## Success Metrics

### Leading Indicators (measure at launch)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Onboarding completion rate | > 75% | % of users who reach OnboardingComplete |
| Family creation during onboarding | > 60% | % of users who create family (not skip) |
| AI demo engagement | > 40% | % who tap "Try it yourself" |
| Camera permission grant rate | > 70% | Of those who tap "Try it", % who grant |
| Notification permission grant rate | > 50% | Of those who see the ask, % who grant |
| Time through onboarding | < 90 seconds | Median time from ValuePager to Tabs |
| Step drop-off rate | < 15% per step | % abandoning at each screen |

### Lagging Indicators (measure at 30 days)

| Metric | Target | Measurement |
|--------|--------|-------------|
| D1 retention (onboarded) | > 50% | % returning next day |
| D7 retention (onboarded) | > 30% | % returning within 7 days |
| D30 retention (onboarded) | > 20% | % returning within 30 days |
| Events extracted per user (week 1) | > 3 | Avg extraction count |
| Family invite rate (week 1) | > 25% | % who invite a family member |

---

## Open Questions

| Question | Owner | Blocking? |
|----------|-------|-----------|
| Do we have illustrations/assets for value screens, or should we use icons? | Design/Gustavo | No — can ship with icons first, refine later |
| Is push notification infrastructure ready enough to request permission? | Engineering | No — can hide behind feature flag |
| Should the demo use a real AI extraction call on the sample image, or mock data? | Engineering | No — mock is fine for v1, more reliable |
| ~~Do we want analytics events?~~ **YES — PostHog SDK integration is now a Day 0 prerequisite.** See Analytics section. | Engineering | **Yes — blocking** |
| Should "Skip" at family setup still count as "onboarding complete"? | Product | Yes — decide before building |

---

## Analytics — PostHog Integration (REQUIRED)

### Current State: No Mobile Analytics

The mobile app has **zero analytics instrumentation**. No PostHog SDK, no event tracking, nothing. The existing PostHog project only receives web app events (`auth_google_signin_success`, `user_registered`, `files_extraction_started`, etc.). Without mobile analytics, we cannot measure whether onboarding works, where users drop off, or basic retention.

**This is a Day 0 prerequisite** — PostHog must be integrated before building any onboarding screens.

### Step 1: Install PostHog React Native SDK

```bash
cd CalendaraMobile
npm install posthog-react-native
```

### Step 2: Initialize PostHog Provider

**File**: `src/lib/services/posthog.ts`

```typescript
import PostHog from 'posthog-react-native';

export const posthog = new PostHog(
  '<YOUR_POSTHOG_API_KEY>',  // From PostHog project settings
  {
    host: 'https://us.i.posthog.com',  // or eu.i.posthog.com
    enableSessionReplay: false,  // Not needed for mobile v1
  }
);
```

**File**: Wrap app root with `PostHogProvider` in `App.tsx` or equivalent:

```typescript
import { PostHogProvider } from 'posthog-react-native';
import { posthog } from './src/lib/services/posthog';

// Inside your app component:
<PostHogProvider client={posthog}>
  <NavigationContainer>
    {/* ... */}
  </NavigationContainer>
</PostHogProvider>
```

### Step 3: Create Analytics Helper

**File**: `src/lib/services/analytics.ts`

```typescript
import { posthog } from './posthog';

// ── Onboarding Events ──────────────────────────────────────

export const analytics = {
  // Pre-auth value screens
  onboardingValueScreenViewed: (screen: 1 | 2 | 3) =>
    posthog.capture('onboarding_value_screen_viewed', { screen }),

  onboardingValueScreenCompleted: () =>
    posthog.capture('onboarding_value_screen_completed'),

  // Family setup (post-auth step 1)
  onboardingFamilySetupStarted: () =>
    posthog.capture('onboarding_family_setup_started'),

  onboardingFamilySetupCompleted: (familyName: string, memberCount: number) =>
    posthog.capture('onboarding_family_setup_completed', {
      family_name: familyName,
      member_count: memberCount,
    }),

  onboardingFamilySetupSkipped: () =>
    posthog.capture('onboarding_family_setup_skipped'),

  // AI demo (post-auth step 2)
  onboardingAIDemoViewed: () =>
    posthog.capture('onboarding_ai_demo_viewed'),

  onboardingAIDemoTried: () =>
    posthog.capture('onboarding_ai_demo_tried'),

  onboardingCameraPermission: (granted: boolean) =>
    posthog.capture('onboarding_camera_permission', { granted }),

  onboardingExtractionCompleted: (eventCount: number) =>
    posthog.capture('onboarding_extraction_completed', { event_count: eventCount }),

  onboardingAIDemoSkipped: () =>
    posthog.capture('onboarding_ai_demo_skipped'),

  // Completion (post-auth step 3)
  onboardingNotificationsAsked: () =>
    posthog.capture('onboarding_notifications_asked'),

  onboardingNotificationsResult: (granted: boolean) =>
    posthog.capture('onboarding_notifications_result', { granted }),

  onboardingCompleted: (props: {
    family_created: boolean;
    ai_demo_tried: boolean;
    camera_granted: boolean;
    notifications_granted: boolean;
    total_time_ms: number;
  }) => posthog.capture('onboarding_completed', props),

  // ── Identify user after auth ───────────────────────────────
  identifyUser: (userId: string, properties: {
    email?: string;
    name?: string;
    platform: 'ios' | 'android';
  }) => posthog.identify(userId, properties),
};
```

### Step 4: PostHog Events to Create (for dashboards)

These are the events that will flow into your PostHog project. Use them to build an **Onboarding Funnel** insight:

| Event Name | Properties | Fired When |
|------------|-----------|------------|
| `onboarding_value_screen_viewed` | `{ screen: 1\|2\|3 }` | Each value slide becomes visible |
| `onboarding_value_screen_completed` | — | User taps "Get Started" |
| `onboarding_family_setup_started` | — | Family setup screen mounts |
| `onboarding_family_setup_completed` | `{ family_name, member_count }` | Family created successfully |
| `onboarding_family_setup_skipped` | — | User taps "Skip" |
| `onboarding_ai_demo_viewed` | — | AI demo screen mounts |
| `onboarding_ai_demo_tried` | — | User taps "Try it yourself" |
| `onboarding_camera_permission` | `{ granted: bool }` | Camera permission result |
| `onboarding_extraction_completed` | `{ event_count: number }` | AI extraction finishes |
| `onboarding_ai_demo_skipped` | — | User taps "Skip" on AI demo |
| `onboarding_notifications_asked` | — | Notification dialog shown |
| `onboarding_notifications_result` | `{ granted: bool }` | Notification permission result |
| `onboarding_completed` | `{ family_created, ai_demo_tried, camera_granted, notifications_granted, total_time_ms }` | User taps "Go to my calendar" |

### Step 5: PostHog Dashboard — Onboarding Funnel

After events are flowing, create this funnel insight in PostHog:

```
Funnel steps:
1. onboarding_value_screen_viewed (screen=1)
2. onboarding_value_screen_completed
3. onboarding_family_setup_started
4. onboarding_family_setup_completed OR onboarding_family_setup_skipped
5. onboarding_ai_demo_viewed
6. onboarding_completed
```

This will show exactly where users drop off in the onboarding flow, with conversion rates between each step.

**Additional insights to create**:
- **Trend**: `onboarding_completed` over time (daily new completions)
- **Trend**: `onboarding_family_setup_completed` vs `onboarding_family_setup_skipped` (family creation rate)
- **Trend**: `onboarding_camera_permission` broken down by `granted` property (camera grant rate)
- **Retention**: Users who fired `onboarding_completed` — D1/D7/D30 retention
- **Comparison**: Retention of users with `family_created=true` vs `family_created=false`

### Bonus: Core Mobile Events (While We're At It)

Since there's no mobile analytics at all, also instrument these foundational events alongside onboarding. These are needed for basic product health:

```typescript
// Add to analytics.ts — ship these with the PostHog integration

// Auth
'mobile_auth_started'              // { method: 'google' }
'mobile_auth_completed'            // { method: 'google', is_new_user: bool }

// Core actions
'mobile_event_created'             // { source: 'manual' | 'ai_extraction' }
'mobile_event_edited'              // { event_id }
'mobile_extraction_started'        // { source: 'camera' | 'gallery' | 'share_extension' }
'mobile_extraction_completed'      // { event_count, model_used }
'mobile_list_created'              // { type: 'shopping' | 'todo' }
'mobile_list_item_added'           // { list_type }
'mobile_family_member_invited'     // { method: 'email' | 'link' }

// Navigation
'mobile_tab_switched'              // { tab: 'home' | 'calendar' | 'lists' | 'family' }
'mobile_screen_viewed'             // { screen_name }

// App lifecycle
'mobile_app_opened'                // { is_first_launch: bool }
'mobile_app_backgrounded'          // {}
```

---

## Design Guidelines

Follow the existing Calendara design system:

- **Primary color**: `#c96442` (Coral) for CTAs and accents
- **Font**: Manrope (Regular, Medium, SemiBold, Bold)
- **Border radius**: `12px` for cards, `16px` for buttons
- **Min touch target**: 44px (iOS HIG)
- **Spacing**: Use theme spacing tokens (sm=8, md=12, lg=16, xl=20, xxl=24)
- **Background**: `#F2F2F7` for screen, `#FFFFFF` for cards
- **Illustrations**: Warm, friendly style. Show diverse family configurations. Use the coral accent color in illustrations to maintain brand consistency.

---

## Appendix: Competitive Reference

| App | Onboarding Steps | Pre-Auth? | Family Setup? | Demo? |
|-----|-----------------|-----------|---------------|-------|
| Cozi | 6+ screens | No | Yes (first run) | No |
| TimeTree | 3 screens | No | Minimal | No |
| FamilyWall | 4 screens | No | Yes (roles) | No |
| Google Calendar | None | No | N/A | No |
| Fantastical | 2 screens | No | N/A | Yes (NLP) |
| **Calendara (proposed)** | **3 pre-auth + 3 post-auth** | **Yes** | **Yes** | **Yes (AI)** |

Calendara's onboarding will be the most complete in the family calendar category — showing value before sign-up, demonstrating the AI differentiator, AND setting up family context. No competitor does all three.
