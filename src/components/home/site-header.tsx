'use client';

import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { LocaleSwitcher } from './locale-switcher';

type HeaderCopy = {
  logoAlt: string;
  city: string;
  registerLabel: string;
  registerAria: string;
};

type HeaderNavItem = {
  label: string;
  href: string;
};

type SiteHeaderProps = {
  header: HeaderCopy;
  nav: HeaderNavItem[];
  isMenuOpen: boolean;
  toggleMenu: () => void;
};

export function SiteHeader({ header, nav, isMenuOpen, toggleMenu }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 z-[100] w-full border-b border-white/5 px-5 py-6 backdrop-blur-md transition-all duration-300 md:px-10 md:py-8 ${scrolled ? 'bg-[#050505]/90' : 'bg-[#050505]/55'}`}
    >
      <div className="flex w-full items-center justify-between md:hidden">
        <Link href="/">
          <div className="relative h-auto w-auto">
            <Image
              src="/assets/images/logos/devfest-2026.svg"
              width={220}
              height={28}
              alt={header.logoAlt}
              className="h-auto w-[200px] object-contain"
            />
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <button onClick={toggleMenu} className="text-white">
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      <div className="hidden w-full items-center justify-between md:flex">
        <div className="flex items-center gap-3">
          <Link href="/">
            <div className="relative h-auto w-auto">
              <Image
                src="/assets/images/logos/devfest-2026.svg"
                width={220}
                height={28}
                alt={header.logoAlt}
                className="h-auto w-[220px] object-contain"
              />
            </div>
          </Link>
        </div>

        <nav className="flex items-center gap-10">
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
        </div>
      </div>
    </header>
  );
}
