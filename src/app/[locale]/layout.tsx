import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from 'next-intl/server';
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import { notFound } from 'next/navigation';
import { SiteFooter } from '@/components/common/site-footer';
import {
  SiteHeaderShell,
  type HeaderNavItem,
} from '@/components/common/site-header-shell';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.default' });

  return {
    title: {
      default: t('title'),
      template: t('template'),
    },
    description: t('description'),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const tHeader = await getTranslations({ locale, namespace: 'Header' });

  const header = {
    logoAlt: tHeader('header.logoAlt'),
    city: tHeader('header.city'),
    registerLabel: tHeader('header.registerLabel'),
    registerAria: tHeader('header.registerAria'),
  };

  const nav = tHeader.raw('navigation') as HeaderNavItem[];

  return (
    <html lang={locale}>
      <body
        className={`${inter.variable} ${jetBrainsMono.variable} ${spaceGrotesk.variable}`}
      >
        <NextIntlClientProvider messages={messages}>
          <div className="relative isolate flex min-h-screen flex-col">
            <div className="pointer-events-none fixed inset-0 -z-10 bg-background">
              <div className="blueprint-subgrid absolute inset-0" />
              <div className="blueprint-grid absolute inset-0" />
            </div>
            <SiteHeaderShell header={header} nav={nav} />
            <div className="relative z-0 flex-grow">{children}</div>
            <SiteFooter />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
