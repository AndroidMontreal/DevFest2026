'use client';

import Image from 'next/image';
import type { HomeLandingCopy } from '../home/types';

type GalleryGridProps = {
  items: HomeLandingCopy['gallery']['items'];
};

const GalleryGrid = ({ items }: GalleryGridProps) => {
  return (
    <div className="md:columns-3 gap-6 space-y-6">
      {items.map((item, index) => (
        <div key={index} className="break-inside-avoid">
          <div
            className="group relative overflow-hidden border border-outline-variant quad-border-tr quad-border-bl bg-surface-container-low"
            tabIndex={0}
          >
            <Image
              alt={item.label}
              className="w-full h-auto grayscale transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0 group-focus:grayscale-0"
              src={item.imageSrc}
              width={item.width}
              height={item.height}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60"></div>
            <div className="absolute bottom-8 left-8 z-20">
              <div className="glass-panel px-5 py-3 border-l-2 border-primary">
                <span className="font-mono text-xs text-primary uppercase tracking-widest">{item.label}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GalleryGrid;
