import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getBlogPosts, getParentCategories, getBlogPostsByParentCategory } from '@/lib/blog';
import BlogCard from '@/components/cards/BlogCard';
import CategoryDropdown from '@/components/blog/CategoryDropdown';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { getUserFriendlyErrorMessage } from '@/lib/errors';
import type { Locale } from '@/i18n/routing';

// Enable ISR with 60 second revalidation
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
    const categories = await getParentCategories();

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
        <div className="w-full pt-[3.125rem] lg:pt-[4.375rem] pb-[1.875rem] px-[clamp(1.25rem,6.25vw,6.25rem)]">
          <div className="max-w-[77.5rem] mx-auto mt-[1.875rem]">
            <div className="flex items-center gap-[1rem] font-['Berka'] font-normal text-[0.9375rem] leading-[1.7] text-white opacity-40">
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
                <h1 className="font-['Berka'] font-normal text-[clamp(2.5rem,3.4375rem,3.4375rem)] leading-[1.1] text-white">
                  8Blocks blog
                </h1>
                <span className="font-['Berka'] font-normal text-[0.9375rem] leading-[1.7] text-white opacity-50">
                  {totalPosts}
                </span>
              </div>

              {/* Category Filters - horizontal scroll on mobile, flex on desktop */}
              <div className="-mx-[clamp(1.25rem,6.25vw,6.25rem)] px-[clamp(1.25rem,6.25vw,6.25rem)] lg:mx-0 lg:px-0">
                <div className="flex items-center gap-[0.625rem] overflow-x-auto pb-2 scrollbar-hide lg:overflow-visible lg:pb-0">
                  {categories.slice(0, 6).map((category) => (
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
              <div className="mb-[7.8125rem]">
                <BlogCard post={heroPost} variant="big" locale={locale as Locale} />
              </div>
            )}
          </div>
        </section>

        {/* Category Sections */}
        {Object.entries(postsByCategory).map(([slug, { category, posts }]) => {
          const bigPost = posts[0];
          const smallPosts = posts.slice(1, 3); // Mobile: 2 cards, Desktop: will show 3

          return (
            <section
              key={slug}
              className="w-full pb-[7.8125rem] px-[clamp(1.25rem,6.25vw,6.25rem)]"
            >
              <div className="max-w-[77.5rem] mx-auto">
                {/* Category Title */}
                <h2 className="font-['Berka'] font-normal text-[clamp(2.5rem,3.4375rem,3.4375rem)] leading-[1.1] text-white mb-[3.125rem]">
                  {category.name}
                </h2>

                {/* Posts Grid */}
                <div className="flex flex-col gap-[3.125rem] mb-[1.5625rem] lg:mb-[3.125rem]">
                  {/* Big Card - Desktop only */}
                  {bigPost && (
                    <div className="hidden lg:block">
                      <BlogCard post={bigPost} variant="big" locale={locale as Locale} />
                    </div>
                  )}

                  {/* Small Cards Row - Horizontal scroll on mobile, grid on desktop */}
                  {smallPosts.length > 0 && (
                    <>
                      {/* Mobile: Horizontal scroll */}
                      <div className="lg:hidden flex gap-[1.25rem] overflow-x-auto pb-2 scrollbar-hide -mx-[clamp(1.25rem,6.25vw,6.25rem)] px-[clamp(1.25rem,6.25vw,6.25rem)]">
                        {smallPosts.map((post) => (
                          <div key={post.id} className="flex-shrink-0 w-[18rem]">
                            <BlogCard
                              post={post}
                              variant="default"
                              locale={locale as Locale}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Desktop: Grid */}
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
                    </>
                  )}
                </div>

                {/* View All Button */}
                <div className="flex justify-start lg:justify-center">
                  <Link
                    href={`/${locale}/blog/${category.slug}`}
                    className="backdrop-blur-[2px] bg-white flex items-center h-[3rem] px-[1.25rem] py-[0.75rem] rounded-[0.375rem] font-['Berka'] font-medium text-[0.9375rem] leading-[1.5] text-black hover:opacity-90 transition-opacity"
                  >
                    See all articles
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
        <section className="w-full pt-[3.125rem] lg:pt-[4.375rem] pb-[6.25rem] px-[clamp(1.25rem,6.25vw,6.25rem)]">
          <div className="max-w-[77.5rem] mx-auto text-center">
            <h1 className="font-['Berka'] font-normal text-[clamp(2.5rem,3.4375rem,3.4375rem)] leading-[1.1] text-white mb-[1.25rem]">
              {t('title')}
            </h1>
            <div className="flex flex-col items-center gap-[1.25rem]">
              <p className="font-['Berka'] font-normal text-[clamp(0.875rem,0.9375rem,0.9375rem)] leading-[1.7] text-white opacity-70">
                {errorMessage}
              </p>
              <p className="font-['Berka'] font-normal text-[clamp(0.875rem,0.9375rem,0.9375rem)] leading-[1.7] text-white opacity-50">
                {t('tryAgainLater')}
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
