import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionHeader } from '@/components/common/section-header';
import Link from 'next/link';

export default async function CodeOfConductPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'CodeOfConduct' });

  return (
    <main>
      <section className="mx-auto w-full max-w-[1440px] px-6 py-32 md:px-12">
        <SectionHeader
          subheading={t('header.subheading')}
          headingLine1={t('header.heading.line1')}
          headingLine2={t('header.heading.line2')}
        />

        <div className="max-w-4xl space-y-10 font-inter text-base leading-relaxed text-white/80">
          <section className="space-y-4">
            <p>{t('intro_line')}</p>
            <ul className="list-disc space-y-2 pl-5">
              {t.raw('why_points').map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <p>{t('harassment_free_statement')}</p>
            <ul className="list-disc space-y-2 pl-5">
              {t.raw('harassment_free_list').map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <p>{t('not_exhaustive')}</p>
          <p className="font-semibold text-primary">{t('sexual_language_warning')}</p>

          <section className="space-y-4">
            <h2 className="font-display text-2xl uppercase tracking-tight text-white">
              {t('harassment_includes_title')}
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              {t.raw('harassment_includes_list').map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <p>{t('comply_immediately')}</p>
          <p>{t('exhibitors_speakers_policy')}</p>
          <p>{t('reporting_harassment_title')}</p>

          <section className="space-y-4">
            <h2 className="font-display text-2xl uppercase tracking-tight text-white">
              {t('contacts_title')}
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              {t.raw('contacts_list').map((contact: string, index: number) => (
                <li key={index}>
                  <Link
                    href={`mailto:${contact}`}
                    className="text-google-blue transition-colors hover:text-google-yellow"
                  >
                    {contact}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <p>{t('policy_belief')}</p>

          <section className="space-y-4">
            <h2 className="font-display text-2xl uppercase tracking-tight text-white">
              {t('license_attribution_title')}
            </h2>
            <p>{t('license_attribution_text')}</p>
          </section>
        </div>
      </section>
    </main>
  );
}
