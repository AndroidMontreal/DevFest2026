import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'DevFest 2026',
  description: 'Official DevFest 2026 website.',
};

export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}
