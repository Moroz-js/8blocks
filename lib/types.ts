// Frontend types based on Prisma models

export interface NormalizedBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featuredImage: {
    url: string;
    alt: string;
  } | null;
  published: boolean;
  publishedAt: Date | null;
  locale: string;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  tags: Array<{
    id: string;
    name: string;
  }>;
  views: number;
  readTime?: number;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NormalizedCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
}

export interface NormalizedTag {
  id: string;
  name: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    pagination: PaginationMeta;
  };
}
