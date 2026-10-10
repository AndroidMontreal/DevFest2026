'use client';

import { Link, usePathname } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

export function LocaleSwitcher() {
  const pathname = usePathname();
  const locale = useLocale();
  const nextLocale = locale === 'en' ? 'fr' : 'en';

  return (
    <Link
      href={pathname}
      locale={nextLocale}
      aria-label={`Switch language to ${nextLocale.toUpperCase()}`}
      className="group relative inline-flex shrink-0 items-center gap-1.5 sm:gap-2 overflow-hidden rounded-sm border border-white/25 bg-black/20 px-2.5 py-1.5 sm:px-3.5 sm:py-2 backdrop-blur-sm transition-all hover:border-white/45 hover:bg-white/5 whitespace-nowrap"
    >
      <div className="quad-border-tr absolute inset-0 opacity-35" />
      <div className="quad-border-bl absolute inset-0 opacity-35" />
      <svg
        className="relative size-3 sm:size-3.5 text-white/60 transition-colors group-hover:text-google-blue shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </svg>
      <span className="font-mono-tech relative text-[10px] sm:text-[11px] font-bold tracking-[0.15em] sm:tracking-[0.25em] text-white/85 uppercase transition-colors group-hover:text-google-blue">
        {nextLocale.toUpperCase()}
      </span>
    </Link>
  );
}
