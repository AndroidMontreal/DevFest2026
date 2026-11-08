'use client';

import { CalendarDays, MapPin } from 'lucide-react';
import type { HomeLandingCopy } from './types';

type HeroBottomHudProps = {
  hud: HomeLandingCopy['hud'];
};

export function HeroBottomHud({ hud }: HeroBottomHudProps) {
  return (
    <div className="relative z-30 w-full px-6 pb-16 md:px-12">
      <div className="flex flex-col justify-between gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex items-center gap-3">
            <CalendarDays className="w-4 h-4 text-google-blue" />
            <span className="font-mono-tech uppercase tracking-wider text-xs text-white/90">
              {hud.date}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-google-red" />
            <span className="font-mono-tech tracking-wider text-xs text-white/90">
              {hud.location}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
