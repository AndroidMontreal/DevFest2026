'use client';

import { TalkAbstractControl } from '@/components/common/talk-abstract-control';
import { getTalkAbstract } from '@/lib/talk-abstracts';
import {
  AlertTriangle,
  Bookmark,
  BookmarkCheck,
  CalendarRange,
  Compass,
  DoorOpen,
  Layers,
  MapPin,
  Search,
  Sparkles,
  Users,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  flattenRoomSessions,
  makeSessionId,
  MyAgendaBuilder,
  parseTimeRangeToMinutes,
  sessionsOverlap,
} from './my-agenda-builder';
import {
  OverallDayAgenda,
  type OverallDayAgendaCopy,
} from './overall-day-agenda';
import {
  TronSpaceNavigator,
  type TronMapFocusRequest,
} from './tron-space-navigator';

export type LightningSubItem = {
  time: string;
  title: string;
  speakers: string;
  abstract?: string;
  categories?: string[];
  level?: string;
};

export type RoomSessionItem = {
  kind?: 'session' | 'lunch' | 'open';
  variant?: 'yellow' | 'blue' | 'red';
  tentative?: boolean;
  time: string;
  title: string;
  subtitle?: string;
  speakers?: string;
  abstract?: string;
  duration?: string;
  lang?: string;
  categories?: string[];
  level?: string;
  subItems?: LightningSubItem[];
};

export function getCategoryBadgeClass(category: string): string {
  const lower = category.toLowerCase();
  if (lower.includes('ai') || lower.includes('ia')) {
    return 'border-fuchsia-400/50 bg-fuchsia-950/45 text-fuchsia-200';
  }
  if (lower.includes('cloud')) {
    return 'border-sky-400/50 bg-sky-950/45 text-sky-200';
  }
  if (lower.includes('appdev')) {
    return 'border-emerald-400/50 bg-emerald-950/45 text-emerald-200';
  }
  return 'border-amber-400/50 bg-amber-950/45 text-amber-200';
}

export function getLevelBadgeClass(level: string): string {
  const lower = level.toLowerCase();
  if (lower.includes('beginner') || lower.includes('débutant')) {
    return 'border-teal-400/45 bg-teal-950/40 text-teal-200';
  }
  if (lower.includes('intermediate') || lower.includes('intermédiaire')) {
    return 'border-indigo-400/50 bg-indigo-950/45 text-indigo-200';
  }
  if (lower.includes('advanced') || lower.includes('avancé')) {
    return 'border-rose-400/50 bg-rose-950/45 text-rose-200';
  }
  return 'border-white/25 bg-white/10 text-white/90';
}

export type RoomTrack = {
  id: string;
  worldCode: string;
  locationBadgePrimary: string;
  locationBadgeSecondary: string;
  name: string;
  typePrimary: string;
  typeSecondary: string;
  accent: 'yellow' | 'blue' | 'red';
  sessions: RoomSessionItem[];
};

export type RoomAgendaSectionCopy = {
  section_badge: string;
  section_title: string;
  section_subtitle: string;
  main_agenda_tab?: string;
  my_agenda_tab?: string;
  map_tab?: string;
  filter_all: string;
  search_placeholder?: string;
  filter_all_sessions?: string;
  filter_ai?: string;
  filter_cloud?: string;
  filter_appdev?: string;
  filter_community?: string;
  no_results?: string;
  subject_to_change_note: string;
  rooms: RoomTrack[];
};

type RoomAgendaSectionProps = {
  tldrCopy: OverallDayAgendaCopy;
  copy: RoomAgendaSectionCopy;
  locale?: string;
};

const STORAGE_KEY = 'devfest2026_my_agenda_v1';

