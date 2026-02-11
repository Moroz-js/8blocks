import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  // Output standalone for Docker
  output: 'standalone',
  
  // Trailing slash for consistent routing
  trailingSlash: true,
  
  images: {
    // Loader configuration
    loader: 'default',
    
    // Remote patterns for external images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '8blocks.io',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'www.figma.com',
        pathname: '/api/mcp/asset/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    
    // Domains (deprecated but may help with compatibility)
    domains: ['localhost', '8blocks.io', 'images.unsplash.com'],
    
    // Image formats - WebP and AVIF for better compression
    formats: ['image/avif', 'image/webp'],
    
    // Device sizes for responsive images
    // Based on common device widths and project breakpoints
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    
    // Image sizes for different use cases
    // Covers common image widths in the design
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Minimum cache TTL for optimized images (in seconds)
    minimumCacheTTL: 60,
    
    // Disable static imports for better control
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default withNextIntl(nextConfig);
