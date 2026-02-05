import { 
  generatePageMetadata, 
  generateBlogPostMetadata,
  generateBlogPostStructuredData,
  generateOrganizationStructuredData 
} from '@/lib/seo/metadata';
import type { NormalizedBlogPost } from '@/lib/types';

describe('SEO Metadata Helpers', () => {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://8blocks.io';

  describe('generatePageMetadata', () => {
    it('should generate basic page metadata with all required fields', () => {
      const metadata = generatePageMetadata({
        title: 'About Us',
        description: 'Learn about 8Blocks',
        locale: 'en',
        path: '/about',
      });

      expect(metadata.title).toBe('About Us | 8Blocks');
      expect(metadata.description).toBe('Learn about 8Blocks');
      expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/en/about`);
      expect(metadata.openGraph?.title).toBe('About Us | 8Blocks');
      expect(metadata.openGraph?.type).toBe('website');
      expect(metadata.twitter?.card).toBe('summary_large_image');
    });

    it('should generate metadata with default description', () => {
      const metadata = generatePageMetadata({
        title: 'Test Page',
        locale: 'en',
        path: '/test',
      });

      expect(metadata.description).toBe('Modern web development and blockchain solutions');
    });

    it('should generate metadata for Russian locale', () => {
      const metadata = generatePageMetadata({
        title: 'О нас',
        description: 'Узнайте о 8Blocks',
        locale: 'ru',
        path: '/about',
      });

      expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/ru/about`);
      expect(metadata.openGraph?.locale).toBe('ru_RU');
    });

    it('should include language alternates', () => {
      const metadata = generatePageMetadata({
        title: 'Test',
        locale: 'en',
        path: '/test',
      });

      expect(metadata.alternates?.languages).toEqual({
        'en': `${SITE_URL}/en/test`,
        'ru': `${SITE_URL}/ru/test`,
      });
    });

    it('should use custom image when provided', () => {
      const customImage = 'https://example.com/custom.jpg';
      const metadata = generatePageMetadata({
        title: 'Test',
        locale: 'en',
        path: '/test',
        image: customImage,
      });

      expect(metadata.openGraph?.images).toEqual([
        {
          url: customImage,
          width: 1200,
          height: 630,
          alt: 'Test',
        },
      ]);
    });

    it('should handle site name as title without duplication', () => {
      const metadata = generatePageMetadata({
        title: '8Blocks',
        locale: 'en',
        path: '',
      });

      expect(metadata.title).toBe('8Blocks');
    });
  });

  describe('generateBlogPostMetadata', () => {
    const mockPost: NormalizedBlogPost = {
      id: 1,
      title: 'Test Blog Post',
      slug: 'test-blog-post',
      excerpt: 'This is a test excerpt',
      content: '<p>Test content</p>',
      featuredImage: {
        url: 'https://example.com/image.jpg',
        alt: 'Test image',
        width: 1200,
        height: 630,
      },
      publishedAt: new Date('2024-01-15T10:00:00Z'),
      locale: 'en',
      category: {
        id: 1,
        name: 'Technology',
        slug: 'technology',
      },
      tags: [
        { id: 1, name: 'Web', slug: 'web' },
        { id: 2, name: 'Development', slug: 'development' },
      ],
    };

    it('should generate blog post metadata with all required fields', () => {
      const metadata = generateBlogPostMetadata(mockPost, 'en');

      expect(metadata.title).toBe('Test Blog Post | 8Blocks');
      expect(metadata.description).toBe('This is a test excerpt');
      expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/en/blog/technology/test-blog-post`);
      expect(metadata.openGraph?.type).toBe('article');
      expect(metadata.openGraph?.publishedTime).toBe('2024-01-15T10:00:00.000Z');
    });

    it('should use featured image in metadata', () => {
      const metadata = generateBlogPostMetadata(mockPost, 'en');

      expect(metadata.openGraph?.images).toEqual([
        {
          url: 'https://example.com/image.jpg',
          width: 1200,
          height: 630,
          alt: 'Test image',
        },
      ]);
      expect(metadata.twitter?.images).toEqual(['https://example.com/image.jpg']);
    });

    it('should use default image when no featured image', () => {
      const postWithoutImage: NormalizedBlogPost = {
        ...mockPost,
        featuredImage: null,
      };

      const metadata = generateBlogPostMetadata(postWithoutImage, 'en');

      expect(metadata.openGraph?.images?.[0].url).toBe(`${SITE_URL}/assets/8-blocks.svg`);
    });

    it('should include language alternates for blog posts', () => {
      const metadata = generateBlogPostMetadata(mockPost, 'en');

      expect(metadata.alternates?.languages).toEqual({
        'en': `${SITE_URL}/en/blog/technology/test-blog-post`,
        'ru': `${SITE_URL}/ru/blog/technology/test-blog-post`,
      });
    });

    it('should set correct locale for Russian posts', () => {
      const metadata = generateBlogPostMetadata(mockPost, 'ru');

      expect(metadata.openGraph?.locale).toBe('ru_RU');
      expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/ru/blog/technology/test-blog-post`);
    });
  });

  describe('generateBlogPostStructuredData', () => {
    const mockPost: NormalizedBlogPost = {
      id: 1,
      title: 'Test Blog Post',
      slug: 'test-blog-post',
      excerpt: 'This is a test excerpt',
      content: '<p>Test content</p>',
      featuredImage: {
        url: 'https://example.com/image.jpg',
        alt: 'Test image',
        width: 1200,
        height: 630,
      },
      publishedAt: new Date('2024-01-15T10:00:00Z'),
      locale: 'en',
      category: {
        id: 1,
        name: 'Technology',
        slug: 'technology',
      },
      tags: [],
    };

    it('should generate valid Schema.org BlogPosting structured data', () => {
      const structuredData = generateBlogPostStructuredData(mockPost, 'en');

      expect(structuredData['@context']).toBe('https://schema.org');
      expect(structuredData['@type']).toBe('BlogPosting');
      expect(structuredData.headline).toBe('Test Blog Post');
      expect(structuredData.description).toBe('This is a test excerpt');
      expect(structuredData.image).toBe('https://example.com/image.jpg');
      expect(structuredData.datePublished).toBe('2024-01-15T10:00:00.000Z');
    });

    it('should include author and publisher information', () => {
      const structuredData = generateBlogPostStructuredData(mockPost, 'en');

      expect(structuredData.author).toEqual({
        '@type': 'Organization',
        name: '8Blocks',
        url: SITE_URL,
      });
      expect(structuredData.publisher).toEqual({
        '@type': 'Organization',
        name: '8Blocks',
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/assets/8-blocks.svg`,
        },
      });
    });

    it('should include mainEntityOfPage with correct URL', () => {
      const structuredData = generateBlogPostStructuredData(mockPost, 'en');

      expect(structuredData.mainEntityOfPage).toEqual({
        '@type': 'WebPage',
        '@id': `${SITE_URL}/en/blog/technology/test-blog-post`,
      });
    });
  });

  describe('generateOrganizationStructuredData', () => {
    it('should generate valid Schema.org Organization structured data', () => {
      const structuredData = generateOrganizationStructuredData();

      expect(structuredData['@context']).toBe('https://schema.org');
      expect(structuredData['@type']).toBe('Organization');
      expect(structuredData.name).toBe('8Blocks');
      expect(structuredData.url).toBe(SITE_URL);
      expect(structuredData.logo).toBe(`${SITE_URL}/assets/8-blocks.svg`);
    });

    it('should include sameAs array for social media', () => {
      const structuredData = generateOrganizationStructuredData();

      expect(structuredData.sameAs).toBeInstanceOf(Array);
    });
  });
});
