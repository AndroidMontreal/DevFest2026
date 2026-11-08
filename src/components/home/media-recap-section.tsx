'use client';

import { Camera, ExternalLink, Images, Sparkles, Video } from 'lucide-react';
import { useLocale } from 'next-intl';
import { SectionHeader } from '../common/section-header';

const PHOTO_ALBUM_LINKS = {
  photographer: '',
  googlePhotos: 'https://photos.app.goo.gl/tRv2wDUhY9LgQPr77',
  photoBooth: 'https://photos.app.goo.gl/Ymd6kUihwgoQaQkq5',
};

const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@gdgmontreal/videos';

export function MediaRecapSection() {
  const locale = useLocale();
  const isFr = locale === 'fr';

  const photoAlbums = [
    {
      id: '01',
      badge: isFr ? 'Photographe officiel' : 'Official Photographer',
      title: isFr ? 'Photographe' : 'Photographer',
      creditName: 'Mathieu Chevalier',
      creditUrl: 'https://www.mathieuchevalier.com/',
      description: isFr
        ? 'Photos officielles haute résolution des conférences, ateliers, panélistes et moments forts capturés tout au long de la journée par Mathieu Chevalier.'
        : 'High-resolution official photos of talks, workshops, speakers, and highlights captured throughout the day by Mathieu Chevalier.',
      ctaLabel: isFr
        ? "Voir l'album du photographe"
        : 'Open Photographer Album',
      comingSoonLabel: isFr ? 'Album bientôt disponible' : 'Album coming soon',
      href: PHOTO_ALBUM_LINKS.photographer,
      icon: Camera,
      accentText: 'text-google-blue',
      accentBg: 'bg-google-blue/15',
      accentBorder: 'border-google-blue/35',
      panelClass: 'neon-panel-blue',
      lineColor: 'bg-google-blue/40',
      btnClass:
        'border-google-blue bg-google-blue/15 text-google-blue hover:bg-google-blue hover:text-white hover:shadow-[0_0_20px_rgba(66,133,244,0.4)]',
    },
    {
      id: '02',
      badge: isFr ? 'Album communautaire' : 'Community Shared Album',
      title: isFr ? 'Album Google Photos' : 'Google Photo Album',
      description: isFr
        ? 'L’album partagé de la communauté DevFest Montréal 2026 — consultez les photos des participants et ajoutez les vôtres !'
        : 'The shared DevFest Montreal 2026 community album — browse attendee snapshots and add your own photos from the event!',
      ctaLabel: isFr ? 'Ouvrir Google Photos' : 'Open Google Photo Album',
      comingSoonLabel: isFr ? 'Lien bientôt disponible' : 'Link coming soon',
      href: PHOTO_ALBUM_LINKS.googlePhotos,
      icon: Images,
      accentText: 'text-google-yellow',
      accentBg: 'bg-google-yellow/15',
      accentBorder: 'border-google-yellow/35',
      panelClass:
        'border border-google-yellow/35 hover:border-google-yellow/60 shadow-[0_0_25px_rgba(251,188,4,0.08)]',
      lineColor: 'bg-google-yellow/40',
      btnClass:
        'border-google-yellow bg-google-yellow/15 text-google-yellow hover:bg-google-yellow hover:text-black hover:shadow-[0_0_20px_rgba(251,188,4,0.4)]',
    },
    {
      id: '03',
      badge: isFr ? 'Souvenirs 80s' : '80s Retro Captures',
      title: isFr ? 'Photo Booths' : 'Photo Booths',
      description: isFr
        ? 'Retrouvez toutes les poses et clichés rétro pris aux cabines photo du DevFest Montréal 2026.'
        : 'Find all the retro snapshots and poses taken at the DevFest Montreal 2026 Photo Booths.',
      ctaLabel: isFr
        ? 'Voir les photos des Photo Booths'
        : 'Open Photo Booths Album',
      comingSoonLabel: isFr ? 'Lien bientôt disponible' : 'Link coming soon',
      href: PHOTO_ALBUM_LINKS.photoBooth,
      icon: Sparkles,
      accentText: 'text-google-green',
      accentBg: 'bg-google-green/15',
      accentBorder: 'border-google-green/35',
      panelClass: 'neon-panel-green',
      lineColor: 'bg-google-green/40',
      btnClass:
        'border-google-green bg-google-green/15 text-google-green hover:bg-google-green hover:text-white hover:shadow-[0_0_20px_rgba(52,168,83,0.4)]',
    },
  ];

  return (
    <>
      {/* Photo Albums Section */}
      <section
        id="photos"
        className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-32 scroll-mt-24"
      >
        <SectionHeader
          subheading={
            isFr ? "Souvenirs de l'événement" : 'Event Memories & Snapshots'
          }
          headingLine1="DevFest 2026"
          headingLine2={isFr ? 'Albums Photos' : 'Photo Albums'}
          headingLine2ClassName="text-google-yellow"
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-7">
          {photoAlbums.map((album) => {
            const Icon = album.icon;
            return (
              <div
                key={album.id}
                className={`group relative overflow-hidden bg-[#0c0e14]/90 backdrop-blur-md p-6 sm:p-8 lg:p-7 xl:p-10 quad-border-tr transition-all duration-300 flex flex-col justify-between ${album.panelClass}`}
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span
                        className={`font-mono-tech text-xs font-bold ${album.accentText} ${album.accentBg} px-2.5 py-1 rounded border ${album.accentBorder}`}
                      >
                        [ {album.id} ]
                      </span>
                      <span className="font-mono-tech text-[11px] tracking-[0.18em] text-white/75 uppercase font-semibold">
                        {album.badge}
                      </span>
                    </div>
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded border ${album.accentBorder} ${album.accentBg} ${album.accentText}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl lg:text-2xl xl:text-3xl font-bold tracking-tight text-white uppercase mb-2">
                    {album.title}
                  </h3>
                  {'creditName' in album && album.creditName && (
                    <div className="mb-4">
                      <a
                        href={album.creditUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-mono-tech text-xs sm:text-sm font-bold uppercase tracking-wider text-google-blue hover:text-white underline decoration-google-blue/60 underline-offset-4 transition-colors"
                      >
                        <span>📸 {album.creditName}</span>
                        <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                      </a>
                    </div>
                  )}
                  <div
                    className={`w-12 h-[1px] ${album.lineColor} mb-5 group-hover:w-24 transition-all duration-500`}
                  />
                  <p className="font-sans text-base leading-relaxed text-white/85 group-hover:text-white transition-colors mb-8">
                    {album.description}
                  </p>
                </div>

                <div>
                  {album.href ? (
                    <a
                      href={album.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex w-full items-center justify-center gap-2.5 border px-5 py-4 text-center font-mono-tech text-xs font-bold uppercase tracking-[0.14em] leading-snug transition-all duration-300 quad-border-tr ${album.btnClass}`}
                    >
                      <span>{album.ctaLabel}</span>
                      <ExternalLink className="h-4 w-4 shrink-0" />
                    </a>
                  ) : (
                    <span
                      aria-disabled="true"
                      className="inline-flex w-full items-center justify-center gap-2 border border-white/20 bg-white/[0.06] px-5 py-4 text-center font-mono-tech text-xs font-bold uppercase tracking-[0.14em] leading-snug text-white/55 cursor-not-allowed select-none"
                    >
                      <span>{album.comingSoonLabel}</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Laser Divider */}
      <div className="laser-divider" />

      {/* Videos Section */}
      <section
        id="videos"
        className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-32 scroll-mt-24"
      >
        <SectionHeader
          subheading={
            isFr ? 'Enregistrements & Rediffusions' : 'Recordings & Replays'
          }
          headingLine1={isFr ? 'Conférences & Sessions' : 'Talks & Sessions'}
          headingLine2={isFr ? 'Vidéos' : 'Videos'}
          headingLine2ClassName="text-google-red"
        />

        <div className="group relative overflow-hidden bg-[#0c0e14]/90 backdrop-blur-md p-6 sm:p-8 lg:p-12 quad-border-tr neon-panel-red transition-all duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 font-mono-tech text-xs font-bold text-google-red bg-google-red/15 px-3 py-1 rounded border border-google-red/35">
                  <Video className="h-3.5 w-3.5" />
                  <span>YOUTUBE // @GDGMONTREAL</span>
                </span>
                <span className="inline-flex items-center gap-2 font-mono-tech text-xs font-bold text-google-yellow bg-google-yellow/15 px-3 py-1 rounded border border-google-yellow/35">
                  <span className="h-2 w-2 rounded-full bg-google-yellow animate-pulse" />
                  <span>
                    {isFr
                      ? "BIENTÔT DISPONIBLE · DEVFEST MTL '26"
                      : "COMING SOON · DEVFEST MTL '26"}
                  </span>
                </span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight text-white">
                {isFr
                  ? 'Chaîne YouTube GDG Montréal'
                  : 'GDG Montréal YouTube Channel'}
              </h3>

              <p className="font-sans text-base leading-relaxed text-white/85">
                {isFr
                  ? "Les vidéos des conférences et sessions du DevFest MTL '26 seront bientôt disponibles dans l'onglet Vidéos de notre chaîne YouTube officielle GDG Montréal."
                  : "The DevFest MTL '26 talk and session videos will be available soon in the Videos tab on our official GDG Montréal YouTube channel."}
              </p>
            </div>

            <div className="shrink-0">
              <a
                href={YOUTUBE_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-3 border border-google-red bg-google-red/15 hover:bg-google-red px-7 py-4 text-center font-mono-tech text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-google-red hover:text-white transition-all duration-300 quad-border-tr hover:shadow-[0_0_25px_rgba(234,67,53,0.45)]"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span>
                  {isFr
                    ? 'Voir sur YouTube · GDG Montréal'
                    : 'Watch on YouTube · GDG Montréal'}
                </span>
                <ExternalLink className="h-4 w-4 shrink-0" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
