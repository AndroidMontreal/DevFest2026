'use client';

import { useState } from 'react';
import { MobileMenu } from '@/components/home/mobile-menu';
import { SiteHeader } from '@/components/home/site-header';

export type HeaderCopy = {
  logoAlt: string;
  city: string;
  registerLabel: string;
  registerAria: string;
};

export type HeaderNavItem = {
  label: string;
  href: string;
};

type SiteHeaderShellProps = {
  header: HeaderCopy;
  nav: HeaderNavItem[];
};

export function SiteHeaderShell({ header, nav }: SiteHeaderShellProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <>
      <SiteHeader
        header={header}
        nav={nav}
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
      />
      <MobileMenu nav={nav} isOpen={isMenuOpen} toggleMenu={toggleMenu} />
    </>
  );
}

