import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategoryBySlug, getSubcategories, getBlogPostsBySubcategory } from '@/lib/blog';
import BlogCard from '@/components/cards/BlogCard';
import BlogPostsSlider from '@/components/blog/BlogPostsSlider';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { getUserFriendlyErrorMessage } from '@/lib/errors';
import type { Locale } from '@/i18n/routing';

// Force dynamic rendering - don't generate at build time
export const dynamic = 'force-dynamic';
export const revalidate = 60;

interface CategoryPageProps {
  params: Promise<{ locale: string; category: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { locale, category: categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug, locale);

  if (!category) {
    return generatePageMetadata({
      title: 'Category Not Found',
      description: 'The requested category could not be found',
      locale,
      path: `/blog/${categorySlug}`,
      type: 'website',
    });
  }

  return generatePageMetadata({
    title: category.name,
    description: category.description || `Articles in ${category.name}`,
    locale,
    path: `/blog/${categorySlug}`,
    type: 'website',
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, category: categorySlug } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations('blog');

  try {
    // Fetch category
    const category = await getCategoryBySlug(categorySlug, locale);

    if (!category) {
      notFound();
    }

    // Fetch subcategories
    const subcategories = await getSubcategories(categorySlug, locale);

    // If no subcategories, fetch posts directly from this category
    if (subcategories.length === 0) {
      const postsResponse = await getBlogPostsBySubcategory(categorySlug, locale, 1, 12);
      const posts = postsResponse.data;

      if (posts.length === 0) {
        return (
          <div className="min-h-screen bg-black">
            {/* Breadcrumbs */}
            <div className="w-full pt-[6.25rem] lg:pt-[10rem] pb-[1.875rem] px-[clamp(1.25rem,6.25vw,6.25rem)]">
              <div className="max-w-[77.5rem] mx-auto mt-[1.875rem]">
                <div className="flex flex-wrap items-center gap-[1rem] font-berka font-normal text-[0.9375rem] leading-[1.7] text-white opacity-40">
                  <Link href={`/${locale}`} className="hover:opacity-100 transition-opacity">
                    Home
                  </Link>
                  <span>/</span>
                  <Link href={`/${locale}/blog`} className="hover:opacity-100 transition-opacity">
                    Blog
                  </Link>
                  <span>/</span>
                  <span>{category.name}</span>
                </div>
              </div>
            </div>

            <section className="w-full pt-[3.125rem] pb-[6.25rem] px-[clamp(1.25rem,6.25vw,6.25rem)]">
              <div className="max-w-[77.5rem] mx-auto text-center">
                <h1 className="font-berka font-normal text-[1.875rem] lg:text-[clamp(2.5rem,3.4375rem,3.4375rem)] leading-[1.1] text-white mb-[1.25rem]">
                  {category.name}
                </h1>
                <p className="font-berka font-normal text-[clamp(0.875rem,0.9375rem,0.9375rem)] leading-[1.7] text-white opacity-70">
                  {t('noPosts')}
                </p>
              </div>
            </section>
          </div>
        );
      }

      // Show posts for category without subcategories
      return (
        <div className="min-h-screen bg-black">
          {/* Breadcrumbs */}
          <div className="w-full pt-[6.25rem] lg:pt-[10rem] pb-[1.875rem] px-[clamp(1.25rem,6.25vw,6.25rem)]">
            <div className="max-w-[77.5rem] mx-auto mt-[1.875rem]">
              <div className="flex items-center gap-[1rem] font-berka font-normal text-[0.9375rem] leading-[1.7] text-white opacity-40">
                <Link href={`/${locale}`} className="hover:opacity-100 transition-opacity">
                  Home
                </Link>
                <span>/</span>
                <Link href={`/${locale}/blog`} className="hover:opacity-100 transition-opacity">
                  Blog
                </Link>
                <span>/</span>
                <span>{category.name}</span>
              </div>
            </div>
          </div>

          {/* Category Title */}
          <section className="w-full pb-[1.25rem] lg:pb-[3.125rem] px-[clamp(1.25rem,6.25vw,6.25rem)]">
            <div className="max-w-[77.5rem] mx-auto">
              <h1 className="font-berka font-normal text-[1.875rem] lg:text-[clamp(2.5rem,3.4375rem,3.4375rem)] leading-[1.1] text-white">
                {category.name}
              </h1>
            </div>
          </section>

          {/* Posts Grid */}
          <section className="w-full pb-[3.125rem] lg:pb-[6.25rem] px-[clamp(1.25rem,6.25vw,6.25rem)]">
            <div className="max-w-[77.5rem] mx-auto">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-[0.625rem] lg:gap-[1.5625rem]">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} variant="default" locale={locale as Locale} />
                ))}
              </div>
            </div>
          </section>
        </div>
      );
    }

