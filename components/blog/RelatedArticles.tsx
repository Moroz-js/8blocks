'use client';

import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import BlogCard from '@/components/cards/BlogCard';
import type { NormalizedBlogPost } from '@/lib/types';
import type { Locale } from '@/i18n/routing';

import 'swiper/css';
import 'swiper/css/navigation';

interface RelatedArticlesProps {
  posts: NormalizedBlogPost[];
  locale: Locale;
  title?: string;
}

export function RelatedArticles({ posts, locale, title = 'Related articles' }: RelatedArticlesProps) {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);

  const updateNavigationState = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  if (posts.length === 0) return null;

  return (
    <section className="w-full py-[3.125rem] px-[clamp(1.25rem,6.25vw,6.25rem)]">
      <div className="max-w-[77.5rem] mx-auto">
        {/* Title */}
        <h2 className="font-berka font-normal text-[clamp(1.75rem,2.1875rem,2.1875rem)] leading-[1.25] text-white mb-[3.125rem]">
          {title}
        </h2>

        {/* Slider Container with Navigation */}
        <div className="relative">
          {/* Custom Navigation Buttons */}
          {!isBeginning && (
            <button 
              onClick={() => swiperRef.current?.slidePrev()}
              className="absolute left-[-4.6875rem] top-1/2 -translate-y-1/2 bg-background-tertiary rounded-[0.5rem] size-[3.125rem] flex items-center justify-center hover:bg-[#3a3a3b] transition-colors z-10 hidden lg:flex"
              aria-label="Previous slide"
            >
              <ChevronLeft className="size-[1.25rem] text-white" />
            </button>
          )}

          {!isEnd && (
            <button 
              onClick={() => swiperRef.current?.slideNext()}
              className="absolute right-[-4.6875rem] top-1/2 -translate-y-1/2 bg-background-tertiary rounded-[0.5rem] size-[3.125rem] flex items-center justify-center hover:bg-[#3a3a3b] transition-colors z-10 hidden lg:flex"
              aria-label="Next slide"
            >
              <ChevronRight className="size-[1.25rem] text-white" />
            </button>
          )}

          {/* Swiper Slider */}
          <Swiper
            modules={[Navigation]}
            spaceBetween={25}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 25,
              },
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              updateNavigationState(swiper);
            }}
            onSlideChange={(swiper) => {
              updateNavigationState(swiper);
            }}
            speed={600}
            className="w-full"
          >
            {posts.map((post) => (
              <SwiperSlide key={post.id}>
                <BlogCard post={post} locale={locale} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
