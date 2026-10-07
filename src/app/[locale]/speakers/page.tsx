import {
  SpeakersGrid,
  type SpeakersGridCopy,
} from '@/components/speakers/speakers-grid';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function SpeakersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'SpeakersPage' });

  const copy: SpeakersGridCopy = {
    search_placeholder: t('search_placeholder'),
    filter_all: t('filter_all'),
    filter_ai: t('filter_ai'),
    filter_cloud: t('filter_cloud'),
    filter_appdev: t('filter_appdev'),
    filter_community: t('filter_community'),
    no_results: t('no_results'),
    items: t.raw('items') as SpeakersGridCopy['items'],
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Blueprint Ambient Grid Backgrounds */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-background">
        <div className="blueprint-subgrid absolute inset-0 opacity-[0.3]" />
        <div className="blueprint-grid absolute inset-0 opacity-[0.3]" />

        {/* Ambient Glowing Orbs */}
        <div className="absolute top-1/4 left-0 h-[450px] w-[450px] rounded-full bg-google-blue/5 blur-[130px]" />
        <div className="absolute bottom-1/4 right-0 h-[450px] w-[450px] rounded-full bg-google-green/5 blur-[130px]" />
        <div className="absolute top-1/2 right-1/4 h-[350px] w-[350px] rounded-full bg-google-red/5 blur-[110px]" />
      </div>

      <section className="mx-auto w-full max-w-[1440px] px-6 py-32 md:px-12">
        {/* Split Header */}
        <div className="mb-20 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 border-l-2 border-primary/10 pl-8 pb-8 border-b border-white/5">
          <div className="max-w-3xl">
            <span className="mb-4 block font-mono text-xs uppercase tracking-[0.3em] text-cyan-400">
              {t('subheading')}
            </span>
            <h1 className="font-display text-4xl font-bold uppercase leading-[0.95] tracking-tighter text-white sm:text-5xl md:text-7xl">
              <span className="font-light">{t('heading.line1')}</span>{' '}
              <span className="text-google-blue">{t('heading.line2')}</span>
            </h1>
          </div>

          <div className="max-w-xl pb-1">
            <p className="font-sans text-sm md:text-base leading-relaxed text-white/60">
              {t('description')}
            </p>
          </div>
        </div>

        {/* Interactive Speakers Grid with Search & Filters */}
        <SpeakersGrid copy={copy} />
      </section>
    </main>
  );
}
