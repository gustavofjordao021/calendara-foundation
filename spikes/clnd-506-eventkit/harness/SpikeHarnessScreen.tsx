// CLND-506 spike harness — on-device EventKit probes.
//
// Drop this file into calendara-ios (e.g. src/screens/dev/SpikeHarnessScreen.tsx),
// `npx expo install expo-calendar`, add NSCalendarsFullAccessUsageDescription +
// NSCalendarsUsageDescription to app.config.js ios.infoPlist, prebuild, and mount
// the screen behind a dev-only route. Run on a REAL device signed into iCloud
// (Simulator has a calendar store but no iCloud/subscription calendars).
//
// Answers spike must-resolves #1 (recurring identifiers), #4 (subscription
// detectability), #5 (lastModifiedDate semantics — run twice, hours apart),
// #8 (write-back source pinning). Results render on screen and can be shared
// as JSON for the design note.

import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Calendar from 'expo-calendar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SCRATCH_CAL = 'CLND506 Spike';
const SNAPSHOT_KEY = 'clnd506_lastmodified_snapshot';

type Section = { title: string; lines: string[] };

async function ensurePermission(): Promise<string> {
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  return status;
}

// ---------- Probe 4: enumerate calendars — subscription/birthday detectability ----------
async function probeCalendars(): Promise<Section> {
  const lines: string[] = [];
  const cals = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  for (const c of cals) {
    lines.push(
      `${c.title} | type=${String((c as any).type)} | source=${c.source?.name}(${String(c.source?.type)}) ` +
        `| writable=${String(c.allowsModifications)}`
    );
    // Dump every serialized key once, so we see whether ANY field leaks a feed URL.
    lines.push(`  keys: ${Object.keys(c).join(', ')}`);
    const suspect = JSON.stringify(c).match(/https?:\/\/[^"]+|webcal:[^"]+/g);
    if (suspect) lines.push(`  !! URL-ish content found: ${suspect.join(' ')}`);
  }
  lines.push('');
  lines.push('CHECK MANUALLY: does your old "Calendara" webcal subscription appear above?');
  lines.push('If yes: note its type/source strings — that is our exclusion key.');
  return { title: 'P4 · Calendars (subscription/birthday detectability)', lines };
}

// ---------- Probe 8: sources + calendar creation pinning ----------
async function probeSources(): Promise<Section> {
  const lines: string[] = [];
  const sources = await (Calendar as any).getSourcesAsync();
  for (const s of sources) lines.push(`source: ${s.name} | type=${String(s.type)} | id=${s.id}`);
  const def = await Calendar.getDefaultCalendarAsync();
  lines.push(`default calendar: ${def.title} | source=${def.source?.name}(${String(def.source?.type)})`);

  // Attempt creation in the iCloud CalDAV source first, then local — the decision-4 chain.
  const icloud = sources.find((s: any) => String(s.type) === 'caldav' && /icloud/i.test(s.name ?? ''));
  const local = sources.find((s: any) => String(s.type) === 'local');
  for (const [label, src] of [
    ['iCloud CalDAV', icloud],
    ['local', local],
  ] as const) {
    if (!src) {
      lines.push(`create in ${label}: source not present on this device`);
      continue;
    }
    try {
      const id = await Calendar.createCalendarAsync({
        title: `${SCRATCH_CAL} (${label})`,
        color: '#EB5757',
        entityType: Calendar.EntityTypes.EVENT,
        sourceId: src.id,
        name: `${SCRATCH_CAL} (${label})`,
        ownerAccount: 'calendara',
        accessLevel: (Calendar as any).CalendarAccessLevel?.OWNER,
      });
      lines.push(`create in ${label}: OK (id=${id})`);
      lines.push(`  CHECK MANUALLY: open Apple Calendar — is "${SCRATCH_CAL} (${label})" visible? Does it survive 5 min with iCloud on?`);
    } catch (e: any) {
      lines.push(`create in ${label}: FAILED — ${e?.message ?? e}`);
    }
  }
  return { title: 'P8 · Sources + write-back pinning', lines };
}

