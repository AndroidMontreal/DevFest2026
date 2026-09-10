import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa';

type TeamMember = {
  name: string;
  title: string;
  image: string;
  link: string;
};

// Color style variants for the grid cards to support full static compilation in Tailwind
const cardStyles = [
  {
    borderHover: 'group-hover:border-google-blue/30',
    shadowHover: 'hover:shadow-[0_0_25px_rgba(66,133,244,0.25)]',
    textHover: 'group-hover:text-google-blue',
    btnHover: 'hover:border-google-blue hover:bg-google-blue/10 hover:text-google-blue'
  },
  {
    borderHover: 'group-hover:border-google-red/30',
    shadowHover: 'hover:shadow-[0_0_25px_rgba(234,67,53,0.25)]',
    textHover: 'group-hover:text-google-red',
    btnHover: 'hover:border-google-red hover:bg-google-red/10 hover:text-google-red'
  },
  {
    borderHover: 'group-hover:border-google-yellow/30',
    shadowHover: 'hover:shadow-[0_0_25px_rgba(251,188,4,0.25)]',
    textHover: 'group-hover:text-google-yellow',
    btnHover: 'hover:border-google-yellow hover:bg-google-yellow/10 hover:text-google-yellow'
  },
  {
    borderHover: 'group-hover:border-google-green/30',
    shadowHover: 'hover:shadow-[0_0_25px_rgba(52,168,83,0.25)]',
    textHover: 'group-hover:text-google-green',
    btnHover: 'hover:border-google-green hover:bg-google-green/10 hover:text-google-green'
  }
];

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'TeamPage' });

  // Get organizers/team members array from translations
  const organizers = t.raw('organizer.members') as TeamMember[];
  
  // Future-proofing: We also load volunteer members if any exist (currently empty array in JSON)
  const volunteers = t.raw('volunteer.members') as TeamMember[];

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Tech decorative background elements */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-background">
        <div className="blueprint-subgrid absolute inset-0 opacity-[0.3]" />
        <div className="blueprint-grid absolute inset-0 opacity-[0.3]" />
        
        {/* Soft glowing ambient orbs (Google Green & Blue theme) */}
        <div className="absolute top-1/4 left-0 h-[400px] w-[400px] rounded-full bg-google-green/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 h-[400px] w-[400px] rounded-full bg-google-blue/5 blur-[120px]" />
        <div className="absolute top-1/2 right-1/4 h-[300px] w-[300px] rounded-full bg-google-red/5 blur-[100px]" />
      </div>

      <section className="mx-auto w-full max-w-[1440px] px-6 py-32 md:px-12">
        
        {/* Custom Split Header: Title on the left, Description on the right */}
        <div className="mb-24 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12 border-l-2 border-primary/10 pl-10 pb-8 border-b border-white/5 lg:gap-16">
          <div className="max-w-3xl">
            <span className="mb-6 block font-mono text-xs uppercase tracking-[0.3em] text-primary/60">
              {t('subheading')}
            </span>
            <h2 className="font-display text-4xl font-bold uppercase leading-[0.95] tracking-tighter text-on-surface sm:text-5xl md:text-7xl">
              <span className="font-light">{t('heading.line1')}</span>
              <br />
              <span className="text-google-green">{t('heading.line2')}</span>
            </h2>
          </div>
          
          <div className="max-w-2xl lg:max-w-lg xl:max-w-xl pb-1">
            <p className="font-sans text-sm md:text-base leading-relaxed text-white/60">
              {t('description')}
            </p>
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {organizers.map((member, index) => {
            const style = cardStyles[index % cardStyles.length];
            const isLinkedin = member.link.includes('linkedin.com');

            return (
              <div
                key={member.name}
                className={`group relative flex flex-col border border-white/5 bg-[#0a0a0a]/80 quad-border-tr p-5 backdrop-blur-xl transition-all duration-300 hover:border-transparent hover:scale-[1.02] hover:bg-[#0d0d0d] ${style.shadowHover}`}
              >
                {/* Visual hover border highlight matching color tier */}
                <div className={`absolute inset-0 border border-transparent pointer-events-none transition-colors duration-300 quad-border-tr ${style.borderHover}`} />

                {/* Tech scanline aesthetic and grid effect */}
                <div className="relative aspect-square w-full overflow-hidden mb-6 bg-white/5 border border-white/10 quad-border-tr quad-border-bl">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out"
                  />
                  {/* CRT scanner overlay on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity duration-300 bg-gradient-to-b from-transparent via-white/40 to-transparent bg-[length:100%_4px]" />
                </div>

                {/* Member Info */}
                <div className="flex-grow flex flex-col justify-between">
                  <div className="mb-4">
                    <h3 className={`font-display text-lg font-bold tracking-wide text-white uppercase transition-colors ${style.textHover}`}>
                      {member.name}
                    </h3>
                    <p className="font-sans text-xs text-white/50 leading-relaxed mt-2 line-clamp-3">
                      {member.title}
                    </p>
                  </div>

                  {/* Action Link Button */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="font-mono-tech text-[9px] tracking-[0.2em] text-white/30 uppercase">
                      DEVFEST 2026
                    </span>
                    <a
                      href={member.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex h-9 w-9 items-center justify-center border border-white/15 bg-white/[0.03] text-white/80 transition-all rounded-none ${style.btnHover}`}
                      aria-label={`${member.name} profile`}
                    >
                      {isLinkedin ? (
                        <FaLinkedin className="h-5 w-5" />
                      ) : (
                        <ExternalLink className="h-[18px] w-[18px]" strokeWidth={2.5} />
                      )}
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Future Volunteers Section: Simply uncomment/fill standard list to easily render later */}
        {volunteers && volunteers.length > 0 && (
          <div className="mt-32">
            <div className="border-b border-white/10 pb-4 mb-12 flex items-center gap-3">
              <h3 className="font-display text-2xl uppercase tracking-tight text-white md:text-3xl">
                {t('volunteer.title')}
              </h3>
              <span className="rounded-full border border-white/20 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
                {volunteers.length}
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {volunteers.map((member) => (
                <div
                  key={member.name}
                  className="group relative flex flex-col border border-white/5 bg-[#0a0a0a]/80 quad-border-tr p-5 backdrop-blur-xl"
                >
                  {/* Render design pattern similar to above */}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
