'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  ExternalLink,
  GraduationCap,
  Laptop,
  Mic,
  RotateCcw,
  Search,
  Sparkles,
  Users2,
  Zap,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { FaLinkedin } from 'react-icons/fa';

export type SpeakerCategory =
  'ai' | 'cloud' | 'appdev' | 'community' | 'mobile';

export type SpeakerItem = {
  name: string;
  title?: string;
  employer?: string;
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
  } else if (
    normFormat.includes('lightning') ||
    normFormat.includes('éclair')
  ) {
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

function renderSessionBadgeAndIcon(type: SessionType, locale?: string) {
  const isFr = locale === 'fr';
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
            {isFr ? 'Mentorat 1:1' : '1:1 Coaching'}
          </span>
        </>
      );
    case 'workshop':
      return (
        <>
          <Laptop className="h-3.5 w-3.5 text-google-red shrink-0" />
          <span className="inline-flex items-center rounded px-1.5 py-0.5 font-mono-tech text-[9px] uppercase tracking-wider font-bold border border-google-red/40 bg-google-red/10 text-google-red">
            {isFr ? 'Atelier' : 'Workshop'}
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
            {isFr ? 'Panel éclair' : 'Lightning Panel'}
          </span>
        </>
      );
    case 'lightning':
      return (
        <>
          <Zap className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <span className="inline-flex items-center rounded px-1.5 py-0.5 font-mono-tech text-[9px] uppercase tracking-wider font-bold border border-amber-400/40 bg-amber-400/10 text-amber-300">
            {isFr ? 'Éclair' : 'Lightning'}
          </span>
        </>
      );
    case 'talk':
    default:
      return (
        <>
          <Mic className="h-3.5 w-3.5 text-google-blue shrink-0" />
          <span className="inline-flex items-center rounded px-1.5 py-0.5 font-mono-tech text-[9px] uppercase tracking-wider font-bold border border-google-blue/40 bg-google-blue/10 text-google-blue">
            {isFr ? 'Conférence' : 'Talk'}
          </span>
        </>
      );
  }
}

export type SpeakerSession = {
  type: SessionType;
  duration?: string;
  title: string;
};