// ---------- Probe 1: recurring identifiers + expansion shape ----------
async function probeRecurring(): Promise<Section> {
  const lines: string[] = [];
  const cals = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  const scratch = cals.find((c) => c.title.startsWith(SCRATCH_CAL) && c.allowsModifications);
  if (!scratch) return { title: 'P1 · Recurring identifiers', lines: ['Run P8 first (needs the scratch calendar).'] };

  const start = new Date();
  start.setHours(10, 0, 0, 0);
  const end = new Date(start.getTime() + 3600_000);
  const eventId = await Calendar.createEventAsync(scratch.id, {
    title: 'CLND506 weekly probe',
    startDate: start,
    endDate: end,
    recurrenceRule: { frequency: (Calendar as any).Frequency.WEEKLY, occurrence: 8 },
  });
  lines.push(`created weekly x8 series, createEventAsync returned id=${eventId}`);

  const windowEnd = new Date(start.getTime() + 70 * 86400_000);
  const events = await Calendar.getEventsAsync([scratch.id], start, windowEnd);
  const mine = events.filter((e) => e.title === 'CLND506 weekly probe');
  const ids = new Set(mine.map((e) => e.id));
  lines.push(`range query returned ${mine.length} occurrences, ${ids.size} distinct id(s)`);
  lines.push(ids.size === 1 ? '=> CONFIRMED: occurrences share one identifier (composite key or master model REQUIRED)' : '=> UNEXPECTED: distinct per-occurrence ids — report back!');
  const first = mine[0] as any;
  if (first) {
    lines.push(`occurrence fields: ${Object.keys(first).join(', ')}`);
    lines.push(`recurrenceRule readable: ${JSON.stringify(first.recurrenceRule ?? null)}`);
    lines.push(`originalStartDate: ${String(first.originalStartDate ?? 'ABSENT')} | isDetached: ${String(first.isDetached ?? 'ABSENT')}`);
  }
  // Single-occurrence delete addressing (feeds CLND-512's occurrence semantics).
  if (mine.length > 1) {
    try {
      await Calendar.deleteEventAsync(mine[1].id, { instanceStartDate: (mine[1] as any).startDate } as any);
      const after = (await Calendar.getEventsAsync([scratch.id], start, windowEnd)).filter((e) => e.title === 'CLND506 weekly probe');
      lines.push(`deleted occurrence #2 via instanceStartDate → ${after.length} occurrences remain (expect ${mine.length - 1})`);
    } catch (e: any) {
      lines.push(`single-occurrence delete FAILED — ${e?.message ?? e}`);
    }
  }
  return { title: 'P1 · Recurring identifiers + expansion', lines };
}

// ---------- Probe 5: lastModifiedDate semantics (run twice, hours apart) ----------
async function probeLastModified(): Promise<Section> {
  const lines: string[] = [];
  const cals = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  const readable = cals.filter((c) => !c.title.startsWith(SCRATCH_CAL));
  const now = new Date();
  const events = await Calendar.getEventsAsync(
    readable.map((c) => c.id),
    new Date(now.getTime() - 30 * 86400_000),
    new Date(now.getTime() + 30 * 86400_000)
  );
  const current: Record<string, string> = {};
  for (const e of events as any[]) if (e.id && e.lastModifiedDate) current[`${e.id}@${e.startDate}`] = String(e.lastModifiedDate);
  lines.push(`snapshotted lastModifiedDate for ${Object.keys(current).length} events across ${readable.length} calendars`);

  const prevRaw = await AsyncStorage.getItem(SNAPSHOT_KEY);
  if (prevRaw) {
    const prev = JSON.parse(prevRaw) as Record<string, string>;
    const changed = Object.keys(current).filter((k) => prev[k] && prev[k] !== current[k]);
    lines.push(`vs previous run: ${changed.length} events changed lastModifiedDate`);
    lines.push('If YOU did not edit those events, EventKit bumps timestamps on its own —');
    lines.push('the LWW tolerance in CLND-514 must absorb this. List:');
    for (const k of changed.slice(0, 10)) lines.push(`  ${k}: ${prev[k]} -> ${current[k]}`);
  } else {
    lines.push('First run — snapshot saved. Re-run in a few hours (and after toggling iCloud sync) to diff.');
  }
  await AsyncStorage.setItem(SNAPSHOT_KEY, JSON.stringify(current));

  // Self-bump check: our own write — does lastModifiedDate move on create+update?
  const scratch = cals.find((c) => c.title.startsWith(SCRATCH_CAL) && c.allowsModifications);
  if (scratch) {
    const id = await Calendar.createEventAsync(scratch.id, {
      title: 'CLND506 lm probe',
      startDate: new Date(now.getTime() + 86400_000),
      endDate: new Date(now.getTime() + 86400_000 + 3600_000),
    });
    const read1 = (await Calendar.getEventAsync(id)) as any;
    await Calendar.updateEventAsync(id, { notes: 'edited' });
    const read2 = (await Calendar.getEventAsync(id)) as any;
    lines.push(`own-write lastModifiedDate: created=${read1.lastModifiedDate} afterEdit=${read2.lastModifiedDate}`);
  }
  return { title: 'P5 · lastModifiedDate semantics', lines };
}

