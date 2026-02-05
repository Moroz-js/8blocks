'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import BlogCard from '@/components/cards/BlogCard';
import type { NormalizedBlogPost } from '@/lib/types';
import type { Locale } from '@/i18n/routing';

import 'swiper/css';
import 'swiper/css/free-mode';

interface BlogPostsSliderProps {
  posts: NormalizedBlogPost[];
  locale: Locale;
}

export default function BlogPostsSlider({ posts, locale }: BlogPostsSliderProps) {
  if (posts.length === 0) return null;

  return (
    <div className="lg:hidden -mr-[clamp(1.25rem,6.25vw,6.25rem)] overflow-hidden">
      <Swiper
        modules={[FreeMode]}
        spaceBetween={15}
        slidesPerView="auto"
        freeMode
        className="w-full"
      >
        {posts.map((post) => (
          <SwiperSlide key={post.id} style={{ width: '75%', maxWidth: '267px' }}>
            <BlogCard post={post} variant="default" locale={locale} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
