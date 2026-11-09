import { Link } from '@/i18n/navigation';
import type { HomeLandingCopy } from './types';

type HeroContentProps = {
  hero: HomeLandingCopy['hero'];
  stats: HomeLandingCopy['stats'];
};

export function HeroContent({ hero, stats }: HeroContentProps) {
  const titleParts = hero.title.split('MTL');
  const isFr = hero.tickets_btn === 'Billets';

  return (
    <section className="relative z-30 flex flex-1 flex-col items-center justify-center px-5 pt-28 pb-16 text-center sm:px-8 sm:pt-32 sm:pb-24 md:px-12 min-h-[85vh]">
      <div className="flex w-full max-w-5xl flex-col items-center justify-center my-auto">
        <div className="mb-5 flex items-center justify-center gap-4 sm:gap-6">
          <div className="hidden sm:block h-px w-10 bg-white/15 md:w-20" />
          <span className="font-mono-tech text-xs sm:text-sm tracking-[0.16em] sm:tracking-[0.24em] text-white/85 font-semibold uppercase leading-relaxed">
            {hero.phase}
          </span>
          <div className="hidden sm:block h-px w-10 bg-white/15 md:w-20" />
        </div>

        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-light tracking-tight text-white retro-chromatic-text">
          {titleParts[0]}
          <span className="text-google-blue font-bold">MTL</span>
          {titleParts[1]}
        </h1>

        {/* Main Tagline (Sentence Case, Elegant and Modern) */}
        <p className="font-display mt-6 max-w-3xl text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white leading-snug">
          {hero.tagline}
        </p>

        {/* Supporting Description */}
        <p className="font-sans mt-4 max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed text-white/80 mx-auto">
          {hero.description}
        </p>

        {/* 2027 Edition Hint Pill */}
        <div className="mt-6 inline-flex items-center gap-2.5 rounded-sm border border-google-blue/45 bg-google-blue/15 px-4 py-2.5 font-mono-tech text-[11px] sm:text-xs uppercase tracking-[0.16em] sm:tracking-[0.2em] text-google-blue font-semibold leading-snug">
          <span className="h-2 w-2 shrink-0 rounded-full bg-google-blue animate-pulse" />
          <span>
            {isFr
              ? "Édition 2027 · Rendez-vous au début novembre de l'an prochain !"
              : '2027 Edition · See you in early November of next year!'}
          </span>
        </div>

        {/* Refined compact stats section (Large numbers, wider container to prevent wrapping) */}
        <div className="mt-10 grid w-full max-w-4xl grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-6 md:gap-10">
          {[stats.attendees, stats.speakers, stats.talks].map(
            (stat, i) => {
              const colors = [
                'bg-google-blue',
                'bg-google-green',
                'bg-google-yellow',
              ];
              const parenIdx = stat.label.indexOf('(');
              const mainLabel =
                parenIdx !== -1
                  ? stat.label.slice(0, parenIdx).trim()
                  : stat.label;
              const subLabel =
                parenIdx !== -1 ? stat.label.slice(parenIdx).trim() : '';

              return (
                <div
                  key={i}
                  className="flex flex-col items-center justify-between gap-2 rounded-sm border border-white/10 bg-white/[0.03] p-4 sm:border-0 sm:bg-transparent sm:p-0 transition-transform duration-300 hover:scale-105"
                >
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center gap-2">
                      <div
                        className={`w-2 h-2 shrink-0 rounded-full ${colors[i]}`}
                      />
                      <p className="font-mono-tech text-xs tracking-widest text-white/80 font-semibold uppercase">
                        {mainLabel}
                      </p>
                    </div>
                    <p className="mt-1 min-h-[16px] max-w-[260px] text-center font-mono-tech text-[11px] leading-snug tracking-wider text-white/60">
                      {subLabel}
                    </p>
                  </div>
                  <p className="font-display text-5xl md:text-6xl font-bold text-white tabular-nums whitespace-nowrap">
                    {stat.value}
                  </p>
                </div>
              );
            },
          )}
        </div>

        {/* CTA Buttons */}
        <div className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <a
            href="#photos"
            className="inline-flex items-center border border-google-yellow bg-google-yellow/15 hover:bg-google-yellow/25 px-5 py-3.5 sm:px-6 sm:py-4 font-mono-tech text-xs uppercase tracking-[0.18em] text-google-yellow font-bold transition-all duration-300 hover:border-google-yellow hover:text-white hover:scale-[1.02] active:scale-[0.98] quad-border-tr hover:shadow-[0_0_25px_rgba(251,188,4,0.45)]"
          >
            Photos
          </a>
          <a
            href="#videos"
            className="inline-flex items-center border border-google-red bg-google-red/15 hover:bg-google-red/25 px-5 py-3.5 sm:px-6 sm:py-4 font-mono-tech text-xs uppercase tracking-[0.18em] text-google-red font-bold transition-all duration-300 hover:border-google-red hover:text-white hover:scale-[1.02] active:scale-[0.98] quad-border-tr hover:shadow-[0_0_25px_rgba(234,67,53,0.45)]"
          >
            {isFr ? 'Vidéos' : 'Videos'}
          </a>
          <Link
            href="/speakers"
            className="inline-flex items-center border border-google-green bg-google-green/15 hover:bg-google-green/25 px-5 py-3.5 sm:px-6 sm:py-4 font-mono-tech text-xs uppercase tracking-[0.18em] text-google-green font-bold transition-all duration-300 hover:border-google-green hover:text-white hover:scale-[1.02] active:scale-[0.98] quad-border-tr hover:shadow-[0_0_25px_rgba(52,168,83,0.45)]"
          >
            {hero.speakers_btn}
          </Link>
          <Link
            href="/schedule"
            className="inline-flex items-center border border-google-blue bg-google-blue/15 hover:bg-google-blue/25 px-5 py-3.5 sm:px-6 sm:py-4 font-mono-tech text-xs uppercase tracking-[0.18em] text-google-blue font-bold transition-all duration-300 hover:border-google-blue hover:text-white hover:scale-[1.02] active:scale-[0.98] quad-border-tr hover:shadow-[0_0_25px_rgba(66,133,244,0.45)]"
          >
            {hero.agenda_btn}
          </Link>
          <a
            href="#community"
            className="inline-flex items-center border border-orange-500 bg-orange-500/15 hover:bg-orange-500/25 px-5 py-3.5 sm:px-6 sm:py-4 font-mono-tech text-xs uppercase tracking-[0.18em] text-orange-400 font-bold transition-all duration-300 hover:border-orange-400 hover:text-white hover:scale-[1.02] active:scale-[0.98] quad-border-tr hover:shadow-[0_0_25px_rgba(249,115,22,0.45)]"
          >
            {isFr ? 'Communauté' : 'Community'}
          </a>
          <a
            href="#sponsors"
            className="inline-flex items-center border border-white/30 bg-white/10 hover:bg-white/20 px-5 py-3.5 sm:px-6 sm:py-4 font-mono-tech text-xs uppercase tracking-[0.18em] text-white font-bold transition-all duration-300 hover:border-white/50 hover:text-white hover:scale-[1.02] active:scale-[0.98] quad-border-tr hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
          >
            {hero.sponsor_btn}
          </a>
        </div>
      </div>
    </section>
  );
}
