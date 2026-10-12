'use client';

import { MobileMenu } from '@/components/home/mobile-menu';
import { SiteHeader } from '@/components/home/site-header';
import { usePathname } from '@/i18n/navigation';
import { useState } from 'react';

export type HeaderCopy = {
  logoAlt: string;
  city: string;
  registerLabel: string;
  registerAria: string;
  ticketsButton?: string;
};

export type HeaderNavItem = {
  label: string;
  href: string;
  isExternal?: boolean;
};

function normalizePath(path: string) {
  const localeFreePath = path.replace(/^\/(en|fr)(?=\/|$)/, '') || '/';
  if (localeFreePath === '/') return '/';
  return localeFreePath.replace(/\/+$/, '');
}

export function isActiveNavItem(currentPathname: string, href: string) {
  if (href.startsWith('mailto:') || href.startsWith('http')) return false;
  const current = normalizePath(currentPathname);
  const target = normalizePath(href);
  if (target === '/') return current === '/';
  return current === target || current.startsWith(`${target}/`);
}

type SiteHeaderShellProps = {
  header: HeaderCopy;
  nav: HeaderNavItem[];
};

export function SiteHeaderShell({ header, nav }: SiteHeaderShellProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <>
      <SiteHeader
        header={header}
        nav={nav}
        currentPathname={pathname}
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
      />
      <MobileMenu
        nav={nav}
        currentPathname={pathname}
        isOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        ticketsLabel={header.ticketsButton}
      />
    </>
  );
}
