'use client';

import {
  ExternalLink,
  GraduationCap,
  Laptop,
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

function renderTopicSections(topic: string, format?: string) {
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

          return (
            <div key={idx} className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                {renderSessionBadgeAndIcon(session.type)}
                {session.duration && (
                  <span className="font-mono-tech text-[10px] text-white/50 tracking-wider">
                    · {session.duration}
                  </span>
                )}
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

  return (
    <div className="space-y-1.5 mt-4 pt-3 border-t border-white/5">
      <div className="flex items-center gap-2">
        {renderSessionBadgeAndIcon(session.type)}
        {session.duration && (
          <span className="font-mono-tech text-[10px] text-white/50 tracking-wider">
            · {session.duration}
          </span>
        )}
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

export function SpeakersGrid({ copy }: { copy: SpeakersGridCopy }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

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
        (speaker.employer && speaker.employer.toLowerCase().includes(query)) ||
        (speaker.format && speaker.format.toLowerCase().includes(query)) ||
        speaker.topic.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [copy.items, selectedCategory, searchQuery]);

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
      <div className="flex items-center justify-between text-white/40 font-mono-tech text-xs tracking-widest uppercase">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span>
            {filteredSpeakers.length}{' '}
            {filteredSpeakers.length === 1 ? 'Speaker' : 'Speakers'}
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
                        className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 rounded-full border border-white/25 bg-[#0a0f1d]/90 px-2.5 py-1 font-mono-tech text-[10px] font-bold tracking-wider text-white uppercase shadow-[0_4px_12px_rgba(0,0,0,0.6)] backdrop-blur-md"
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
                      {(speaker.title || speaker.gde) && (
                        <p className="font-mono-tech text-xs text-google-yellow font-medium tracking-wide">
                          {speaker.title
                            ? speaker.gde &&
                              !speaker.title.includes('(GDE)') &&
                              speaker.title !== 'GDE'
                              ? `${speaker.title} (GDE)`
                              : speaker.title
                            : 'GDE'}
                        </p>
                      )}
                      {speaker.employer && (
                        <p className="font-sans text-xs text-white/55">
                          {speaker.employer}
                        </p>
                      )}
                    </div>

                    {/* Topic Rendering with Blue Talk, Red Workshop, Orange Panel, Amber Lightning, Yellow Keynote & Green Coaching icons */}
                    {renderTopicSections(speaker.topic, speaker.format)}
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
