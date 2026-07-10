'use client';

import { useTranslations } from 'next-intl';
import SocialLinks from './social-links';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';

export const SiteFooter = () => {
  const t = useTranslations('Footer');

  const pastEventsLinks = t.raw('pastEvents.links') as { label: string; href: string }[];
  const quickLinks = t.raw('quickLinks.links') as { label:string; href: string; isExternal?: boolean }[];
  const codeOfConductLink = quickLinks.find(link => link.label.toLowerCase().includes('conduct'));

  return (
    <footer className="bg-background pt-20 pb-12 relative overflow-hidden gradient-border-top"> {/* Applied gradient-border-top */}
      <div className="absolute inset-0 blueprint-subgrid opacity-20 pointer-events-none"></div>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Column 1: Brand */}
          <div className="md:col-span-4 space-y-6">
            <Link href="/" className="block w-[230px] h-[28px] relative"> {/* Replaced text logo with Image */}
              <Image
                src="/assets/images/logos/devfest-2026.svg"
                alt="DevFest 2026 Logo"
                className="object-contain"
                width={230}
                height={48}
              />
            </Link>
            <p className="text-sm text-on-surface-variant leading-relaxed max-w-xs">
              {t('brand.description')}
            </p>
            {/* Removed color dots div */}
          </div>

          {/* Column 2: Past Events */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="font-mono text-[10px] text-primary/40 uppercase tracking-[0.4em]">{t('pastEvents.title')}</h4>
            <ul className="space-y-3">
              {pastEventsLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="font-mono text-xs text-on-surface-variant hover:text-primary transition-colors uppercase tracking-widest">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="font-mono text-[10px] text-primary/40 uppercase tracking-[0.4em]">{t('quickLinks.title')}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-mono text-xs text-on-surface-variant hover:text-primary transition-colors uppercase tracking-widest"
                    target={link.isExternal ? '_blank' : undefined}
                    rel={link.isExternal ? 'noopener noreferrer' : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Social */}
          <div className="md:col-span-4 space-y-6">
            <h4 className="font-mono text-[10px] text-primary/40 uppercase tracking-[0.4em]">{t('joinUs.title')}</h4>
            <SocialLinks />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-outline-variant"> {/* Moved border-t here for clarity */}
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-[0.2em]">
              {t('brand.copyright')}
            </span>
          </div>
          {codeOfConductLink && (
            <Link href={codeOfConductLink.href} className="font-mono text-[10px] text-outline uppercase tracking-widest hover:text-primary transition-colors">
              {codeOfConductLink.label}
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
};
