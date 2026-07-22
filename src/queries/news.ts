import { supabase } from '@/lib/supabase/public';
import type { News } from '@/types/database';

const NEWS_LIST_SELECT = `id, title, slug, excerpt, cover_image_public_id, published_at, brand:brands(id, name, slug)`;

export interface NewsBrandRef {
  id: string;
  name: string;
  slug: string;
}

// Lightweight shape used by listing contexts (NewsCard, related news,
// news listing page) — not the full News row, just what those views need.
export interface NewsListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_public_id: string | null;
  published_at: string | null;
  brand: NewsBrandRef | null;
}

// Full News row plus its joined brand — this is what the article detail
// page actually gets back, so this interface removes the need for any
// cast at the call site.
export interface NewsWithBrand extends News {
  brand: NewsBrandRef | null;
}

export async function getPublishedNews({
  page = 1,
  limit = 10,
  brandSlug,
}: { page?: number; limit?: number; brandSlug?: string } = {}): Promise<{
  news: NewsListItem[];
  total: number;
}> {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('news')
    .select(NEWS_LIST_SELECT, { count: 'exact' })
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .range(from, to);

  if (brandSlug) query = query.eq('brand.slug', brandSlug);

  const { data, error, count } = await query;
  if (error) throw new Error(`getPublishedNews: ${error.message}`);

  const rows = (data ?? []) as unknown as NewsListItem[];
  const filtered = brandSlug ? rows.filter((n) => n.brand?.slug === brandSlug) : rows;

  return { news: filtered, total: count ?? 0 };
}

export async function getNewsBySlug(slug: string): Promise<NewsWithBrand | null> {
  const { data, error } = await supabase
    .from('news')
    .select('*, brand:brands(id, name, slug)')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  if (error) throw new Error(`getNewsBySlug: ${error.message}`);
  return data as unknown as NewsWithBrand | null;
}

export async function getAllNewsSlugs(): Promise<string[]> {
  const { data, error } = await supabase.from('news').select('slug').eq('is_published', true);
  if (error) throw new Error(`getAllNewsSlugs: ${error.message}`);
  return (data ?? []).map((n) => n.slug);
}

export async function getRelatedNews(
  newsId: string,
  brandId: string | null,
  limit = 4
): Promise<NewsListItem[]> {
  let query = supabase
    .from('news')
    .select(NEWS_LIST_SELECT)
    .neq('id', newsId)
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (brandId) query = query.eq('brand_id', brandId);

  const { data, error } = await query;
  if (error) throw new Error(`getRelatedNews: ${error.message}`);
  return (data ?? []) as unknown as NewsListItem[];
}