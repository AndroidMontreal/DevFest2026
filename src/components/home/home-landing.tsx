'use client';

import Image from 'next/image';
import { useState } from 'react';
import { HeroBottomHud } from './hero-bottom-hud';
import { HeroContent } from './hero-content';
import { HeroTicker } from './hero-ticker';
import { SiteHeader } from './site-header';
import { MobileMenu } from './mobile-menu';
import type { HomeLandingCopy } from './types';

export type { HomeLandingCopy } from './types';

type HomeLandingProps = {
  copy: HomeLandingCopy;
};

export function HomeLanding({ copy }: HomeLandingProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <main className="retro-hero relative flex min-h-screen w-full flex-col">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/assets/images/backgrounds/hero-skyline.png"
            alt=""
            fill
            priority
            className="blueprint-silhouette object-cover object-bottom opacity-10 mix-blend-screen"
          />
        </div>
        <div className="blueprint-subgrid absolute inset-0" />
        <div className="blueprint-grid absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
        <div className="scanning-line" />
      </div>

      <SiteHeader
        header={copy.header}
        nav={copy.nav}
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
      />
      <MobileMenu
        nav={copy.nav}
        isOpen={isMenuOpen}
        toggleMenu={toggleMenu}
      />
      <HeroContent hero={copy.hero} stats={copy.stats} />
      <HeroBottomHud hud={copy.hud} />
      <HeroTicker ticker={copy.ticker} />
    </main>
  );
}
