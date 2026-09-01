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

  const t_home = await getTranslations({ locale, namespace: 'Home' });
  const t_gallery = await getTranslations({ locale, namespace: 'Gallery' });
  const t_sponsors = await getTranslations({ locale, namespace: 'Sponsors' });

  const copy: HomeLandingCopy = {
    hero: {
      phase: t_home('hero.phase'),
      title: t_home('hero.title'),
      subtitle: t_home('hero.subtitle'),
      tagline: t_home('hero.tagline'),
      description: t_home('hero.description'),
      cfp_btn: t_home('hero.cfp_btn'),
      tickets_btn: t_home('hero.tickets_btn'),
    },
    stats: {
      workshops: {
        label: t_home('stats.workshops.label'),
        value: t_home('stats.workshops.value'),
      },
      attendees: {
        label: t_home('stats.attendees.label'),
        value: t_home('stats.attendees.value'),
      },
      speakers: {
        label: t_home('stats.speakers.label'),
        value: t_home('stats.speakers.value'),
      },
    },
    hud: {
      date: t_home('hud.date'),
      location: t_home('hud.location'),
      countdown: {
        days: {
          label: t_home('countdown.days'),
        },
        hours: {
          label: t_home('countdown.hours'),
        },
        minutes: {
          label: t_home('countdown.minutes'),
        },
        seconds: {
          label: t_home('countdown.seconds'),
        },
      },
    },
    ticker: {
      item1: t_home('ticker.item1'),
      item2: t_home('ticker.item2'),
      item3: t_home('ticker.item3'),
      item4: t_home('ticker.item4'),
    },
    about: {
      header: {
        subheading: t_home('about.header.subheading'),
        heading: {
          line1: t_home('about.header.heading.line1'),
          line2: t_home('about.header.heading.line2'),
        },
      },
      venueAddress: t_home('about.venueAddress'),
      blocks: t_home.raw('about.blocks') as HomeLandingCopy['about']['blocks'],
    },
    gallery: {
      header: {
        subheading: t_gallery('header.subheading'),
        heading: {
          line1: t_gallery('header.heading.line1'),
          line2: t_gallery('header.heading.line2'),
        },
      },
      items: t_gallery.raw('items') as HomeLandingCopy['gallery']['items'],
    },
    sponsors: {
      header: {
        subheading: t_sponsors('header.subheading'),
        heading: {
          line1: t_sponsors('header.heading.line1'),
          line2: t_sponsors('header.heading.line2'),
        },
      },
      cta: {
        label: t_sponsors('header.cta'),
        link: t_sponsors('header.cta_link'),
      },
      tiers: t_sponsors.raw('tiers') as HomeLandingCopy['sponsors']['tiers'],
    },
  };

  return <HomeLanding copy={copy} />;
}
