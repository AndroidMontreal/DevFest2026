import { type OverallDayAgendaCopy } from '@/components/schedule/overall-day-agenda';
import {
  RoomAgendaSection,
  type RoomAgendaSectionCopy,
} from '@/components/schedule/room-agenda-section';
import { Link } from '@/i18n/navigation';
import { Sparkles, Ticket } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function SchedulePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'SchedulePage' });

  const tldrCopy = t.raw('tldr') as OverallDayAgendaCopy;
  const roomsSectionCopy = t.raw('rooms_section') as RoomAgendaSectionCopy;

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Decorative Blueprint Background Grids & Ambient Lights */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-background">
        <div className="blueprint-subgrid absolute inset-0 opacity-[0.3]" />
        <div className="blueprint-grid absolute inset-0 opacity-[0.3]" />

        <div className="absolute top-1/4 left-0 h-[450px] w-[450px] rounded-full bg-cyan-500/5 blur-[130px]" />
        <div className="absolute top-1/2 right-0 h-[450px] w-[450px] rounded-full bg-google-yellow/5 blur-[130px]" />
        <div className="absolute bottom-1/4 left-1/3 h-[400px] w-[400px] rounded-full bg-google-blue/5 blur-[120px]" />
      </div>

      <section className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 py-24 md:py-32 md:px-12">
        {/* Split Header */}
        <div className="mb-12 md:mb-16 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 md:gap-8 border-l-2 border-primary/20 pl-4 sm:pl-8 pb-6 md:pb-8 border-b border-white/5">
          <div className="max-w-3xl">
            <span className="mb-3 md:mb-4 block font-mono text-xs uppercase tracking-[0.3em] text-cyan-400">
              {t('subheading')}
            </span>
            <h1 className="font-display text-3xl sm:text-5xl md:text-7xl font-bold uppercase leading-tight tracking-tight text-white">
              <span className="font-light">{t('heading.line1')}</span>{' '}
              <span className="text-cyan-400">{t('heading.line2')}</span>
            </h1>
          </div>

          <div className="max-w-xl pb-1">
            <p className="font-sans text-sm md:text-base leading-relaxed text-white/60">
              {t('description')}
            </p>
          </div>
        </div>

        {/* Room Navigation Bar at the start of the page + Main Agenda & Room Schedules */}
        <div className="mb-16 md:mb-20">
          <RoomAgendaSection tldrCopy={tldrCopy} copy={roomsSectionCopy} />
        </div>

        {/* Coming Soon: Detailed Room & Track Sessions Notice */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0f1d]/70 p-6 sm:p-8 md:p-12 quad-border-tr backdrop-blur-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8">
            <div className="max-w-2xl space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-google-yellow animate-pulse" />
                <span className="font-mono-tech text-xs uppercase tracking-widest text-google-yellow">
                  Tracks & Breakouts
                </span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-tight text-white">
                {t('more_info_title')}
              </h3>
              <p className="font-sans text-sm md:text-base text-white/60 leading-relaxed">
                {t('more_info_note')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto shrink-0">
              <a
                href="https://gdg.community.dev/events/details/google-gdg-montreal-presents-devfest-mtl-26/cohost-gdg-montreal/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center items-center gap-2 border border-google-yellow bg-google-yellow/10 hover:bg-google-yellow hover:text-black px-6 py-3.5 font-mono-tech text-xs uppercase tracking-widest text-google-yellow font-bold transition-all duration-300 quad-border-tr hover:shadow-[0_0_20px_rgba(251,188,4,0.4)]"
              >
                <Ticket className="h-4 w-4" />
                <span>Get Tickets</span>
              </a>
              <Link
                href="/faq"
                className="inline-flex justify-center items-center border border-white/20 bg-white/[0.03] hover:border-cyan-400 hover:text-cyan-300 px-6 py-3.5 font-mono-tech text-xs uppercase tracking-widest text-white/80 transition-all duration-300"
              >
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