    // Fetch posts for each subcategory
    const subcategoriesWithPosts = await Promise.all(
      subcategories.map(async (subcategory) => {
        const postsResponse = await getBlogPostsBySubcategory(subcategory.slug, locale, 1, 4);
        return {
          subcategory,
          posts: postsResponse.data,
          total: postsResponse.meta.pagination.total,
        };
      })
    );

    return (
      <div className="min-h-screen bg-black">
        {/* Breadcrumbs */}
        <div className="w-full pt-[6.25rem] lg:pt-[10rem] pb-[1.875rem] px-[clamp(1.25rem,6.25vw,6.25rem)]">
          <div className="max-w-[77.5rem] mx-auto mt-[1.875rem]">
            <div className="flex items-center gap-[1rem] font-berka font-normal text-[0.9375rem] leading-[1.7] text-white opacity-40">
              <Link href={`/${locale}`} className="hover:opacity-100 transition-opacity">
                Home
              </Link>
              <span>/</span>
              <Link href={`/${locale}/blog`} className="hover:opacity-100 transition-opacity">
                Blog
              </Link>
              <span>/</span>
              <span>{category.name}</span>
            </div>
          </div>
        </div>

        {/* Category Title */}
        <section className="w-full pb-[1.25rem] lg:pb-[3.125rem] px-[clamp(1.25rem,6.25vw,6.25rem)]">
          <div className="max-w-[77.5rem] mx-auto">
            <h1 className="font-berka font-normal text-[1.875rem] lg:text-[clamp(2.5rem,3.4375rem,3.4375rem)] leading-[1.1] text-white">
              {category.name}
            </h1>
          </div>
        </section>

        {/* Subcategory Sections */}
        {subcategoriesWithPosts.map(({ subcategory, posts }) => {
          if (posts.length === 0) return null;

          const bigPost = posts[0];
          const smallPosts = posts.slice(1, 3);

          return (
            <section
              key={subcategory.id}
              className="w-full pb-[6.25rem] lg:pb-[7.8125rem] px-[clamp(1.25rem,6.25vw,6.25rem)]"
            >
              <div className="max-w-[77.5rem] mx-auto">
                {/* Subcategory Title */}
                <h2 className="font-berka font-normal text-[1.25rem] lg:text-[clamp(1.75rem,2.1875rem,2.1875rem)] leading-[1.2] lg:leading-[1.25] text-white mb-[1.25rem] lg:mb-[3.125rem]">
                  {subcategory.name}
                </h2>

                {/* Posts Grid */}
                <div className="flex flex-col gap-[1.25rem] lg:gap-[3.125rem] mb-[1.875rem] lg:mb-[3.125rem]">
                  {/* Big Card */}
                  {bigPost && (
                    <BlogCard post={bigPost} variant="big" locale={locale as Locale} />
                  )}

                  {/* Mobile: Swiper slider */}
                  {smallPosts.length > 0 && (
                    <BlogPostsSlider posts={smallPosts} locale={locale as Locale} />
                  )}

                  {/* Desktop: 3-column grid */}
                  {smallPosts.length > 0 && (
                    <div className="hidden lg:grid lg:grid-cols-3 gap-[1.5625rem]">
                      {smallPosts.map((post) => (
                        <BlogCard
                          key={post.id}
                          post={post}
                          variant="default"
                          locale={locale as Locale}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* View All Button */}
                <div className="flex justify-start lg:justify-center">
                  <Link
                    href={`/${locale}/blog/${categorySlug}/${subcategory.slug}`}
                    className="backdrop-blur-[2px] bg-white flex items-center h-[2.25rem] lg:h-[3rem] px-[0.9375rem] lg:px-[1.25rem] py-[0.625rem] lg:py-[0.75rem] rounded-[0.5rem] lg:rounded-[0.375rem] font-berka font-medium text-[0.8125rem] lg:text-[0.9375rem] leading-[1.5] text-black hover:opacity-90 transition-opacity"
                  >
                    {t('seeAllArticles')}
                  </Link>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    );
  } catch (error) {
    const errorMessage = getUserFriendlyErrorMessage(error);

    return (
      <div className="min-h-screen bg-black">
        <section className="w-full pt-[6.25rem] lg:pt-[10rem] pb-[6.25rem] px-[clamp(1.25rem,6.25vw,6.25rem)]">
          <div className="max-w-[77.5rem] mx-auto text-center">
            <h1 className="font-berka font-normal text-[clamp(2.5rem,3.4375rem,3.4375rem)] leading-[1.1] text-white mb-[1.25rem]">
              {t('title')}
            </h1>
            <div className="flex flex-col items-center gap-[1.25rem]">
              <p className="font-berka font-normal text-[clamp(0.875rem,0.9375rem,0.9375rem)] leading-[1.7] text-white opacity-70">
                {errorMessage}
              </p>
              <p className="font-berka font-normal text-[clamp(0.875rem,0.9375rem,0.9375rem)] leading-[1.7] text-white opacity-50">
                {t('tryAgainLater')}
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
