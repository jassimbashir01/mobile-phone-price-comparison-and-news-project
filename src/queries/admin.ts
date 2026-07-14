/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAdminClient } from '@/lib/supabase/admin';
import type { Brand, News, PhoneWithDetails } from '@/types/database';

export async function getAllBrandsAdmin(): Promise<Brand[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from('brands').select('*').order('name');
  if (error) throw new Error(`getAllBrandsAdmin: ${error.message}`);
  return data ?? [];
}

export async function getBrandByIdAdmin(id: string): Promise<Brand | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from('brands').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(`getBrandByIdAdmin: ${error.message}`);
  return data;
}

export async function getAllPhonesAdmin({
  page = 1,
  limit = 20,
  search,
}: { page?: number; limit?: number; search?: string } = {}) {
  const supabase = createAdminClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('phones')
    .select('*, brand:brands(id, name, slug)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (search) query = query.ilike('name', `%${search}%`);

  const { data, error, count } = await query;
  if (error) throw new Error(`getAllPhonesAdmin: ${error.message}`);
  return { phones: data ?? [], total: count ?? 0 };
}

export async function getPhoneByIdAdmin(id: string): Promise<PhoneWithDetails | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('phones')
    .select('*, brand:brands(*), specs:phone_specs(*), images:phone_images(*)')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(`getPhoneByIdAdmin: ${error.message}`);
  if (!data) return null;
  const specsRaw = Array.isArray((data as any).specs) ? (data as any).specs[0] : (data as any).specs;
  return {
    ...(data as any),
    specs: specsRaw ?? null,
    images: ((data as any).images ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order),
  };
}

export async function getAllNewsAdmin(): Promise<News[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('news')
    .select('*, brand:brands(id, name, slug)')
    .order('published_at', { ascending: false, nullsFirst: false });
  if (error) throw new Error(`getAllNewsAdmin: ${error.message}`);
  return data ?? [];
}

export async function getNewsByIdAdmin(id: string): Promise<News | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from('news').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(`getNewsByIdAdmin: ${error.message}`);
  return data;
}

export async function getDashboardCounts() {
  const supabase = createAdminClient();
  const [{ count: phoneCount }, { count: brandCount }, { count: newsCount }, { count: messageCount }] =
    await Promise.all([
      supabase.from('phones').select('*', { count: 'exact', head: true }),
      supabase.from('brands').select('*', { count: 'exact', head: true }),
      supabase.from('news').select('*', { count: 'exact', head: true }),
      supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
    ]);

  return {
    phones: phoneCount ?? 0,
    brands: brandCount ?? 0,
    news: newsCount ?? 0,
    messages: messageCount ?? 0,
  };
}

export async function getHomepageSectionsAdmin() {
  const supabase = createAdminClient();
  const { data: sections, error } = await supabase.from('homepage_sections').select('*').order('section_key');
  if (error) throw new Error(`getHomepageSectionsAdmin: ${error.message}`);

  const allPhoneIds = Array.from(new Set((sections ?? []).flatMap((s) => s.phone_ids)));
  let phoneMap = new Map<string, any>();
  if (allPhoneIds.length > 0) {
    const { data: phones } = await supabase
      .from('phones')
      .select('id, name, slug, price_pkr, is_sponsored')
      .in('id', allPhoneIds);
    phoneMap = new Map((phones ?? []).map((p) => [p.id, p]));
  }

  return (sections ?? []).map((s) => ({
    ...s,
    phones: s.phone_ids.map((id: string) => phoneMap.get(id)).filter(Boolean),
  }));
}