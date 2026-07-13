import { SectionHeader } from './section-header';

type ComingSoonPageProps = {
  subheading: string;
  headingLine1: string;
  headingLine2: string;
  message: string;
};

export function ComingSoonPage({
  subheading,
  headingLine1,
  headingLine2,
  message,
}: ComingSoonPageProps) {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-6 py-32 md:px-12">
      <SectionHeader
        subheading={subheading}
        headingLine1={headingLine1}
        headingLine2={headingLine2}
      />
      <div className="max-w-3xl">
        <p className="font-mono-tech text-sm uppercase tracking-[0.22em] text-white/70">
          {message}
        </p>
      </div>
    </section>
  );
}

