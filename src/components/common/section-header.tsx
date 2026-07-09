'use client';

type SectionHeaderProps = {
  subheading: string;
  headingLine1: string;
  headingLine2: string;
};

export const SectionHeader = ({
  subheading,
  headingLine1,
  headingLine2,
}: SectionHeaderProps) => {
  return (
    <div className="mb-24 flex flex-col items-start justify-between gap-12 border-l-2 border-primary/10 pl-10 md:flex-row md:items-end">
      <div className="max-w-3xl">
        <span className="mb-6 block font-mono text-xs uppercase tracking-[0.3em] text-primary/60">
          {subheading}
        </span>
        <h2 className="font-display text-4xl font-bold uppercase leading-[0.95] tracking-tighter text-on-surface sm:text-5xl md:text-7xl">
          <span className="font-light">{headingLine1}</span>
          <br />
          <span className="text-google-blue">{headingLine2}</span>
        </h2>
      </div>
    </div>
  );
};
