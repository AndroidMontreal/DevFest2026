import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionHeader } from '@/components/common/section-header';
import { FaqAccordion } from '@/components/faq/faq-accordion';
import SocialLinks from '@/components/common/social-links';

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'FaqPage' });

  // Get raw items list
  const items = t.raw('items') as { question: string; answer: string }[];

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Dynamic tech decorative grids */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-background">
        <div className="blueprint-subgrid absolute inset-0 opacity-[0.3]" />
        <div className="blueprint-grid absolute inset-0 opacity-[0.3]" />
        {/* Soft glowing ambient orbs */}
        <div className="absolute top-1/4 left-0 h-[400px] w-[400px] rounded-full bg-google-yellow/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 h-[400px] w-[400px] rounded-full bg-google-blue/5 blur-[120px]" />
      </div>

      <section className="mx-auto w-full max-w-[1440px] px-6 py-32 md:px-12">
        <SectionHeader
          subheading={t('subheading')}
          headingLine1={t('heading.line1')}
          headingLine2={t('heading.line2')}
          headingLine2ClassName="text-google-yellow"
        />
        
        {/* Split Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start mt-12">
          
          {/* Left Column: Sticky Support Panel */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-8">
            <div className="group relative overflow-hidden border border-white/5 bg-[#0a0a0a]/80 p-8 md:p-10 quad-border-tr backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-google-yellow/0 via-transparent to-google-yellow/[0.01] pointer-events-none" />
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-google-yellow/20 to-transparent" />
              
              <div className="flex items-center gap-3 mb-6">
                <span className="h-2 w-2 rounded-full bg-google-yellow animate-pulse" />
                <span className="font-mono-tech text-[10px] tracking-[0.25em] text-white/40 uppercase">
                  FAQ HELP DESK
                </span>
              </div>

              <h3 className="font-mono-tech text-md font-bold tracking-wider text-white uppercase mb-4">
                Still have questions?
              </h3>
              <p className="font-sans text-sm leading-relaxed text-white/60 mb-8">
                Can&apos;t find what you&apos;re looking for? Reach out to us or join our developer community across our social channels.
              </p>

              {/* Seamlessly Integrated Brand Social Grid */}
              <div className="relative z-10">
                <SocialLinks />
              </div>
            </div>
          </div>

          {/* Right Column: Premium Accordion Panel */}
          <div className="lg:col-span-8">
            <FaqAccordion items={items} />
          </div>

        </div>
      </section>
    </main>
  );
}
