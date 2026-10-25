'use client';

import {
  isActiveNavItem,
  type HeaderCopy,
  type HeaderNavItem,
} from '@/components/common/site-header-shell';
import { TicketsTriggerButton } from '@/components/common/tickets-modal';
import { Link } from '@/i18n/navigation';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { LocaleSwitcher } from './locale-switcher';

type SiteHeaderProps = {
  header: HeaderCopy;
  nav: HeaderNavItem[];
  currentPathname: string;
  isMenuOpen: boolean;
  toggleMenu: () => void;
};

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
      className={`fixed top-0 left-0 z-[110] w-full border-b px-3.5 sm:px-6 xl:px-10 backdrop-blur-md transition-all duration-300 neon-header-border ${
        scrolled
          ? 'bg-[#050505]/95 py-3 sm:py-4'
          : 'bg-[#050505]/65 py-3.5 sm:py-5 xl:py-7'
      }`}
    >
      {/* Mobile & Tablet Top Bar (< 1280px) */}
      <div className="flex w-full items-center justify-between gap-2 xl:hidden">
        <Link href="/" className="shrink-0">
          <div className="relative h-auto w-auto">
            <Image
              src="/assets/images/logos/devfest-2026.svg"
              width={220}
              height={28}
              alt={header.logoAlt}
              style={{ height: 'auto' }}
              className="h-auto w-[135px] sm:w-[175px] md:w-[205px] object-contain"
            />
          </div>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {header.ticketsButton && (
            <TicketsTriggerButton className="inline-flex shrink-0 items-center justify-center whitespace-nowrap border border-google-yellow bg-google-yellow/10 hover:bg-google-yellow hover:text-black px-2.5 py-1.5 sm:px-3.5 sm:py-2 font-mono-tech text-[10px] sm:text-[11px] font-bold uppercase tracking-wider sm:tracking-widest text-google-yellow transition-all duration-300 quad-border-tr hover:shadow-[0_0_15px_rgba(251,188,4,0.3)]">
              {header.ticketsButton}
            </TicketsTriggerButton>
          )}
          <LocaleSwitcher />
          <button
            type="button"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-label={
              isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
            }
            className="relative z-30 inline-flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 cursor-pointer touch-manipulation items-center justify-center rounded-sm border border-white/25 bg-black/20 text-white transition-colors hover:border-white/45 hover:bg-white/10 active:bg-white/15"
          >
            {isMenuOpen ? (
              <X className="size-5 sm:size-5" />
            ) : (
              <Menu className="size-5 sm:size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Desktop Top Bar (>= 1280px) */}
      <div className="hidden w-full items-center justify-between gap-4 xl:flex">
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/">
            <div className="relative h-auto w-auto">
              <Image
                src="/assets/images/logos/devfest-2026.svg"
                width={220}
                height={28}
                alt={header.logoAlt}
                style={{ height: 'auto' }}
                className="h-auto w-[185px] 2xl:w-[220px] object-contain"
              />
            </div>
          </Link>
        </div>

        <nav className="flex items-center gap-4 2xl:gap-8">
          {nav.map((item, index) => {
            const colors = ['blue', 'red', 'yellow', 'green'];
            const colorClass = `hover:text-google-${colors[index % colors.length]}`;
            const activeClass = isActiveNavItem(currentPathname, item.href)
              ? 'text-white font-bold'
              : 'text-white/75 font-semibold';

            const isMailto = item.href.startsWith('mailto:');
            const isExternal =
              item.isExternal || item.href.startsWith('http') || isMailto;

            if (isExternal) {
              return (
                <a
                  key={item.href}
                  className={`font-mono-tech text-[11px] 2xl:text-[12px] tracking-[0.14em] 2xl:tracking-[0.18em] whitespace-nowrap ${activeClass} ${colorClass} uppercase transition-colors`}
                  href={item.href}
                  {...(!isMailto && {
                    target: '_blank',
                    rel: 'noopener noreferrer',
                  })}
                >
                  {item.label}
                </a>
              );
            }

            return (
              <Link
                key={item.href}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  window.dispatchEvent(
                    new CustomEvent('devfest:reset-schedule-top'),
                  );
                }}
                className={`font-mono-tech text-[11px] 2xl:text-[12px] tracking-[0.14em] 2xl:tracking-[0.18em] whitespace-nowrap ${activeClass} ${colorClass} uppercase transition-colors`}
                href={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 2xl:gap-5 shrink-0">
          {header.ticketsButton && (
            <TicketsTriggerButton className="inline-flex shrink-0 items-center whitespace-nowrap border border-google-yellow bg-google-yellow/10 hover:bg-google-yellow hover:text-black px-3.5 py-2 font-mono-tech text-[11px] font-bold uppercase tracking-widest text-google-yellow transition-all duration-300 quad-border-tr hover:shadow-[0_0_15px_rgba(251,188,4,0.3)]">
              {header.ticketsButton}
            </TicketsTriggerButton>
          )}
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}
