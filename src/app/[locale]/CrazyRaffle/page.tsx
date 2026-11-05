import { CrazyRaffleView } from '@/components/crazy-raffle/crazy-raffle-view';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

export const metadata: Metadata = {
  title: "GDG CrazyRaffle // DevFest MTL '26 Category Shuffler",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LocaleCrazyRafflePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CrazyRaffleView />;
}
