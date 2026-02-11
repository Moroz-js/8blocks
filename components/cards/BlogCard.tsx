'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import { NormalizedBlogPost } from '@/lib/types';

interface BlogCardProps {
  post: NormalizedBlogPost;
  variant?: 'default' | 'big';
  locale: 'en' | 'ru';
}

export default function BlogCard({
  post,
  variant = 'default',
  locale,
}: BlogCardProps) {
  const tc = useTranslations('common');
  const [imageError, setImageError] = useState(false);
  // Format date with fallback for invalid dates
  const formattedDate = post.publishedAt && post.publishedAt instanceof Date && !isNaN(post.publishedAt.getTime())
    ? new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(post.publishedAt)
    : '';

  if (variant === 'big') {
    return (
      <Link
        href={`/${locale}/blog/${post.category?.slug}/${post.slug}`}
        className="group w-full max-w-[77.5rem] mx-auto"
      >
        <article className="flex flex-col lg:flex-row gap-[1.25rem] lg:gap-[2.5rem]">
          {/* Image - Left side, flex-1 */}
          {post.featuredImage && !imageError && (
            <div className="relative w-full lg:flex-1 lg:aspect-[8/5] lg:min-h-[250px] bg-black border border-[rgba(255,255,255,0.2)] rounded-[0.5rem] overflow-hidden group-hover:border-[rgba(255,255,255,0.3)] transition-colors">
              <img
                src={post.featuredImage.url}
                alt={post.featuredImage.alt}
                className="object-cover w-full h-full absolute inset-0"
                loading="lazy"
                onError={() => setImageError(true)}
              />
              {/* Category Tag Overlay */}
              {post.category && (
                <div className="absolute top-[0.625rem] left-[0.625rem] lg:top-[0.9375rem] lg:left-[0.9375rem]">
                  <div className="bg-[rgba(233,233,233,0.12)] px-[0.625rem] py-[0.3125rem] rounded-[0.25rem] lg:h-[2.25rem] lg:px-[0.9375rem] lg:py-[0.625rem] lg:rounded-[0.5rem] flex items-center justify-center">
                    <span className="font-berka font-medium text-[0.6875rem] lg:text-[0.8125rem] leading-[1.5] text-white">
                      {post.category.name}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Content - Right side, fixed width */}
          <div className="flex flex-col justify-between w-full lg:w-[24.1875rem] ">
            {/* Top: Date, Title, Excerpt */}
            <div className="flex flex-col gap-[0.3125rem] lg:gap-[0.625rem]">
              {/* Date */}
              {formattedDate && (
                <p className="font-berka font-medium text-[0.6875rem] lg:text-[0.8125rem] leading-[1.5] text-white opacity-50">
                  {formattedDate}
                </p>
              )}

              {/* Title */}
              <h3 className="font-berka font-normal text-[0.9375rem] lg:text-[clamp(1.75rem,3vw,2.1875rem)] leading-[1.3] lg:leading-[1.25] text-white group-hover:opacity-80 transition-opacity line-clamp-2 lg:line-clamp-3">
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="font-berka font-normal text-[0.8125rem] lg:text-[0.9375rem] leading-[1.5] lg:leading-[1.7] text-white opacity-50 line-clamp-2">
                {post.excerpt}
              </p>
            </div>

            {/* Bottom: Meta */}
            <div className="flex items-center gap-[1.25rem] font-berka text-[0.8125rem] leading-[1.5] text-white mt-[1.25rem]">
              <div className="flex items-center gap-[0.125rem] opacity-40">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 3.75C6.5625 3.75 3.65625 5.7625 2.5 8.75C3.65625 11.7375 6.5625 13.75 10 13.75C13.4375 13.75 16.3438 11.7375 17.5 8.75C16.3438 5.7625 13.4375 3.75 10 3.75ZM10 12.5C8.275 12.5 6.875 11.1 6.875 9.375C6.875 7.65 8.275 6.25 10 6.25C11.725 6.25 13.125 7.65 13.125 9.375C13.125 11.1 11.725 12.5 10 12.5ZM10 7.5C8.9625 7.5 8.125 8.3375 8.125 9.375C8.125 10.4125 8.9625 11.25 10 11.25C11.0375 11.25 11.875 10.4125 11.875 9.375C11.875 8.3375 11.0375 7.5 10 7.5Z" fill="currentColor"/>
                </svg>
                <span className="font-medium">{post.views || 125}</span>
              </div>
              <div className="flex items-center gap-[0.125rem] opacity-40">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 1.875C5.5125 1.875 1.875 5.5125 1.875 10C1.875 14.4875 5.5125 18.125 10 18.125C14.4875 18.125 18.125 14.4875 18.125 10C18.125 5.5125 14.4875 1.875 10 1.875ZM10 16.5625C6.375 16.5625 3.4375 13.625 3.4375 10C3.4375 6.375 6.375 3.4375 10 3.4375C13.625 3.4375 16.5625 6.375 16.5625 10C16.5625 13.625 13.625 16.5625 10 16.5625Z" fill="currentColor"/>
                  <path d="M10.625 5.9375H9.375V10.625L13.4375 13.0625L14.0625 12.0375L10.625 10.0625V5.9375Z" fill="currentColor"/>
                </svg>
                <span className="font-medium">{post.readTime || 10} min</span>
              </div>
              <div className="flex items-center gap-[0.4375rem]">
                <img
                  src="/assets/8-blocks.svg"
                  alt="8Blocks"
                  width={16}
                  height={16}
                  className="object-contain"
                />
                <span className="font-medium opacity-50">{tc('by')} {post.author || '8Blocks'}</span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  // Default variant
  return (
    <Link
      href={`/${locale}/blog/${post.category?.slug}/${post.slug}`}
      className="group"
    >
      <article className="flex flex-col gap-[0.625rem] lg:gap-[0.9375rem] items-end w-full">
        {/* Cover and Date */}
        <div className="flex flex-col gap-[0.625rem] items-start w-full">
          {/* Cover Image with Category Tag */}
          {post.featuredImage && !imageError && (
            <div className="relative w-full aspect-[267/167] lg:aspect-[397.67/250] bg-black border border-[rgba(255,255,255,0.2)] rounded-[0.5rem] overflow-hidden group-hover:border-[rgba(255,255,255,0.3)] transition-colors">
              <img
                src={post.featuredImage.url}
                alt={post.featuredImage.alt}
                className="object-cover w-full h-full absolute inset-0"
                loading="lazy"
                onError={() => setImageError(true)}
              />
              {/* Category Tag overlay */}
              {post.category && (
                <div className="absolute top-[0.625rem] left-[0.625rem] lg:top-[0.9375rem] lg:left-[0.9375rem]">
                  <div className="bg-[rgba(233,233,233,0.12)] px-[0.625rem] py-[0.3125rem] rounded-[0.25rem] lg:h-[2.25rem] lg:px-[0.9375rem] lg:py-[0.625rem] lg:rounded-[0.5rem] flex items-center justify-center">
                    <span className="font-berka font-medium text-[0.6875rem] lg:text-[0.8125rem] leading-[1.5] text-white">
                      {post.category.name}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Date */}
          {formattedDate && (
            <p className="font-berka font-medium text-[0.6875rem] lg:text-[0.8125rem] leading-[1.5] text-white opacity-50 w-full">
              {formattedDate}
            </p>
          )}
        </div>

        {/* Title and Excerpt */}
        <div className="flex flex-col gap-[0.3125rem] items-start w-full font-berka font-normal text-white">
          <h3 className="text-[0.9375rem] lg:text-[1.25rem] leading-[1.3] line-clamp-2 w-full group-hover:opacity-80 transition-opacity">
            {post.title}
          </h3>
          <p className="text-[0.8125rem] lg:text-[0.9375rem] leading-[1.5] lg:leading-[1.7] opacity-50 line-clamp-2 w-full">
            {post.excerpt}
          </p>
        </div>

        {/* Meta: Views, Read Time, Author - AFTER description */}
        <div className="flex items-center gap-[0.5rem] lg:gap-[0.75rem] font-berka text-[0.6875rem] lg:text-[0.8125rem] leading-[1.5] text-white w-full flex-wrap">
          <div className="flex gap-[0.375rem] opacity-50">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3C4.5 3 1.73 5.61 1 9c.73 3.39 3.5 6 7 6s6.27-2.61 7-6c-.73-3.39-3.5-6-7-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z" fill="currentColor"/>
            </svg>
            <span>{post.views || 125}</span>
          </div>
          <div className="flex gap-[0.375rem] opacity-50">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1.5C4.41 1.5 1.5 4.41 1.5 8s2.91 6.5 6.5 6.5 6.5-2.91 6.5-6.5S11.59 1.5 8 1.5zm0 11.75c-2.9 0-5.25-2.35-5.25-5.25S5.1 2.75 8 2.75s5.25 2.35 5.25 5.25-2.35 5.25-5.25 5.25z" fill="currentColor"/>
              <path d="M8.5 4.75h-1v4l3.5 2.1.5-.82-3-1.78V4.75z" fill="currentColor"/>
            </svg>
            <span>{post.readTime || 10} min</span>
          </div>
          <div className="flex items-center gap-[0.375rem]">
            <img
              src="/assets/8-blocks.svg"
              alt="8Blocks"
              width={16}
              height={16}
              className="object-contain"
            />
            <span className="opacity-50">{tc('by')} {post.author || '8Blocks'}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
