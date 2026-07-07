'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, MapPin } from 'lucide-react';
import type { HomeLandingCopy } from './types';

type HeroBottomHudProps = {
  hud: HomeLandingCopy['hud'];
};

const EVENT_DATE = new Date('2026-11-06T00:00:00-05:00');

type CountdownValue = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

function formatCountdown(targetDate: Date): CountdownValue {
  const remainingMs = Math.max(0, targetDate.getTime() - Date.now());

  const totalSeconds = Math.floor(remainingMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  };
}

export function HeroBottomHud({ hud }: HeroBottomHudProps) {
  const targetDate = useMemo(() => EVENT_DATE, []);
  const [countdown, setCountdown] = useState<CountdownValue>(() =>
    formatCountdown(targetDate),
  );

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCountdown(formatCountdown(targetDate));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [targetDate]);

  return (
    <div className="relative z-30 w-full px-6 pb-16 md:px-12">
      <div className="flex flex-col justify-between gap-10 border-t border-white/10 pt-8 md:flex-row md:items-end">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <CalendarDays className="w-4 h-4 text-google-blue" />
            <span className="font-mono-tech uppercase tracking-wider text-xs text-white/90">{hud.date}</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-google-red" />
            <span className="font-mono-tech uppercase tracking-wider text-xs text-white/90">{hud.location}</span>
          </div>
        </div>

        <div className="flex items-end gap-8 md:gap-12">
          <div className="flex flex-col items-center">
            <span className="font-display text-4xl font-extralight text-google-blue tabular-nums md:text-5xl">{countdown.days}</span>
            <span className="font-mono-tech mt-2 text-[8px] tracking-[0.24em] text-white/35 uppercase">{hud.countdown.days.label}</span>
          </div>
          <div className="h-12 w-px bg-white/15" />
          <div className="flex flex-col items-center">
            <span className="font-display text-4xl font-extralight text-google-red tabular-nums md:text-5xl">{countdown.hours}</span>
            <span className="font-mono-tech mt-2 text-[8px] tracking-[0.24em] text-white/35 uppercase">{hud.countdown.hours.label}</span>
          </div>
          <div className="h-12 w-px bg-white/15" />
          <div className="flex flex-col items-center">
            <span className="font-display text-4xl font-extralight text-google-yellow tabular-nums md:text-5xl">{countdown.minutes}</span>
            <span className="font-mono-tech mt-2 text-[8px] tracking-[0.24em] text-white/35 uppercase">{hud.countdown.minutes.label}</span>
          </div>
          <div className="h-12 w-px bg-white/15" />
          <div className="flex flex-col items-center">
            <span className="font-display text-4xl font-extralight text-google-green tabular-nums md:text-5xl">{countdown.seconds}</span>
            <span className="font-mono-tech mt-2 text-[8px] tracking-[0.24em] text-white/35 uppercase">{hud.countdown.seconds.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
