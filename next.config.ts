import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  allowedDevOrigins: ['192.168.87.70', '192.168.*.*', 'localhost', '127.0.0.1'],
  images: {
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
