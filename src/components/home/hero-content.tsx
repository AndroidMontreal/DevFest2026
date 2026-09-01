import type { HomeLandingCopy } from './types';

type HeroContentProps = {
  hero: HomeLandingCopy['hero'];
  stats: HomeLandingCopy['stats'];
};

export function HeroContent({ hero, stats }: HeroContentProps) {
  const titleParts = hero.title.split('MTL');

  return (
    <section className="relative z-30 flex flex-1 flex-col items-center justify-center px-6 pt-32 pb-32 text-center md:px-12 min-h-[85vh]">
      <div className="flex w-full max-w-5xl flex-col items-center justify-center my-auto">
        <div className="mb-6 flex items-center gap-6">
          <div className="h-px w-12 bg-white/10 md:w-20" />
          <span className="font-mono-tech text-xs md:text-sm tracking-[0.25em] text-white/75 font-semibold uppercase">
            {hero.phase}
          </span>
          <div className="h-px w-12 bg-white/10 md:w-20" />
        </div>

        <h1 className="font-display text-6xl font-light tracking-tight text-white md:text-9xl retro-chromatic-text">
          {titleParts[0]}
          <span className="text-google-blue font-bold">MTL</span>
          {titleParts[1]}
        </h1>

        {/* Main Tagline (Sentence Case, Elegant and Modern) */}
        <p className="font-display mt-6 max-w-3xl text-xl font-bold tracking-tight text-white md:text-3xl leading-snug">
          {hero.tagline}
        </p>

        {/* Supporting Description */}
        <p className="font-sans mt-4 max-w-2xl text-sm md:text-base leading-relaxed text-white/60 mx-auto">
          {hero.description}
        </p>

        {/* Refined compact stats section (Large numbers, wider container to prevent wrapping) */}
        <div className="mt-12 grid w-full max-w-2xl grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {[stats.workshops, stats.attendees, stats.speakers].map((stat, i) => {
            const colors = [
              'bg-google-blue',
              'bg-google-green',
              'bg-google-yellow',
            ];
            return (
              <div
                key={i}
                className={`flex flex-col items-center gap-1.5 transition-transform duration-300 hover:scale-105 ${i === 2 ? 'col-span-2 md:col-span-1' : ''}`}
              >
                <div className="flex items-center justify-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${colors[i]}`} />
                  <p className="font-mono-tech text-[11px] tracking-widest text-white/50 uppercase whitespace-nowrap">
                    {stat.label}
                  </p>
                </div>
                <p className="font-display text-5xl md:text-6xl font-bold text-white tabular-nums">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://gdg.community.dev/events/details/google-gdg-montreal-presents-devfest-mtl-26/cohost-gdg-montreal/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center border border-google-yellow bg-google-yellow/5 hover:bg-google-yellow/20 px-6 py-4 font-mono-tech text-xs uppercase tracking-[0.2em] text-google-yellow font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] quad-border-tr hover:shadow-[0_0_25px_rgba(251,188,4,0.55)]"
          >
            {hero.tickets_btn}
          </a>
          <a
            href="https://cfp.gdgmontreal.com/c/devfest-mtl-2026"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center border border-google-blue bg-google-blue/5 hover:bg-google-blue/15 px-6 py-4 font-mono-tech text-xs uppercase tracking-[0.2em] text-google-blue transition-all duration-300 hover:border-google-blue hover:text-white hover:scale-[1.02] active:scale-[0.98] quad-border-tr hover:shadow-[0_0_25px_rgba(66,133,244,0.4)]"
          >
            {hero.cfp_btn}
          </a>
        </div>
      </div>
    </section>
  );
}
