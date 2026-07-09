'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import type { HomeLandingCopy } from './types';
import { useEffect } from 'react';

type MobileMenuProps = {
  nav: HomeLandingCopy['nav'];
  isOpen: boolean;
  toggleMenu: () => void;
};

export function MobileMenu({ nav, isOpen, toggleMenu }: MobileMenuProps) {
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
          className="fixed top-[80px] right-0 bottom-0 z-[99] w-full bg-[#050505] py-6 px-4 flex flex-col overflow-y-auto md:hidden"
        >
          <div className="flex-grow flex flex-col items-center gap-8 mt-0"> {/* Adjusted margin-top */}
            <motion.nav className="flex flex-col items-center gap-8">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  onClick={toggleMenu}
                  className="font-mono-tech text-xl uppercase"
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
