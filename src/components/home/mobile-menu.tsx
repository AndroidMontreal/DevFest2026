'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { useEffect } from 'react';

type HeaderNavItem = {
  label: string;
  href: string;
};

type MobileMenuProps = {
  nav: HeaderNavItem[];
  currentPathname: string;
  isOpen: boolean;
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

export function MobileMenu({ nav, currentPathname, isOpen, toggleMenu }: MobileMenuProps) {
  const menuVariants = {
    hidden: { x: '100%' },
    visible: { x: 0, transition: { duration: 0.3 } },
  };

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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={menuVariants}
          className="fixed top-[80px] right-0 bottom-0 z-[110] flex w-full flex-col overflow-y-auto bg-[#050505] px-4 py-6 md:hidden"
        >
          <div className="flex-grow flex flex-col items-center gap-8 mt-0"> {/* Adjusted margin-top */}
            <motion.nav className="flex flex-col items-center gap-8">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  onClick={toggleMenu}
                  className={`font-mono-tech text-xl uppercase transition-colors ${
                    isActiveNavItem(currentPathname, item.href)
                      ? 'text-google-yellow'
                      : 'text-white/75 hover:text-white'
                  }`}
                  href={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </motion.nav>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