export function RoomAgendaSection({
  tldrCopy,
  copy,
  locale = 'en',
}: RoomAgendaSectionProps) {
  const isFr = locale === 'fr';
  const [selectedTab, setSelectedTab] = useState<string>('main');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [primaryOverrides, setPrimaryOverrides] = useState<
    Record<string, string>
  >({});
  const [mapFocusRequest, setMapFocusRequest] =
    useState<TronMapFocusRequest | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    const planParam = params.get('plan');
    const priParam = params.get('pri');

    // Load saved agenda from URL ?plan= or localStorage
    if (planParam) {
      const fromUrl = planParam
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const priFromUrl: Record<string, string> = {};
      if (priParam) {
        for (const pair of priParam.split(',')) {
          const [slotKey, sessId] = pair.split('=');
          if (slotKey && sessId) {
            priFromUrl[slotKey.trim()] = sessId.trim();
          }
        }
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSavedIds(fromUrl);
      setPrimaryOverrides(priFromUrl);
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ savedIds: fromUrl, primaryOverrides: priFromUrl }),
        );
      } catch {
        // ignore storage errors
      }
    } else {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as {
            savedIds?: string[];
            primaryOverrides?: Record<string, string>;
          };
          if (Array.isArray(parsed.savedIds)) {
            setSavedIds(parsed.savedIds);
          }
          if (
            parsed.primaryOverrides &&
            typeof parsed.primaryOverrides === 'object'
          ) {
            setPrimaryOverrides(parsed.primaryOverrides);
          }
        }
      } catch {
        // ignore storage errors
      }
    }

    if (
      roomParam &&
      (roomParam === 'main' ||
        roomParam === 'my-agenda' ||
        roomParam === 'all' ||
        roomParam === 'map' ||
        copy.rooms.some((r) => r.id === roomParam))
    ) {
      setSelectedTab(roomParam);
    } else if (planParam) {
      setSelectedTab('my-agenda');
    }
  }, [copy.rooms]);

  const persistAgenda = (
    nextSavedIds: string[],
    nextPrimaryOverrides = primaryOverrides,
  ) => {
    setSavedIds(nextSavedIds);
    setPrimaryOverrides(nextPrimaryOverrides);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          savedIds: nextSavedIds,
          primaryOverrides: nextPrimaryOverrides,
        }),
      );
    } catch {
      // ignore storage errors
    }
  };

  const handleToggleSession = (sessionId: string) => {
    const exists = savedIds.includes(sessionId);
    const next = exists
      ? savedIds.filter((id) => id !== sessionId)
      : [...savedIds, sessionId];
    persistAgenda(next);
  };

  const handleSetPrimaryForSlot = (slotId: string, sessionId: string) => {
    const nextOverrides = { ...primaryOverrides, [slotId]: sessionId };
    persistAgenda(savedIds, nextOverrides);
  };

  const handleLoadPreset = (sessionIds: string[]) => {
    persistAgenda(sessionIds, {});
  };

  const handleClearAll = () => {
    persistAgenda([], {});
  };

  const handleFocusMapRoute = (req: Omit<TronMapFocusRequest, 'seq'>) => {
    setMapFocusRequest({
      ...req,
      seq: Date.now(),
    });
  };

  const allFlat = flattenRoomSessions(copy.rooms);
  const savedFlat = allFlat.filter((s) => savedIds.includes(s.id));
  const hasAnyConflict = savedFlat.some((s1, i) =>
    savedFlat.slice(i + 1).some((s2) => sessionsOverlap(s1, s2)),
  );

  const isFiltering =
    searchQuery.trim().length > 0 || selectedCategory !== 'all';

  const categoryFilterTabs = [
    {
      id: 'all',
      label:
        copy.filter_all_sessions ||
        (isFr ? 'Toutes les sessions' : 'All Sessions'),
    },
    {
      id: 'ai',
      label: copy.filter_ai || (isFr ? 'IA & Agents' : 'AI & Agents'),
    },
    { id: 'cloud', label: copy.filter_cloud || 'Cloud & Infra' },
    { id: 'appdev', label: copy.filter_appdev || 'AppDev' },
    {
      id: 'community',
      label:
        copy.filter_community ||
        (isFr ? 'Communauté & Panels' : 'Community & Panels'),
    },
  ];

  const visibleRooms = useMemo(() => {
    const isSpecificRoomTab = copy.rooms.some((r) => r.id === selectedTab);

    if (!isFiltering) {
      if (
        selectedTab === 'main' ||
        selectedTab === 'map' ||
        selectedTab === 'my-agenda'
      ) {
        return [];
      }
      if (selectedTab === 'all') {
        return copy.rooms;
      }
      return copy.rooms.filter((room) => room.id === selectedTab);
    }

    const baseRooms = isSpecificRoomTab
      ? copy.rooms.filter((room) => room.id === selectedTab)
      : copy.rooms;

    const query = searchQuery.trim().toLowerCase();

    return baseRooms
      .map((room) => {
        const matchingSessions = room.sessions.filter((session) => {
          if (session.kind === 'lunch') return false;

          if (selectedCategory !== 'all') {
            const allCats = [
              ...(session.categories || []),
              ...(session.subItems?.flatMap((sub) => sub.categories || []) ||
                []),
            ].map((c) => c.toLowerCase());

            const matchesCat =
              selectedCategory === 'ai'
                ? allCats.some((c) => c.includes('ai') || c.includes('ia'))
                : selectedCategory === 'cloud'
                  ? allCats.some((c) => c.includes('cloud'))
                  : selectedCategory === 'appdev'
                    ? allCats.some((c) => c.includes('appdev'))
                    : selectedCategory === 'community'
                      ? allCats.some(
                          (c) =>
                            c.includes('community') ||
                            c.includes('communauté') ||
                            c.includes('panel') ||
                            c.includes('career') ||
                            c.includes('carrière'),
                        )
                      : true;

            if (!matchesCat) return false;
          }

          if (query) {
            const haystack = [
              session.title,
              session.subtitle,
              session.speakers,
              getTalkAbstract(session.title, session.abstract),
              session.time,
              session.duration,
              session.lang,
              session.level,
              ...(session.categories || []),
              room.name,
              room.worldCode,
              room.typePrimary,
              room.typeSecondary,
              ...(session.subItems?.flatMap((sub) => [
                sub.title,
                sub.speakers,
                getTalkAbstract(sub.title, sub.abstract),
                sub.time,
                sub.level,
                ...(sub.categories || []),
              ]) || []),
            ]
              .filter(Boolean)
              .join(' ')
              .toLowerCase();

            if (!haystack.includes(query)) return false;
          }

          return true;
        });

        return {
          ...room,
          sessions: matchingSessions,
        };
      })
      .filter((room) => room.sessions.length > 0);
  }, [copy.rooms, isFiltering, searchQuery, selectedCategory, selectedTab]);

  const totalMatchingSessions = useMemo(
    () =>
      visibleRooms.reduce(
        (acc, room) =>
          acc + room.sessions.filter((s) => s.kind !== 'lunch').length,
        0,
      ),
    [visibleRooms],
  );

  return (
    <div className="space-y-12">
      {/* Top Room & Agenda Navigation Bar at the start of the page */}
      <div className="flex flex-col gap-6 rounded-2xl border border-cyan-500/20 bg-[#070b16]/90 p-6 md:p-8 shadow-[0_0_40px_rgba(0,240,255,0.05)] backdrop-blur-2xl">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span className="font-mono-tech text-[11px] uppercase tracking-[0.25em] text-cyan-400">
                {copy.section_badge}
              </span>
            </div>
            <h2 className="mt-1.5 font-display text-xl md:text-3xl font-bold tracking-tight text-white uppercase">
              {copy.section_title}
            </h2>
            <p className="mt-0.5 font-mono-tech text-xs tracking-wider text-cyan-200/60 uppercase">
              {copy.section_subtitle}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 self-start lg:self-end rounded-lg border border-google-yellow/30 bg-google-yellow/10 px-3.5 py-2 font-mono-tech text-[11px] text-google-yellow">
            <span className="h-2 w-2 rounded-full bg-google-yellow animate-pulse shrink-0" />
            <span>{copy.subject_to_change_note}</span>
          </div>
        </div>

        {/* Navigation Pills: Main Agenda + All Rooms + Each Room + TRON Space Navigator */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2.5">
          <div className="grid grid-cols-2 sm:contents gap-2">
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedTab('main');
              }}
              className={`inline-flex items-center justify-center sm:justify-start gap-2 rounded-lg border px-3 sm:px-4 py-2.5 font-mono-tech text-[11px] sm:text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                selectedTab === 'main' && !isFiltering
                  ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200 shadow-[0_0_18px_rgba(16,185,129,0.35)]'
                  : 'border-emerald-400/35 bg-emerald-500/10 text-emerald-200/90 shadow-[0_0_12px_rgba(16,185,129,0.15)] hover:border-emerald-400 hover:text-white hover:shadow-[0_0_18px_rgba(16,185,129,0.3)]'
              }`}
            >
              <CalendarRange className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {copy.main_agenda_tab || 'Main Agenda (TL;DR)'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedTab('all')}
              className={`inline-flex items-center justify-center sm:justify-start gap-2 rounded-lg border px-3 sm:px-4 py-2.5 font-mono-tech text-[11px] sm:text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                selectedTab === 'all'
                  ? 'border-orange-400 bg-orange-500/20 text-orange-200 shadow-[0_0_18px_rgba(249,115,22,0.35)]'
                  : 'border-orange-400/35 bg-orange-500/10 text-orange-200/90 shadow-[0_0_12px_rgba(249,115,22,0.15)] hover:border-orange-400 hover:text-white hover:shadow-[0_0_18px_rgba(249,115,22,0.3)]'
              }`}
            >
              <Layers className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{copy.filter_all}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 sm:contents -mx-1 px-1">
            {copy.rooms.map((room) => {
              const isActive = selectedTab === room.id;
              const roomSavedCount = savedFlat.filter(
                (s) => s.roomId === room.id,
              ).length;
              const activeClass =
                room.accent === 'yellow'
                  ? 'border-google-yellow bg-google-yellow/20 text-google-yellow shadow-[0_0_15px_rgba(251,188,4,0.25)]'
                  : room.accent === 'red'
                    ? 'border-rose-400 bg-rose-500/20 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.25)]'
                    : 'border-cyan-400 bg-cyan-400/15 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]';
              return (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => setSelectedTab(room.id)}
                  className={`shrink-0 inline-flex items-center gap-2 rounded-lg border px-3.5 sm:px-4 py-2 sm:py-2.5 font-mono-tech text-[11px] sm:text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    isActive
                      ? activeClass
                      : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/30 hover:text-white'
                  }`}
                >
                  <DoorOpen className="h-3.5 w-3.5 shrink-0" />
                  <span className="font-bold">{room.worldCode}</span>
                  <span className="opacity-40">·</span>
                  <span>{room.name}</span>
                  {roomSavedCount > 0 && (
                    <span className="ml-0.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-cyan-400/90 px-1 font-mono-tech text-[9px] font-bold text-black">
                      {roomSavedCount}
                    </span>
                  )}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedTab('map');
              }}
              className={`shrink-0 inline-flex items-center gap-2 rounded-lg border px-3.5 sm:px-4 py-2 sm:py-2.5 font-mono-tech text-[11px] sm:text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                selectedTab === 'map' && !isFiltering
                  ? 'border-fuchsia-400 bg-fuchsia-500/20 text-fuchsia-200 shadow-[0_0_18px_rgba(217,70,239,0.35)]'
                  : 'border-fuchsia-400/35 bg-fuchsia-500/10 text-fuchsia-200/90 hover:border-fuchsia-400 hover:text-white'
              }`}
            >
              <Compass className="h-3.5 w-3.5 shrink-0" />
              <span>
                {copy.map_tab ||
                  (locale === 'fr'
                    ? 'Carte Interactive (3e & 4e)'
                    : 'Space Navigator (Map)')}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Dedicated My Agenda Row / Bar right below Navigate by Room (outside the room cluster) */}
      <div className="-mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-cyan-500/25 bg-[#070b16]/90 px-5 py-4 shadow-[0_0_30px_rgba(0,240,255,0.06)] backdrop-blur-2xl">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedTab('my-agenda');
            }}
            className={`inline-flex items-center justify-center sm:justify-start gap-2.5 rounded-lg border px-4 py-2.5 font-mono-tech text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              selectedTab === 'my-agenda' && !isFiltering
                ? 'border-cyan-300 bg-cyan-400/25 text-white shadow-[0_0_20px_rgba(0,240,255,0.45)]'
                : 'border-cyan-400/45 bg-cyan-500/15 text-cyan-200 shadow-[0_0_14px_rgba(0,240,255,0.18)] hover:border-cyan-300 hover:text-white hover:shadow-[0_0_20px_rgba(0,240,255,0.35)]'
            }`}
          >
            <BookmarkCheck className="h-4 w-4 shrink-0 text-cyan-300" />
            <span className="truncate font-bold">
              {copy.my_agenda_tab || (isFr ? 'Mon Agenda' : 'My Agenda')}
            </span>
            <span
              className={`inline-flex items-center justify-center rounded-full px-1.5 py-0.2 font-mono-tech text-[10px] font-bold ${
                savedFlat.length > 0
                  ? 'bg-cyan-400 text-black'
                  : 'bg-google-yellow/90 text-black'
              }`}
              title={
                isFr
                  ? `4 événements principaux verrouillés + ${savedFlat.length} conférence(s)`
                  : `4 locked core events + ${savedFlat.length} talk(s)`
              }
            >
              {4 + savedFlat.length}
            </span>
            {hasAnyConflict && (
              <span
                title={
                  isFr
                    ? 'Chevauchement horaire (Principal + Plan B)'
                    : 'Time overlap (Primary + Backup)'
                }
                className="inline-flex items-center"
              >
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              </span>
            )}
          </button>

          <span className="hidden md:inline-block font-mono-tech text-xs text-white/60">
            {isFr
              ? 'Créez votre horaire personnalisé, exportez en .ics ou partagez votre lien'
              : 'Build your custom schedule, export to .ics calendar, or share your link'}
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono-tech text-[11px] text-cyan-300/80">
          <span>
            {isFr
              ? `${4 + savedFlat.length} élément(s) à votre horaire (4 principaux + ${savedFlat.length} choix)`
              : `${4 + savedFlat.length} item(s) in your schedule (4 core + ${savedFlat.length} selected)`}
          </span>
        </div>
      </div>

      {/* Controls Bar: Search + Category Filters (Matches Speakers Grid) */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 border-b border-white/10 pb-8">
        {/* Search Input */}
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              copy.search_placeholder ||
              (isFr
                ? 'Rechercher par titre, conférencier, salle, catégorie ou niveau...'
                : 'Search by talk title, speaker, room, category or level...')
            }
            className="w-full rounded-none border border-white/15 bg-[#0a0a0a]/80 py-3 pl-11 pr-14 font-mono-tech text-xs tracking-wider text-white placeholder-white/40 outline-none transition-colors focus:border-cyan-400 focus:bg-white/[0.04]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 font-mono-tech text-[10px] text-white/40 hover:text-white cursor-pointer"
            >
              CLEAR
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {categoryFilterTabs.map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`rounded-none border px-4 py-2 font-mono-tech text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'border-cyan-400 bg-cyan-400/15 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                    : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/30 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Counter when searching/filtering or viewing room schedules */}
      {(isFiltering || visibleRooms.length > 0) && (
        <div className="-mt-6 flex items-center justify-between text-white/40 font-mono-tech text-xs tracking-widest">
          <div className="flex items-center gap-2 flex-wrap">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <span className="uppercase">
              {totalMatchingSessions}{' '}
              {isFr
                ? totalMatchingSessions === 1
                  ? 'SESSION TROUVÉE'
                  : 'SESSIONS TROUVÉES'
                : totalMatchingSessions === 1
                  ? 'SESSION FOUND'
                  : 'SESSIONS FOUND'}{' '}
              · {visibleRooms.length}{' '}
              {isFr
                ? visibleRooms.length === 1
                  ? 'SALLE'
                  : 'SALLES'
                : visibleRooms.length === 1
                  ? 'ROOM'
                  : 'ROOMS'}
            </span>
          </div>
          {isFiltering && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="font-mono-tech text-xs uppercase tracking-wider text-cyan-400 hover:text-cyan-200 cursor-pointer"
            >
              {isFr ? 'Réinitialiser les filtres' : 'Reset Filters'}
            </button>
          )}
        </div>
      )}

      {/* No Results Notice when filtering yields 0 sessions */}
      {isFiltering && visibleRooms.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-[#070b16]/80 p-12 text-center">
          <p className="font-mono-tech text-sm text-white/60">
            {copy.no_results ||
              (isFr
                ? 'Aucune session ne correspond à votre recherche.'
                : 'No sessions found matching your search.')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {copy.rooms.some((r) => r.id === selectedTab) && (
              <button
                type="button"
                onClick={() => setSelectedTab('all')}
                className="rounded-lg border border-cyan-400/50 bg-cyan-400/15 px-4 py-2 font-mono-tech text-xs uppercase tracking-wider text-cyan-200 hover:bg-cyan-400 hover:text-black transition-all cursor-pointer"
              >
                {isFr
                  ? 'Chercher dans toutes les salles'
                  : 'Search across all rooms'}
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 font-mono-tech text-xs uppercase tracking-wider text-white/80 hover:border-white/40 hover:text-white transition-all cursor-pointer"
            >
              {isFr ? 'Effacer la recherche' : 'Clear search'}
            </button>
          </div>
        </div>
      )}

      {/* Main Agenda (TL;DR) when 'main' is selected and not actively filtering */}
      {selectedTab === 'main' && !isFiltering && (
        <OverallDayAgenda copy={tldrCopy} />
      )}

      {/* My Custom Agenda Builder when 'my-agenda' is selected and not actively filtering */}
      {selectedTab === 'my-agenda' && !isFiltering && (
        <MyAgendaBuilder
          rooms={copy.rooms}
          savedIds={savedIds}
          primaryOverrides={primaryOverrides}
          onToggleSession={handleToggleSession}
          onSetPrimaryForSlot={handleSetPrimaryForSlot}
          onLoadPreset={handleLoadPreset}
          onClearAll={handleClearAll}
          onFocusMapRoute={handleFocusMapRoute}
          onBrowseRoom={(roomId) => setSelectedTab(roomId)}
          locale={locale}
        />
      )}

      {/* TRON Space Navigator on 'map' tab, below Main Agenda, or below My Agenda (when not filtering) */}
      {(selectedTab === 'map' ||
        selectedTab === 'main' ||
        selectedTab === 'my-agenda') &&
        !isFiltering && (
          <TronSpaceNavigator
            rooms={copy.rooms}
            onSelectRoomSchedule={(roomId) => setSelectedTab(roomId)}
            locale={locale}
            focusRequest={mapFocusRequest}
          />
        )}

      {/* Room Cards */}
      {visibleRooms.length > 0 && (
        <div className="space-y-12">
          {visibleRooms.map((room) => (
            <section
              key={room.id}
              id={`room-${room.id}`}
              className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#070b16]/95 p-6 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl scroll-mt-28"
            >
              {/* Ambient Top Glow */}
              <div
                className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${
                  room.accent === 'yellow'
                    ? 'via-google-yellow/60'
                    : room.accent === 'red'
                      ? 'via-rose-400/60'
                      : 'via-cyan-400/60'
                } to-transparent`}
              />
              <div
                className={`pointer-events-none absolute -top-24 left-1/4 h-56 w-56 rounded-full ${
                  room.accent === 'yellow'
                    ? 'bg-google-yellow/10'
                    : room.accent === 'red'
                      ? 'bg-google-red/10'
                      : 'bg-google-blue/10'
                } blur-[100px]`}
              />

              {/* Room Header (Matches Slide Layout) */}
              <div className="mb-8 border-b border-white/10 pb-6">
                <div className="flex flex-wrap items-center gap-2 font-mono-tech text-xs md:text-sm uppercase tracking-[0.2em]">
                  <MapPin
                    className={`h-3.5 w-3.5 ${
                      room.accent === 'yellow'
                        ? 'text-google-yellow'
                        : room.accent === 'red'
                          ? 'text-rose-400'
                          : 'text-cyan-400'
                    }`}
                  />
                  <span
                    className={
                      room.accent === 'yellow'
                        ? 'text-google-yellow/90'
                        : room.accent === 'red'
                          ? 'text-rose-400/90'
                          : 'text-cyan-300/90'
                    }
                  >
                    {room.locationBadgePrimary}
                  </span>
                  <span className="text-white/30">/</span>
                  <span className="text-cyan-300/75">
                    {room.locationBadgeSecondary}
                  </span>
                </div>

                <h3 className="mt-2 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
                  {room.name}
                </h3>

                <div className="mt-2 flex flex-wrap items-center gap-2 font-display text-lg md:text-2xl text-white/90">
                  <Users className="h-5 w-5 text-cyan-400/80 mr-1 hidden sm:inline-block" />
                  <span>{room.typePrimary}</span>
                  <span className="text-white/40">/</span>
                  <span className="text-cyan-300">{room.typeSecondary}</span>
                </div>
              </div>

              {/* Room Sessions List */}
              <div className="space-y-3.5">
                {room.sessions.map((session, idx) => {
                  // Lunch Break Bar
                  if (session.kind === 'lunch') {
                    return (
                      <div
                        key={`lunch-${idx}`}
                        className="my-4 flex flex-wrap items-center justify-center gap-2 rounded-lg border border-google-yellow/25 bg-google-yellow/[0.12] px-4 py-2.5 text-center font-mono-tech text-xs md:text-sm uppercase tracking-[0.18em]"
                      >
                        <span className="font-bold text-google-yellow">
                          {session.time}
                        </span>
                        <span className="text-google-yellow/50">·</span>
                        <span className="font-semibold text-google-yellow">
                          {session.title}
                        </span>
                        {session.subtitle && (
                          <>
                            <span className="text-white/40">/</span>
                            <span className="text-cyan-200/90">
                              {session.subtitle}
                            </span>
                          </>
                        )}
                      </div>
                    );
                  }

                  // Open Talk / Workshop Slot (Dashed Border)
                  if (session.kind === 'open') {
                    const isRedOpen =
                      session.variant === 'red' || room.accent === 'red';
                    const openDurationClass = isRedOpen
                      ? 'border-rose-400/80 bg-rose-500/10 text-rose-400'
                      : 'border-cyan-400/70 bg-cyan-950/30 text-cyan-300';

                    return (
                      <div
                        key={`${session.time}-${idx}`}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-dashed border-cyan-200/35 bg-[#0c101d]/60 px-5 py-4 transition-colors hover:border-cyan-300/60 hover:bg-[#101628]/80"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          {/* Outlined Time Pill */}
                          <div className="shrink-0">
                            <span className="inline-flex min-w-[150px] items-center justify-center rounded-full border border-cyan-200/60 bg-transparent px-4 py-2 font-mono-tech text-sm md:text-base tracking-wider text-cyan-100">
                              {session.time}
                            </span>
                          </div>

                          {/* Open Slot Text */}
                          <div className="flex flex-col">
                            <span className="font-display text-base md:text-lg font-bold text-white">
                              {session.title}
                            </span>
                            {session.subtitle && (
                              <span className="font-sans text-xs md:text-sm text-cyan-200/75">
                                {session.subtitle}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Duration Pill */}
                        {session.duration && (
                          <div className="flex items-center gap-2 self-start md:self-center">
                            <span
                              className={`inline-flex min-w-[78px] items-center justify-center rounded-full border px-3.5 py-1.5 font-mono-tech text-xs uppercase tracking-wider ${openDurationClass}`}
                            >
                              {session.duration}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Regular Session (Talk / Panel / Workshop / Lightning Round)
                  const sessionId = makeSessionId(room.id, session.time);
                  const isSaved = savedIds.includes(sessionId);
                  const thisRange = parseTimeRangeToMinutes(session.time);
                  const overlappingOtherSaved = savedFlat.filter(
                    (s) => s.id !== sessionId && sessionsOverlap(thisRange, s),
                  );

                  const pillVariant = session.variant || room.accent || 'blue';

                  const timePillClass = session.tentative
                    ? 'border border-google-yellow bg-transparent text-google-yellow font-bold'
                    : pillVariant === 'yellow'
                      ? 'bg-google-yellow text-black font-bold shadow-[0_0_15px_rgba(251,188,4,0.3)]'
                      : pillVariant === 'red'
                        ? 'bg-google-red text-white font-bold shadow-[0_0_15px_rgba(234,67,53,0.3)]'
                        : 'bg-google-blue text-white font-bold shadow-[0_0_15px_rgba(66,133,244,0.3)]';

                  const durationBadgeClass =
                    pillVariant === 'yellow'
                      ? 'border-google-yellow/80 text-google-yellow bg-google-yellow/10'
                      : pillVariant === 'red'
                        ? 'border-rose-400/80 text-rose-400 bg-rose-500/10'
                        : 'border-cyan-400/75 text-cyan-300 bg-cyan-950/30';

                  return (
                    <div
                      key={`${session.time}-${idx}`}
                      className={`group relative flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl px-5 py-4 transition-all duration-300 ${
                        isSaved
                          ? 'border-2 border-cyan-400/80 bg-[#101935]/95 shadow-[0_0_25px_rgba(0,240,255,0.14)]'
                          : session.tentative
                            ? 'border border-dashed border-google-yellow/80 bg-[#0d1222]/90 hover:border-google-yellow hover:bg-[#121931]'
                            : 'border border-white/10 bg-[#0d1222]/90 hover:border-cyan-400/40 hover:bg-[#121931]'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
                        {/* Solid or Tentative Outlined Time Pill */}
                        <div className="shrink-0">
                          <span
                            className={`inline-flex min-w-[150px] items-center justify-center rounded-full px-4 py-2 font-mono-tech text-sm md:text-base tracking-wider ${timePillClass}`}
                          >
                            {session.time}
                          </span>
                        </div>

                        {/* Session Details */}
                        <div className="flex flex-col gap-1 flex-1">
                          <TalkAbstractControl
                            title={session.title}
                            abstractText={getTalkAbstract(
                              session.title,
                              session.abstract,
                            )}
                            isFr={isFr}
                          />

                          {session.speakers && (
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-mono-tech text-xs uppercase tracking-wider text-cyan-400">
                                {session.speakers.replace(/\s*·\s*GDE\b/i, '')}
                              </p>
                              {/\bGDE\b/i.test(session.speakers) && (
                                <span
                                  title="Google Developer Expert (GDE)"
                                  className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-[#0a0f1d]/90 px-2.5 py-0.5 font-mono-tech text-[10px] font-bold tracking-wider text-white uppercase shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                                >
                                  <svg
                                    viewBox="0 0 24 18"
                                    className="h-2.5 w-3 shrink-0"
                                    aria-hidden="true"
                                  >
                                    <path
                                      d="M8.5 2.5L2.5 8.5"
                                      stroke="#EA4335"
                                      strokeWidth="3.2"
                                      strokeLinecap="round"
                                    />
                                    <path
                                      d="M2.5 9.5L8.5 15.5"
                                      stroke="#4285F4"
                                      strokeWidth="3.2"
                                      strokeLinecap="round"
                                    />
                                    <path
                                      d="M15.5 2.5L21.5 8.5"
                                      stroke="#34A853"
                                      strokeWidth="3.2"
                                      strokeLinecap="round"
                                    />
                                    <path
                                      d="M21.5 9.5L15.5 15.5"
                                      stroke="#FBBC04"
                                      strokeWidth="3.2"
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                  <span>GDE</span>
                                </span>
                              )}
                              {session.tentative && (
                                <>
                                  <span className="font-mono-tech text-xs text-white/35">
                                    ·
                                  </span>
                                  <span className="font-mono-tech text-xs font-semibold uppercase tracking-wider text-google-yellow">
                                    TENTATIVE / À CONFIRMER
                                  </span>
                                </>
                              )}
                            </div>
                          )}

                          {/* Category & Level Badges */}
                          {((session.categories &&
                            session.categories.length > 0) ||
                            session.level) && (
                            <div className="mt-1 flex flex-wrap items-center gap-1.5">
                              {session.categories?.map((cat) => (
                                <span
                                  key={cat}
                                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono-tech text-[10px] font-semibold uppercase tracking-wider ${getCategoryBadgeClass(cat)}`}
                                >
                                  {cat}
                                </span>
                              ))}
                              {session.level && (
                                <span
                                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono-tech text-[10px] font-semibold uppercase tracking-wider ${getLevelBadgeClass(session.level)}`}
                                >
                                  <span className="opacity-60">
                                    {isFr ? 'Niv:' : 'Lvl:'}
                                  </span>
                                  <span>{session.level}</span>
                                </span>
                              )}
                            </div>
                          )}

                          {/* Overlap / Conflict Notice if another session in this time window is saved */}
                          {overlappingOtherSaved.length > 0 && (
                            <div className="mt-1 flex items-center gap-1.5 font-mono-tech text-[10px] text-amber-300">
                              <AlertTriangle className="h-3 w-3 shrink-0 text-amber-400" />
                              <span>
                                {isSaved
                                  ? isFr
                                    ? `Chevauchement avec Monde ${overlappingOtherSaved.map((o) => o.worldCode).join(', ')} (géré en Principal / Plan B dans Mon Agenda)`
                                    : `Overlaps with World ${overlappingOtherSaved.map((o) => o.worldCode).join(', ')} (managed as Primary / Backup in My Agenda)`
                                  : isFr
                                    ? `Même créneau que votre choix dans Monde ${overlappingOtherSaved.map((o) => o.worldCode).join(', ')} (ajoutable en Plan B)`
                                    : `Same time window as your saved talk in World ${overlappingOtherSaved.map((o) => o.worldCode).join(', ')} (can add as Backup)`}
                              </span>
                            </div>
                          )}

                          {/* Sub-items for Lightning Round */}
                          {session.subItems && session.subItems.length > 0 && (
                            <div className="mt-2 space-y-2.5 border-t border-white/10 pt-2">
                              {session.subItems.map((sub, subIdx) => (
                                <div
                                  key={subIdx}
                                  className="flex flex-col gap-1 text-xs md:text-sm"
                                >
                                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                                    <span className="font-mono-tech text-xs font-bold text-google-yellow">
                                      {sub.time}
                                    </span>
                                    <span className="font-sans text-cyan-300">
                                      {sub.speakers}
                                    </span>
                                    {sub.categories?.map((cat) => (
                                      <span
                                        key={cat}
                                        className={`inline-flex items-center rounded-full border px-2 py-0.5 font-mono-tech text-[9px] font-semibold uppercase tracking-wider ${getCategoryBadgeClass(cat)}`}
                                      >
                                        {cat}
                                      </span>
                                    ))}
                                    {sub.level && (
                                      <span
                                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono-tech text-[9px] font-semibold uppercase tracking-wider ${getLevelBadgeClass(sub.level)}`}
                                      >
                                        <span className="opacity-60">
                                          {isFr ? 'Niv:' : 'Lvl:'}
                                        </span>
                                        <span>{sub.level}</span>
                                      </span>
                                    )}
                                  </div>
                                  <TalkAbstractControl
                                    title={sub.title}
                                    abstractText={getTalkAbstract(
                                      sub.title,
                                      sub.abstract,
                                    )}
                                    isFr={isFr}
                                    compact
                                    titleClassName="font-display font-bold text-white text-xs md:text-sm leading-snug hover:text-cyan-100 transition-colors"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Badges: Duration + Language + Save to My Agenda */}
                      <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center shrink-0">
                        {session.duration && (
                          <span
                            className={`inline-flex min-w-[78px] items-center justify-center rounded-full border px-3.5 py-1.5 font-mono-tech text-xs uppercase tracking-wider ${durationBadgeClass}`}
                          >
                            {session.duration}
                          </span>
                        )}
                        {session.lang && (
                          <span className="inline-flex min-w-[64px] items-center justify-center rounded-full border border-cyan-200/60 bg-cyan-950/30 px-3.5 py-1.5 font-mono-tech text-xs uppercase tracking-wider text-cyan-100">
                            {session.lang}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleToggleSession(sessionId)}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-mono-tech text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            isSaved
                              ? 'border-cyan-300 bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                              : 'border-cyan-400/50 bg-cyan-400/10 text-cyan-200 hover:border-cyan-300 hover:bg-cyan-400 hover:text-black'
                          }`}
                        >
                          {isSaved ? (
                            <>
                              <BookmarkCheck className="h-3.5 w-3.5" />
                              <span>{isFr ? 'Sauvé' : 'Saved'}</span>
                            </>
                          ) : (
                            <>
                              <Bookmark className="h-3.5 w-3.5" />
                              <span>
                                {overlappingOtherSaved.length > 0
                                  ? isFr
                                    ? '+ Plan B'
                                    : '+ Backup'
                                  : isFr
                                    ? '+ Agenda'
                                    : '+ My Agenda'}
                              </span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
