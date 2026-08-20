// CLND-506 spike draft — JS surface for the CalendaraEventKit native module.
// Lazy resolution mirrors modules/apple-ads-attribution (jest-safe imports).
import { requireNativeModule, EventEmitter } from 'expo-modules-core';

export type EventIdentity = {
  eventIdentifier: string | null;        // shared across all occurrences of a series
  externalIdentifier: string | null;     // calendarItemExternalIdentifier — cross-device (iCloud); ICS UID for subscribed feeds
  occurrenceDate: string | null;         // the composite-key second half
  startDate: string;
  isDetached: boolean;
  hasRecurrenceRules: boolean;
  recurrenceRule: string | null;
  lastModified: string | null;
  calendarId: string | null;
};

export type CalendarNativeInfo = {
  id: string;
  title: string;
  type: 'local' | 'calDAV' | 'exchange' | 'subscription' | 'birthday' | 'unknown';
  sourceType: 'local' | 'exchange' | 'calDAV' | 'mobileMe' | 'subscribed' | 'birthdays' | 'unknown';
  sourceTitle: string;
  isSubscribed: boolean;
  isImmutable: boolean;
  allowsContentModifications: boolean;
};

type NativeModule = {
  getEventIdentity(calendarIds: string[], startISO: string, endISO: string): Promise<EventIdentity[]>;
  getCalendarNativeInfo(): Promise<CalendarNativeInfo[]>;
  scheduleAppRefresh(identifier: string, earliestSeconds: number): Promise<boolean>;
};

let native: NativeModule | null = null;
function mod(): NativeModule {
  if (!native) native = requireNativeModule('CalendaraEventKit');
  return native!;
}

export const getEventIdentity = (calendarIds: string[], startISO: string, endISO: string) =>
  mod().getEventIdentity(calendarIds, startISO, endISO);
export const getCalendarNativeInfo = () => mod().getCalendarNativeInfo();
export const scheduleAppRefresh = (identifier: string, earliestSeconds: number) =>
  mod().scheduleAppRefresh(identifier, earliestSeconds);

export function addStoreChangedListener(listener: () => void) {
  const emitter = new EventEmitter(requireNativeModule('CalendaraEventKit'));
  return emitter.addListener('onStoreChanged', listener);
}
