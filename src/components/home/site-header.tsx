'use client';

import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { LocaleSwitcher } from './locale-switcher';
import type { HomeLandingCopy } from './types';

type SiteHeaderProps = {
  header: HomeLandingCopy['header'];
  nav: HomeLandingCopy['nav'];
};

export function SiteHeader({ header, nav }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 z-50 flex w-full items-center justify-between px-5 py-6 md:px-10 md:py-8 transition-all duration-300 ${scrolled ? 'bg-[#050505]/90 backdrop-blur-md border-b border-white/5' : 'bg-transparent'}`}
    >
      <div className="flex items-center gap-3">
        <Image
          src="/assets/images/logos/devfest-2026.svg"
          alt={header.logoAlt}
          width={200}
          height={28}
        />
      </div>

      <nav className="hidden items-center gap-10 md:flex">
        <Link
          className="font-mono-tech text-[12px] tracking-[0.32em] text-white hover:text-google-blue uppercase transition-colors"
          href="/"
        >
          {nav.home}
        </Link>
        <Link
          className="font-mono-tech text-[12px] tracking-[0.32em] text-white/50 hover:text-google-red uppercase transition-colors"
          href="/team"
        >
          {nav.team}
        </Link>
        <Link
          className="font-mono-tech text-[12px] tracking-[0.32em] text-white/50 hover:text-google-yellow uppercase transition-colors"
          href="/schedule"
        >
          {nav.schedule}
        </Link>
        <Link
          className="font-mono-tech text-[12px] tracking-[0.32em] text-white/50 hover:text-google-green uppercase transition-colors"
          href="/speakers"
        >
          {nav.speakers}
        </Link>
      </nav>

      <div className="flex items-center gap-6">
        <LocaleSwitcher />
      </div>
    </header>
  );
}
