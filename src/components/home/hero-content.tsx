import type { HomeLandingCopy } from './types';

type HeroContentProps = {
  hero: HomeLandingCopy['hero'];
  stats: HomeLandingCopy['stats'];
};

export function HeroContent({ hero, stats }: HeroContentProps) {
  const titleParts = hero.title.split('MTL');

  return (
    <section className="relative z-30 flex flex-1 items-center justify-center px-6 pt-28 pb-28 text-center md:px-12">
      <div className="flex w-full max-w-5xl flex-col items-center">
        <div className="mb-10 flex items-center gap-6">
          <div className="h-px w-14 bg-white/10 md:w-24" />
          <span className="font-mono-tech text-[13px] tracking-[0.65em] text-white/45 uppercase">{hero.phase}</span>
          <div className="h-px w-14 bg-white/10 md:w-24" />
        </div>

        <h1 className="font-display text-5xl font-light tracking-tight text-white md:text-9xl">
            {titleParts[0]}
            <span className="text-google-blue font-bold">MTL</span>
            {titleParts[1]}
        </h1>
        <p className="font-display mt-6 max-w-4xl text-sm font-light tracking-[0.35em] text-white/65 uppercase md:text-lg">{hero.subtitle}</p>

        {/* Refined retro-tech stats section */}
        <div className="mt-20 grid w-full max-w-4xl grid-cols-2 md:grid-cols-3 gap-8">
            {[stats.workshops, stats.attendees, stats.speakers].map((stat, i) => {
                const colors = ['bg-google-blue', 'bg-google-green', 'bg-google-yellow'];
                return (
                    <div key={i} className={`flex flex-col items-center gap-3 transition-transform duration-300 hover:scale-105 ${i === 2 ? 'col-span-2 md:col-span-1' : ''}`}>
                        <div className="flex items-center justify-center gap-2">
                            <div className={`w-2.5 h-2.5 ${colors[i]}`} />
                            <p className="font-mono-tech text-sm tracking-widest text-white/80 uppercase">{stat.label}</p>
                        </div>
                        <p className="font-display text-5xl font-bold text-white tabular-nums">{stat.value}</p>
                    </div>
                );
            })}
        </div>
      </div>
    </section>
  );
}
