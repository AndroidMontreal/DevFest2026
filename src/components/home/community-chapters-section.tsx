'use client';

import {
  Cloud,
  Code2,
  ExternalLink,
  GraduationCap,
  Sparkles,
  Users,
} from 'lucide-react';
import { useLocale } from 'next-intl';
import { SectionHeader } from '../common/section-header';

export function CommunityChaptersSection() {
  const locale = useLocale();
  const isFr = locale === 'fr';

  const cityChapters = [
    {
      id: '01',
      name: 'GDG Montréal',
      category: isFr ? 'Chapitre principal' : 'Core Chapter',
      description: isFr
        ? 'Google Developer Group Montréal — Android, Web, IA & technologies Google.'
        : 'Google Developer Group Montréal — Android, Web, AI & Google developer technologies.',
      href: 'https://gdg.community.dev/gdg-montreal/',
      icon: Users,
      accentText: 'text-google-blue',
      accentBg: 'bg-google-blue/15',
      accentBorder: 'border-google-blue/35',
      panelClass: 'neon-panel-blue',
      btnClass:
        'border-google-blue bg-google-blue/15 text-google-blue hover:bg-google-blue hover:text-white hover:shadow-[0_0_20px_rgba(66,133,244,0.4)]',
    },
    {
      id: '02',
      name: 'GDG Cloud Montréal',
      category: isFr ? 'Cloud & Infrastructure' : 'Cloud & Infrastructure',
      description: isFr
        ? 'Google Cloud Platform, Kubernetes, DevOps, données et architecture infonuagique.'
        : 'Google Cloud Platform, Kubernetes, DevOps, data engineering, and cloud architecture.',
      href: 'https://gdg.community.dev/gdg-cloud-montreal/',
      icon: Cloud,
      accentText: 'text-google-red',
      accentBg: 'bg-google-red/15',
      accentBorder: 'border-google-red/35',
      panelClass: 'neon-panel-red',
      btnClass:
        'border-google-red bg-google-red/15 text-google-red hover:bg-google-red hover:text-white hover:shadow-[0_0_20px_rgba(234,67,53,0.4)]',
    },
    {
      id: '03',
      name: 'Flutter Montréal',
      category: isFr ? 'Multiplateforme & Mobile' : 'Cross-Platform & Mobile',
      description: isFr
        ? 'La communauté montréalaise dédiée à Flutter, Dart et au développement multiplateforme.'
        : 'Montreal’s community dedicated to Flutter, Dart, and multi-platform app development.',
      href: 'https://www.meetup.com/fluttermontreal/',
      icon: Code2,
      accentText: 'text-google-yellow',
      accentBg: 'bg-google-yellow/15',
      accentBorder: 'border-google-yellow/35',
      panelClass:
        'border border-google-yellow/35 hover:border-google-yellow/60 shadow-[0_0_25px_rgba(251,188,4,0.08)]',
      btnClass:
        'border-google-yellow bg-google-yellow/15 text-google-yellow hover:bg-google-yellow hover:text-black hover:shadow-[0_0_20px_rgba(251,188,4,0.4)]',
    },
    {
      id: '04',
      name: 'Women TechMakers Montréal',
      category: isFr ? 'Diversité & Inclusion' : 'Diversity & Inclusion',
      description: isFr
        ? 'Visibilité, communauté et ressources pour les femmes en technologie à Montréal.'
        : 'Visibility, community, and resources for women in technology across Montreal.',
      href: 'https://developers.google.com/womentechmakers',
      icon: Sparkles,
      accentText: 'text-google-green',
      accentBg: 'bg-google-green/15',
      accentBorder: 'border-google-green/35',
      panelClass: 'neon-panel-green',
      btnClass:
        'border-google-green bg-google-green/15 text-google-green hover:bg-google-green hover:text-white hover:shadow-[0_0_20px_rgba(52,168,83,0.4)]',
    },
  ];

  const campusChapters = [
    {
      id: '05',
      name: 'GDG on Campus McGill',
      university: isFr ? 'Université McGill' : 'McGill University',
      href: 'https://gdg.community.dev/gdg-on-campus-mcgill-university-montreal-canada/',
      accentText: 'text-google-red',
      accentBg: 'bg-google-red/15',
      accentBorder: 'border-google-red/35',
      btnClass:
        'border-google-red bg-google-red/15 text-google-red hover:bg-google-red hover:text-white hover:shadow-[0_0_20px_rgba(234,67,53,0.4)]',
    },
    {
      id: '06',
      name: 'GDG on Campus Concordia',
      university: isFr ? 'Université Concordia' : 'Concordia University',
      href: 'https://gdg.community.dev/gdg-on-campus-concordia-university-montreal-canada/',
      accentText: 'text-google-yellow',
      accentBg: 'bg-google-yellow/15',
      accentBorder: 'border-google-yellow/35',
      btnClass:
        'border-google-yellow bg-google-yellow/15 text-google-yellow hover:bg-google-yellow hover:text-black hover:shadow-[0_0_20px_rgba(251,188,4,0.4)]',
    },
    {
      id: '07',
      name: 'GDG on Campus Polytechnique',
      university: 'Polytechnique Montréal',
      href: 'https://gdg.community.dev/gdg-on-campus-polytechnique-montreal-montreal-canada/',
      accentText: 'text-google-blue',
      accentBg: 'bg-google-blue/15',
      accentBorder: 'border-google-blue/35',
      btnClass:
        'border-google-blue bg-google-blue/15 text-google-blue hover:bg-google-blue hover:text-white hover:shadow-[0_0_20px_rgba(66,133,244,0.4)]',
    },
    {
      id: '08',
      name: 'GDG on Campus ÉTS',
      university: 'École de technologie supérieure (ÉTS)',
      href: 'https://gdg.community.dev/gdg-on-campus-ecole-de-technologie-superieure-montreal-canada/',
      accentText: 'text-google-green',
      accentBg: 'bg-google-green/15',
      accentBorder: 'border-google-green/35',
      btnClass:
        'border-google-green bg-google-green/15 text-google-green hover:bg-google-green hover:text-white hover:shadow-[0_0_20px_rgba(52,168,83,0.4)]',
    },
  ];

  return (
    <section
      id="community"
      className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-32 scroll-mt-24"
    >
      <SectionHeader
        subheading={
          isFr
            ? 'Écosystème & Chapitres Participants'
            : 'Participating Chapters'
        }
        headingLine1={isFr ? 'Notre' : 'Our'}
        headingLine2={isFr ? 'Communauté' : 'Community'}
        headingLine2ClassName="text-google-green"
      />

      {/* City & Tech Chapters */}
      <div className="mb-12">
        <div className="mb-6 flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-google-blue" />
          <h3 className="font-mono-tech text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-white/85">
            {isFr
              ? 'Chapitres & Communautés de Montréal'
              : 'Montreal Chapters & Tech Communities'}
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {cityChapters.map((chapter) => {
            const Icon = chapter.icon;
            return (
              <div
                key={chapter.id}
                className={`group relative overflow-hidden bg-[#0c0e14]/90 backdrop-blur-md p-6 sm:p-7 quad-border-tr transition-all duration-300 flex flex-col justify-between ${chapter.panelClass}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <span
                      className={`font-mono-tech text-xs font-bold ${chapter.accentText} ${chapter.accentBg} px-2.5 py-1 rounded border ${chapter.accentBorder}`}
                    >
                      [ {chapter.id} ]
                    </span>
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded border ${chapter.accentBorder} ${chapter.accentBg} ${chapter.accentText}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>

                  <p className="font-mono-tech text-[11px] uppercase tracking-[0.18em] text-white/65 mb-2">
                    {chapter.category}
                  </p>

                  <h4 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white mb-3">
                    {chapter.name}
                  </h4>

                  <p className="font-sans text-sm sm:text-base leading-relaxed text-white/80 mb-6">
                    {chapter.description}
                  </p>
                </div>

                <a
                  href={chapter.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex w-full items-center justify-center gap-2 border px-4 py-3.5 text-center font-mono-tech text-xs font-bold uppercase tracking-[0.16em] transition-all duration-300 quad-border-tr ${chapter.btnClass}`}
                >
                  <span>{isFr ? 'Rejoindre' : 'Join'}</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* GDG on Campus University Chapters */}
      <div>
        <div className="mb-6 flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-google-green" />
          <h3 className="font-mono-tech text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-white/85">
            {isFr
              ? 'GDG on Campus · Chapitres Universitaires'
              : 'GDG on Campus · University Chapters'}
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {campusChapters.map((campus) => (
            <div
              key={campus.id}
              className="group relative overflow-hidden border border-white/15 hover:border-white/35 bg-[#0c0e14]/90 backdrop-blur-md p-6 quad-border-tr transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span
                    className={`font-mono-tech text-xs font-bold ${campus.accentText} ${campus.accentBg} px-2.5 py-1 rounded border ${campus.accentBorder}`}
                  >
                    [ {campus.id} ]
                  </span>
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded border ${campus.accentBorder} ${campus.accentBg} ${campus.accentText}`}
                  >
                    <GraduationCap className="h-4 w-4" />
                  </div>
                </div>

                <h4 className="font-display text-lg sm:text-xl font-bold tracking-tight text-white mb-1.5">
                  {campus.name}
                </h4>

                <p className="font-mono-tech text-xs tracking-wider text-white/75 mb-6">
                  {campus.university}
                </p>
              </div>

              <a
                href={campus.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex w-full items-center justify-center gap-2 border px-4 py-3.5 text-center font-mono-tech text-xs font-bold uppercase tracking-[0.16em] transition-all duration-300 quad-border-tr ${campus.btnClass}`}
              >
                <span>{isFr ? 'Rejoindre' : 'Join'}</span>
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
