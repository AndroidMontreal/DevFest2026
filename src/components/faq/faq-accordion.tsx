'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ExternalLink, Play } from 'lucide-react';
import { useState } from 'react';

type FaqItem = {
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  items: FaqItem[];
};

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0); // First item expanded by default

  const toggleExpand = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  // Google brand colors for text and active state highlights
  const colors = [
    {
      text: 'text-google-blue',
      border: 'border-l-google-blue',
      hoverBorder: 'group-hover:border-l-google-blue/30',
      bgGlow: 'bg-gradient-to-r from-google-blue/[0.02] to-transparent',
    },
    {
      text: 'text-google-red',
      border: 'border-l-google-red',
      hoverBorder: 'group-hover:border-l-google-red/30',
      bgGlow: 'bg-gradient-to-r from-google-red/[0.02] to-transparent',
    },
    {
      text: 'text-google-yellow',
      border: 'border-l-google-yellow',
      hoverBorder: 'group-hover:border-l-google-yellow/30',
      bgGlow: 'bg-gradient-to-r from-google-yellow/[0.02] to-transparent',
    },
    {
      text: 'text-google-green',
      border: 'border-l-google-green',
      hoverBorder: 'group-hover:border-l-google-green/30',
      bgGlow: 'bg-gradient-to-r from-google-green/[0.02] to-transparent',
    },
  ];

  return (
    <div className="max-w-4xl w-full mr-auto text-left divide-y divide-white/10 border-t border-b border-white/10">
      {items.map((item, index) => {
        const isExpanded = expandedIndex === index;
        const brand = colors[index % colors.length];

        return (
          <div
            key={index}
            className={`group relative overflow-hidden transition-all duration-500 border-l-2 ${
              isExpanded
                ? `bg-white/[0.015] ${brand.border} backdrop-blur-md`
                : `bg-transparent border-l-transparent ${brand.hoverBorder}`
            }`}
          >
            {/* Blending glow background when expanded */}
            {isExpanded && (
              <div
                className={`absolute inset-0 pointer-events-none ${brand.bgGlow} transition-all duration-500`}
              />
            )}

            {/* Accordion Trigger Header */}
            <button
              onClick={() => toggleExpand(index)}
              className="relative z-10 flex w-full items-center justify-between p-6 md:p-8 text-left cursor-pointer transition-all duration-300"
            >
              <div className="flex items-center gap-4 md:gap-6 pr-4">
                {/* Monospace bracket-number */}
                <span
                  className={`font-mono-tech text-xs md:text-sm font-bold tracking-wider transition-colors duration-300 ${
                    isExpanded
                      ? brand.text
                      : 'text-white/30 group-hover:text-white/60'
                  }`}
                >
                  [ {String(index + 1).padStart(2, '0')} ]
                </span>

                {/* Professional Question */}
                <span
                  className={`font-sans text-sm md:text-base font-semibold tracking-wide transition-colors duration-300 ${
                    isExpanded
                      ? 'text-white'
                      : 'text-white/70 group-hover:text-white/95'
                  }`}
                >
                  {item.question}
                </span>
              </div>

              {/* Premium rotating chevron */}
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                  isExpanded
                    ? 'rotate-180 text-white bg-white/5'
                    : 'text-white/30 bg-transparent group-hover:text-white/6 group-hover:bg-white/[0.02]'
                }`}
              >
                <ChevronDown className="h-4 w-4" />
              </div>
            </button>

            {/* Expandable Content Area */}
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: 'auto',
                    opacity: 1,
                    transition: {
                      height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                      opacity: { duration: 0.25, delay: 0.05 },
                    },
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                    transition: {
                      height: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                      opacity: { duration: 0.15 },
                    },
                  }}
                  className="relative z-10"
                >
                  <div className="p-6 md:p-8 pt-0 md:pt-0 pb-8 md:pb-8 font-sans text-sm text-white/60 leading-relaxed max-w-3xl ml-10 md:ml-14">
                    {renderAnswerText(item.answer)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

function renderAnswerText(answer: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = answer.split(urlRegex);

  return (
    <div className="space-y-2">
      {parts.map((part, index) => {
        if (!part) return null;
        if (part.match(urlRegex)) {
          const isVideo =
            part.includes('tiny.cc') ||
            part.includes('youtube.com') ||
            part.includes('youtu.be');

          return (
            <div key={index} className="pt-2">
              <a
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={`group/link inline-flex items-center gap-3 px-4 py-2.5 rounded border font-mono-tech text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isVideo
                    ? 'border-google-red/40 bg-google-red/10 text-white hover:border-google-red hover:bg-google-red/20 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(234,67,53,0.15)] hover:shadow-[0_0_20px_rgba(234,67,53,0.35)]'
                    : 'border-google-blue/40 bg-google-blue/10 text-google-blue hover:border-google-blue hover:bg-google-blue/20 hover:text-white hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(66,133,244,0.15)] hover:shadow-[0_0_20px_rgba(66,133,244,0.35)]'
                }`}
              >
                {isVideo && (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-google-red text-white transition-transform duration-200 group-hover/link:scale-110">
                    <Play className="h-2.5 w-2.5 fill-white ml-0.5" />
                  </span>
                )}
                <span className="underline underline-offset-4 break-all">
                  {part}
                </span>
                <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-70 group-hover/link:opacity-100" />
              </a>
            </div>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </div>
  );
}
