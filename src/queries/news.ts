/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/server';
import type { News } from '@/types/database';

const NEWS_LIST_SELECT = `id, title, slug, excerpt, cover_image_public_id, published_at, brand:brands(id, name, slug)`;

export async function getPublishedNews({
  page = 1,
  limit = 10,
  brandSlug,
}: { page?: number; limit?: number; brandSlug?: string } = {}): Promise<{
  news: any[];
  total: number;
}> {
  const supabase = await createClient();
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

  const filtered = brandSlug
    ? (data ?? []).filter((n: any) => n.brand?.slug === brandSlug)
    : data ?? [];

  return { news: filtered, total: count ?? 0 };
}

export async function getNewsBySlug(slug: string): Promise<News | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('news')
    .select('*, brand:brands(id, name, slug)')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  if (error) throw new Error(`getNewsBySlug: ${error.message}`);
  return data;
}

export async function getAllNewsSlugs(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('news').select('slug').eq('is_published', true);
  if (error) throw new Error(`getAllNewsSlugs: ${error.message}`);
  return (data ?? []).map((n) => n.slug);
}

export async function getRelatedNews(newsId: string, brandId: string | null, limit = 4) {
  const supabase = await createClient();
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
  return data ?? [];
}