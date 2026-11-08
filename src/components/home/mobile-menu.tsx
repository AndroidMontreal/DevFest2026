'use client';

import {
  isActiveNavItem,
  type HeaderNavItem,
} from '@/components/common/site-header-shell';
import { Link } from '@/i18n/navigation';
import { useEffect } from 'react';

type MobileMenuProps = {
  nav: HeaderNavItem[];
  currentPathname: string;
  isOpen: boolean;
  toggleMenu: () => void;
  ticketsLabel?: string;
};

export function MobileMenu({
  nav,
  currentPathname,
  isOpen,
  toggleMenu,
}: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
      className="fixed inset-0 top-0 z-[105] flex w-full flex-col overflow-y-auto bg-[#050505]/95 px-6 pt-24 pb-10 backdrop-blur-xl xl:hidden"
    >
      <div className="my-auto flex flex-grow flex-col items-center justify-center gap-7">
        <nav className="flex flex-col items-center gap-6 sm:gap-7">
          {nav.map((item) => {
            const isMailto = item.href.startsWith('mailto:');
            const isExternal =
              item.isExternal || item.href.startsWith('http') || isMailto;
            const activeClass = isActiveNavItem(currentPathname, item.href)
              ? 'text-google-yellow font-bold'
              : 'text-white/80 hover:text-white';

            if (isExternal) {
              return (
                <a
                  key={item.href}
                  onClick={toggleMenu}
                  className={`font-mono-tech text-lg sm:text-xl tracking-[0.2em] uppercase transition-colors ${activeClass}`}
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
                  toggleMenu();
                  if (!item.href.includes('#')) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    window.dispatchEvent(
                      new CustomEvent('devfest:reset-schedule-top'),
                    );
                  }
                }}
                className={`font-mono-tech text-lg sm:text-xl tracking-[0.2em] uppercase transition-colors ${activeClass}`}
                href={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
