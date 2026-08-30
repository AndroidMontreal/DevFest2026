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
  cfpButton?: string;
};

type HeaderNavItem = {
  label: string;
  href: string;
  isExternal?: boolean;
};

type SiteHeaderProps = {
  header: HeaderCopy;
  nav: HeaderNavItem[];
  currentPathname: string;
  isMenuOpen: boolean;
  toggleMenu: () => void;
};

function normalizePath(path: string) {
  const localeFreePath = path.replace(/^\/(en|fr)(?=\/|$)/, '') || '/';
  if (localeFreePath === '/') return '/';
  return localeFreePath.replace(/\/+$/, '');
}

function isActiveNavItem(currentPathname: string, href: string) {
  const current = normalizePath(currentPathname);
  const target = normalizePath(href);
  if (target === '/') return current === '/';
  return current === target || current.startsWith(`${target}/`);
}

export function SiteHeader({
  header,
  nav,
  currentPathname,
  isMenuOpen,
  toggleMenu,
}: SiteHeaderProps) {
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
      className={`fixed top-0 left-0 z-[100] w-full border-b px-5 py-6 backdrop-blur-md transition-all duration-300 md:px-10 md:py-8 neon-header-border ${scrolled ? 'bg-[#050505]/90' : 'bg-[#050505]/55'}`}
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
            const activeClass = isActiveNavItem(currentPathname, item.href)
              ? 'text-white'
              : 'text-white/50';

            const isExternal = item.isExternal || item.href.startsWith('http');

            if (isExternal) {
              return (
                <a
                  key={item.href}
                  className={`font-mono-tech text-[12px] tracking-[0.32em] ${activeClass} ${colorClass} uppercase transition-colors`}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.label}
                </a>
              );
            }

            return (
              <Link
                key={item.href}
                className={`font-mono-tech text-[12px] tracking-[0.32em] ${activeClass} ${colorClass} uppercase transition-colors`}
                href={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-6">
          {header.cfpButton && (
            <a
              href="https://cfp.gdgmontreal.com/c/devfest-mtl-2026"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center border border-google-blue bg-google-blue/10 hover:bg-google-blue hover:text-black px-4 py-2 font-mono-tech text-[10px] uppercase tracking-widest text-google-blue transition-all duration-300 quad-border-tr"
            >
              {header.cfpButton}
            </a>
          )}
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}
