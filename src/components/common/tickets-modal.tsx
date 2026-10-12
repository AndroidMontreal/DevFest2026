'use client';

import { ExternalLink, Mail, Ticket, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

const BEVY_TICKETS_URL =
  'https://gdg.community.dev/events/details/google-gdg-montreal-presents-devfest-mtl-26/';

type TicketsModalContextValue = {
  openTicketsModal: () => void;
  closeTicketsModal: () => void;
};

const TicketsModalContext = createContext<TicketsModalContextValue | null>(
  null,
);

export function useTicketsModal() {
  const context = useContext(TicketsModalContext);
  if (!context) {
    throw new Error(
      'useTicketsModal must be used within a TicketsModalProvider',
    );
  }
  return context;
}

export function TicketsTriggerButton({
  className,
  children,
  onClick,
}: {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  const { openTicketsModal } = useTicketsModal();

  return (
    <button
      type="button"
      onClick={() => {
        onClick?.();
        openTicketsModal();
      }}
      className={`cursor-pointer ${className ?? ''}`}
    >
      {children}
    </button>
  );
}

export function TicketsModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('Header.ticketsModal');

  const openTicketsModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeTicketsModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || window.self === window.top) return;

    // When embedded in a sandboxed iframe without allow-popups-to-escape-sandbox (e.g. dev.events),
    // target="_blank" popups inherit the sandbox and fail with ERR_BLOCKED_BY_RESPONSE on sites
    // that send Cross-Origin-Opener-Policy headers (like gdg.community.dev, YouTube, Instagram).
    // Route external _blank links through top-level navigation (allowed by allow-top-navigation).
    const handleEmbeddedExternalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest(
        'a[target="_blank"]',
      ) as HTMLAnchorElement | null;
      if (!anchor || !anchor.href || !anchor.href.startsWith('http')) return;

      if (window.top) {
        event.preventDefault();
        window.top.location.href = anchor.href;
      }
    };

    document.addEventListener('click', handleEmbeddedExternalClick);
    return () => {
      document.removeEventListener('click', handleEmbeddedExternalClick);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeTicketsModal();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeTicketsModal]);

  const handleProceedClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (
      typeof window !== 'undefined' &&
      window.top &&
      window.self !== window.top
    ) {
      event.preventDefault();
      window.top.location.href = BEVY_TICKETS_URL;
      return;
    }

    window.setTimeout(() => {
      closeTicketsModal();
    }, 150);
  };

  const email = t('issueEmail');
  const subject = t('issueSubject');
  const mailtoHref = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

  return (
    <TicketsModalContext.Provider
      value={{ openTicketsModal, closeTicketsModal }}
    >
      {children}

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="tickets-modal-title"
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-md"
          onClick={closeTicketsModal}
        >
          <div
            className="relative w-full max-w-lg overflow-hidden border border-google-yellow/40 bg-[#08080c]/95 p-6 sm:p-8 quad-border-tr quad-border-bl shadow-[0_0_45px_rgba(251,188,4,0.2)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top gradient highlight */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-google-yellow/60 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-google-yellow/[0.04] via-transparent to-google-blue/[0.03]" />

            {/* Header Row */}
            <div className="relative z-10 flex items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-google-yellow animate-pulse" />
                <span className="font-mono-tech text-[10px] sm:text-[11px] tracking-[0.22em] text-google-yellow uppercase font-semibold">
                  {t('badge')}
                </span>
              </div>

              <button
                type="button"
                onClick={closeTicketsModal}
                aria-label={t('closeAria')}
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center border border-white/15 bg-white/5 text-white/70 transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Title & Description */}
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-google-yellow/30 bg-google-yellow/10 text-google-yellow">
                  <Ticket className="size-5" />
                </div>
                <h2
                  id="tickets-modal-title"
                  className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white"
                >
                  {t('title')}
                </h2>
              </div>

              <p className="font-sans text-sm sm:text-base leading-relaxed text-white/80">
                {t('description')}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="relative z-10 mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href={BEVY_TICKETS_URL}
                target="_top"
                rel="noopener noreferrer"
                onClick={handleProceedClick}
                className="inline-flex flex-1 items-center justify-center gap-2 border border-google-yellow bg-google-yellow px-6 py-3.5 font-mono-tech text-xs font-bold uppercase tracking-[0.2em] text-black transition-all duration-300 hover:bg-google-yellow/90 hover:shadow-[0_0_25px_rgba(251,188,4,0.45)] quad-border-tr"
              >
                <span>{t('proceedButton')}</span>
                <ExternalLink className="size-3.5" />
              </a>

              <button
                type="button"
                onClick={closeTicketsModal}
                className="inline-flex cursor-pointer items-center justify-center border border-white/20 bg-white/[0.03] px-5 py-3.5 font-mono-tech text-xs font-semibold uppercase tracking-[0.18em] text-white/75 transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white"
              >
                {t('cancelButton')}
              </button>
            </div>

            {/* Support / Issues Footer */}
            <div className="relative z-10 mt-6 border-t border-white/10 pt-4">
              <p className="flex flex-wrap items-center gap-1.5 font-sans text-xs sm:text-sm leading-relaxed text-white/60">
                <Mail className="size-3.5 shrink-0 text-google-yellow/80" />
                <span>{t('issuePrefix')}</span>
                <a
                  href={mailtoHref}
                  className="font-mono-tech text-xs text-google-yellow underline decoration-google-yellow/50 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
                >
                  {email}
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </TicketsModalContext.Provider>
  );
}
