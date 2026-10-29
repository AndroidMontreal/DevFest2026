import { StaffAssignmentsView } from '@/components/staff/staff-assignments-view';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'DevFest Montréal 2026 · Staff & Room Assignments',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LocaleStaffPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <StaffAssignmentsView initialLocale={locale === 'fr' ? 'fr' : 'en'} />;
}
