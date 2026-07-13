import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (
    !locale ||
    !routing.locales.includes(locale as (typeof routing.locales)[number])
  ) {
    locale = routing.defaultLocale;
  }

  const common = (await import(`../messages/${locale}/common.json`)).default;
  const metadata = (await import(`../messages/${locale}/metadata.json`))
    .default;
  const header = (await import(`../messages/${locale}/header.json`)).default;
  const home = (await import(`../messages/${locale}/home.json`)).default;
  const gallery = (await import(`../messages/${locale}/gallery.json`)).default;
  const footer = (await import(`../messages/${locale}/footer.json`)).default;
  const sponsors = (await import(`../messages/${locale}/sponsors.json`)).default;
  const team = (await import(`../messages/${locale}/team.json`)).default;
  const schedule = (await import(`../messages/${locale}/schedule.json`)).default;
  const speakers = (await import(`../messages/${locale}/speakers.json`)).default;
  const codeOfConduct = (await import(`../messages/${locale}/code-of-conduct.json`)).default;

  return {
    locale,
    messages: {
      Common: common,
      Metadata: metadata,
      Header: header,
      Home: home,
      Gallery: gallery,
      Footer: footer,
      Sponsors: sponsors,
      TeamPage: team,
      SchedulePage: schedule,
      SpeakersPage: speakers,
      CodeOfConduct: codeOfConduct,
    },
  };
});
