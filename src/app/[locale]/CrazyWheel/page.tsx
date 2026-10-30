import { CrazyWheelView } from '@/components/crazy-wheel/crazy-wheel-view';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

export const metadata: Metadata = {
  title: "GDG RadWheel // DevFest MTL '26 Raffle",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LocaleCrazyWheelPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CrazyWheelView />;
}
