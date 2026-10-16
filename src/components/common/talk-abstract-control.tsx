'use client';

import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { useState } from 'react';

type TalkAbstractControlProps = {
  title: string;
  abstractText: string | null;
  isFr?: boolean;
  titleClassName?: string;
  compact?: boolean;
};

function renderFormattedAbstract(text: string) {
  const paragraphs = text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  const urlRegex = /(https?:\/\/[^\s)]+)/g;

  return (
    <div className="space-y-2.5">
      {paragraphs.map((para, pIdx) => {
        const lines = para.split('\n');
        return (
          <p
            key={pIdx}
            className="font-sans text-xs md:text-[13px] leading-relaxed text-white/85 whitespace-pre-line"
          >
            {lines.map((line, lIdx) => {
              const parts = line.split(urlRegex);
              return (
                <span key={lIdx}>
                  {lIdx > 0 && '\n'}
                  {parts.map((part, partIdx) =>
                    /^https?:\/\//.test(part) ? (
                      <a
                        key={partIdx}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-cyan-300 underline decoration-cyan-400/50 underline-offset-2 hover:text-cyan-200 break-all"
                      >
                        {part}
                      </a>
                    ) : (
                      <span key={partIdx}>{part}</span>
                    ),
                  )}
                </span>
              );
            })}
          </p>
        );
      })}
    </div>
  );
}

export function TalkAbstractControl({
  title,
  abstractText,
  isFr = false,
  titleClassName = 'font-display text-base md:text-lg font-bold text-white leading-snug group-hover:text-cyan-100 transition-colors',
  compact = false,
}: TalkAbstractControlProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!abstractText) {
    return <h4 className={titleClassName}>{title}</h4>;
  }

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="flex flex-col">
      <div className="inline-flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleToggleExpand}
          aria-expanded={isExpanded}
          className="text-left cursor-pointer group/title inline-flex items-start gap-2 focus:outline-none"
        >
          <span
            className={`${titleClassName} underline decoration-cyan-400/0 group-hover/title:decoration-cyan-400/50 underline-offset-4 transition-all`}
          >
            {title}
          </span>
        </button>

        <button
          type="button"
          onClick={handleToggleExpand}
          aria-expanded={isExpanded}
          title={
            isFr
              ? 'Cliquer pour voir la description'
              : 'Click to view talk abstract'
          }
          className={`inline-flex items-center gap-1 rounded-full border transition-all cursor-pointer shrink-0 font-mono-tech uppercase tracking-wider ${
            compact ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-0.5 text-[10px]'
          } ${
            isExpanded
              ? 'border-cyan-400 bg-cyan-400/20 text-cyan-200 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
              : 'border-cyan-400/35 bg-cyan-950/40 text-cyan-300/90 hover:border-cyan-400 hover:bg-cyan-400/15 hover:text-cyan-100'
          }`}
        >
          <Info className={compact ? 'h-2.5 w-2.5' : 'h-3 w-3'} />
          <span>{isFr ? 'Résumé' : 'Abstract'}</span>
          {isExpanded ? (
            <ChevronUp className={compact ? 'h-2.5 w-2.5' : 'h-3 w-3'} />
          ) : (
            <ChevronDown className={compact ? 'h-2.5 w-2.5' : 'h-3 w-3'} />
          )}
        </button>
      </div>

      {/* Inline Expanded Abstract Drawer (on click/tap) */}
      {isExpanded && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="mt-2.5 rounded-xl border border-cyan-400/30 bg-[#070d1f]/95 p-3.5 md:p-4 shadow-[0_0_25px_rgba(0,240,255,0.08)]"
        >
          <div className="mb-2 flex items-center justify-between border-b border-white/10 pb-1.5">
            <span className="inline-flex items-center gap-1.5 font-mono-tech text-[10px] uppercase tracking-[0.2em] text-cyan-400">
              <Info className="h-3 w-3" />
              <span>
                {isFr
                  ? 'Résumé / Description de la session'
                  : 'Talk Abstract / Description'}
              </span>
            </span>
            <button
              type="button"
              onClick={handleToggleExpand}
              className="font-mono-tech text-[10px] uppercase tracking-wider text-white/50 hover:text-cyan-300 cursor-pointer"
            >
              {isFr ? 'Fermer ✕' : 'Close ✕'}
            </button>
          </div>
          {renderFormattedAbstract(abstractText)}
        </div>
      )}
    </div>
  );
}
