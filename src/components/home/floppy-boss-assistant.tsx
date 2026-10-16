'use client';

import { ExternalLink, X } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useState } from 'react';

const BOSS_PDF_URL_EN =
  'https://drive.google.com/file/d/1b5xb5mgb36U7j1Rb5eSF_al9IVQxGL6A/view?usp=drive_link';
const BOSS_PDF_URL_FR =
  'https://drive.google.com/file/d/1HSBwPv59tTBBtt8RStrpcy1ffVksjpEQ/view?usp=drive_link';

export function FloppyBossAssistant() {
  const locale = useLocale();
  const isFr = locale === 'fr';
  const pdfUrl = isFr ? BOSS_PDF_URL_FR : BOSS_PDF_URL_EN;
  const [bubbleCollapsed, setBubbleCollapsed] = useState(false);

  return (
    <div className="fixed bottom-44 right-4 sm:bottom-48 sm:right-6 md:bottom-52 md:right-8 z-40 flex flex-col items-end gap-2 select-none">
      {/* Clippy-style Speech Bubble */}
      {!bubbleCollapsed && (
        <div className="relative max-w-[250px] sm:max-w-[285px] rounded-2xl border-2 border-google-yellow bg-[#fef9c3] px-4 py-3 text-black shadow-[0_10px_30px_rgba(0,0,0,0.65),0_0_20px_rgba(251,188,4,0.35)] transition-transform duration-300 hover:-translate-y-0.5">
          {/* Dismiss / Collapse Bubble Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setBubbleCollapsed(true);
            }}
            aria-label={isFr ? 'Masquer la bulle' : 'Minimize tip'}
            className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full border border-black/25 bg-white text-black/70 hover:bg-black hover:text-white transition-colors cursor-pointer shadow-sm"
          >
            <X className="h-3 w-3" />
          </button>

          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group block text-left focus:outline-none"
          >
            <p className="font-mono-tech text-[10px] font-bold tracking-wider text-black/60 mb-1 flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-google-blue animate-ping" />
              <span>Disk-Y</span>
            </p>
            <p className="font-sans text-xs sm:text-[13px] font-bold leading-snug text-black">
              {isFr
                ? "Besoin d'aide pour convaincre votre boss de vous envoyer au DevFest ?"
                : 'Need help selling going to DevFest to your boss?'}{' '}
              <span className="inline-flex items-center gap-1 text-google-blue underline decoration-2 underline-offset-2 group-hover:text-blue-700 font-extrabold">
                <span>{isFr ? 'Cliquez ici' : 'Click here!'}</span>
                <ExternalLink className="h-3 w-3 shrink-0" />
              </span>
            </p>
          </a>

          {/* Speech Bubble Tail pointing down to Floppy */}
          <div className=" -bottom-2.5 right-7 absolute h-4 w-4 rotate-45 border-r-2 border-b-2 border-google-yellow bg-[#fef9c3]" />
        </div>
      )}

      {/* Floating Clippy-style 3.5" Floppy Disk Character */}
      <div className="flex items-center gap-2">
        {bubbleCollapsed && (
          <button
            type="button"
            onClick={() => setBubbleCollapsed(false)}
            className="rounded-full border border-google-yellow/60 bg-[#0a0f1d]/95 px-3 py-1 font-mono-tech text-[10px] font-bold text-google-yellow shadow-[0_0_15px_rgba(251,188,4,0.25)] hover:bg-google-yellow hover:text-black transition-all cursor-pointer"
          >
            {isFr ? '💬 Convaincre mon boss ?' : '💬 Convince your boss?'}
          </button>
        )}

        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={
            isFr
              ? "Besoin d'aide pour convaincre votre boss de vous envoyer au DevFest ? Cliquez ici"
              : 'Need help selling going to DevFest to your boss? Click here!'
          }
          className="group relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl border border-cyan-400/40 bg-[#080e1e]/90 p-1.5 shadow-[0_0_25px_rgba(0,240,255,0.22)] backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-google-yellow hover:shadow-[0_0_30px_rgba(251,188,4,0.45)] animate-bounce"
          style={{ animationDuration: '3.2s' }}
        >
          <svg
            viewBox="0 0 100 100"
            className="h-full w-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
            aria-hidden="true"
          >
            {/* Floppy Disk Body (3.5" Classic Blue/Indigo with chamfered top-right corner) */}
            <path
              d="M12 10 H76 L88 22 V88 C88 91.3 85.3 94 82 94 H18 C14.7 94 12 91.3 12 88 V16 C12 12.7 14.7 10 18 10 Z"
              fill="#2563eb"
              stroke="#60a5fa"
              strokeWidth="3"
            />

            {/* Top Metal Sliding Shutter */}
            <rect
              x="28"
              y="10"
              width="40"
              height="26"
              rx="2"
              fill="#cbd5e1"
              stroke="#94a3b8"
              strokeWidth="2"
            />
            {/* Shutter Window Cutout */}
            <rect x="52" y="14" width="10" height="18" rx="1" fill="#1e293b" />

            {/* Bottom Paper Label */}
            <rect
              x="22"
              y="56"
              width="56"
              height="34"
              rx="3"
              fill="#f8fafc"
              stroke="#cbd5e1"
              strokeWidth="1.5"
            />
            {/* Google Color Stripes on Label */}
            <rect
              x="26"
              y="61"
              width="48"
              height="3.5"
              rx="1.5"
              fill="#4285F4"
            />
            <rect
              x="26"
              y="67"
              width="48"
              height="3.5"
              rx="1.5"
              fill="#EA4335"
            />
            <rect
              x="26"
              y="73"
              width="48"
              height="3.5"
              rx="1.5"
              fill="#FBBC04"
            />
            <rect
              x="26"
              y="79"
              width="32"
              height="3.5"
              rx="1.5"
              fill="#34A853"
            />

            {/* Write-protect Notch */}
            <rect x="16" y="78" width="4" height="6" rx="1" fill="#0f172a" />

            {/* CLIPPY-STYLE EXPRESSIVE CARTOON EYES & EYEBROWS */}
            {/* Left Eyebrow */}
            <path
              d="M21 29 Q33 21 44 28"
              fill="none"
              stroke="#0f172a"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Right Eyebrow */}
            <path
              d="M55 27 Q67 19 79 28"
              fill="none"
              stroke="#0f172a"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Left Eye Sclera */}
            <ellipse
              cx="34"
              cy="43"
              rx="11"
              ry="13"
              fill="#ffffff"
              stroke="#0f172a"
              strokeWidth="2.8"
            />
            {/* Right Eye Sclera */}
            <ellipse
              cx="66"
              cy="43"
              rx="11"
              ry="13"
              fill="#ffffff"
              stroke="#0f172a"
              strokeWidth="2.8"
            />

            {/* Left Pupil */}
            <ellipse cx="36" cy="43" rx="5.2" ry="6.5" fill="#0f172a" />
            <circle cx="38" cy="40" r="2.2" fill="#ffffff" />

            {/* Right Pupil */}
            <ellipse cx="68" cy="43" rx="5.2" ry="6.5" fill="#0f172a" />
            <circle cx="70" cy="40" r="2.2" fill="#ffffff" />

            {/* Cute Little Smile */}
            <path
              d="M44 52 Q50 56 56 52"
              fill="none"
              stroke="#fde047"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
