// Blog data access layer using Prisma
import { prisma } from './prisma';
import type { NormalizedBlogPost, NormalizedCategory, PaginatedResponse } from './types';

/**
 * Get paginated blog posts
 */
export async function getBlogPosts(
  locale: string,
  page = 1,
  pageSize = 12
): Promise<PaginatedResponse<NormalizedBlogPost>> {
  const skip = (page - 1) * pageSize;

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where: {
        published: true,
      },
      include: {
        category: true,
        tags: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
      skip,
      take: pageSize,
    }),
    prisma.blogPost.count({
      where: {
        published: true,
      },
    }),
  ]);

  const normalizedPosts = posts.map((post) => normalizeBlogPost(post, locale));
  const pageCount = Math.ceil(total / pageSize);

  return {
    data: normalizedPosts,
    meta: {
      pagination: {
        page,
        pageSize,
        pageCount,
        total,
      },
    },
  };
}

/**
 * Get blog post by slug
 */
export async function getBlogPostBySlug(
  slug: string,
  locale: string
): Promise<NormalizedBlogPost | null> {
  const post = await prisma.blogPost.findFirst({
    where: {
      slug,
      published: true,
    },
    include: {
      category: true,
      tags: true,
    },
  });

  return post ? normalizeBlogPost(post, locale) : null;
}

/**
 * Get blog posts by category
 */
export async function getBlogPostsByCategory(
  categorySlug: string,
  locale: string,
  page = 1,
  pageSize = 12
): Promise<PaginatedResponse<NormalizedBlogPost>> {
  const skip = (page - 1) * pageSize;

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where: {
        published: true,
        category: {
          slug: categorySlug,
        },
      },
      include: {
        category: true,
        tags: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
      skip,
      take: pageSize,
    }),
    prisma.blogPost.count({
      where: {
        published: true,
        category: {
          slug: categorySlug,
        },
      },
    }),
  ]);

  const normalizedPosts = posts.map((post) => normalizeBlogPost(post, locale));
  const pageCount = Math.ceil(total / pageSize);

  return {
    data: normalizedPosts,
    meta: {
      pagination: {
        page,
        pageSize,
        pageCount,
        total,
      },
    },
  };
}

/**
 * Get all categories
 */
export async function getCategories(locale: string): Promise<NormalizedCategory[]> {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  return categories.map((cat) => normalizeCategory(cat, locale));
}

/**
 * Get parent categories only (no parentId)
 */
export async function getParentCategories(locale: string): Promise<NormalizedCategory[]> {
  const categories = await prisma.category.findMany({
    where: {
      parentId: null,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return categories.map((cat) => normalizeCategory(cat, locale));
}

/**
 * Get subcategories for a parent category
 */
export async function getSubcategories(parentSlug: string, locale: string): Promise<NormalizedCategory[]> {
  const parent = await prisma.category.findUnique({
    where: { slug: parentSlug },
  });

  if (!parent) return [];

  const subcategories = await prisma.category.findMany({
    where: {
      parentId: parent.id,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return subcategories.map((cat) => normalizeCategory(cat, locale));
}

/**
 * Get blog posts by subcategory
 */
export async function getBlogPostsBySubcategory(
  subcategorySlug: string,
  locale: string,
  page = 1,
  pageSize = 12
): Promise<PaginatedResponse<NormalizedBlogPost>> {
  const skip = (page - 1) * pageSize;

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where: {
        published: true,
        category: {
          slug: subcategorySlug,
        },
      },
      include: {
        category: true,
        tags: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
      skip,
      take: pageSize,
    }),
    prisma.blogPost.count({
      where: {
        published: true,
        category: {
          slug: subcategorySlug,
        },
      },
    }),
  ]);

  const normalizedPosts = posts.map((post) => normalizeBlogPost(post, locale));
  const pageCount = Math.ceil(total / pageSize);

  return {
    data: normalizedPosts,
    meta: {
      pagination: {
        page,
        pageSize,
        pageCount,
        total,
      },
    },
  };
}

/**
 * Get posts grouped by parent category (includes subcategory posts)
 */
export async function getBlogPostsByParentCategory(
  parentSlug: string,
  locale: string
): Promise<NormalizedBlogPost[]> {
  const parent = await prisma.category.findUnique({
    where: { slug: parentSlug },
    include: {
      children: true,
    },
  });

  if (!parent) return [];

  const subcategoryIds = parent.children.map(child => child.id);

  const posts = await prisma.blogPost.findMany({
    where: {
      published: true,
      categoryId: {
        in: subcategoryIds,
      },
    },
    include: {
      category: true,
      tags: true,
    },
    orderBy: {
      publishedAt: 'desc',
    },
  });

  return posts.map((post) => normalizeBlogPost(post, locale));
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(
  slug: string,
  locale: string
): Promise<NormalizedCategory | null> {
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  return category ? normalizeCategory(category, locale) : null;
}

/**
 * Normalize Prisma post to frontend format (locale-aware)
 */
function normalizeBlogPost(post: any, locale: string): NormalizedBlogPost {
  return {
    id: post.id,
    title: locale === 'ru' ? (post.titleRu || post.title) : post.title,
    slug: post.slug,
    excerpt: locale === 'ru' ? (post.excerptRu || post.excerpt) : post.excerpt,
    content: locale === 'ru' ? (post.contentRu || post.content) : post.content,
    featuredImage: post.featuredImage ? {
      url: post.featuredImage,
      alt: locale === 'ru' ? (post.titleRu || post.title) : post.title,
    } : null,
    published: post.published,
    publishedAt: post.publishedAt,
    category: post.category ? {
      id: post.category.id,
      name: locale === 'ru' ? (post.category.nameRu || post.category.name) : post.category.name,
      slug: post.category.slug,
    } : null,
    tags: post.tags.map((tag: any) => ({
      id: tag.id,
      name: locale === 'ru' ? (tag.nameRu || tag.name) : tag.name,
    })),
    views: post.views || 0,
    author: post.author || '8 Blocks',
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

/**
 * Get related blog posts (same category, excluding current post)
 */
export async function getRelatedBlogPosts(
  postId: string,
  categoryId: string,
  locale: string,
  limit = 3
): Promise<NormalizedBlogPost[]> {
  const posts = await prisma.blogPost.findMany({
    where: {
      published: true,
      categoryId,
      id: {
        not: postId,
      },
    },
    include: {
      category: true,
      tags: true,
    },
    orderBy: {
      publishedAt: 'desc',
    },
    take: limit,
  });

  return posts.map((post) => normalizeBlogPost(post, locale));
}

/**
 * Normalize Prisma category to frontend format (locale-aware)
 */
function normalizeCategory(category: any, locale: string): NormalizedCategory {
  return {
    id: category.id,
    name: locale === 'ru' ? (category.nameRu || category.name) : category.name,
    slug: category.slug,
    description: locale === 'ru' ? (category.descriptionRu || category.description) : category.description,
    parentId: category.parentId || null,
  };
}
