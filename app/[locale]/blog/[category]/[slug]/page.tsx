import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  getBlogPostBySlug, 
  getCategoryBySlug, 
  getBlogPostsBySubcategory,
  getRelatedBlogPosts
} from '@/lib/blog';
import BlogCard from '@/components/cards/BlogCard';
import { Pagination } from '@/components/ui/Pagination';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { RelatedArticles } from '@/components/blog/RelatedArticles';
import { generateBlogPostMetadata, generateBlogPostStructuredData, generatePageMetadata } from '@/lib/seo/metadata';
import { getUserFriendlyErrorMessage, isApiError } from '@/lib/errors';
import { parseAndAddIdsToHeadings } from '@/lib/blog-utils';
import type { Locale } from '@/i18n/routing';

// Force dynamic rendering - don't generate at build time
export const dynamic = 'force-dynamic';
export const revalidate = 60;

interface BlogSlugPageProps {
  params: Promise<{ locale: string; category: string; slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: BlogSlugPageProps) {
  const { locale, category: categorySlug, slug } = await params;

  try {
    // First, check if slug is a subcategory
    const subcategory = await getCategoryBySlug(slug, locale);
    if (subcategory && subcategory.id) {
      // Check if this subcategory belongs to the parent category
      const parentCategory = await getCategoryBySlug(categorySlug, locale);
      if (parentCategory && subcategory.id) {
        return generatePageMetadata({
          title: subcategory.name,
          description: subcategory.description || `Articles in ${subcategory.name}`,
          locale,
          path: `/blog/${categorySlug}/${slug}`,
          type: 'website',
        });
      }
    }

    // If not a subcategory, try to find a blog post
    const post = await getBlogPostBySlug(slug, locale);
    
    if (!post) {
      return {
        title: 'Not Found',
      };
    }

    return generateBlogPostMetadata(post, locale);
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog',
    };
  }
}

