'use client';

import {
  Clock,
  Coffee,
  Footprints,
  Gamepad2,
  Laptop,
  Mic,
  PartyPopper,
  Sparkles,
  Store,
  Users2,
  Utensils,
} from 'lucide-react';

export type TimelineItem = {
  time: string;
  title: string;
  subtitle: string;
  badge?: string;
};

export type AllDayItem = {
  title: string;
  subtitle: string;
  meta: string;
  color: 'green' | 'cyan' | 'blue';
};

export type OverallDayAgendaCopy = {
  level_map_badge: string;
  title: string;
  subtitle: string;
  hud_footer: string;
  timeline: TimelineItem[];
  all_day: {
    title: string;
    subtitle: string;
    items: AllDayItem[];
  };
};

type OverallDayAgendaProps = {
  copy: OverallDayAgendaCopy;
};

const getTimelineIcon = (index: number) => {
  switch (index) {
    case 0:
      return <Coffee className="h-4 w-4 text-google-yellow" />;
    case 1:
      return <Mic className="h-4 w-4 text-google-blue" />;
    case 2:
      return <Laptop className="h-4 w-4 text-google-green" />;
    case 3:
      return <Utensils className="h-4 w-4 text-google-yellow" />;
    case 4:
      return <Laptop className="h-4 w-4 text-google-green" />;
    case 5:
      return <Footprints className="h-4 w-4 text-google-red" />;
    case 6:
      return <PartyPopper className="h-4 w-4 text-google-yellow" />;
    default:
      return <Clock className="h-4 w-4 text-white/60" />;
  }
};

export function OverallDayAgenda({ copy }: OverallDayAgendaProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-[#070b16]/90 p-6 md:p-10 shadow-[0_0_50px_rgba(0,240,255,0.06)] backdrop-blur-2xl">
      {/* Ambient Top Glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
      <div className="pointer-events-none absolute -top-24 left-1/4 h-56 w-56 rounded-full bg-cyan-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute -top-24 right-1/4 h-56 w-56 rounded-full bg-google-yellow/10 blur-[100px]" />

      {/* Header HUD Bar */}
      <div className="mb-8 border-b border-white/10 pb-6">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-mono-tech text-[11px] uppercase tracking-[0.25em] text-cyan-400">
            {copy.level_map_badge}
          </span>
        </div>
        <h3 className="mt-2 font-display text-3xl md:text-5xl font-bold tracking-tight text-white uppercase">
          {copy.title}
        </h3>
        <p className="font-mono-tech text-sm tracking-wider text-cyan-200/60 uppercase mt-1">
          {copy.subtitle}
        </p>
      </div>

      {/* Content Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
        {/* Left Column: Timeline List */}
        <div className="space-y-3.5 lg:col-span-8">
          {copy.timeline.map((item, index) => (
            <div
              key={`${item.time}-${index}`}
              className="group relative flex flex-col md:flex-row md:items-center justify-between gap-3 overflow-hidden rounded-xl border border-white/10 bg-[#0d1326]/75 px-5 py-4 backdrop-blur-md transition-all duration-300 hover:border-cyan-400/40 hover:bg-[#121933]/90 hover:shadow-[0_0_20px_rgba(0,240,255,0.08)]"
            >
              {/* Visual Accent bar on hover */}
              <div className="absolute inset-y-0 left-0 w-1 bg-cyan-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="flex items-start md:items-center gap-4">
                {/* Icon */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] transition-colors group-hover:border-cyan-400/30 group-hover:bg-cyan-400/10">
                  {getTimelineIcon(index)}
                </div>

                {/* Time Badge */}
                <div className="min-w-[130px]">
                  <span className="font-mono-tech text-sm md:text-base font-bold text-google-yellow tracking-wider">
                    {item.time}
                  </span>
                </div>

                {/* Titles */}
                <div className="flex flex-col">
                  <span className="font-display text-base md:text-lg font-bold text-white transition-colors group-hover:text-cyan-200">
                    {item.title}
                  </span>
                  <span className="font-sans text-xs text-white/50 group-hover:text-white/70 transition-colors">
                    {item.subtitle}
                  </span>
                </div>
              </div>

              {/* Optional category badge */}
              {item.badge && (
                <div className="self-start md:self-center pl-13 md:pl-0">
                  <span className="inline-flex rounded border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono-tech text-[10px] uppercase tracking-wider text-white/60">
                    {item.badge}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Column: "ALL DAY / TOUTE LA JOURNÉE" Card */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-cyan-400/50 bg-[#090e1c]/90 p-6 md:p-7 shadow-[0_0_30px_rgba(0,240,255,0.12)] backdrop-blur-xl">
            <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-cyan-400/15 blur-[50px]" />

            <div>
              {/* Header */}
              <div className="border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  <h4 className="font-mono-tech text-sm font-bold tracking-[0.25em] text-cyan-400 uppercase">
                    {copy.all_day.title}
                  </h4>
                </div>
                <p className="font-mono-tech text-xs tracking-widest text-white/40 uppercase mt-0.5">
                  {copy.all_day.subtitle}
                </p>
              </div>

              {/* Items */}
              <div className="space-y-6">
                {copy.all_day.items.map((item, idx) => {
                  const colorStyles = {
                    green: {
                      dot: 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]',
                      meta: 'text-emerald-400',
                      icon: <Users2 className="h-4 w-4 text-emerald-400" />,
                    },
                    cyan: {
                      dot: 'bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.8)]',
                      meta: 'text-cyan-300',
                      icon: <Store className="h-4 w-4 text-cyan-300" />,
                    },
                    blue: {
                      dot: 'bg-sky-300 shadow-[0_0_12px_rgba(125,211,252,0.8)]',
                      meta: 'text-sky-300',
                      icon: <Gamepad2 className="h-4 w-4 text-sky-300" />,
                    },
                  }[item.color];

                  return (
                    <div
                      key={idx}
                      className="group flex items-start gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all duration-300 hover:border-cyan-400/30 hover:bg-white/[0.05]"
                    >
                      <div
                        className={`mt-1 h-5 w-5 shrink-0 rounded-full transition-transform duration-300 group-hover:scale-110 ${colorStyles.dot}`}
                      />
                      <div className="flex-1">
                        <h5 className="font-display text-base font-bold text-white transition-colors group-hover:text-cyan-200">
                          {item.title}
                        </h5>
                        <p className="font-sans text-xs text-white/50">
                          {item.subtitle}
                        </p>
                        <div className="mt-2 inline-flex items-center gap-1.5 font-mono-tech text-xs tracking-wider">
                          <span className={colorStyles.meta}>{item.meta}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card Footer Decorative Badge */}
            <div className="mt-8 border-t border-white/10 pt-4 flex items-center justify-between font-mono-tech text-[10px] text-white/40 uppercase tracking-widest">
              <span>Ax.C Hub · Montreal</span>
              <span className="text-cyan-400">Nov 6, 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Synthwave Sunset Horizon at the bottom */}
      <div className="relative mt-12 pt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-mono-tech text-xs tracking-[0.25em] text-white/40 uppercase">
          {copy.hud_footer}
        </span>

        {/* Retro Sun element */}
        <div className="flex items-center gap-3">
          <div className="h-4 w-8 rounded-t-full bg-gradient-to-t from-google-yellow to-google-red shadow-[0_0_15px_rgba(251,188,4,0.6)]" />
          <span className="font-mono-tech text-[10px] tracking-widest text-white/30 uppercase">
            GDG Montreal
          </span>
        </div>
      </div>
    </div>
  );
}
