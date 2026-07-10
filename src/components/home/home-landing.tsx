'use client';

import Image from 'next/image';
import { HeroBottomHud } from './hero-bottom-hud';
import { HeroContent } from './hero-content';
import { HeroTicker } from './hero-ticker';
import GalleryGrid from '../gallery/gallery-grid';
import { SectionHeader } from '../common/section-header';
import type { HomeLandingCopy } from './types';

export type { HomeLandingCopy } from './types';
type HomeLandingProps = {
  copy: HomeLandingCopy;
};

export function HomeLanding({ copy }: HomeLandingProps) {
  return (
    <>
      {/* Global Grid Background */}
      <div className="fixed inset-0 -z-10 bg-background">
        <div className="blueprint-subgrid absolute inset-0" />
        <div className="blueprint-grid absolute inset-0" />
      </div>

      <main>
        {/* Hero Section */}
        <section className="relative flex min-h-screen w-full flex-col overflow-hidden">
          {/* Hero-specific background elements */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src="/assets/images/backgrounds/hero-skyline.png"
                alt=""
                fill
                priority
                className="object-cover object-bottom opacity-10"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
            <div className="scanning-line" />
          </div>

          {/* Hero Content Wrapper */}
          <div className="relative z-10 flex flex-grow flex-col">
            <HeroContent hero={copy.hero} stats={copy.stats} />
            <HeroBottomHud hud={copy.hud} />
            <HeroTicker ticker={copy.ticker} />
          </div>
        </section>

        {/* Gallery Section */}
        <section className="mx-auto w-full max-w-[1440px] px-6 py-32 md:px-12">
          <SectionHeader
            subheading={copy.gallery.header.subheading}
            headingLine1={copy.gallery.header.heading.line1}
            headingLine2={copy.gallery.header.heading.line2}
          />
          <GalleryGrid items={copy.gallery.items} />
        </section>
      </main>
    </>
  );
}
