'use client';

import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { LocaleSwitcher } from './locale-switcher';
import type { HomeLandingCopy } from './types';

type SiteHeaderProps = {
  header: HomeLandingCopy['header'];
  nav: HomeLandingCopy['nav'];
  isMenuOpen: boolean;
  toggleMenu: () => void;
};

export function SiteHeader({ header, nav, isMenuOpen, toggleMenu }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 z-50 flex w-full items-center justify-between px-5 py-6 md:px-10 md:py-8 transition-all duration-300 ${scrolled ? 'bg-[#050505]/90 backdrop-blur-md border-b border-white/5' : 'bg-transparent'}`}>
      <div className="flex items-center gap-3">
        <Link href="/">
          <Image src="/assets/images/logos/devfest-2026.svg" alt={header.logoAlt} width={200} height={28} />
        </Link>
      </div>

      <nav className="hidden items-center gap-10 md:flex">
        {nav.map((item, index) => {
          const colors = ['blue', 'red', 'yellow', 'green'];
          const colorClass = `hover:text-google-${colors[index % colors.length]}`;
          const opacityClass = index === 0 ? 'text-white' : 'text-white/50';

          return (
            <Link
              key={item.href}
              className={`font-mono-tech text-[12px] tracking-[0.32em] ${opacityClass} ${colorClass} uppercase transition-colors`}
              href={item.href}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-6">
        <LocaleSwitcher />
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white">
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
    </header>
  );
}