// ---------- Cleanup ----------
async function cleanup(): Promise<Section> {
  const lines: string[] = [];
  const cals = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  for (const c of cals.filter((c) => c.title.startsWith(SCRATCH_CAL))) {
    await Calendar.deleteCalendarAsync(c.id);
    lines.push(`deleted ${c.title}`);
  }
  await AsyncStorage.removeItem(SNAPSHOT_KEY);
  return { title: 'Cleanup', lines: lines.length ? lines : ['nothing to clean'] };
}

export default function SpikeHarnessScreen() {
  const [sections, setSections] = useState<Section[]>([]);
  const [busy, setBusy] = useState(false);

  const run = async (fn: () => Promise<Section>) => {
    setBusy(true);
    try {
      const status = await ensurePermission();
      if (status !== 'granted') {
        setSections((s) => [...s, { title: 'Permission', lines: [`status=${status} — grant full calendar access in Settings`] }]);
        return;
      }
      const section = await fn();
      setSections((s) => [...s, section]);
    } catch (e: any) {
      setSections((s) => [...s, { title: 'ERROR', lines: [String(e?.message ?? e)] }]);
    } finally {
      setBusy(false);
    }
  };

  const shareAll = () =>
    Share.share({ message: JSON.stringify(sections, null, 2), title: 'CLND-506 spike results' });

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.h1}>CLND-506 EventKit spike harness</Text>
        <View style={styles.row}>
          <Btn label="P4 calendars" onPress={() => run(probeCalendars)} disabled={busy} />
          <Btn label="P8 sources" onPress={() => run(probeSources)} disabled={busy} />
          <Btn label="P1 recurring" onPress={() => run(probeRecurring)} disabled={busy} />
          <Btn label="P5 lastModified" onPress={() => run(probeLastModified)} disabled={busy} />
          <Btn label="Cleanup" onPress={() => run(cleanup)} disabled={busy} />
          <Btn label="Share JSON" onPress={shareAll} disabled={!sections.length} />
        </View>
        {sections.map((s, i) => (
          <View key={i} style={styles.card}>
            <Text style={styles.h2}>{s.title}</Text>
            {s.lines.map((l, j) => (
              <Text key={j} style={styles.mono}>
                {l}
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function Btn({ label, onPress, disabled }: { label: string; onPress: () => void; disabled?: boolean }) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} style={[styles.btn, disabled && { opacity: 0.4 }]}>
      <Text style={styles.btnText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 16, paddingBottom: 64 },
  h1: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  h2: { fontSize: 15, fontWeight: '600', marginBottom: 6 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  btn: { backgroundColor: '#EB5757', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  card: { backgroundColor: '#F6F4F1', borderRadius: 10, padding: 12, marginBottom: 12 },
  mono: { fontFamily: 'Menlo', fontSize: 11, marginBottom: 2 },
});
