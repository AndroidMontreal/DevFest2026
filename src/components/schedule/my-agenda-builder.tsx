'use client';

import { TalkAbstractControl } from '@/components/common/talk-abstract-control';
import { getTalkAbstract } from '@/lib/talk-abstracts';
import {
  AlertTriangle,
  ArrowDownUp,
  ArrowRight,
  CalendarPlus,
  Check,
  Clock,
  Coffee,
  Compass,
  Copy,
  DoorOpen,
  Lock,
  MapPin,
  Mic,
  PartyPopper,
  Plus,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Star,
  Trash2,
  Utensils,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import {
  getCategoryBadgeClass,
  getLevelBadgeClass,
  renderSpeakersWithParens,
  type RoomSessionItem,
  type RoomTrack,
} from './room-agenda-section';
import type { TronMapFocusRequest } from './tron-space-navigator';

export type FlatSession = {
  id: string;
  roomId: string;
  worldCode: string;
  roomName: string;
  floor: '03' | '04';
  mapNodeId: string;
  seats: number;
  roomAccent: 'yellow' | 'blue' | 'red' | 'green';
  session: RoomSessionItem;
  startMin: number;
  endMin: number;
};

type TimeSlotBucket = {
  id: string;
  label: string;
  startMin: number;
  endMin: number;
};

const BREAKOUT_SLOTS: TimeSlotBucket[] = [
  { id: 'slot-1015', label: '10:15 – 11:00', startMin: 615, endMin: 660 },
  { id: 'slot-1115', label: '11:15 – 12:00', startMin: 675, endMin: 720 },
  { id: 'slot-1300', label: '13:00 – 13:45', startMin: 780, endMin: 825 },
  { id: 'slot-1400', label: '14:00 – 14:45', startMin: 840, endMin: 885 },
  { id: 'slot-1500', label: '15:00 – 15:45', startMin: 900, endMin: 945 },
  { id: 'slot-1600', label: '16:00 – 16:45', startMin: 960, endMin: 1005 },
];

const ROOM_TO_MAP_NODE: Record<
  string,
  { floor: '03' | '04'; nodeId: string; seats: number }
> = {
  '3-1': { floor: '03', nodeId: 'l3-room-1', seats: 75 },
  '3-3': { floor: '03', nodeId: 'l3-room-3', seats: 2 },
  '3-4': { floor: '03', nodeId: 'l3-room-4', seats: 20 },
  '3-5': { floor: '03', nodeId: 'l3-room-5', seats: 25 },
  '4-2': { floor: '04', nodeId: 'l4-room-2', seats: 2 },
  '4-3': { floor: '04', nodeId: 'l4-room-3', seats: 2 },
  '4-4': { floor: '04', nodeId: 'l4-room-4', seats: 40 },
  '4-5': { floor: '04', nodeId: 'l4-room-5', seats: 40 },
  '4-6': { floor: '04', nodeId: 'l4-room-6', seats: 91 },
  '4-7': { floor: '04', nodeId: 'l4-room-7', seats: 2 },
};

export function makeSessionId(roomId: string, time: string): string {
  return `${roomId}__${time.replace(/\s+/g, '')}`;
}

export function parseTimeRangeToMinutes(timeStr: string): {
  startMin: number;
  endMin: number;
} {
  const parts = timeStr.split(/[–-]/).map((s) => s.trim());
  const parsePart = (hm: string, fallback: number) => {
    const m = hm.match(/(\d{1,2}):(\d{2})/);
    if (!m) return fallback;
    return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
  };
  const startMin = parsePart(parts[0] || '', 600);
  const endMin = parsePart(parts[1] || '', startMin + 45);
  return { startMin, endMin };
}

export function sessionsOverlap(
  a: { startMin: number; endMin: number },
  b: { startMin: number; endMin: number },
): boolean {
  return a.startMin < b.endMin && b.startMin < a.endMin;
}

export function flattenRoomSessions(rooms: RoomTrack[]): FlatSession[] {
  const result: FlatSession[] = [];
  for (const room of rooms) {
    const meta = ROOM_TO_MAP_NODE[room.id] || {
      floor: room.id.startsWith('4') ? '04' : '03',
      nodeId: room.id.startsWith('4') ? 'l4-room-4' : 'l3-room-1',
      seats: 40,
    };
    for (const session of room.sessions) {
      if (session.kind === 'lunch') continue;
      const { startMin, endMin } = parseTimeRangeToMinutes(session.time);
      result.push({
        id: makeSessionId(room.id, session.time),
        roomId: room.id,
        worldCode: room.worldCode,
        roomName: room.name,
        floor: meta.floor,
        mapNodeId: meta.nodeId,
        seats: meta.seats,
        roomAccent: room.accent,
        session,
        startMin,
        endMin,
      });
    }
  }
  return result;
}

type MyAgendaBuilderProps = {
  rooms: RoomTrack[];
  savedIds: string[];
  primaryOverrides: Record<string, string>;
  onToggleSession: (sessionId: string) => void;
  onSetPrimaryForSlot: (slotId: string, sessionId: string) => void;
  onLoadPreset?: (sessionIds: string[]) => void;
  onClearAll: () => void;
  onFocusMapRoute: (req: Omit<TronMapFocusRequest, 'seq'>) => void;
  onBrowseRoom: (roomId: string) => void;
  locale?: string;
};

export function MyAgendaBuilder({
  rooms,
  savedIds,
  primaryOverrides,
  onToggleSession,
  onSetPrimaryForSlot,
  onClearAll,
  onFocusMapRoute,
  onBrowseRoom,
  locale = 'en',
}: MyAgendaBuilderProps) {
  const isFr = locale === 'fr';
  const [copiedShareUrl, setCopiedShareUrl] = useState(false);

  const allFlatSessions = flattenRoomSessions(rooms);

  const savedSessions = allFlatSessions
    .filter((s) => savedIds.includes(s.id))
    .sort(
      (a, b) => a.startMin - b.startMin || a.roomId.localeCompare(b.roomId),
    );

  // Map each breakout slot to matching or overlapping saved sessions
  const slotAssignments = BREAKOUT_SLOTS.map((slot) => {
    const overlappingSaved = savedSessions.filter((s) =>
      sessionsOverlap(
        { startMin: s.startMin, endMin: s.endMin },
        { startMin: slot.startMin, endMin: slot.endMin },
      ),
    );

    const preferredPrimaryId = primaryOverrides[slot.id];
    const primarySession =
      overlappingSaved.find((s) => s.id === preferredPrimaryId) ||
      overlappingSaved[0] ||
      null;

    const backupSessions = overlappingSaved.filter(
      (s) => s.id !== primarySession?.id,
    );

    // Check if primary session actually started in an EARLIER slot (e.g., 90-min workshop in 4-6)
    const isContinuationOfLongSession =
      primarySession !== null && primarySession.startMin < slot.startMin - 10;

    // Available regular talks/workshops in this slot (excluding 1:1 coaching pods which require prior RSVP)
    const availableConferencesInSlot = allFlatSessions.filter(
      (s) =>
        s.session.kind !== 'open' &&
        s.roomAccent !== 'green' &&
        sessionsOverlap(
          { startMin: s.startMin, endMin: s.endMin },
          { startMin: slot.startMin, endMin: slot.endMin },
        ),
    );

    return {
      slot,
      overlappingSaved,
      primarySession,
      backupSessions,
      isContinuationOfLongSession,
      hasConflict: overlappingSaved.length > 1,
      availableConferencesInSlot,
    };
  });

  const totalConflicts = slotAssignments.filter((sa) => sa.hasConflict).length;
  const floorHopsCount = (() => {
    let hops = 0;
    let prevFloor: '03' | '04' = '03'; // Opening keynote is on 03
    for (const sa of slotAssignments) {
      if (sa.primarySession) {
        if (sa.primarySession.floor !== prevFloor) {
          hops++;
          prevFloor = sa.primarySession.floor;
        }
      }
    }
    if (prevFloor !== '03') hops++; // Return to 03 for closing keynote
    return hops;
  })();

  const handleCopyShareLink = () => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.set('room', 'my-agenda');
    if (savedIds.length > 0) {
      url.searchParams.set('plan', savedIds.join(','));
    } else {
      url.searchParams.delete('plan');
    }
    const priEntries = Object.entries(primaryOverrides)
      .filter(([, sessId]) => savedIds.includes(sessId))
      .map(([slotKey, sessId]) => `${slotKey}=${sessId}`);
    if (priEntries.length > 0) {
      url.searchParams.set('pri', priEntries.join(','));
    } else {
      url.searchParams.delete('pri');
    }
    navigator.clipboard.writeText(url.toString());
    setCopiedShareUrl(true);
    setTimeout(() => setCopiedShareUrl(false), 2500);
  };

  // Determine whether a saved session is a Backup in any slot so .ics labels it clearly
  const backupSessionIds = new Set(
    slotAssignments.flatMap((sa) => sa.backupSessions.map((b) => b.id)),
  );
  const conflictPrimaryIds = new Set(
    slotAssignments
      .filter((sa) => sa.hasConflict && sa.primarySession)
      .map((sa) => sa.primarySession!.id),
  );

  const handleExportIcs = () => {
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//GDG Montreal//DevFest Montreal 2026 Agenda//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
    ];

    const toIcsTime = (minFromMidnight: number) => {
      const hh = String(Math.floor(minFromMidnight / 60)).padStart(2, '0');
      const mm = String(minFromMidnight % 60).padStart(2, '0');
      return `20261106T${hh}${mm}00`;
    };

    // Always include the 4 locked core events (Registration/Breakfast, Opening Keynote, Lunch & Raffle, Closing Keynote) + ALL selected sessions
    const morningSaved = savedSessions.filter((s) => s.startMin < 720);
    const afternoonSaved = savedSessions.filter((s) => s.startMin >= 720);

    const mapSessionToIcsEvent = (s: FlatSession) => {
      const isBackup =
        backupSessionIds.has(s.id) && !conflictPrimaryIds.has(s.id);
      const isConflictPrimary = conflictPrimaryIds.has(s.id);
      const rolePrefix = isBackup
        ? isFr
          ? '[Plan B] '
          : '[Backup] '
        : isConflictPrimary
          ? isFr
            ? '[Principal] '
            : '[Primary] '
          : '';

      return {
        uid: `devfest2026-${s.id}`,
        startMin: s.startMin,
        endMin: s.endMin,
        summary: `${rolePrefix}${s.session.title} (World ${s.worldCode})`,
        location: `World ${s.worldCode} · ${s.roomName} (Level ${s.floor} · Ax.c Hub)`,
        description: [
          isBackup
            ? isFr
              ? 'Statut : Plan B / Session alternative dans Mon Agenda'
              : 'Status: Backup / Plan B session in My Agenda'
            : isConflictPrimary
              ? isFr
                ? 'Statut : Choix Principal dans Mon Agenda'
                : 'Status: Primary Choice in My Agenda'
              : '',
          s.session.speakers ? `Speakers: ${s.session.speakers}` : '',
          s.session.categories && s.session.categories.length > 0
            ? `Categories: ${s.session.categories.join(', ')}`
            : '',
          s.session.level ? `Level: ${s.session.level}` : '',
          s.session.duration ? `Duration: ${s.session.duration}` : '',
          s.session.lang ? `Language: ${s.session.lang}` : '',
        ]
          .filter(Boolean)
          .join('\\n'),
      };
    };

    const events = [
      {
        uid: 'devfest2026-registration-breakfast',
        startMin: 510, // 08:30
        endMin: 570, // 09:30
        summary: isFr
          ? 'DevFest MTL: Enregistrement, Café & Déjeuner'
          : 'DevFest MTL: Registration, Coffee & Breakfast',
        location: 'Level 03 · Registration (R) & Le Parquet (Ax.c Hub)',
        description: isFr
          ? 'Accueil des participants, remise des badges, café et déjeuner.'
          : 'Attendee check-in, badge pickup, coffee and breakfast.',
      },
      {
        uid: 'devfest2026-keynote-open',
        startMin: 565, // 09:25
        endMin: 600, // 10:00
        summary: isFr
          ? "DevFest MTL: Conférence d'ouverture (Opening Keynote)"
          : 'DevFest MTL: Opening Keynote',
        location: "World 3-1 · Don't Stop Believin' (Level 03 · Ax.c Hub)",
        description: 'Main Stage Opening Keynote at Ax.c Hub Montreal.',
      },
      ...morningSaved.map(mapSessionToIcsEvent),
      {
        uid: 'devfest2026-lunch-raffle',
        startMin: 720, // 12:00
        endMin: 780, // 13:00
        summary: isFr
          ? 'DevFest MTL: Dîner, Réseautage & Tirage (Lunch & Raffle)'
          : 'DevFest MTL: Lunch, Networking & Raffle',
        location:
          'Level 03 (Le Parquet) & Level 04 (Le Square) · Ax.c Hub Montreal',
        description: isFr
          ? 'Repas inclus sur les étages 3 et 4 et tirage de prix.'
          : 'Catering included on Levels 03 & 04 plus raffle prizes.',
      },
      ...afternoonSaved.map(mapSessionToIcsEvent),
      {
        uid: 'devfest2026-keynote-close',
        startMin: 1020, // 17:00
        endMin: 1110, // 18:30
        summary: isFr
          ? 'DevFest MTL: Mot de la fin, tirages et 5 à 7'
          : 'DevFest MTL: Closing Keynote, Raffles & 5 à 7',
        location: "World 3-1 · Don't Stop Believin' (Level 03 · Ax.c Hub)",
        description: 'Closing Keynote, Raffles & 5 à 7 Networking.',
      },
    ];

    for (const ev of events) {
      lines.push(
        'BEGIN:VEVENT',
        `UID:${ev.uid}@devfest-montreal-2026`,
        `DTSTAMP:20261013T120000Z`,
        `DTSTART;TZID=America/Toronto:${toIcsTime(ev.startMin)}`,
        `DTEND;TZID=America/Toronto:${toIcsTime(ev.endMin)}`,
        `SUMMARY:${ev.summary.replace(/,/g, '\\,')}`,
        `LOCATION:${ev.location.replace(/,/g, '\\,')}`,
        `DESCRIPTION:${ev.description.replace(/,/g, '\\,')}`,
        'END:VEVENT',
      );
    }

    lines.push('END:VCALENDAR');
    const blob = new Blob([lines.join('\r\n')], {
      type: 'text/calendar;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'devfest-montreal-2026-my-agenda.ics';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper to render Floor-Hop or Same-Floor transition badge between two locations
  const renderTransitionConnector = (
    fromLabel: string,
    fromFloor: '03' | '04',
    fromNodeId: string,
    toLabel: string,
    toFloor: '03' | '04',
    toNodeId: string,
    breakLabel?: string,
  ) => {
    const isFloorHop = fromFloor !== toFloor;
    const isSameRoom = fromNodeId === toNodeId;

    if (isSameRoom) {
      return (
        <div className="my-2 flex items-center gap-2.5 pl-4 sm:pl-8 font-mono-tech text-[11px] uppercase tracking-wider text-emerald-300/80">
          <div className="h-5 w-0.5 bg-emerald-400/40" />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1">
            <Check className="h-3 w-3 text-emerald-400" />
            <span>
              {isFr
                ? `Même salle · Restez dans ${toLabel} (Niveau ${toFloor})`
                : `Same Room · Stay in ${toLabel} (Level ${toFloor})`}
            </span>
          </span>
        </div>
      );
    }

    if (isFloorHop) {
      const goingUp = fromFloor === '03' && toFloor === '04';
      return (
        <div className="my-3 relative overflow-hidden rounded-xl border border-fuchsia-400/45 bg-gradient-to-r from-fuchsia-950/50 via-[#0d1428]/90 to-cyan-950/40 p-3 sm:px-4 sm:py-3 shadow-[0_0_25px_rgba(217,70,239,0.12)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
            <div className="flex items-start sm:items-center gap-3">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-fuchsia-400/60 bg-fuchsia-500/20 text-fuchsia-200 shadow-[0_0_12px_rgba(217,70,239,0.4)]">
                <ArrowDownUp className="h-4 w-4" />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono-tech text-[11px] font-bold uppercase tracking-widest text-fuchsia-300">
                    {goingUp
                      ? isFr
                        ? '⬆️ CHANGEMENT D’ÉTAGE : NIVEAU 03 → NIVEAU 04'
                        : '⬆️ FLOOR HOP: LEVEL 03 → LEVEL 04'
                      : isFr
                        ? '⬇️ CHANGEMENT D’ÉTAGE : NIVEAU 04 → NIVEAU 03'
                        : '⬇️ FLOOR HOP: LEVEL 04 → LEVEL 03'}
                  </span>
                  {breakLabel && (
                    <span className="rounded border border-white/15 bg-white/5 px-2 py-0.5 font-mono-tech text-[10px] text-white/60">
                      {breakLabel}
                    </span>
                  )}
                </div>
                <p className="font-sans text-xs text-white/70 mt-0.5">
                  {isFr
                    ? `De ${fromLabel} vers ${toLabel} via le Grand Escalier ou les Ascenseurs.`
                    : `Transit from ${fromLabel} to ${toLabel} via Grand Stairs or Main Elevators.`}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0 pl-11 md:pl-0">
              <button
                type="button"
                onClick={() =>
                  onFocusMapRoute({
                    floor: toFloor,
                    originNodeId: toFloor === '04' ? 'l4-stairs' : 'l3-stairs',
                    destinationNodeId: toNodeId,
                    labelEn: `Floor Hop Arrival: Grand Stairs (Level ${toFloor}) → ${toLabel}`,
                    labelFr: `Arrivée Niveau ${toFloor} : Grand Escalier → ${toLabel}`,
                  })
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-fuchsia-400/60 bg-fuchsia-500/20 hover:bg-fuchsia-400 hover:text-black px-3 py-1.5 font-mono-tech text-[11px] font-bold uppercase tracking-wider text-fuchsia-200 transition-all cursor-pointer"
              >
                <Compass className="h-3.5 w-3.5" />
                <span>
                  {isFr
                    ? `Carte Niv. ${toFloor} (Escalier → ${toLabel})`
                    : `Level ${toFloor} Map (Stairs → ${toLabel})`}
                </span>
              </button>
              <button
                type="button"
                onClick={() =>
                  onFocusMapRoute({
                    floor: fromFloor,
                    originNodeId: fromNodeId,
                    destinationNodeId:
                      fromFloor === '03' ? 'l3-stairs' : 'l4-stairs',
                    labelEn: `Floor Hop Departure: ${fromLabel} → Grand Stairs (Level ${fromFloor})`,
                    labelFr: `Départ Niveau ${fromFloor} : ${fromLabel} → Grand Escalier`,
                  })
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 hover:border-cyan-400/60 hover:text-cyan-200 px-2.5 py-1.5 font-mono-tech text-[10px] uppercase tracking-wider text-white/70 transition-all cursor-pointer"
              >
                <span>
                  {isFr
                    ? `Départ Niv. ${fromFloor}`
                    : `Exit Level ${fromFloor}`}
                </span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Same floor, different room
    return (
      <div className="my-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-cyan-400/25 bg-cyan-950/20 px-4 py-2.5">
        <div className="flex items-center gap-2.5 font-mono-tech text-[11px] text-cyan-200">
          <ArrowRight className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
          <span>
            {isFr
              ? `TRANSIT NIVEAU ${toFloor} : ${fromLabel} → ${toLabel}`
              : `LEVEL ${toFloor} CORRIDOR: ${fromLabel} → ${toLabel}`}
          </span>
        </div>
        <button
          type="button"
          onClick={() =>
            onFocusMapRoute({
              floor: toFloor,
              originNodeId: fromNodeId,
              destinationNodeId: toNodeId,
              labelEn: `Level ${toFloor} Corridor Route: ${fromLabel} → ${toLabel}`,
              labelFr: `Trajet Niveau ${toFloor} : ${fromLabel} → ${toLabel}`,
            })
          }
          className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/40 bg-cyan-400/10 hover:bg-cyan-400 hover:text-black px-3 py-1 font-mono-tech text-[10px] font-bold uppercase tracking-wider text-cyan-200 transition-all cursor-pointer"
        >
          <Compass className="h-3 w-3" />
          <span>{isFr ? 'Voir trajet TRON' : 'Trace Corridor Route'}</span>
        </button>
      </div>
    );
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-cyan-400/35 bg-[#060a15]/95 p-4 sm:p-6 md:p-10 shadow-[0_0_60px_rgba(0,240,255,0.09)] backdrop-blur-2xl">
      {/* Top Laser Line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

      {/* Header HUD & Stats Bar */}
      <div className="mb-8 flex flex-col xl:flex-row xl:items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 font-mono-tech text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
              <Sparkles className="h-3 w-3" />
              <span>
                {isFr
                  ? 'SANS CONNEXION · SAUVEGARDE LOCALE & LIEN'
                  : 'NO LOGIN REQUIRED · SAVED IN BROWSER & URL'}
              </span>
            </span>

            {totalConflicts > 0 ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/50 bg-amber-500/15 px-3 py-1 font-mono-tech text-[10px] font-bold uppercase tracking-wider text-amber-300">
                <AlertTriangle className="h-3 w-3" />
                <span>
                  {isFr
                    ? `${totalConflicts} créneau(x) multi-sessions (Principal + Plan B)`
                    : `${totalConflicts} Multi-Session Slot(s) (Primary + Backup)`}
                </span>
              </span>
            ) : savedSessions.length > 0 ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3 py-1 font-mono-tech text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                <Check className="h-3 w-3" />
                <span>
                  {isFr ? 'Aucun conflit horaire' : 'Zero Time Conflicts'}
                </span>
              </span>
            ) : null}
          </div>

          <h3 className="mt-3 font-display text-2xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight text-white">
            {isFr ? 'Mon Agenda Personnalisé' : 'My Custom Agenda'}
          </h3>
          <p className="mt-1 font-sans text-xs sm:text-sm text-white/60 max-w-2xl">
            {isFr
              ? 'Choisissez votre conférence dans le menu déroulant pour chaque créneau horaire, gérez vos plans B et visualisez vos trajets entre les étages 3 et 4 sur la carte TRON.'
              : 'Pick your conference from the drop down for each time slot, manage Backup (Plan B) talks, and trace Floor-Hop routes between Floors 3 & 4 on the TRON Map.'}
          </p>
        </div>

        {/* Action Buttons: Shareable Link + Export .ICS (All Selected Sessions) + Reset */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleCopyShareLink}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/50 bg-cyan-400/15 hover:bg-cyan-400 hover:text-black px-4 py-2.5 font-mono-tech text-xs font-bold uppercase tracking-wider text-cyan-200 transition-all cursor-pointer"
          >
            {copiedShareUrl ? (
              <>
                <Check className="h-4 w-4" />
                <span>
                  {isFr ? 'Lien partageable copié !' : 'Shareable Link Copied!'}
                </span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>
                  {isFr ? 'Copier le lien partageable' : 'Copy Shareable Link'}
                </span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleExportIcs}
            className="inline-flex items-center gap-2 rounded-xl border border-google-yellow/50 bg-google-yellow/15 hover:bg-google-yellow hover:text-black px-4 py-2.5 font-mono-tech text-xs font-bold uppercase tracking-wider text-google-yellow transition-all cursor-pointer"
          >
            <CalendarPlus className="h-4 w-4" />
            <span>
              {isFr
                ? `Exporter (.ics · ${4 + savedSessions.length} événements)`
                : `Export Calendar (.ics · ${4 + savedSessions.length} events)`}
            </span>
          </button>

          {savedSessions.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-400/35 bg-rose-500/10 hover:bg-rose-500/25 px-3.5 py-2.5 font-mono-tech text-xs uppercase tracking-wider text-rose-300 transition-all cursor-pointer"
              title={
                isFr
                  ? 'Réinitialiser mes choix de conférences (les 4 moments clés restent verrouillés)'
                  : 'Reset conference picks (the 4 core events stay locked)'
              }
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{isFr ? 'Réinitialiser' : 'Reset Picks'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="mb-8 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-white/10 bg-[#0b1124]/90 p-3.5">
          <span className="block font-mono-tech text-[10px] uppercase tracking-widest text-white/45">
            {isFr ? 'Événements à mon agenda' : 'Selected in My Agenda'}
          </span>
          <div className="mt-1 flex flex-wrap items-baseline gap-2">
            <span className="font-display text-2xl sm:text-3xl font-bold text-cyan-300">
              {4 + savedSessions.length}
            </span>
            <span className="font-mono-tech text-[10px] uppercase text-google-yellow/85">
              {isFr
                ? `(4 verrouillés + ${savedSessions.length} conf.)`
                : `(4 locked + ${savedSessions.length} talks)`}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#0b1124]/90 p-3.5">
          <span className="block font-mono-tech text-[10px] uppercase tracking-widest text-white/45">
            {isFr ? 'Changements 3e↔4e' : 'Floor Hops (3↔4)'}
          </span>
          <span className="mt-1 block font-display text-2xl sm:text-3xl font-bold text-fuchsia-300">
            {floorHopsCount}
          </span>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#0b1124]/90 p-3.5">
          <span className="block font-mono-tech text-[10px] uppercase tracking-widest text-white/45">
            {isFr ? 'Créneaux à choisir' : 'Open Time Slots'}
          </span>
          <span className="mt-1 block font-display text-2xl sm:text-3xl font-bold text-emerald-300">
            {
              slotAssignments.filter((sa) => sa.overlappingSaved.length === 0)
                .length
            }
            <span className="text-sm text-white/40 font-mono-tech"> / 6</span>
          </span>
        </div>
      </div>

      {/* ==================== FULL-DAY PERSONALIZED TIMELINE ==================== */}
      <div className="space-y-4">
        {/* 08:30 - 09:30 BREAKFAST & REGISTRATION (ALWAYS SELECTED & LOCKED) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border-2 border-google-yellow/45 bg-[#0e152a]/95 px-5 py-4 shadow-[0_0_22px_rgba(251,188,4,0.08)]">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-google-yellow/40 bg-google-yellow/15">
              <Coffee className="h-5 w-5 text-google-yellow" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-google-yellow px-2.5 py-0.5 font-mono-tech text-[10px] font-bold uppercase tracking-wider text-black">
                  <Lock className="h-3 w-3" />
                  <span>
                    {isFr ? 'SÉLECTIONNÉ · VERROUILLÉ' : 'SELECTED · LOCKED'}
                  </span>
                </span>
                <span className="font-mono-tech text-xs sm:text-sm font-bold text-google-yellow">
                  08:30 – 09:30
                </span>
                <span className="rounded border border-white/15 bg-white/5 px-2 py-0.5 font-mono-tech text-[10px] uppercase text-white/70">
                  {isFr ? 'Niveau 03 · Accueil (R)' : 'Level 03 · Check-in (R)'}
                </span>
              </div>
              <h4 className="mt-1 font-display text-base sm:text-lg font-bold text-white">
                {isFr
                  ? 'Enregistrement, Café & Déjeuner'
                  : 'Registration, Coffee & Breakfast'}
              </h4>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center shrink-0">
            <button
              type="button"
              onClick={() =>
                onFocusMapRoute({
                  floor: '03',
                  originNodeId: 'l3-elevators',
                  destinationNodeId: 'l3-reg',
                  labelEn:
                    'Arrival Check-In: Main Elevators → Registration Desk (R)',
                  labelFr:
                    'Arrivée : Ascenseurs → Accueil & Enregistrement (R)',
                })
              }
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 hover:border-cyan-400/50 hover:text-cyan-200 px-3 py-1.5 font-mono-tech text-[10px] uppercase tracking-wider text-white/75 transition-all cursor-pointer"
            >
              <MapPin className="h-3 w-3 text-cyan-400" />
              <span>
                {isFr ? 'Localiser Accueil (R)' : 'Locate Check-In (R)'}
              </span>
            </button>
            <span
              title={
                isFr
                  ? 'Toujours inclus dans votre agenda (ne peut pas être retiré)'
                  : 'Always selected in My Agenda (cannot be removed)'
              }
              className="inline-flex items-center gap-1 rounded-lg border border-emerald-400/40 bg-emerald-500/15 px-2.5 py-1.5 font-mono-tech text-[10px] font-bold uppercase tracking-wider text-emerald-300 select-none"
            >
              <Check className="h-3.5 w-3.5" />
              <Lock className="h-3 w-3 opacity-80" />
            </span>
          </div>
        </div>

        {/* 09:25 - 10:00 OPENING KEYNOTE (ALWAYS SELECTED & LOCKED) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border-2 border-google-yellow/55 bg-google-yellow/[0.09] px-5 py-4 shadow-[0_0_25px_rgba(251,188,4,0.1)]">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-google-yellow/40 bg-google-yellow/20">
              <Mic className="h-5 w-5 text-google-yellow" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-google-yellow px-2.5 py-0.5 font-mono-tech text-[10px] font-bold uppercase tracking-wider text-black">
                  <Lock className="h-3 w-3" />
                  <span>
                    {isFr ? 'SÉLECTIONNÉ · VERROUILLÉ' : 'SELECTED · LOCKED'}
                  </span>
                </span>
                <span className="font-mono-tech text-xs sm:text-sm font-bold text-google-yellow">
                  09:25 – 10:00
                </span>
                <span className="rounded border border-google-yellow/35 bg-google-yellow/15 px-2 py-0.5 font-mono-tech text-[10px] font-bold uppercase text-google-yellow">
                  {isFr
                    ? "Monde 3-1 · Don't Stop Believin' · Niv. 03"
                    : "World 3-1 · Don't Stop Believin' · Level 03"}
                </span>
              </div>
              <h4 className="mt-1 font-display text-base sm:text-lg font-bold text-white">
                {isFr
                  ? "Conférence d'ouverture (Opening Keynote)"
                  : 'Opening Keynote — Main Stage'}
              </h4>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center shrink-0">
            <button
              type="button"
              onClick={() =>
                onFocusMapRoute({
                  floor: '03',
                  originNodeId: 'l3-reg',
                  destinationNodeId: 'l3-room-1',
                  labelEn:
                    "Opening Keynote Route: Registration (R) → World 3-1 (Don't Stop Believin')",
                  labelFr:
                    "Vers la Keynote : Accueil (R) → Monde 3-1 (Don't Stop Believin')",
                })
              }
              className="inline-flex items-center gap-1.5 rounded-lg border border-google-yellow/40 bg-google-yellow/10 hover:bg-google-yellow hover:text-black px-3 py-1.5 font-mono-tech text-[10px] font-bold uppercase tracking-wider text-google-yellow transition-all cursor-pointer"
            >
              <Compass className="h-3.5 w-3.5" />
              <span>{isFr ? 'Trajet vers 3-1' : 'Route to 3-1'}</span>
            </button>
            <span
              title={
                isFr
                  ? 'Toujours inclus dans votre agenda (ne peut pas être retiré)'
                  : 'Always selected in My Agenda (cannot be removed)'
              }
              className="inline-flex items-center gap-1 rounded-lg border border-emerald-400/40 bg-emerald-500/15 px-2.5 py-1.5 font-mono-tech text-[10px] font-bold uppercase tracking-wider text-emerald-300 select-none"
            >
              <Check className="h-3.5 w-3.5" />
              <Lock className="h-3 w-3 opacity-80" />
            </span>
          </div>
        </div>

        {/* BREAKOUT SLOTS + LUNCH + TRANSITIONS */}
        {slotAssignments.map((sa, idx) => {
          const {
            slot,
            primarySession,
            backupSessions,
            isContinuationOfLongSession,
            hasConflict,
            availableConferencesInSlot,
          } = sa;

          // Determine previous location for Floor-Hop / Corridor transition
          const prevSlotAssignment = idx > 0 ? slotAssignments[idx - 1] : null;
          let prevFloor: '03' | '04' = '03';
          let prevNodeId = 'l3-room-1';
          let prevLabel = "World 3-1 (Don't Stop Believin')";

          if (idx === 0) {
            prevFloor = '03';
            prevNodeId = 'l3-room-1';
            prevLabel = 'World 3-1 (Opening Keynote)';
          } else if (prevSlotAssignment?.primarySession) {
            prevFloor = prevSlotAssignment.primarySession.floor;
            prevNodeId = prevSlotAssignment.primarySession.mapNodeId;
            prevLabel = `World ${prevSlotAssignment.primarySession.worldCode} (${prevSlotAssignment.primarySession.roomName})`;
          }

          const unselectedConferences = availableConferencesInSlot.filter(
            (c) => !savedIds.includes(c.id),
          );

          return (
            <div key={slot.id} className="space-y-3">
              {/* Insert Lunch & Raffle Banner before 13:00 slot (idx === 2) — ALWAYS SELECTED & LOCKED */}
              {idx === 2 && (
                <div className="my-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border-2 border-google-yellow/55 bg-gradient-to-r from-google-yellow/15 via-google-yellow/[0.08] to-cyan-500/10 px-5 py-4 shadow-[0_0_25px_rgba(251,188,4,0.1)]">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-google-yellow/40 bg-google-yellow/20">
                      <Utensils className="h-5 w-5 text-google-yellow" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-google-yellow px-2.5 py-0.5 font-mono-tech text-[10px] font-bold uppercase tracking-wider text-black">
                          <Lock className="h-3 w-3" />
                          <span>
                            {isFr
                              ? 'SÉLECTIONNÉ · VERROUILLÉ'
                              : 'SELECTED · LOCKED'}
                          </span>
                        </span>
                        <span className="font-mono-tech text-xs sm:text-sm font-bold text-google-yellow">
                          12:00 – 13:00
                        </span>
                        <span className="rounded border border-google-yellow/40 bg-google-yellow/15 px-2 py-0.5 font-mono-tech text-[10px] font-bold uppercase text-google-yellow">
                          {isFr
                            ? 'Repas inclus · Étage 3 & Étage 4'
                            : 'Catering Included · Level 03 & Level 04'}
                        </span>
                      </div>
                      <h4 className="mt-1 font-display text-base sm:text-lg font-bold text-white">
                        {isFr
                          ? 'Dîner, Réseautage & Tirage (Lunch & Raffle)'
                          : 'Lunch, Networking & Raffle'}
                      </h4>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-start sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        onFocusMapRoute({
                          floor: '03',
                          originNodeId:
                            prevFloor === '03' ? prevNodeId : 'l3-stairs',
                          destinationNodeId: 'l3-dining',
                          labelEn: 'Lunch Area (Level 03 Le Parquet Dining)',
                          labelFr: 'Zone repas (Niveau 03 Le Parquet)',
                        })
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-google-yellow/40 bg-google-yellow/10 hover:bg-google-yellow hover:text-black px-3 py-1.5 font-mono-tech text-[10px] font-bold uppercase tracking-wider text-google-yellow transition-all cursor-pointer"
                    >
                      <MapPin className="h-3 w-3" />
                      <span>{isFr ? 'Repas Niv. 03' : '3F Dining'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onFocusMapRoute({
                          floor: '04',
                          originNodeId:
                            prevFloor === '04' ? prevNodeId : 'l4-stairs',
                          destinationNodeId: 'l4-dining',
                          labelEn: 'Lunch Area (Level 04 Le Square Dining)',
                          labelFr: 'Zone repas (Niveau 04 Le Square)',
                        })
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/40 bg-cyan-400/10 hover:bg-cyan-400 hover:text-black px-3 py-1.5 font-mono-tech text-[10px] font-bold uppercase tracking-wider text-cyan-200 transition-all cursor-pointer"
                    >
                      <MapPin className="h-3 w-3" />
                      <span>{isFr ? 'Repas Niv. 04' : '4F Dining'}</span>
                    </button>
                    <span
                      title={
                        isFr
                          ? 'Toujours inclus dans votre agenda (ne peut pas être retiré)'
                          : 'Always selected in My Agenda (cannot be removed)'
                      }
                      className="inline-flex items-center gap-1 rounded-lg border border-emerald-400/40 bg-emerald-500/15 px-2.5 py-1.5 font-mono-tech text-[10px] font-bold uppercase tracking-wider text-emerald-300 select-none"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <Lock className="h-3 w-3 opacity-80" />
                    </span>
                  </div>
                </div>
              )}

              {/* Transition Connector from Previous Session/Keynote (if not a continuation of the same 90-min workshop) */}
              {primarySession &&
                !isContinuationOfLongSession &&
                (idx === 0 || prevSlotAssignment?.primarySession) &&
                renderTransitionConnector(
                  prevLabel,
                  prevFloor,
                  prevNodeId,
                  `World ${primarySession.worldCode} (${primarySession.roomName})`,
                  primarySession.floor,
                  primarySession.mapNodeId,
                  idx === 2 ? 'After Lunch' : '15 min break',
                )}

              {/* SLOT CARD */}
              <div
                className={`rounded-2xl border p-4 sm:p-5 transition-all ${
                  hasConflict
                    ? 'border-amber-400/50 bg-[#121324]/95 shadow-[0_0_25px_rgba(251,191,36,0.1)]'
                    : primarySession
                      ? 'border-cyan-400/35 bg-[#0b1224]/95'
                      : 'border-dashed border-white/20 bg-[#080d1a]/80'
                }`}
              >
                {/* Slot Header Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 font-mono-tech text-xs sm:text-sm font-bold text-cyan-200">
                      <Clock className="h-3.5 w-3.5 text-cyan-400" />
                      <span>{slot.label}</span>
                    </span>

                    {hasConflict && (
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400/50 bg-amber-500/15 px-2.5 py-1 font-mono-tech text-[10px] font-bold uppercase tracking-wider text-amber-300">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <span>
                          {isFr
                            ? 'Multi-sessions : 1 Principal + Plan(s) B'
                            : 'Multi-Session: 1 Primary + Backup(s)'}
                        </span>
                      </span>
                    )}

                    {isContinuationOfLongSession && primarySession && (
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-rose-400/50 bg-rose-500/15 px-2.5 py-1 font-mono-tech text-[10px] font-bold uppercase tracking-wider text-rose-300">
                        <Zap className="h-3.5 w-3.5" />
                        <span>
                          {isFr
                            ? `Suite de l'atelier 90 min (${primarySession.session.time})`
                            : `Part 2 of 90-Min Workshop (${primarySession.session.time})`}
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                {/* CASE 1: HAS SAVED SESSION(S) IN THIS SLOT */}
                {primarySession ? (
                  <div className="space-y-3">
                    {/* Primary Session Card */}
                    <div className="rounded-xl border border-cyan-400/40 bg-[#101935]/90 p-4">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-cyan-400 px-2.5 py-0.5 font-mono-tech text-[10px] font-bold uppercase tracking-wider text-black">
                              <Star className="h-3 w-3 fill-black" />
                              <span>
                                {isFr ? 'CHOIX PRINCIPAL' : 'PRIMARY CHOICE'}
                              </span>
                            </span>

                            <button
                              type="button"
                              onClick={() => {
                                if (!primarySession.id.startsWith('special-')) {
                                  onBrowseRoom(primarySession.roomId);
                                }
                              }}
                              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 hover:border-cyan-400 px-2.5 py-0.5 font-mono-tech text-[11px] font-bold uppercase text-cyan-300 transition-colors cursor-pointer"
                            >
                              <DoorOpen className="h-3 w-3" />
                              <span>
                                World {primarySession.worldCode} ·{' '}
                                {primarySession.roomName}
                              </span>
                              <span className="text-white/40">
                                (Level {primarySession.floor})
                              </span>
                            </button>

                            <span className="rounded border border-white/15 bg-white/5 px-2 py-0.5 font-mono-tech text-[10px] text-google-yellow">
                              {primarySession.session.time} (
                              {primarySession.session.duration || '45 MIN'})
                            </span>

                            {primarySession.session.lang && (
                              <span className="rounded border border-cyan-300/40 bg-cyan-950/40 px-2 py-0.5 font-mono-tech text-[10px] text-cyan-200">
                                {primarySession.session.lang}
                              </span>
                            )}

                            {/* Small Room Capacity Alert (20-25 seats in 3-4 and 3-5) */}
                            {primarySession.seats <= 25 && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/50 bg-amber-500/15 px-2.5 py-0.5 font-mono-tech text-[10px] font-semibold text-amber-300">
                                <ShieldAlert className="h-3 w-3" />
                                <span>
                                  {isFr
                                    ? `Salle compacte (${primarySession.seats} places) — Arrivez 10 min d'avance`
                                    : `Compact Room (${primarySession.seats} seats) — Arrive 10m early`}
                                </span>
                              </span>
                            )}
                          </div>

                          <TalkAbstractControl
                            title={primarySession.session.title}
                            abstractText={getTalkAbstract(
                              primarySession.session.title,
                              primarySession.session.abstract,
                            )}
                            isFr={isFr}
                            titleClassName="font-display text-base sm:text-lg font-bold text-white leading-snug hover:text-cyan-100 transition-colors"
                          />

                          {primarySession.session.speakers && (
                            <p className="font-mono-tech text-xs uppercase tracking-wider text-cyan-400">
                              {renderSpeakersWithParens(
                                primarySession.session.speakers,
                              )}
                            </p>
                          )}

                          {((primarySession.session.categories &&
                            primarySession.session.categories.length > 0) ||
                            primarySession.session.level) && (
                            <div className="pt-0.5 flex flex-wrap items-center gap-1.5">
                              {primarySession.session.categories?.map((cat) => (
                                <span
                                  key={cat}
                                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono-tech text-[10px] font-semibold uppercase tracking-wider ${getCategoryBadgeClass(cat)}`}
                                >
                                  {cat}
                                </span>
                              ))}
                              {primarySession.session.level && (
                                <span
                                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono-tech text-[10px] font-semibold uppercase tracking-wider ${getLevelBadgeClass(primarySession.session.level)}`}
                                >
                                  <span className="opacity-60">
                                    {isFr ? 'Niv:' : 'Lvl:'}
                                  </span>
                                  <span>{primarySession.session.level}</span>
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              onFocusMapRoute({
                                floor: primarySession.floor,
                                originNodeId:
                                  prevFloor === primarySession.floor
                                    ? prevNodeId
                                    : primarySession.floor === '04'
                                      ? 'l4-stairs'
                                      : 'l3-stairs',
                                destinationNodeId: primarySession.mapNodeId,
                                labelEn: `World ${primarySession.worldCode} · ${primarySession.roomName} (Level ${primarySession.floor})`,
                                labelFr: `Monde ${primarySession.worldCode} · ${primarySession.roomName} (Niveau ${primarySession.floor})`,
                              })
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/50 bg-cyan-400/15 hover:bg-cyan-400 hover:text-black px-3 py-1.5 font-mono-tech text-[11px] font-bold uppercase tracking-wider text-cyan-200 transition-all cursor-pointer"
                          >
                            <Compass className="h-3.5 w-3.5" />
                            <span>{isFr ? 'Carte TRON' : 'Locate on Map'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onToggleSession(primarySession.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-rose-400/35 bg-rose-500/10 hover:bg-rose-500/25 px-2.5 py-1.5 font-mono-tech text-[11px] uppercase tracking-wider text-rose-300 transition-all cursor-pointer"
                            title={isFr ? 'Retirer' : 'Remove'}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Backup / Overlapping Sessions (Plan B) */}
                    {backupSessions.map((backup) => (
                      <div
                        key={backup.id}
                        className="rounded-xl border border-amber-400/35 bg-amber-950/15 p-3.5 sm:px-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/50 bg-amber-500/20 px-2.5 py-0.5 font-mono-tech text-[10px] font-bold uppercase tracking-wider text-amber-300">
                                {isFr
                                  ? '🛡️ PLAN B / BACKUP'
                                  : '🛡️ BACKUP / PLAN B'}
                              </span>
                              <span className="font-mono-tech text-xs font-bold text-white/80">
                                World {backup.worldCode} · {backup.roomName}{' '}
                                (Level {backup.floor})
                              </span>
                              <span className="font-mono-tech text-[11px] text-amber-300/80">
                                {backup.session.time}
                              </span>
                            </div>
                            <TalkAbstractControl
                              title={backup.session.title}
                              abstractText={getTalkAbstract(
                                backup.session.title,
                                backup.session.abstract,
                              )}
                              isFr={isFr}
                              compact
                              titleClassName="font-display text-sm sm:text-base font-bold text-white/90 hover:text-cyan-100 transition-colors"
                            />
                            {backup.session.speakers && (
                              <p className="font-mono-tech text-[11px] uppercase text-cyan-300/75">
                                {renderSpeakersWithParens(
                                  backup.session.speakers,
                                )}
                              </p>
                            )}
                            {((backup.session.categories &&
                              backup.session.categories.length > 0) ||
                              backup.session.level) && (
                              <div className="pt-0.5 flex flex-wrap items-center gap-1.5">
                                {backup.session.categories?.map((cat) => (
                                  <span
                                    key={cat}
                                    className={`inline-flex items-center rounded-full border px-2 py-0.5 font-mono-tech text-[9px] font-semibold uppercase tracking-wider ${getCategoryBadgeClass(cat)}`}
                                  >
                                    {cat}
                                  </span>
                                ))}
                                {backup.session.level && (
                                  <span
                                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono-tech text-[9px] font-semibold uppercase tracking-wider ${getLevelBadgeClass(backup.session.level)}`}
                                  >
                                    <span className="opacity-60">
                                      {isFr ? 'Niv:' : 'Lvl:'}
                                    </span>
                                    <span>{backup.session.level}</span>
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() =>
                                onSetPrimaryForSlot(slot.id, backup.id)
                              }
                              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400/50 bg-amber-500/20 hover:bg-amber-400 hover:text-black px-3 py-1.5 font-mono-tech text-[10px] font-bold uppercase tracking-wider text-amber-200 transition-all cursor-pointer"
                            >
                              <Star className="h-3 w-3" />
                              <span>
                                {isFr
                                  ? 'Définir comme Principal'
                                  : 'Make Primary'}
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onToggleSession(backup.id)}
                              className="inline-flex items-center gap-1 rounded-lg border border-rose-400/35 bg-rose-500/10 hover:bg-rose-500/25 px-2.5 py-1.5 font-mono-tech text-[10px] uppercase text-rose-300 transition-all cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Optional Dropdown to Add a Backup (Plan B) Session */}
                    {unselectedConferences.length > 0 && (
                      <div className="pt-1">
                        <div className="relative flex items-center">
                          <Plus className="pointer-events-none absolute left-3.5 h-3.5 w-3.5 text-cyan-400" />
                          <select
                            value=""
                            onChange={(e) => {
                              if (e.target.value) {
                                onToggleSession(e.target.value);
                              }
                            }}
                            aria-label={
                              isFr
                                ? 'Ajouter une autre conférence (Plan B)'
                                : 'Add a backup conference from the drop down'
                            }
                            className="w-full appearance-none rounded-xl border border-white/15 bg-[#090f20] pl-9 pr-8 py-2.5 font-mono-tech text-xs text-white/75 hover:border-cyan-400/50 focus:border-cyan-400 focus:outline-none cursor-pointer"
                          >
                            <option value="">
                              {isFr
                                ? '+ Ajouter un Plan B (ou autre choix) depuis le menu déroulant...'
                                : '+ Add a backup conference from the drop down...'}
                            </option>
                            <optgroup
                              label={
                                isFr
                                  ? `Conférences & Ateliers (${slot.label})`
                                  : `Talks & Workshops (${slot.label})`
                              }
                            >
                              {unselectedConferences.map((cand) => (
                                <option key={cand.id} value={cand.id}>
                                  [World {cand.worldCode} · {cand.roomName}]{' '}
                                  {cand.session.title} (
                                  {cand.session.categories &&
                                  cand.session.categories.length > 0
                                    ? `${cand.session.categories.join(', ')} · `
                                    : ''}
                                  {cand.session.level
                                    ? `${cand.session.level} · `
                                    : ''}
                                  {cand.session.duration || '45 MIN'}
                                  {cand.session.lang
                                    ? ` · ${cand.session.lang}`
                                    : ''}
                                  )
                                </option>
                              ))}
                            </optgroup>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* CASE 2: EMPTY SLOT — SIMPLE DROPDOWN PROMPT (NO DEFAULT TALK PICKED) */
                  <div className="space-y-2.5">
                    <label
                      htmlFor={`select-${slot.id}`}
                      className="block font-mono-tech text-xs uppercase tracking-wider text-cyan-300"
                    >
                      {isFr
                        ? 'Choisissez votre conférence dans le menu déroulant'
                        : 'Pick your conference from the drop down'}
                    </label>
                    <select
                      id={`select-${slot.id}`}
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          onToggleSession(e.target.value);
                        }
                      }}
                      className="w-full rounded-xl border border-cyan-400/40 bg-[#0c1428] px-4 py-3 font-sans text-sm text-white hover:border-cyan-400 focus:border-cyan-300 focus:outline-none cursor-pointer"
                    >
                      <option value="">
                        {isFr
                          ? '— Choisissez votre conférence dans le menu déroulant —'
                          : '— Pick your conference from the drop down —'}
                      </option>
                      <optgroup
                        label={
                          isFr
                            ? `Conférences & Ateliers (${slot.label})`
                            : `Talks & Workshops (${slot.label})`
                        }
                      >
                        {availableConferencesInSlot.map((cand) => (
                          <option key={cand.id} value={cand.id}>
                            [World {cand.worldCode} · {cand.roomName} · Niv.{' '}
                            {cand.floor}] {cand.session.title}
                            {cand.session.speakers
                              ? ` — ${cand.session.speakers}`
                              : ''}{' '}
                            (
                            {cand.session.categories &&
                            cand.session.categories.length > 0
                              ? `${cand.session.categories.join(', ')} · `
                              : ''}
                            {cand.session.level
                              ? `${cand.session.level} · `
                              : ''}
                            {cand.session.duration || '45 MIN'}
                            {cand.session.lang ? ` · ${cand.session.lang}` : ''}
                            )
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* 16:45 - 18:30 CLOSING KEYNOTE, RAFFLES & 5 À 7 */}
        {(() => {
          const lastSlot = slotAssignments[slotAssignments.length - 1];
          const lastPrimary = lastSlot?.primarySession;
          const fromFloor = lastPrimary ? lastPrimary.floor : '04';
          const fromNodeId = lastPrimary ? lastPrimary.mapNodeId : 'l4-stairs';
          const fromLabel = lastPrimary
            ? `World ${lastPrimary.worldCode} (${lastPrimary.roomName})`
            : 'Level 04';

          return (
            <>
              {lastPrimary &&
                renderTransitionConnector(
                  fromLabel,
                  fromFloor,
                  fromNodeId,
                  "World 3-1 (Don't Stop Believin')",
                  '03',
                  'l3-room-1',
                  '16:45 – 17:00 Floor Change',
                )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border-2 border-google-yellow/55 bg-gradient-to-r from-google-yellow/15 via-[#0c1224] to-fuchsia-500/15 px-5 py-4 shadow-[0_0_25px_rgba(251,188,4,0.1)]">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-google-yellow/40 bg-google-yellow/20">
                    <PartyPopper className="h-5 w-5 text-google-yellow" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-google-yellow px-2.5 py-0.5 font-mono-tech text-[10px] font-bold uppercase tracking-wider text-black">
                        <Lock className="h-3 w-3" />
                        <span>
                          {isFr
                            ? 'SÉLECTIONNÉ · VERROUILLÉ'
                            : 'SELECTED · LOCKED'}
                        </span>
                      </span>
                      <span className="font-mono-tech text-xs sm:text-sm font-bold text-google-yellow">
                        17:00 – 18:30
                      </span>
                      <span className="rounded border border-google-yellow/35 bg-google-yellow/15 px-2 py-0.5 font-mono-tech text-[10px] font-bold uppercase text-google-yellow">
                        {isFr
                          ? "Monde 3-1 · Don't Stop Believin' · Niv. 03"
                          : "World 3-1 · Don't Stop Believin' · Level 03"}
                      </span>
                    </div>
                    <h4 className="mt-1 font-display text-base sm:text-lg font-bold text-white">
                      {isFr
                        ? 'Mot de la fin, Tirages & 5 à 7 (Closing Keynote & Happy Hour)'
                        : 'Closing Keynote, Raffles & 5 à 7 Networking'}
                    </h4>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-start sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      onFocusMapRoute({
                        floor: '03',
                        originNodeId:
                          fromFloor === '03' ? fromNodeId : 'l3-stairs',
                        destinationNodeId: 'l3-room-1',
                        labelEn:
                          "Closing Keynote & 5 à 7: Grand Stairs → World 3-1 (Don't Stop Believin')",
                        labelFr:
                          "Mot de la fin & 5 à 7 : Grand Escalier → Monde 3-1 (Don't Stop Believin')",
                      })
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-google-yellow/40 bg-google-yellow/10 hover:bg-google-yellow hover:text-black px-3 py-1.5 font-mono-tech text-[10px] font-bold uppercase tracking-wider text-google-yellow transition-all cursor-pointer"
                  >
                    <Compass className="h-3.5 w-3.5" />
                    <span>{isFr ? 'Trajet vers 3-1' : 'Route to 3-1'}</span>
                  </button>
                  <span
                    title={
                      isFr
                        ? 'Toujours inclus dans votre agenda (ne peut pas être retiré)'
                        : 'Always selected in My Agenda (cannot be removed)'
                    }
                    className="inline-flex items-center gap-1 rounded-lg border border-emerald-400/40 bg-emerald-500/15 px-2.5 py-1.5 font-mono-tech text-[10px] font-bold uppercase tracking-wider text-emerald-300 select-none"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <Lock className="h-3 w-3 opacity-80" />
                  </span>
                </div>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}
