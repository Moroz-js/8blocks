import Hero from '@/components/sections/Hero';
import Services from '@/components/sections/Services';
import About from '@/components/sections/About';
import Partners from '@/components/sections/Partners';
import Benefits from '@/components/sections/Benefits';
import CallToAction from '@/components/sections/CallToAction';
// import Cases from '@/components/sections/Cases';
import { generatePageMetadata, generateOrganizationStructuredData } from '@/lib/seo/metadata';
import { getTranslations } from 'next-intl/server';
// import { prisma } from '@/lib/prisma';
// import type { NormalizedBlogPost } from '@/lib/types';

// Force dynamic rendering - don't generate at build time
export const dynamic = 'force-dynamic';
export const revalidate = 60;

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });

  return generatePageMetadata({
    title: '8Blocks',
    description: t('description'),
    locale,
    path: '',
    type: 'website',
  });
}

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;
  const organizationData = generateOrganizationStructuredData();
  
  // Fetch latest published blog posts for Cases section
  // const posts = await prisma.blogPost.findMany({
  //   where: {
  //     published: true,
  //   },
  //   include: {
  //     category: true,
  //     tags: true,
  //   },
  //   orderBy: {
  //     publishedAt: 'desc',
  //   },
  //   take: 6, // Get 6 latest posts for Cases carousel
  // });

  // Normalize posts to match NormalizedBlogPost type
  // const normalizedPosts: NormalizedBlogPost[] = posts.map((post: any) => ({
  //   id: post.id,
  //   title: locale === 'ru' && post.titleRu ? post.titleRu : post.title,
  //   slug: post.slug,
  //   excerpt: locale === 'ru' && post.excerptRu ? post.excerptRu : post.excerpt,
  //   content: locale === 'ru' && post.contentRu ? post.contentRu : post.content,
  //   featuredImage: post.featuredImage ? {
  //     url: post.featuredImage,
  //     alt: locale === 'ru' && post.titleRu ? post.titleRu : post.title,
  //   } : null,
  //   published: post.published,
  //   publishedAt: post.publishedAt,
  //   locale: locale,
  //   category: post.category ? {
  //     id: post.category.id,
  //     name: locale === 'ru' && post.category.nameRu ? post.category.nameRu : post.category.name,
  //     slug: post.category.slug,
  //   } : null,
  //   tags: post.tags.map((tag: any) => ({
  //     id: tag.id,
  //     name: locale === 'ru' && tag.nameRu ? tag.nameRu : tag.name,
  //   })),
  //   views: post.views || 0,
  //   readTime: post.readTime ?? undefined,
  //   author: post.author || '8Blocks',
  //   createdAt: post.createdAt,
  //   updatedAt: post.updatedAt,
  // }));
  
  return (
    <>
      {/* Organization Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      
      {/* Sections wrapped by <main> in layout.tsx */}
      <Hero />
      <Services locale={locale as 'en' | 'ru'} />
      <About />
      <Partners />
      <Benefits />
      {/* <Cases posts={normalizedPosts} locale={locale as 'en' | 'ru'} /> */}
      <CallToAction locale={locale as 'en' | 'ru'} />
    </>
  );
}
