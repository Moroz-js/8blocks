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
  noindex?: boolean;
  publishedAt: Date | null;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
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
  children?: NormalizedCategory[];
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
