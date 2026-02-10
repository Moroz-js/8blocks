import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getBlogPosts, getParentCategories, getBlogPostsByParentCategory } from '@/lib/blog';
import BlogCard from '@/components/cards/BlogCard';
import CategoryDropdown from '@/components/blog/CategoryDropdown';
import BlogPostsSlider from '@/components/blog/BlogPostsSlider';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { getUserFriendlyErrorMessage } from '@/lib/errors';
import type { Locale } from '@/i18n/routing';

// Force dynamic rendering - don't generate at build time
export const dynamic = 'force-dynamic';
export const revalidate = 60;

interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: BlogPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });

  return generatePageMetadata({
    title: t('title'),
    description: t('allPosts'),
    locale,
    path: '/blog',
    type: 'website',
  });
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations('blog');

  try {
    // Fetch parent categories only
    const categories = await getParentCategories(locale);

    // Fetch all posts for hero
    const allPostsResponse = await getBlogPosts(locale, 1, 100);
    const allPosts = allPostsResponse.data;
    const totalPosts = allPostsResponse.meta.pagination.total;

    // Get first post for hero
    const heroPost = allPosts[0];

    // Group posts by parent category (includes subcategory posts)
    const postsByCategory: Record<string, { category: typeof categories[0]; posts: typeof allPosts }> = {};
    
    for (const category of categories) {
      const categoryPosts = await getBlogPostsByParentCategory(category.slug, locale);
      if (categoryPosts.length > 0) {
        postsByCategory[category.slug] = {
          category,
          posts: categoryPosts,
        };
      }
    }

    return (
      <div className="min-h-screen bg-black">
        {/* Breadcrumbs */}
        <div className="w-full pt-[6.25rem] lg:pt-[10rem] pb-[1.875rem] px-[clamp(1.25rem,6.25vw,6.25rem)]">
          <div className="max-w-[77.5rem] mx-auto">
            <div className="flex flex-wrap items-center gap-[1rem] font-berka font-normal text-[0.9375rem] leading-[1.7] text-white opacity-40">
              <Link href={`/${locale}`} className="hover:opacity-100 transition-opacity">
                Home
              </Link>
              <span>/</span>
              <span>Blog</span>
            </div>
          </div>
        </div>

        {/* Hero Section with Title and Filters */}
        <section className="w-full pb-[3.125rem] px-[clamp(1.25rem,6.25vw,6.25rem)]">
          <div className="max-w-[77.5rem] mx-auto">
            {/* Title with count and Category Filters - aligned horizontally */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-[1.875rem] mb-[1.875rem] lg:mb-[3.125rem]">
              {/* Title with count */}
              <div className="flex items-start gap-[0.625rem]">
                <h1 className="font-berka font-normal text-[1.875rem] lg:text-[clamp(2.5rem,3.4375rem,3.4375rem)] leading-[1.1] text-white">
                  8Blocks blog
                </h1>
                <span className="font-berka font-normal text-[0.9375rem] leading-[1.7] text-white opacity-50">
                  {totalPosts}
                </span>
              </div>

              {/* Category Filters - horizontal scroll on mobile, flex on desktop */}
              <div className="-mx-[clamp(1.25rem,6.25vw,6.25rem)] px-[clamp(1.25rem,6.25vw,6.25rem)] lg:mx-0 lg:px-0 overflow-hidden">
                <div className="flex items-center gap-[0.625rem] overflow-x-auto pb-2 scrollbar-hide lg:overflow-visible lg:pb-0">
                  {categories.map((category) => (
                    <CategoryDropdown
                      key={category.id}
                      category={category}
                      locale={locale}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Hero Post - Big Card */}
            {heroPost && (
              <div className="mb-[6.5625rem] lg:mb-[7.8125rem]">
                <BlogCard post={heroPost} variant="big" locale={locale as Locale} />
              </div>
            )}
          </div>
        </section>

        {/* Category Sections */}
        {Object.entries(postsByCategory).map(([slug, { category, posts }]) => {
          const bigPost = posts[0];
          const smallPosts = posts.slice(1);

          return (
            <section
              key={slug}
              className="w-full pb-[6.25rem] lg:pb-[7.8125rem] px-[clamp(1.25rem,6.25vw,6.25rem)]"
            >
              <div className="max-w-[77.5rem] mx-auto">
                {/* Category Title */}
                <h2 className="font-berka font-normal text-[1.25rem] lg:text-[clamp(2.5rem,3.4375rem,3.4375rem)] leading-[1.2] lg:leading-[1.1] text-white mb-[1.25rem] lg:mb-[3.125rem]">
                  {category.name}
                </h2>

                {/* Posts */}
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
                      {smallPosts.slice(0, 3).map((post) => (
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
                    href={`/${locale}/blog/${category.slug}`}
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
