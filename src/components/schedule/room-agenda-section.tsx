'use client';

import {
  CalendarRange,
  DoorOpen,
  Layers,
  MapPin,
  Sparkles,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import {
  OverallDayAgenda,
  type OverallDayAgendaCopy,
} from './overall-day-agenda';

export type LightningSubItem = {
  time: string;
  title: string;
  speakers: string;
};

export type RoomSessionItem = {
  kind?: 'session' | 'lunch' | 'open';
  variant?: 'yellow' | 'blue' | 'red';
  time: string;
  title: string;
  subtitle?: string;
  speakers?: string;
  duration?: string;
  lang?: string;
  subItems?: LightningSubItem[];
};

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
  filter_all: string;
  subject_to_change_note: string;
  rooms: RoomTrack[];
};

type RoomAgendaSectionProps = {
  tldrCopy: OverallDayAgendaCopy;
  copy: RoomAgendaSectionCopy;
};

export function RoomAgendaSection({ tldrCopy, copy }: RoomAgendaSectionProps) {
  const [selectedTab, setSelectedTab] = useState<string>('main');

  const visibleRooms =
    selectedTab === 'main'
      ? []
      : selectedTab === 'all'
        ? copy.rooms
        : copy.rooms.filter((room) => room.id === selectedTab);

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

        {/* Navigation Pills: Main Agenda + Each Room + All Rooms */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setSelectedTab('main')}
            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 font-mono-tech text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              selectedTab === 'main'
                ? 'border-cyan-400 bg-cyan-400/15 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/30 hover:text-white'
            }`}
          >
            <CalendarRange className="h-3.5 w-3.5" />
            <span>{copy.main_agenda_tab || 'Main Agenda (TL;DR)'}</span>
          </button>

          {copy.rooms.map((room) => {
            const isActive = selectedTab === room.id;
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
                className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 font-mono-tech text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isActive
                    ? activeClass
                    : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/30 hover:text-white'
                }`}
              >
                <DoorOpen className="h-3.5 w-3.5" />
                <span className="font-bold">{room.worldCode}</span>
                <span className="opacity-40">·</span>
                <span>{room.name}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setSelectedTab('all')}
            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 font-mono-tech text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              selectedTab === 'all'
                ? 'border-cyan-400 bg-cyan-400/15 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/30 hover:text-white'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>{copy.filter_all}</span>
          </button>
        </div>
      </div>

      {/* Main Agenda (TL;DR) when 'main' is selected */}
      {selectedTab === 'main' && <OverallDayAgenda copy={tldrCopy} />}

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
                  const pillVariant = session.variant || room.accent || 'blue';

                  const timePillClass =
                    pillVariant === 'yellow'
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
                      className="group relative flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#0d1222]/90 px-5 py-4 transition-all duration-300 hover:border-cyan-400/40 hover:bg-[#121931]"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
                        {/* Solid Time Pill */}
                        <div className="shrink-0">
                          <span
                            className={`inline-flex min-w-[150px] items-center justify-center rounded-full px-4 py-2 font-mono-tech text-sm md:text-base tracking-wider ${timePillClass}`}
                          >
                            {session.time}
                          </span>
                        </div>

                        {/* Session Details */}
                        <div className="flex flex-col gap-1 flex-1">
                          <h4 className="font-display text-base md:text-lg font-bold text-white leading-snug group-hover:text-cyan-100 transition-colors">
                            {session.title}
                          </h4>

                          {session.speakers && (
                            <p className="font-mono-tech text-xs uppercase tracking-wider text-cyan-400">
                              {session.speakers}
                            </p>
                          )}

                          {/* Sub-items for Lightning Round */}
                          {session.subItems && session.subItems.length > 0 && (
                            <div className="mt-1.5 space-y-1">
                              {session.subItems.map((sub, subIdx) => (
                                <div
                                  key={subIdx}
                                  className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5 text-xs md:text-sm"
                                >
                                  <span className="font-mono-tech text-xs font-bold text-google-yellow">
                                    {sub.time}
                                  </span>
                                  <span className="font-display font-bold text-white">
                                    {sub.title}
                                  </span>
                                  <span className="text-white/40">·</span>
                                  <span className="font-sans text-cyan-300">
                                    {sub.speakers}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Badges: Duration + Language */}
                      <div className="flex items-center gap-2.5 self-start md:self-center shrink-0">
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
