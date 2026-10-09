'use client';

import { Link } from '@/i18n/navigation';
import {
  ExternalLink,
  GraduationCap,
  Laptop,
  MapPin,
  Mic,
  Search,
  Sparkles,
  Users2,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { FaLinkedin } from 'react-icons/fa';

export type SpeakerCategory =
  'ai' | 'cloud' | 'appdev' | 'community' | 'mobile';

export type SpeakerItem = {
  name: string;
  title?: string;
  employer?: string;
  gde?: boolean;
  googler?: boolean;
  topic: string;
  format?: string;
  link: string;
  image: string;
  category: SpeakerCategory;
  categories?: SpeakerCategory[];
};

export type SpeakersGridCopy = {
  search_placeholder: string;
  filter_all: string;
  filter_ai: string;
  filter_cloud: string;
  filter_appdev: string;
  filter_community: string;
  no_results: string;
  items: SpeakerItem[];
};

const cardStyles = [
  {
    borderHover: 'group-hover:border-google-blue/40',
    shadowHover: 'hover:shadow-[0_0_30px_rgba(66,133,244,0.2)]',
    textHover: 'group-hover:text-google-blue',
    btnHover:
      'hover:border-google-blue hover:bg-google-blue/10 hover:text-google-blue',
    badge: 'border-google-blue/30 bg-google-blue/10 text-google-blue',
  },
  {
    borderHover: 'group-hover:border-google-red/40',
    shadowHover: 'hover:shadow-[0_0_30px_rgba(234,67,53,0.2)]',
    textHover: 'group-hover:text-google-red',
    btnHover:
      'hover:border-google-red hover:bg-google-red/10 hover:text-google-red',
    badge: 'border-google-red/30 bg-google-red/10 text-google-red',
  },
  {
    borderHover: 'group-hover:border-google-yellow/40',
    shadowHover: 'hover:shadow-[0_0_30px_rgba(251,188,4,0.2)]',
    textHover: 'group-hover:text-google-yellow',
    btnHover:
      'hover:border-google-yellow hover:bg-google-yellow/10 hover:text-google-yellow',
    badge: 'border-google-yellow/30 bg-google-yellow/10 text-google-yellow',
  },
  {
    borderHover: 'group-hover:border-google-green/40',
    shadowHover: 'hover:shadow-[0_0_30px_rgba(52,168,83,0.2)]',
    textHover: 'group-hover:text-google-green',
    btnHover:
      'hover:border-google-green hover:bg-google-green/10 hover:text-google-green',
    badge: 'border-google-green/30 bg-google-green/10 text-google-green',
  },
];

type SessionType =
  | 'talk'
  | 'workshop'
  | 'panel'
  | 'lightning-panel'
  | 'lightning'
  | 'keynote'
  | 'coaching';

type SessionLocation = {
  tabId: string;
  roomCode: string;
  roomName: string;
  time: string;
};

function getSessionLocation(
  sessionTitle: string,
  sessionType: SessionType,
  isFr: boolean,
): SessionLocation | null {
  if (sessionType === 'coaching') return null;

  const t = sessionTitle.toLowerCase();

  // Keynotes (World 3-1 · Don't Stop Believin')
  if (sessionType === 'keynote') {
    if (t.includes('closing') || t.includes('clôture')) {
      return {
        tabId: '3-1',
        roomCode: '3-1',
        roomName: "Don't Stop Believin'",
        time:
          t.includes('opening') || t.includes('ouverture')
            ? '09:25 & 17:00'
            : '17:00 – 17:15',
      };
    }
    return {
      tabId: '3-1',
      roomCode: '3-1',
      roomName: "Don't Stop Believin'",
      time: '09:25 – 10:00',
    };
  }

  // World 3-1 · Don't Stop Believin'
  if (
    t.includes('montreal tech community') ||
    t.includes('communauté tech montréalaise')
  ) {
    return {
      tabId: '3-1',
      roomCode: '3-1',
      roomName: "Don't Stop Believin'",
      time: '10:15 – 11:00',
    };
  }
  if (t.includes('flight mode ai')) {
    return {
      tabId: '3-1',
      roomCode: '3-1',
      roomName: "Don't Stop Believin'",
      time: '11:15 – 12:00',
    };
  }
  if (t.includes('from data to action')) {
    return {
      tabId: '3-1',
      roomCode: '3-1',
      roomName: "Don't Stop Believin'",
      time: '13:00 – 13:45',
    };
  }
  if (t.includes('work at google')) {
    return {
      tabId: '3-1',
      roomCode: '3-1',
      roomName: "Don't Stop Believin'",
      time: '14:00 – 14:45',
    };
  }
  if (t.includes('plateforme agentique') || t.includes('nova')) {
    return {
      tabId: '3-1',
      roomCode: '3-1',
      roomName: "Don't Stop Believin'",
      time: '15:00 – 15:45',
    };
  }
  if (
    t.includes('magic') ||
    t.includes('magique') ||
    t.includes('wins the race')
  ) {
    return {
      tabId: '3-1',
      roomCode: '3-1',
      roomName: "Don't Stop Believin'",
      time: '16:00 – 16:45',
    };
  }

  // World 3-2 · Mr. Roboto (Showcase)
  if (t === 'the doomsday course') {
    return {
      tabId: 'map',
      roomCode: '3-2',
      roomName: 'Mr. Roboto',
      time: isFr ? 'Toute la journée' : 'All Day',
    };
  }

  // World 3-4 · Call Me (Lightning Round)
  if (t.includes('gdg') && t.includes('campus')) {
    return {
      tabId: '3-4',
      roomCode: '3-4',
      roomName: 'Call Me',
      time: '16:00 – 16:15',
    };
  }
  if (t.includes('90%')) {
    return {
      tabId: '3-4',
      roomCode: '3-4',
      roomName: 'Call Me',
      time: '16:15 – 16:30',
    };
  }

  // World 3-5 · Just Can't Get Enough
  if (t.includes('building the doomsday course')) {
    return {
      tabId: '3-5',
      roomCode: '3-5',
      roomName: "Just Can't Get Enough",
      time: '10:15 – 11:00',
    };
  }
  if (t.includes('off the edge')) {
    return {
      tabId: '3-5',
      roomCode: '3-5',
      roomName: "Just Can't Get Enough",
      time: '13:00 – 13:45',
    };
  }
  if (t.includes('beyond push-to-talk')) {
    return {
      tabId: '3-5',
      roomCode: '3-5',
      roomName: "Just Can't Get Enough",
      time: '14:00 – 14:45',
    };
  }
  if (t.includes('gemini enterprise')) {
    return {
      tabId: '3-5',
      roomCode: '3-5',
      roomName: "Just Can't Get Enough",
      time: '15:00 – 15:45',
    };
  }

  // World 4-4 · Under Pressure
  if (t.includes('real-time rag')) {
    return {
      tabId: '4-4',
      roomCode: '4-4',
      roomName: 'Under Pressure',
      time: '10:15 – 11:00',
    };
  }
  if (t.includes('gold team')) {
    return {
      tabId: '4-4',
      roomCode: '4-4',
      roomName: 'Under Pressure',
      time: '11:15 – 12:00',
    };
  }
  if (t.includes('gemini live: architecting')) {
    return {
      tabId: '4-4',
      roomCode: '4-4',
      roomName: 'Under Pressure',
      time: '13:00 – 13:45',
    };
  }
  if (t.includes('taekwondo') || t.includes('black belts')) {
    return {
      tabId: '4-4',
      roomCode: '4-4',
      roomName: 'Under Pressure',
      time: '14:00 – 14:45',
    };
  }
  if (t.includes('edge ai on mobile')) {
    return {
      tabId: '4-4',
      roomCode: '4-4',
      roomName: 'Under Pressure',
      time: '15:00 – 15:45',
    };
  }
  if (t.includes('terminal to stadium')) {
    return {
      tabId: '4-4',
      roomCode: '4-4',
      roomName: 'Under Pressure',
      time: '16:00 – 16:45',
    };
  }

  // World 4-5 · Never Gonna Give You Up
  if (t.includes('webmcp')) {
    return {
      tabId: '4-5',
      roomCode: '4-5',
      roomName: 'Never Gonna Give You Up',
      time: '10:15 – 11:00',
    };
  }
  if (t.includes('attention attention everywhere')) {
    return {
      tabId: '4-5',
      roomCode: '4-5',
      roomName: 'Never Gonna Give You Up',
      time: '11:15 – 12:00',
    };
  }
  if (t.includes('boîte noire') || t.includes('interprétabilité')) {
    return {
      tabId: '4-5',
      roomCode: '4-5',
      roomName: 'Never Gonna Give You Up',
      time: '13:00 – 13:45',
    };
  }
  if (t.includes('appfunctions')) {
    return {
      tabId: '4-5',
      roomCode: '4-5',
      roomName: 'Never Gonna Give You Up',
      time: '14:00 – 14:45',
    };
  }
  if (t.includes('think fast and slow')) {
    return {
      tabId: '4-5',
      roomCode: '4-5',
      roomName: 'Never Gonna Give You Up',
      time: '16:00 – 16:45',
    };
  }

  // World 4-6 · Hip To Be Square (Workshops)
  if (t.includes('troubleshooting')) {
    return {
      tabId: '4-6',
      roomCode: '4-6',
      roomName: 'Hip To Be Square',
      time: '10:15 – 11:45',
    };
  }
  if (t.includes('productivity assistant on cloud run')) {
    return {
      tabId: '4-6',
      roomCode: '4-6',
      roomName: 'Hip To Be Square',
      time: '13:15 – 14:45',
    };
  }
  if (t.includes('automatisez la gestion des admissions')) {
    return {
      tabId: '4-6',
      roomCode: '4-6',
      roomName: 'Hip To Be Square',
      time: '15:00 – 16:30',
    };
  }

  return null;
}

function renderLocatePin(location: SessionLocation | null, isFr: boolean) {
  if (!location) return null;

  const href =
    location.tabId === 'map'
      ? '/schedule?room=map'
      : `/schedule?room=${location.tabId}#room-${location.tabId}`;

  return (
    <Link
      href={href}
      title={`${isFr ? 'Localiser' : 'Locate'}: World ${location.roomCode} · ${location.roomName} (${location.time})`}
      className="group/locate relative ml-auto inline-flex items-center gap-1 rounded border border-cyan-400/35 bg-cyan-400/10 px-1.5 py-0.5 font-mono-tech text-[9px] tracking-wider text-cyan-300 transition-all hover:border-cyan-400 hover:bg-cyan-400/20 hover:text-white hover:shadow-[0_0_12px_rgba(0,240,255,0.3)]"
    >
      <MapPin className="h-2.5 w-2.5 text-cyan-400 shrink-0 transition-transform group-hover/locate:scale-110" />
      <span className="font-bold">{location.roomCode}</span>
      <span className="text-cyan-400/50">·</span>
      <span>{location.time}</span>

      {/* Hover Tooltip */}
      <span className="pointer-events-none absolute bottom-full right-0 mb-1.5 hidden w-max max-w-[230px] flex-col gap-0.5 rounded-lg border border-cyan-400/50 bg-[#070b16]/95 px-2.5 py-1.5 text-left shadow-[0_8px_25px_rgba(0,0,0,0.85)] backdrop-blur-xl group-hover/locate:flex z-30">
        <span className="font-mono-tech text-[9px] uppercase tracking-widest text-cyan-400">
          {isFr ? 'Salle & Horaire' : 'Room & Time'}
        </span>
        <span className="font-display text-[11px] font-bold text-white">
          World {location.roomCode} · {location.roomName}
        </span>
        <span className="font-mono-tech text-[10px] text-white/75">
          {location.time}
        </span>
      </span>
    </Link>
  );
}

function parseSessionDetails(
  formatStr?: string,
  topicStr?: string,
): {
  type: SessionType;
  duration?: string;
  title: string;
} {
  const normFormat = (formatStr || '').toLowerCase();
  const normTopic = (topicStr || '').toLowerCase();

  let type: SessionType = 'talk';
  if (
    normFormat.includes('keynote') ||
    normTopic.startsWith('keynote') ||
    normTopic.includes("mot d'ouverture") ||
    normTopic.includes('mot de fin') ||
    normTopic.includes('mot de clôture')
  ) {
    type = 'keynote';
  } else if (
    normFormat.includes('coaching') ||
    normFormat.includes('mentorat') ||
    normTopic.startsWith('coaching') ||
    normTopic.includes('career coaching') ||
    normTopic.includes('mentorat')
  ) {
    type = 'coaching';
  } else if (normFormat.includes('lightning') && normFormat.includes('panel')) {
    type = 'lightning-panel';
  } else if (normFormat.includes('panel') || normTopic.startsWith('panel')) {
    type = 'panel';
  } else if (
    normFormat.includes('workshop') ||
    normFormat.includes('atelier') ||
    normTopic.startsWith('workshop:') ||
    normTopic.startsWith('atelier:')
  ) {
    type = 'workshop';
  } else if (normFormat.includes('lightning')) {
    type = 'lightning';
  }

  // Extract duration if present, e.g. "Talk · 40 min" -> "40 min"
  let duration: string | undefined;
  if (formatStr && formatStr.includes('·')) {
    duration = formatStr.split('·')[1]?.trim();
  }

  // Clean topic title
  let title = topicStr || '';
  title = title
    .replace(
      /^(talk|workshop|panel|atelier|conférence|conference|keynote|coaching|1:1 coaching|career coaching|mentorat)\s*[-–—:]\s*/i,
      '',
    )
    .trim();

  return { type, duration, title };
}

function renderSessionBadgeAndIcon(type: SessionType) {
  switch (type) {
    case 'keynote':
      return (
        <>
          <Sparkles className="h-3.5 w-3.5 text-yellow-400 shrink-0" />
          <span className="inline-flex items-center rounded px-1.5 py-0.5 font-mono-tech text-[9px] uppercase tracking-wider font-bold border border-yellow-400/40 bg-yellow-400/10 text-yellow-300">
            Keynote
          </span>
        </>
      );
    case 'coaching':
      return (
        <>
          <GraduationCap className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span className="inline-flex items-center rounded px-1.5 py-0.5 font-mono-tech text-[9px] uppercase tracking-wider font-bold border border-emerald-400/40 bg-emerald-400/10 text-emerald-300">
            1:1 Coaching
          </span>
        </>
      );
    case 'workshop':
      return (
        <>
          <Laptop className="h-3.5 w-3.5 text-google-red shrink-0" />
          <span className="inline-flex items-center rounded px-1.5 py-0.5 font-mono-tech text-[9px] uppercase tracking-wider font-bold border border-google-red/40 bg-google-red/10 text-google-red">
            Workshop
          </span>
        </>
      );
    case 'panel':
      return (
        <>
          <Users2 className="h-3.5 w-3.5 text-orange-400 shrink-0" />
          <span className="inline-flex items-center rounded px-1.5 py-0.5 font-mono-tech text-[9px] uppercase tracking-wider font-bold border border-orange-500/40 bg-orange-500/10 text-orange-400">
            Panel
          </span>
        </>
      );
    case 'lightning-panel':
      return (
        <>
          <Zap className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <span className="inline-flex items-center rounded px-1.5 py-0.5 font-mono-tech text-[9px] uppercase tracking-wider font-bold border border-orange-500/40 bg-orange-500/10 text-orange-400">
            Lightning Panel
          </span>
        </>
      );
    case 'lightning':
      return (
        <>
          <Zap className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <span className="inline-flex items-center rounded px-1.5 py-0.5 font-mono-tech text-[9px] uppercase tracking-wider font-bold border border-amber-400/40 bg-amber-400/10 text-amber-300">
            Lightning
          </span>
        </>
      );
    case 'talk':
    default:
      return (
        <>
          <Mic className="h-3.5 w-3.5 text-google-blue shrink-0" />
          <span className="inline-flex items-center rounded px-1.5 py-0.5 font-mono-tech text-[9px] uppercase tracking-wider font-bold border border-google-blue/40 bg-google-blue/10 text-google-blue">
            Talk
          </span>
        </>
      );
  }
}

function renderTopicSections(
  topic: string,
  format?: string,
  isFr: boolean = false,
) {
  const topicLines = topic
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const formatLines = (format || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  if (topicLines.length > 1) {
    return (
      <div className="space-y-3 mt-4 pt-3 border-t border-white/5">
        {topicLines.map((topicLine, idx) => {
          const formatLine =
            formatLines[idx] ||
            (topicLine.toLowerCase().startsWith('workshop:')
              ? 'Workshop'
              : 'Talk');
          const session = parseSessionDetails(formatLine, topicLine);
          const location = getSessionLocation(
            session.title,
            session.type,
            isFr,
          );

          return (
            <div key={idx} className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-1.5">
                {renderSessionBadgeAndIcon(session.type)}
                {session.duration && (
                  <span className="font-mono-tech text-[10px] text-white/50 tracking-wider">
                    · {session.duration}
                  </span>
                )}
                {renderLocatePin(location, isFr)}
              </div>
              <p className="font-sans text-xs text-white/80 leading-relaxed pl-5">
                {session.title}
              </p>
            </div>
          );
        })}
      </div>
    );
  }

  const session = parseSessionDetails(format, topic);
  const location = getSessionLocation(session.title, session.type, isFr);

  return (
    <div className="space-y-1.5 mt-4 pt-3 border-t border-white/5">
      <div className="flex flex-wrap items-center gap-1.5">
        {renderSessionBadgeAndIcon(session.type)}
        {session.duration && (
          <span className="font-mono-tech text-[10px] text-white/50 tracking-wider">
            · {session.duration}
          </span>
        )}
        {renderLocatePin(location, isFr)}
      </div>
      <p className="font-sans text-xs text-white/80 leading-relaxed pl-5 line-clamp-4">
        {session.title}
      </p>
    </div>
  );
}

function getSpeakerCategories(speaker: SpeakerItem): SpeakerCategory[] {
  if (speaker.categories && speaker.categories.length > 0) {
    return speaker.categories;
  }
  return speaker.category ? [speaker.category] : [];
}

export function SpeakersGrid({
  copy,
  locale = 'en',
}: {
  copy: SpeakersGridCopy;
  locale?: string;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const isFr = locale === 'fr';

  const filterTabs = [
    { id: 'all', label: copy.filter_all },
    { id: 'ai', label: copy.filter_ai },
    { id: 'cloud', label: copy.filter_cloud },
    { id: 'appdev', label: copy.filter_appdev },
    { id: 'community', label: copy.filter_community },
  ];

  const filteredSpeakers = useMemo(() => {
    return copy.items.filter((speaker) => {
      const categories = getSpeakerCategories(speaker);
      const matchesCategory =
        selectedCategory === 'all' ||
        categories.includes(selectedCategory as SpeakerCategory) ||
        (selectedCategory === 'appdev' && categories.includes('mobile'));

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        speaker.name.toLowerCase().includes(query) ||
        (speaker.title && speaker.title.toLowerCase().includes(query)) ||
        (speaker.gde && 'gde'.includes(query)) ||
        (speaker.googler && 'googler'.includes(query)) ||
        (speaker.employer && speaker.employer.toLowerCase().includes(query)) ||
        (speaker.format && speaker.format.toLowerCase().includes(query)) ||
        speaker.topic.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [copy.items, selectedCategory, searchQuery]);

  const { googlersCount, gdesCount } = useMemo(() => {
    let googlers = 0;
    let gdes = 0;
    for (const speaker of filteredSpeakers) {
      if (speaker.googler || speaker.employer?.toLowerCase() === 'google') {
        googlers += 1;
      }
      if (speaker.gde) {
        gdes += 1;
      }
    }
    return { googlersCount: googlers, gdesCount: gdes };
  }, [filteredSpeakers]);

  const breakdownText = useMemo(() => {
    const parts: string[] = [];
    if (googlersCount > 0) {
      parts.push(
        `${googlersCount} ${googlersCount === 1 ? 'Googler' : 'Googlers'}`,
      );
    }
    if (gdesCount > 0) {
      parts.push(`${gdesCount} ${gdesCount === 1 ? 'GDE' : 'GDEs'}`);
    }
    if (parts.length === 0) return '';
    const joined = isFr ? parts.join(' et ') : parts.join(' and ');
    return isFr ? `(incluant ${joined})` : `(including ${joined})`;
  }, [googlersCount, gdesCount, isFr]);

  return (
    <div className="space-y-12">
      {/* Controls Bar: Search + Category Filters */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 border-b border-white/10 pb-8">
        {/* Search Input */}
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={copy.search_placeholder}
            className="w-full rounded-none border border-white/15 bg-[#0a0a0a]/80 py-3 pl-11 pr-4 font-mono-tech text-xs tracking-wider text-white placeholder-white/40 outline-none transition-colors focus:border-cyan-400 focus:bg-white/[0.04]"
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
          {filterTabs.map((tab) => {
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

      {/* Results Counter */}
      <div className="flex items-center justify-between text-white/40 font-mono-tech text-xs tracking-widest">
        <div className="flex items-center gap-2 flex-wrap">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
          <span>
            <span className="uppercase">
              {filteredSpeakers.length}{' '}
              {isFr
                ? filteredSpeakers.length === 1
                  ? 'Conférencier'
                  : 'Conférenciers'
                : filteredSpeakers.length === 1
                  ? 'Speaker'
                  : 'Speakers'}
            </span>
            {breakdownText && (
              <span className="ml-2 text-white/55">{breakdownText}</span>
            )}
          </span>
        </div>
      </div>

      {/* Grid */}
      {filteredSpeakers.length === 0 ? (
        <div className="py-24 text-center border border-white/5 bg-[#0a0a0a]/50 p-8 quad-border-tr">
          <p className="font-mono-tech text-sm text-white/50 tracking-wider">
            {copy.no_results}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
          {filteredSpeakers.map((speaker, index) => {
            const style = cardStyles[index % cardStyles.length];
            const isLinkedin = speaker.link.includes('linkedin.com');

            return (
              <div
                key={speaker.name}
                className={`group relative flex flex-col justify-between border border-white/10 bg-[#0a0f1d]/80 quad-border-tr p-5 backdrop-blur-xl transition-all duration-300 hover:border-transparent hover:scale-[1.02] hover:bg-[#0c1326] ${style.shadowHover}`}
              >
                {/* Visual hover border highlight */}
                <div
                  className={`pointer-events-none absolute inset-0 border border-transparent transition-colors duration-300 quad-border-tr ${style.borderHover}`}
                />

                <div>
                  {/* Photo with Cyberpunk Scanlines */}
                  <div className="relative aspect-square w-full overflow-hidden mb-5 bg-white/5 border border-white/10 quad-border-tr quad-border-bl">
                    <Image
                      src={speaker.image}
                      alt={speaker.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out"
                    />
                    {/* CRT Scanline overlay on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-15 pointer-events-none transition-opacity duration-300 bg-gradient-to-b from-transparent via-white/50 to-transparent bg-[length:100%_4px]" />
                    {speaker.gde && (
                      <div
                        title="Google Developer Expert (GDE)"
                        className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5 rounded-full border border-white/25 bg-[#0a0f1d]/90 px-2.5 py-1 font-mono-tech text-[10px] font-bold tracking-wider text-white uppercase shadow-[0_4px_12px_rgba(0,0,0,0.6)] backdrop-blur-md"
                      >
                        <svg
                          viewBox="0 0 24 18"
                          className="h-3 w-3.5 shrink-0"
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
                      </div>
                    )}
                    {(speaker.googler ||
                      speaker.employer?.toLowerCase() === 'google') && (
                      <div
                        title="Google"
                        className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5 rounded-full border border-white/25 bg-[#0a0f1d]/90 px-2.5 py-1 font-mono-tech text-[10px] font-bold tracking-wider text-white uppercase shadow-[0_4px_12px_rgba(0,0,0,0.6)] backdrop-blur-md"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="h-3.5 w-3.5 shrink-0"
                          aria-hidden="true"
                        >
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        <span>Google</span>
                      </div>
                    )}
                  </div>

                  {/* Speaker Info */}
                  <div>
                    <h3
                      className={`font-display text-lg font-bold uppercase tracking-tight text-white transition-colors ${style.textHover}`}
                    >
                      {speaker.name}
                    </h3>

                    {/* Title & Employer */}
                    <div className="mt-1 flex flex-col gap-0.5 min-h-[36px]">
                      {speaker.title && (
                        <p className="font-mono-tech text-xs text-google-yellow font-medium tracking-wide">
                          {speaker.title}
                        </p>
                      )}
                      {speaker.employer && (
                        <p className="font-sans text-xs text-white/55">
                          {speaker.employer}
                        </p>
                      )}
                    </div>

                    {/* Topic Rendering with Blue Talk, Red Workshop, Orange Panel, Amber Lightning, Yellow Keynote & Green Coaching icons */}
                    {renderTopicSections(speaker.topic, speaker.format, isFr)}
                  </div>
                </div>

                {/* Bottom Bar: Category Badge + LinkedIn Link */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {getSpeakerCategories(speaker).map((cat, idx) => {
                      const label =
                        cat === 'mobile' || cat === 'appdev'
                          ? 'APPDEV'
                          : cat.toUpperCase();
                      return (
                        <span
                          key={cat}
                          className="font-mono-tech text-[10px] tracking-widest text-white/50 uppercase"
                        >
                          {idx > 0 && (
                            <span className="text-white/20 mr-1.5 font-normal">
                              /
                            </span>
                          )}
                          {label}
                        </span>
                      );
                    })}
                  </div>

                  {speaker.link && (
                    <a
                      href={speaker.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex h-9 w-9 items-center justify-center border border-white/15 bg-white/[0.03] text-white/80 transition-all rounded-none ${style.btnHover}`}
                      aria-label={`${speaker.name} profile`}
                    >
                      {isLinkedin ? (
                        <FaLinkedin className="h-5 w-5" />
                      ) : (
                        <ExternalLink
                          className="h-[18px] w-[18px]"
                          strokeWidth={2.5}
                        />
                      )}
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
