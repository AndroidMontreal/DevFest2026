import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Common' });
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{t('title')}</h1>
      <p className="max-w-2xl text-base text-slate-600 md:text-lg">{t('subtitle')}</p>
    </main>
  );
}
