import type { Metadata } from 'next';
import type { NormalizedBlogPost } from '@/lib/types';

/**
 * Base site URL from environment variable
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://8blocks.io';

/**
 * Default Open Graph image
 */
const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/8-blocks.svg`;

/**
 * Site name constant
 */
const SITE_NAME = '8Blocks';

/**
 * Default site description
 */
const DEFAULT_DESCRIPTION = 'Modern web development and blockchain solutions';

/**
 * Generate metadata for a standard page
 * 
 * @param options - Page metadata options
 * @param options.title - Page title
 * @param options.description - Page description
 * @param options.locale - Current locale (en or ru)
 * @param options.path - Page path (e.g., '/blog', '/about')
 * @param options.image - Optional custom Open Graph image
 * @param options.type - Open Graph type (default: 'website')
 * @returns Next.js Metadata object
 */
export function generatePageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  locale = 'en',
  path = '',
  image = DEFAULT_OG_IMAGE,
  type = 'website' as const,
}: {
  title: string;
  description?: string;
  locale?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
}): Metadata {
  // Construct full URL
  const url = `${SITE_URL}/${locale}${path}`;

  // Construct full title
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: url,
      languages: {
        'en': `${SITE_URL}/en${path}`,
        'ru': `${SITE_URL}/ru${path}`,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: locale === 'ru' ? 'ru_RU' : 'en_US',
      type,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
  };
}

/**
 * Generate metadata for a blog post
 * 
 * @param post - Normalized blog post data
 * @param locale - Current locale (en or ru)
 * @returns Next.js Metadata object
 */
export function generateBlogPostMetadata(
  post: NormalizedBlogPost,
  locale: string
): Metadata {
  // Construct full URL
  const categorySlug = post.category?.slug || 'uncategorized';
  const url = `${SITE_URL}/${locale}/blog/${categorySlug}/${post.slug}`;

  // Use featured image or default
  const imageUrl = post.featuredImage?.url || DEFAULT_OG_IMAGE;
  const imageWidth = 1200;
  const imageHeight = 630;
  const imageAlt = post.featuredImage?.alt || post.title;

  // Construct full title
  const fullTitle = `${post.title} | ${SITE_NAME}`;

  const metadata: Metadata = {
    title: fullTitle,
    description: post.excerpt || undefined,
    alternates: {
      canonical: url,
      languages: {
        'en': `${SITE_URL}/en/blog/${categorySlug}/${post.slug}`,
        'ru': `${SITE_URL}/ru/blog/${categorySlug}/${post.slug}`,
      },
    },
    openGraph: {
      title: fullTitle,
      description: post.excerpt || undefined,
      url,
      siteName: SITE_NAME,
      locale: locale === 'ru' ? 'ru_RU' : 'en_US',
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      authors: [SITE_NAME],
      images: [
        {
          url: imageUrl,
          width: imageWidth,
          height: imageHeight,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: post.excerpt || undefined,
      images: [imageUrl],
    },
  };

  // Add noindex/nofollow if the post is marked as noindex
  if (post.noindex) {
    metadata.robots = {
      index: false,
      follow: false,
    };
  }

  return metadata;
}

/**
 * Generate Schema.org BlogPosting structured data
 * 
 * @param post - Normalized blog post data
 * @param locale - Current locale (en or ru)
 * @returns JSON-LD structured data object
 */
export function generateBlogPostStructuredData(
  post: NormalizedBlogPost,
  locale: string
) {
  const categorySlug = post.category?.slug || 'uncategorized';
  const url = `${SITE_URL}/${locale}/blog/${categorySlug}/${post.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || undefined,
    image: post.featuredImage?.url,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.publishedAt?.toISOString(),
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: DEFAULT_OG_IMAGE,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

/**
 * Generate Schema.org Organization structured data
 * 
 * @returns JSON-LD structured data object
 */
export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: DEFAULT_OG_IMAGE,
    sameAs: [
      // Add social media URLs here when available
      // 'https://twitter.com/8blocks',
      // 'https://t.me/8blocks',
    ],
  };
}
