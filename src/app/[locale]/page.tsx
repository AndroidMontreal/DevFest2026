import {
  HomeLanding,
  type HomeLandingCopy,
} from '@/components/home/home-landing';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Common' });

  const copy: HomeLandingCopy = {
    header: {
      logoAlt: t('header.logoAlt'),
      city: t('header.city'),
      registerLabel: t('header.registerLabel'),
      registerAria: t('header.registerAria'),
    },
    nav: {
      home: t('nav.home'),
      team: t('nav.team'),
      schedule: t('nav.schedule'),
      speakers: t('nav.speakers'),
    },
    hero: {
      phase: t('hero.phase'),
      title: t('hero.title'),
      subtitle: t('hero.subtitle'),
    },
    stats: {
      workshops: {
        label: t('stats.workshops.label'),
        value: t('stats.workshops.value'),
      },
      attendees: {
        label: t('stats.attendees.label'),
        value: t('stats.attendees.value'),
      },
      speakers: {
        label: t('stats.speakers.label'),
        value: t('stats.speakers.value'),
      },
    },
    hud: {
      date: t('hud.date'),
      location: t('hud.location'),
      countdown: {
        days: {
          label: t('countdown.days'),
        },
        hours: {
          label: t('countdown.hours'),
        },
        minutes: {
          label: t('countdown.minutes'),
        },
        seconds: {
          label: t('countdown.seconds'),
        },
      },
    },
    ticker: {
      item1: t('ticker.item1'),
      item2: t('ticker.item2'),
      item3: t('ticker.item3'),
      item4: t('ticker.item4'),
    },
  };

  return <HomeLanding copy={copy} />;
}