export default async function BlogSlugPage({ params, searchParams }: BlogSlugPageProps) {
  const { locale, category: categorySlug, slug } = await params;
  const { page: pageParam } = await searchParams;

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations('blog');
  const currentPage = Number(pageParam) || 1;

  try {
    // First, check if slug is a subcategory
    const subcategory = await getCategoryBySlug(slug, locale);
    
    if (subcategory && subcategory.id) {
      // This is a subcategory page
      const parentCategory = await getCategoryBySlug(categorySlug, locale);
      
      if (!parentCategory) {
        notFound();
      }

      // Fetch posts for subcategory
      const response = await getBlogPostsBySubcategory(slug, locale, currentPage, 12);
      const { data: posts, meta } = response;

      if (posts.length === 0 && currentPage === 1) {
        return (
          <div className="min-h-screen bg-black">
            {/* Breadcrumbs */}
            <div className="w-full pt-[6.25rem] lg:pt-[10rem] pb-[1.875rem] px-[clamp(1.25rem,6.25vw,6.25rem)]">
              <div className="max-w-[77.5rem] mx-auto">
                <div className="flex items-center gap-[1rem] font-berka font-normal text-[0.9375rem] leading-[1.7] text-white opacity-40">
                  <Link href={`/${locale}`} className="hover:opacity-100 transition-opacity">
                    Home
                  </Link>
                  <span>/</span>
                  <Link href={`/${locale}/blog`} className="hover:opacity-100 transition-opacity">
                    Blog
                  </Link>
                  <span>/</span>
                  <Link href={`/${locale}/blog/${categorySlug}`} className="hover:opacity-100 transition-opacity">
                    {parentCategory.name}
                  </Link>
                  <span>/</span>
                  <span>{subcategory.name}</span>
                </div>
              </div>
            </div>

            <section className="w-full pt-[3.125rem] pb-[6.25rem] px-[clamp(1.25rem,6.25vw,6.25rem)]">
              <div className="max-w-[77.5rem] mx-auto text-center">
                <h1 className="font-berka font-normal text-[clamp(2.5rem,3.4375rem,3.4375rem)] leading-[1.1] text-white mb-[1.25rem]">
                  {subcategory.name}
                </h1>
                <p className="font-berka font-normal text-[clamp(0.875rem,0.9375rem,0.9375rem)] leading-[1.7] text-white opacity-70">
                  {t('noPosts')}
                </p>
              </div>
            </section>
          </div>
        );
      }

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
                <Link href={`/${locale}/blog/${categorySlug}`} className="hover:opacity-100 transition-opacity">
                  {parentCategory.name}
                </Link>
                <span>/</span>
                <span>{subcategory.name}</span>
              </div>
            </div>
          </div>

          {/* Subcategory Header */}
          <section className="w-full pb-[3.125rem] px-[clamp(1.25rem,6.25vw,6.25rem)]">
            <div className="max-w-[77.5rem] mx-auto">
              <h1 className="font-berka font-normal text-[clamp(2.5rem,3.4375rem,3.4375rem)] leading-[1.1] text-white mb-[1.25rem]">
                {subcategory.name}
              </h1>
              {subcategory.description && (
                <p className="font-berka font-normal text-[clamp(0.875rem,0.9375rem,0.9375rem)] leading-[1.7] text-white opacity-70">
                  {subcategory.description}
                </p>
              )}
            </div>
          </section>

          {/* Posts Grid */}
          <section className="w-full pb-[6.25rem] px-[clamp(1.25rem,6.25vw,6.25rem)]">
            <div className="max-w-[77.5rem] mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1.5625rem] mb-[3.125rem]">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} variant="default" locale={locale as Locale} />
                ))}
              </div>

              {/* Pagination */}
              {meta.pagination.pageCount > 1 && (
                <Pagination
                  currentPage={meta.pagination.page}
                  totalPages={meta.pagination.pageCount}
                  baseUrl={`/${locale}/blog/${categorySlug}/${slug}`}
                />
              )}
            </div>
          </section>
        </div>
      );
    }

    // If not a subcategory, try to find a blog post
    const post = await getBlogPostBySlug(slug, locale);

    if (!post) {
      notFound();
    }

    // Format date
    const formattedDate = post.publishedAt && post.publishedAt instanceof Date && !isNaN(post.publishedAt.getTime())
      ? new Intl.DateTimeFormat(locale, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }).format(post.publishedAt)
      : '';

    // Generate Schema.org BlogPosting structured data using helper
    const structuredData = generateBlogPostStructuredData(post, locale);

    // Fetch related posts
    const relatedPosts = post.category?.id 
      ? await getRelatedBlogPosts(post.id, post.category.id, locale, 3)
      : [];

    // Parse headings from content and add IDs
    const { content: processedContent, headings } = parseAndAddIdsToHeadings(post.content);

    return (
      <>
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <div className="min-h-screen bg-black">
          {/* Breadcrumbs */}
          <div className="w-full pt-[3.125rem] lg:pt-[7.375rem] pb-[1.875rem] px-[clamp(1.25rem,6.25vw,6.25rem)]">
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
                {post.category && (
                  <>
                    <Link href={`/${locale}/blog/${post.category.slug}`} className="hover:opacity-100 transition-opacity">
                      {post.category.name}
                    </Link>
                    <span>/</span>
                  </>
                )}
                <span>{post.title}</span>
              </div>
            </div>
          </div>

          {/* Article Content - Two Column Layout */}
          <div className="w-full px-[clamp(1.25rem,6.25vw,6.25rem)] pb-[3.125rem]">
            <div className="max-w-[77.5rem] mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-[813px_1fr] gap-[3.125rem] lg:gap-[3.125rem]">
                {/* Main Content */}
                <article className="w-full order-1">
                  {/* Title */}
                  <h1 className="font-berka font-normal text-[clamp(2.5rem,3.4375rem,3.4375rem)] leading-[1.1] text-white mb-[1.875rem]">
                    {post.title}
                  </h1>

                  {/* Meta Info and Featured Image Card */}
                  <div className="flex flex-col gap-[1.25rem] mb-[3.125rem]">
                    {/* Meta Row */}
                    <div className="flex items-center justify-between">
                      {/* Date */}
                      {formattedDate && post.publishedAt && (
                        <time
                          dateTime={post.publishedAt.toISOString()}
                          className="font-berka font-medium text-[0.8125rem] leading-[1.5] text-white opacity-50"
                        >
                          {formattedDate}
                        </time>
                      )}

                      {/* Views, Read Time, Author */}
                      <div className="flex items-center gap-[1.25rem]">
                        {/* Views */}
                        <div className="flex items-center gap-[0.3125rem] opacity-40">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white">
                            <path d="M10 3.75C6.5625 3.75 3.65625 5.7625 2.5 8.75C3.65625 11.7375 6.5625 13.75 10 13.75C13.4375 13.75 16.3438 11.7375 17.5 8.75C16.3438 5.7625 13.4375 3.75 10 3.75ZM10 12.5C8.275 12.5 6.875 11.1 6.875 9.375C6.875 7.65 8.275 6.25 10 6.25C11.725 6.25 13.125 7.65 13.125 9.375C13.125 11.1 11.725 12.5 10 12.5ZM10 7.5C8.9625 7.5 8.125 8.3375 8.125 9.375C8.125 10.4125 8.9625 11.25 10 11.25C11.0375 11.25 11.875 10.4125 11.875 9.375C11.875 8.3375 11.0375 7.5 10 7.5Z" fill="currentColor"/>
                          </svg>
                          <span className="font-berka font-medium text-[0.8125rem] leading-[1.5] text-white">
                            {post.views || 125}
                          </span>
                        </div>

                        {/* Read Time */}
                        <div className="flex items-center gap-[0.3125rem] opacity-40">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white">
                            <path d="M10 1.875C5.5125 1.875 1.875 5.5125 1.875 10C1.875 14.4875 5.5125 18.125 10 18.125C14.4875 18.125 18.125 14.4875 18.125 10C18.125 5.5125 14.4875 1.875 10 1.875ZM10 16.5625C6.375 16.5625 3.4375 13.625 3.4375 10C3.4375 6.375 6.375 3.4375 10 3.4375C13.625 3.4375 16.5625 6.375 16.5625 10C16.5625 13.625 13.625 16.5625 10 16.5625Z" fill="currentColor"/>
                            <path d="M10.625 5.9375H9.375V10.625L13.4375 13.0625L14.0625 12.0375L10.625 10.0625V5.9375Z" fill="currentColor"/>
                          </svg>
                          <span className="font-berka font-medium text-[0.8125rem] leading-[1.5] text-white">
                            {post.readTime || 10} min
                          </span>
                        </div>

                        {/* Author */}
                        <div className="flex items-center gap-[0.4375rem]">
                          <div className="relative size-[1rem]">
                            <Image
                              src="/assets/8-blocks.svg"
                              alt="8Blocks"
                              width={16}
                              height={16}
                              className="object-contain"
                            />
                          </div>
                          <span className="font-berka font-medium text-[0.8125rem] leading-[1.5] text-white opacity-50">
                            By {post.author || '8Blocks'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Featured Image with Category Tag */}
                    {post.featuredImage && (
                      <div className="relative w-full aspect-[397.67/250] rounded-[0.5rem] overflow-hidden border border-[rgba(255,255,255,0.2)]">
                        <Image
                          src={post.featuredImage.url}
                          alt={post.featuredImage.alt}
                          fill
                          className="object-cover"
                          priority
                          sizes="(max-width: 1024px) 100vw, 813px"
                          placeholder="blur"
                          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12NgAAIABQABNjN9GQAAAABJRU5ErkJggg=="
                        />
                        {/* Category Tag Overlay */}
                        {post.category && (
                          <div className="absolute top-[0.9375rem] left-[0.9375rem]">
                            <div className="bg-[rgba(233,233,233,0.12)] h-[2.25rem] px-[0.9375rem] py-[0.625rem] rounded-[0.5rem] flex items-center justify-center">
                              <span className="font-berka font-medium text-[0.8125rem] leading-[1.5] text-white">
                                {post.category.name}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="font-berka font-normal text-[0.9375rem] leading-[1.7] text-white opacity-50 overflow-hidden text-ellipsis whitespace-nowrap">
                        {post.excerpt}
                      </p>
                    )}
                  </div>

                  {/* Content */}
                  <div
                    className="prose prose-invert max-w-none mb-[3.125rem]"
                    style={{
                      fontFamily: 'Manrope',
                      fontSize: '0.9375rem',
                      lineHeight: '1.7',
                      color: 'white',
                    }}
                    dangerouslySetInnerHTML={{ __html: processedContent }}
                  />
                </article>

                {/* Sidebar */}
                <aside className="w-full lg:pl-[3.125rem] lg:pt-[6.25rem] order-2 lg:order-2">
                  <div className="flex flex-col gap-[1.25rem] lg:sticky lg:top-[6.25rem]">
                    {/* Share Buttons */}
                    <ShareButtons 
                      title={post.title}
                      url={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://8blocks.io/new'}${locale === 'en' ? '' : `/${locale}`}/blog/${post.category?.slug || 'blog'}/${post.slug}`}
                    />

                    {/* Table of Contents */}
                    {post.category && (
                      <TableOfContents 
                        category={post.category}
                        headings={headings}
                      />
                    )}
                  </div>
                </aside>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <RelatedArticles 
              posts={relatedPosts} 
              locale={locale as Locale}
              title={locale === 'ru' ? 'Похожие статьи' : 'Related articles'}
            />
          )}

          {/* Contact Form Section */}
          <section className="w-full py-[3.125rem] px-[clamp(1.25rem,6.25vw,6.25rem)]">
            <div className="max-w-[77.5rem] mx-auto">
              <div className="flex flex-col gap-[3.125rem]">
                {/* Title */}
                <h2 className="font-berka font-normal text-[clamp(1.75rem,2.1875rem,2.1875rem)] leading-[1.25] text-white">
                  {locale === 'ru' ? 'Давайте поговорим о вашем токене' : 'Let\'s talk about your token'}
                </h2>

                {/* Form */}
<form className="flex flex-col gap-[1.0625rem] w-full max-w-[44.3125rem]">
                  {/* Row 1: Name and Company */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[0.9375rem]">
                    <input
                      type="text"
                      placeholder={locale === 'ru' ? 'Ваше имя' : 'Your name'}
                      className="!bg-[rgba(255,255,255,0.08)] h-[3.75rem] px-[1.5625rem] py-[0.5rem] rounded-[0.5rem] font-berka font-normal text-[0.9375rem] leading-[1.7] text-white placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                    <input
                      type="text"
                      placeholder={locale === 'ru' ? 'Название компании' : 'Company name'}
                      className="!bg-[rgba(255,255,255,0.08)] h-[3.75rem] px-[1.5625rem] py-[0.5rem] rounded-[0.5rem] font-berka font-normal text-[0.9375rem] leading-[1.7] text-white placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                  </div>

                  {/* Row 2: Messenger and Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[0.9375rem]">
                    <input
                      type="text"
                      placeholder={locale === 'ru' ? 'Предпочитаемый мессенджер' : 'Preferred messenger number'}
                      className="!bg-[rgba(255,255,255,0.08)] h-[3.75rem] px-[1.5625rem] py-[0.5rem] rounded-[0.5rem] font-berka font-normal text-[0.9375rem] leading-[1.7] text-white placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      className="!bg-[rgba(255,255,255,0.08)] h-[3.75rem] px-[1.5625rem] py-[0.5rem] rounded-[0.5rem] font-berka font-normal text-[0.9375rem] leading-[1.7] text-white placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                  </div>

                  {/* Row 3: Message (full width, textarea) */}
                  <textarea
                    placeholder={locale === 'ru' ? 'Кратко опишите ваш проект или вопрос' : 'Briefly describe your project or question'}
                    rows={5}
                    className="!bg-[rgba(255,255,255,0.08)] min-h-[9.375rem] px-[1.5625rem] py-[0.75rem] rounded-[0.5rem] font-berka font-normal text-[0.9375rem] leading-[1.7] text-white placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-white/20 w-full resize-none"
                  />

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="backdrop-blur-[2px] bg-white h-[3rem] px-[1.25rem] py-[0.75rem] rounded-[0.375rem] font-berka font-medium text-[0.9375rem] leading-[1.5] text-black hover:bg-white/90 transition-colors mt-[1.875rem] w-[9rem]"
                  >
                    {locale === 'ru' ? 'Отправить' : 'Send message'}
                  </button>
                </form>
              </div>
            </div>
          </section>
        </div>
      </>
    );
  } catch (error) {
    // If it's a 404 error, show the not found page
    if (isApiError(error) && error.statusCode === 404) {
      notFound();
    }
    
    // For other errors, show a user-friendly error message
    const errorMessage = getUserFriendlyErrorMessage(error);
    const t = await getTranslations('blog');

    return (
      <div className="min-h-screen bg-black">
        <section className="w-full pt-[6.25rem] lg:pt-[10rem] pb-[6.25rem] px-[clamp(1.25rem,6.25vw,6.25rem)]">
          <div className="max-w-[50rem] mx-auto text-center">
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
