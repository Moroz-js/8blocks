'use client';

import { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import BlogCard from '@/components/cards/BlogCard';
import { Button } from '@/components/ui';
import { Container } from '@/components/layout';
import type { NormalizedBlogPost } from '@/lib/types';

import 'swiper/css';
import 'swiper/css/navigation';

interface CasesProps {
  posts: NormalizedBlogPost[];
  locale: 'en' | 'ru';
}

export default function Cases({ posts, locale }: CasesProps) {
  const [selectedTag, setSelectedTag] = useState('All');
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);

  // Get unique tags from posts
  const allTags = ['All', ...Array.from(new Set(posts.map(p => p.category?.name).filter((name): name is string => Boolean(name))))];
  const tags = allTags.slice(0, 5); // Limit to 5 tags

  // Filter cases by selected tag
  const filteredCases = selectedTag === 'All' 
    ? posts 
    : posts.filter(p => p.category?.name === selectedTag);

  // Check if navigation is needed (more than 3 items)
  const needsNavigation = filteredCases.length > 3;

  // Reset swiper when tag changes
  const handleTagChange = (tag: string) => {
    if (tag === selectedTag) return;
    
    setIsTransitioning(true);
    setSelectedTag(tag);
    
    // Short delay to show skeleton
    setTimeout(() => {
      setIsTransitioning(false);
      if (swiperRef.current) {
        swiperRef.current.slideTo(0);
      }
    }, 300);
  };

  // Update navigation state
  const updateNavigationState = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  // Show message if no posts
  if (posts.length === 0) {
    return (
      <section id="cases" className="w-full py-fluid-lg">
        <Container className="flex flex-col gap-fluid-md items-center justify-center">
          <h2 className="font-berka font-normal text-h2 text-white">
            Our cases
          </h2>
          <p className="text-white opacity-50">No published posts yet.</p>
        </Container>
      </section>
    );
  }

  return (
    <section id="cases" className="w-full py-fluid-lg">
      {/* Title in Container */}
      <Container>
        <h2 className="font-berka font-normal text-[30px] lg:text-h2 leading-[1.1] text-white w-full md:w-[36.3125rem]">
          Our cases
        </h2>
      </Container>

      {/* Tags - scroll beyond container on mobile */}
      <div className="pl-[clamp(1.25rem,6.25vw,6.25rem)] lg:px-0 mt-[15px] lg:mt-0">
        <div className="lg:max-w-[90rem] lg:mx-auto lg:px-[clamp(1.25rem,6.25vw,6.25rem)] lg:flex lg:justify-end">
          <div className="flex gap-[0.625rem] items-center overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagChange(tag)}
                className={`h-tag px-[0.9375rem] py-[0.625rem] rounded-[0.5rem] flex items-center justify-center font-berka font-medium text-caption transition-colors whitespace-nowrap flex-shrink-0 ${
                  selectedTag === tag
                    ? 'bg-white text-black'
                    : 'bg-overlay-tag text-white hover:bg-overlay-glass'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Slider - outside Container on mobile, left-padded to match container padding */}
      <div className="relative w-full pl-[clamp(1.25rem,6.25vw,6.25rem)] lg:px-0 mt-[15px] lg:mt-fluid-md">
        {/* Desktop: wrap in container-like max-width */}
        <div className="lg:max-w-[90rem] lg:mx-auto lg:px-[clamp(1.25rem,6.25vw,6.25rem)] relative">
          {/* Custom Navigation Buttons - centered by image height */}
          {needsNavigation && !isBeginning && !isTransitioning && (
            <button 
              onClick={() => swiperRef.current?.slidePrev()}
              className="hidden lg:flex absolute left-[-4.6875rem] top-[calc((100%*5/8)/2)] -translate-y-1/2 bg-background-tertiary rounded-[0.5rem] size-[3.125rem] items-center justify-center hover:bg-[#3a3a3b] transition-colors z-10"
              aria-label="Previous slide"
            >
              <ArrowLeft className="size-[1.25rem] text-white" />
            </button>
          )}

          {needsNavigation && !isEnd && !isTransitioning && (
            <button 
              onClick={() => swiperRef.current?.slideNext()}
              className="hidden lg:flex absolute right-[-4.6875rem] top-[calc((100%*5/8)/2)] -translate-y-1/2 bg-background-tertiary rounded-[0.5rem] size-[3.125rem] items-center justify-center hover:bg-[#3a3a3b] transition-colors z-10"
              aria-label="Next slide"
            >
              <ArrowRight className="size-[1.25rem] text-white" />
            </button>
          )}

          {/* Skeleton Loader */}
          {isTransitioning && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1.25rem] lg:gap-[1.5625rem]">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-[0.9375rem] animate-pulse">
                  <div className="w-full h-[10.4375rem] lg:h-auto lg:aspect-[8/5] bg-[#1a1a1a] rounded-[0.5rem]" />
                  <div className="h-[0.8125rem] w-[6rem] bg-[#1a1a1a] rounded" />
                  <div className="space-y-2">
                    <div className="h-[1.25rem] w-full bg-[#1a1a1a] rounded" />
                    <div className="h-[1.25rem] w-3/4 bg-[#1a1a1a] rounded" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-[0.9375rem] w-full bg-[#1a1a1a] rounded" />
                    <div className="h-[0.9375rem] w-5/6 bg-[#1a1a1a] rounded" />
                  </div>
                  <div className="flex gap-[0.75rem]">
                    <div className="h-[0.8125rem] w-[3rem] bg-[#1a1a1a] rounded" />
                    <div className="h-[0.8125rem] w-[3rem] bg-[#1a1a1a] rounded" />
                    <div className="h-[0.8125rem] w-[5rem] bg-[#1a1a1a] rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Swiper Slider */}
          {!isTransitioning && (
            <Swiper
              key={selectedTag}
              modules={[Navigation]}
              spaceBetween={15}
              slidesPerView="auto"
              breakpoints={{
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
              speed={400}
              className="w-full"
            >
              {filteredCases.map((caseItem) => (
                <SwiperSlide key={caseItem.id} className="max-md:!w-[267px]">
                  <BlogCard post={caseItem} locale={locale} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>

      {/* CTA Button in Container */}
      <Container className="mt-fluid-md">
        <button className="bg-white h-[36px] px-[15px] py-[10px] rounded-[8px] flex items-center justify-center font-['Berka'] font-medium text-[13px] leading-[1.5] text-black hover:opacity-90 transition-opacity lg:hidden">
          Explore all cases
        </button>
        <div className="hidden lg:flex justify-center">
        image.png          <Button variant="secondary">
            Explore all cases
          </Button>
        </div>
      </Container>
    </section>
  );
}