export function getSpeakerSessions(
  topicStr: string,
  formatStr?: string,
): SpeakerSession[] {
  const topicLines = topicStr
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const formatLines = (formatStr || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  if (topicLines.length > 1) {
    return topicLines.map((topicLine, idx) => {
      const formatLine =
        formatLines[idx] ||
        (topicLine.toLowerCase().startsWith('workshop:') ||
        topicLine.toLowerCase().startsWith('atelier:')
          ? 'Workshop · 90 min'
          : topicLine.toLowerCase().startsWith('keynote:')
            ? 'Keynote'
            : topicLine.toLowerCase().startsWith('panel:')
              ? 'Panel · 40 min'
              : topicLine.toLowerCase().includes('coaching') ||
                  topicLine.toLowerCase().includes('mentorat')
                ? '1:1 coaching · 25 min'
                : 'Talk · 40 min');
      return parseSessionDetails(formatLine, topicLine);
    });
  }

  return [parseSessionDetails(formatStr, topicStr)];
}

function getSpeakerCategories(speaker: SpeakerItem): SpeakerCategory[] {
  if (speaker.categories && speaker.categories.length > 0) {
    return speaker.categories;
  }
  return speaker.category ? [speaker.category] : [];
}

type SpeakerCardProps = {
  speaker: SpeakerItem;
  index: number;
};

function SpeakerCard({ speaker, index }: SpeakerCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
  const locale = useLocale();
  const isFr = locale === 'fr';
  const t = useTranslations('SpeakersPage');

  const style = cardStyles[index % cardStyles.length];
  const isLinkedin = speaker.link.includes('linkedin.com');
  const sessions = useMemo(
    () => getSpeakerSessions(speaker.topic, speaker.format),
    [speaker.topic, speaker.format],
  );
  const totalSessions = sessions.length;
  const currentSession = sessions[currentSessionIndex] || sessions[0];

  const handleCardClick = () => {
    if (!isFlipped) {
      setIsFlipped(true);
    } else {
      if (totalSessions > 1 && currentSessionIndex < totalSessions - 1) {
        setCurrentSessionIndex((prev) => prev + 1);
      } else {
        setIsFlipped(false);
        setTimeout(() => {
          setCurrentSessionIndex(0);
        }, 300);
      }
    }
  };

  const handleFlipBack = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentSessionIndex(0);
    }, 300);
  };

  return (
    <div className="perspective-1000 h-full select-none">
      <div
        className={`relative w-full h-full preserve-3d transition-transform duration-500 ease-in-out ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* FRONT FACE */}
        <div
          onClick={handleCardClick}
          className={`group relative flex flex-col justify-between border border-white/10 bg-[#0a0f1d]/80 quad-border-tr p-5 backdrop-blur-xl transition-all duration-300 hover:border-transparent hover:scale-[1.02] hover:bg-[#0c1326] cursor-pointer backface-hidden ${
            style.shadowHover
          } ${isFlipped ? 'pointer-events-none' : 'pointer-events-auto'}`}
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

              {/* Sessions indicator pill */}
              <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5 bg-[#0a0f1d]/90 border border-white/20 px-2.5 py-1 font-mono-tech text-[10px] font-bold uppercase tracking-wider text-cyan-300 backdrop-blur-md">
                <Sparkles className="h-3 w-3 text-cyan-400" />
                {totalSessions > 1
                  ? t('card_session_multiple', { count: totalSessions })
                  : t('card_session_single')}
              </div>
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

              {/* Click to Flip prompt */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <div className="font-mono-tech text-xs text-cyan-400 group-hover:text-cyan-300 transition-colors">
                  {isFr ? (
                    <div className="flex flex-col leading-tight">
                      <span className="font-medium">
                        {totalSessions > 1 ? 'Voir les' : 'Voir la'}
                      </span>
                      <span className="font-medium inline-flex items-center gap-1.5">
                        <span>
                          {totalSessions > 1 ? 'sessions' : 'session'}
                        </span>
                        <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                          →
                        </span>
                      </span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5">
                      <span className="font-medium">
                        {totalSessions > 1
                          ? t('card_view_talk_multiple')
                          : t('card_view_talk_single')}
                      </span>
                      <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  )}
                </div>

                {isFr ? (
                  <div className="shrink-0 text-right font-mono-tech text-[10px] text-white/40 tracking-wider uppercase group-hover:text-white/70 transition-colors flex flex-col items-end leading-tight">
                    <span>CLIQUER POUR</span>
                    <span className="flex items-center gap-1">
                      <span>RETOURNER</span>
                      <span className="text-[11px] leading-none">↷</span>
                    </span>
                  </div>
                ) : (
                  <span className="font-mono-tech text-[10px] text-white/40 tracking-wider uppercase group-hover:text-white/70 transition-colors flex items-center gap-1">
                    {t('card_click_to_flip')}
                  </span>
                )}
              </div>
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

            <a
              href={speaker.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`inline-flex h-9 w-9 items-center justify-center border border-white/15 bg-white/[0.03] text-white/80 transition-all rounded-none ${style.btnHover}`}
              aria-label={
                isFr ? `Profil de ${speaker.name}` : `${speaker.name} profile`
              }
            >
              {isLinkedin ? (
                <FaLinkedin className="h-5 w-5" />
              ) : (
                <ExternalLink className="h-[18px] w-[18px]" strokeWidth={2.5} />
              )}
            </a>
          </div>
        </div>

        {/* BACK FACE (FLIPPED) */}
        <div
          onClick={handleCardClick}
          className={`group absolute inset-0 w-full h-full flex flex-col justify-between border border-white/10 bg-[#0a0f1d] quad-border-tr p-5 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:bg-[#0c1326] cursor-pointer rotate-y-180 backface-hidden ${
            style.shadowHover
          } ${isFlipped ? 'pointer-events-auto' : 'pointer-events-none'}`}
        >
          {/* Visual hover border highlight */}
          <div
            className={`pointer-events-none absolute inset-0 border border-transparent transition-colors duration-300 quad-border-tr ${style.borderHover}`}
          />

          {/* Back Header: Speaker avatar thumbnail + name + flip back button */}
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-white/20 bg-white/5">
                <Image
                  src={speaker.image}
                  alt={speaker.name}
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <h4 className="font-display text-xs font-bold uppercase tracking-tight text-white truncate">
                  {speaker.name}
                </h4>
                <p className="font-mono-tech text-[9px] text-google-yellow truncate">
                  {speaker.title ||
                    speaker.employer ||
                    (isFr ? 'Conférencier' : 'Speaker')}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFlipBack}
              className="shrink-0 inline-flex items-center gap-1 border border-white/15 bg-white/[0.04] px-2 py-0.5 font-mono-tech text-[9px] uppercase tracking-wider text-white/70 transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white cursor-pointer"
              aria-label={t('card_flip_back')}
            >
              <RotateCcw className="h-2.5 w-2.5" />
              <span>{t('card_back')}</span>
            </button>
          </div>

          {/* Back Center: Talk / Session Information */}
          <div className="my-auto py-3 flex flex-col gap-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSessionIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-3"
              >
                {/* Session Type Badge + Duration */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    {renderSessionBadgeAndIcon(currentSession.type, locale)}
                    {currentSession.duration && (
                      <span className="font-mono-tech text-[10px] text-white/60 tracking-wider">
                        ·{' '}
                        {isFr && currentSession.duration === 'drop-in showcase'
                          ? 'kiosque en accès libre'
                          : currentSession.duration}
                      </span>
                    )}
                  </div>

                  {totalSessions > 1 && (
                    <span className="inline-flex items-center rounded px-1.5 py-0.5 font-mono-tech text-[9px] uppercase tracking-wider font-semibold border border-cyan-400/40 bg-cyan-400/10 text-cyan-300">
                      {t('card_session_count', {
                        current: currentSessionIndex + 1,
                        total: totalSessions,
                      })}
                    </span>
                  )}
                </div>

                {/* Talk Title */}
                <div className="relative pl-3.5 border-l-2 border-cyan-400">
                  <p className="font-mono-tech text-[9px] uppercase tracking-widest text-cyan-400/80 mb-1">
                    {t('card_session_topic')}
                  </p>
                  <h3 className="font-display text-base font-bold leading-snug text-white">
                    {currentSession.title}
                  </h3>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Interaction Prompt Bar */}
            {totalSessions > 1 ? (
              <div className="mt-1 flex items-center justify-between rounded border border-cyan-500/30 bg-cyan-950/30 px-3 py-1.5 text-xs font-mono-tech text-cyan-300">
                {currentSessionIndex < totalSessions - 1 ? (
                  <span className="flex items-center gap-1.5 text-[11px]">
                    {t('card_next_talk')}
                    <ArrowRight className="h-3 w-3 inline animate-pulse text-cyan-400" />
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-[11px] text-white/70">
                    {t('card_flip_back')}
                    <RotateCcw className="h-3 w-3 inline" />
                  </span>
                )}
                <span className="text-[10px] text-cyan-400/70 uppercase">
                  {currentSessionIndex + 1}/{totalSessions}
                </span>
              </div>
            ) : (
              <div className="mt-1 flex items-center rounded border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs font-mono-tech text-white/40">
                <span className="flex items-center gap-1.5 text-[10px]">
                  <RotateCcw className="h-3 w-3" />
                  {t('card_flip_back')}
                </span>
              </div>
            )}
          </div>

          {/* Back Bottom Bar: Navigation / Dots on Left + NUMBER OF SESSIONS IN BOTTOM RIGHT CORNER (e.g. 1/2) */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center gap-2">
              {totalSessions > 1 ? (
                <div className="flex items-center gap-1.5">
                  {sessions.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentSessionIndex(idx);
                      }}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === currentSessionIndex
                          ? 'w-6 bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.6)]'
                          : 'w-2 bg-white/20 hover:bg-white/50'
                      }`}
                      aria-label={t('card_go_to_talk', { index: idx + 1 })}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {getSpeakerCategories(speaker).map((cat) => (
                    <span
                      key={cat}
                      className="font-mono-tech text-[10px] tracking-widest text-white/40 uppercase"
                    >
                      {cat.toUpperCase()}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Right Corner: Number of sessions i.e.: 1/2 */}
            <div
              className="font-mono-tech text-xs font-bold tracking-widest text-cyan-300 bg-cyan-950/70 border border-cyan-400/50 px-2.5 py-1 quad-border-tr shadow-[0_0_12px_rgba(0,240,255,0.25)] flex items-center gap-1"
              title={t('card_session_count', {
                current: currentSessionIndex + 1,
                total: totalSessions,
              })}
            >
              <span>{currentSessionIndex + 1}</span>
              <span className="text-white/40">/</span>
              <span>{totalSessions}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SpeakersGrid({ copy }: { copy: SpeakersGridCopy }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const locale = useLocale();
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
              {isFr ? 'EFFACER' : 'CLEAR'}
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
            {filteredSpeakers.length === 1
              ? isFr
                ? 'Conférencier'
                : 'Speaker'
              : isFr
                ? 'Conférenciers'
                : 'Speakers'}
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
          {filteredSpeakers.map((speaker, index) => (
            <SpeakerCard key={speaker.name} speaker={speaker} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
