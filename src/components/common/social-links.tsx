'use client';

import { FaLinkedinIn, FaInstagram, FaDiscord, FaYoutube } from 'react-icons/fa';
import Link from 'next/link';

const socialLinksData = [
  { label: 'Linkedin', href: 'https://www.linkedin.com/company/gdgmontreal', icon: FaLinkedinIn },
  { label: 'Instagram', href: 'https://www.instagram.com/gdgmtl/', icon: FaInstagram },
  { label: 'Discord', href: 'https://discord.com/invite/rKMxWWDSTT', icon: FaDiscord },
  { label: 'YouTube', href: 'https://www.youtube.com/@gdgmontreal', icon: FaYoutube },
];

const SocialLinks = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {socialLinksData.map((social) => {
        const Icon = social.icon;
        return (
          <Link
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-outline-variant quad-border-tr p-3 flex items-center gap-3 hover:bg-primary/5 transition-all group"
          >
            <Icon className="text-on-surface-variant group-hover:text-primary" size={16} />
            <span className="font-mono text-[10px] text-on-surface-variant group-hover:text-primary uppercase tracking-widest">
              {social.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default SocialLinks;
