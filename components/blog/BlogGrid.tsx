import { NormalizedBlogPost } from '@/lib/types';
import BlogCard from '@/components/cards/BlogCard';

interface BlogGridProps {
  posts: NormalizedBlogPost[];
  locale: 'en' | 'ru';
  variant?: 'default' | 'big';
}

export function BlogGrid({ posts, locale, variant = 'default' }: BlogGridProps) {
  if (posts.length === 0) {
    return (
      <div className="w-full text-center py-[3.125rem]">
        <p className="font-['Berka'] text-[0.9375rem] text-white opacity-50">
          {locale === 'en' ? 'No posts found' : 'Статьи не найдены'}
        </p>
      </div>
    );
  }

  if (variant === 'big') {
    return (
      <div className="flex flex-col gap-[1.5625rem] w-full">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} variant="big" locale={locale} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[1.25rem] lg:gap-[1.5625rem] w-full">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} variant="default" locale={locale} />
      ))}
    </div>
  );
}
