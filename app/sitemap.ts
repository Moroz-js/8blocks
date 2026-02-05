import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { prisma } from '@/lib/prisma';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://8blocks.io';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  // 1. Static pages for each locale
  const staticPages: MetadataRoute.Sitemap = routing.locales.flatMap((locale) => [
    {
      url: `${BASE_URL}/${locale}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/${locale}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ]);

  // 2. Dynamic: blog categories (parent + subcategories)
  const categories = await prisma.category.findMany({
    select: {
      slug: true,
      updatedAt: true,
      parent: { select: { slug: true } },
    },
  });

  const categoryPages: MetadataRoute.Sitemap = categories.flatMap((cat) => {
    // Parent categories → /blog/{slug}
    // Subcategories → /blog/{parentSlug}/{slug}
    const path = cat.parent
      ? `/blog/${cat.parent.slug}/${cat.slug}`
      : `/blog/${cat.slug}`;

    return routing.locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: cat.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  });

  // 3. Dynamic: published blog posts (multilingual — generate URL for each locale)
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: {
      slug: true,
      publishedAt: true,
      updatedAt: true,
      category: {
        select: { slug: true },
      },
    },
    orderBy: { publishedAt: 'desc' },
  });

  const postPages: MetadataRoute.Sitemap = posts
    .filter((post) => post.category)
    .flatMap((post) =>
      routing.locales.map((locale) => ({
        url: `${BASE_URL}/${locale}/blog/${post.category!.slug}/${post.slug}`,
        lastModified: post.updatedAt || post.publishedAt || currentDate,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }))
    );

  return [...staticPages, ...categoryPages, ...postPages];
}
