'use client';

// Note: Reverted to <img> tag to respect original SVG sizing as requested.
// Using a white background for maximum contrast with dark/transparent logos.
// Added grayscale-to-color hover effect.

type SponsorTier = {
  title: string;
  subtitle: string;
  badge: string;
  items: {
    name: string;
    logo?: string;
    link?: string;
  }[];
};

type SponsorsTiersProps = {
  tiers: SponsorTier[];
  ctaLabel: string;
  ctaLink: string;
};

export function SponsorsTiers({ tiers, ctaLabel, ctaLink }: SponsorsTiersProps) {
  return (
    <div className="space-y-14">
      {tiers.map((tier) => (
        <section key={tier.title} className="space-y-6">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-4 md:flex-row md:items-end md:justify-between">
            <div className="flex items-center gap-3">
              <h3 className="font-display text-2xl uppercase tracking-tight text-white md:text-3xl">
                {tier.title}
              </h3>
              <span className="rounded-full border border-white/20 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
                {tier.badge}
              </span>
            </div>
            <p className="max-w-xl font-mono text-xs uppercase tracking-[0.18em] text-white/55 md:text-right">
              {tier.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {tier.items.map((sponsor) => (
              <a
                key={sponsor.name}
                href={sponsor.link || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center rounded-lg bg-white p-6 transition-all duration-300 hover:scale-105"
              >
                {sponsor.logo && (
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="grayscale transition-all duration-300 group-hover:grayscale-0"
                  />
                )}
              </a>
            ))}
          </div>
        </section>
      ))}

      <div className="pt-2">
        <a
          href={ctaLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center border border-white/25 px-5 py-3 font-mono-tech text-xs uppercase tracking-[0.2em] text-white transition-colors hover:border-google-blue hover:text-google-blue"
        >
          {ctaLabel}
        </a>
      </div>
    </div>
  );
}
