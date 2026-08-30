'use client';

import Image from 'next/image';
import { SectionHeader } from '../common/section-header';
import type { HomeLandingCopy } from './types';

type AboutSectionProps = {
  about: HomeLandingCopy['about'];
};

export function AboutSection({ about }: AboutSectionProps) {
  // Find our blocks by their expected IDs
  const devfestBlock = about.blocks.find((b) => blockIdEquals(b.id, '01'));
  const gdgBlock = about.blocks.find((b) => blockIdEquals(b.id, '02'));
  const venueBlock = about.blocks.find((b) => blockIdEquals(b.id, '03'));

  // Utility to handle ID match robustly
  function blockIdEquals(id: string, target: string) {
    return id.replace(/\D/g, '') === target.replace(/\D/g, '');
  }

  return (
    <section id="about" className="mx-auto w-full max-w-[1440px] px-6 py-32 md:px-12 border-b border-white/5 scroll-mt-24">
      <SectionHeader
        subheading={about.header.subheading}
        headingLine1={about.header.heading.line1}
        headingLine2={about.header.heading.line2}
        headingLine2ClassName="text-google-blue"
      />

      {/* Premium Dashboard Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12">
        
        {/* Block 01: What is DevFest? */}
        {devfestBlock && (
          <div className="group relative overflow-hidden bg-[#0a0a0a]/60 p-8 md:p-10 quad-border-tr transition-all duration-300 lg:col-span-8 flex flex-col justify-between neon-panel-blue">
            {/* Ambient hover glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-google-blue/0 via-transparent to-google-blue/[0.01] pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-google-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="font-mono-tech text-xs font-bold text-google-blue bg-google-blue/10 px-2 py-0.5 rounded border border-google-blue/20">
                  [ {devfestBlock.id} ]
                </span>
                <span className="font-mono-tech text-[10px] tracking-[0.25em] text-white/40 uppercase">
                  DevFest Montreal
                </span>
              </div>

              <h3 className="font-mono-tech text-sm md:text-md font-bold tracking-[0.3em] text-white uppercase mb-4">
                {devfestBlock.title}
              </h3>
              <div className="w-12 h-[1px] bg-google-blue/30 mb-6 group-hover:w-24 transition-all duration-500" />
              <p className="font-sans text-sm md:text-base leading-relaxed text-white/70 group-hover:text-white/90 transition-colors">
                {devfestBlock.content}
              </p>
            </div>
          </div>
        )}

        {/* Block 02: Venue Image 01 (Crowd Shot) */}
        <div className="group relative h-[300px] md:h-[350px] lg:h-auto overflow-hidden border border-white/10 bg-[#0a0a0a] quad-border-tr shadow-2xl lg:col-span-4">
          <Image
            src="/assets/images/gallery/gallery1.webp"
            alt="DevFest Montreal crowd enjoying tech talks"
            fill
            className="object-cover grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-[1.04] transition-all duration-1000"
            sizes="(max-width: 1024px) 100vw, 400px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 font-mono-tech text-[10px] tracking-widest text-white/60 bg-black/60 px-3 py-1 rounded border border-white/5 backdrop-blur-sm">
            DevFest Montreal
          </div>
        </div>

        {/* Block 03: Venue Image 02 (Auditorium Stage) */}
        <div className="group relative h-[300px] md:h-[350px] lg:h-auto overflow-hidden border border-white/10 bg-[#0a0a0a] quad-border-bl shadow-2xl lg:col-span-4">
          <Image
            src="/assets/images/gallery/gallery3.webp"
            alt="DevFest Montreal presentation stage"
            fill
            className="object-cover grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-[1.04] transition-all duration-1000"
            sizes="(max-width: 1024px) 100vw, 400px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 font-mono-tech text-[10px] tracking-widest text-white/60 bg-black/60 px-3 py-1 rounded border border-white/5 backdrop-blur-sm">
            Ax.C Hub
          </div>
        </div>

        {/* Block 04: Who's Behind It? */}
        {gdgBlock && (
          <div className="group relative overflow-hidden bg-[#0a0a0a]/60 p-8 quad-border-tr transition-all duration-300 lg:col-span-4 flex flex-col justify-between neon-panel-red">
            <div className="absolute inset-0 bg-gradient-to-br from-google-red/0 via-transparent to-google-red/[0.01] pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-google-red/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="font-mono-tech text-xs font-bold text-google-red bg-google-red/10 px-2 py-0.5 rounded border border-google-red/20">
                  [ {gdgBlock.id} ]
                </span>
                <span className="font-mono-tech text-[10px] tracking-[0.25em] text-white/40 uppercase">
                  Google Developer Groups
                </span>
              </div>

              <h3 className="font-mono-tech text-sm font-bold tracking-[0.3em] text-white uppercase mb-4">
                {gdgBlock.title}
              </h3>
              <div className="w-12 h-[1px] bg-google-red/30 mb-6 group-hover:w-24 transition-all duration-500" />
              <p className="font-sans text-sm md:text-base leading-relaxed text-white/70 group-hover:text-white/90 transition-colors">
                {gdgBlock.content}
              </p>
            </div>
          </div>
        )}

        {/* Block 05: The Venue */}
        {venueBlock && (
          <div className="group relative overflow-hidden bg-[#0a0a0a]/60 p-8 quad-border-tr transition-all duration-300 lg:col-span-4 flex flex-col justify-between neon-panel-green">
            <div className="absolute inset-0 bg-gradient-to-br from-google-green/0 via-transparent to-google-green/[0.01] pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-google-green/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="font-mono-tech text-xs font-bold text-google-green bg-google-green/10 px-2 py-0.5 rounded border border-google-green/20">
                  [ {venueBlock.id} ]
                </span>
                <span className="font-mono-tech text-[10px] tracking-[0.25em] text-white/40 uppercase">
                  Ax.C Hub
                </span>
              </div>

              <div>
                <h3 className="font-mono-tech text-sm font-bold tracking-[0.3em] text-white uppercase mb-4">
                  {venueBlock.title}
                </h3>
                <div className="w-12 h-[1px] bg-google-green/30 mb-6 group-hover:w-24 transition-all duration-500" />
                <p className="font-sans text-sm md:text-base leading-relaxed text-white/70 group-hover:text-white/90 transition-colors mb-6">
                  {venueBlock.content}
                </p>
              </div>

              {/* Geographic locator with map link */}
              <a
                href="https://maps.app.goo.gl/6iLLdi2fiL33hCPG9"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-google-green/30 p-3 rounded text-[11px] font-mono-tech transition-all duration-300 cursor-pointer"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-google-green/15 text-google-green">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-white/80 font-bold uppercase tracking-wider text-[10px] truncate">{about.venueAddress}</div>
                </div>
              </a>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
