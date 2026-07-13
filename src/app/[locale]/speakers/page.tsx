import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function SpeakersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'SpeakersPage' });

  return (
    <ComingSoonPage
      subheading={t('subheading')}
      headingLine1={t('heading.line1')}
      headingLine2={t('heading.line2')}
      message={t('message')}
    />
  );
}
