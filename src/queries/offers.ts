import { supabase } from '@/lib/supabase/public';
import type { Offer } from '@/types/database';

export async function getActiveOffers(
  offerType?: 'affiliate' | 'local_deal',
  page = 1,
  limit = 24
): Promise<{ offers: Offer[]; total: number }> {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('offers')
    .select('*', { count: 'exact' })
    .eq('is_active', true)
    .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())
    .order('sort_order', { ascending: true })
    .range(from, to);

  if (offerType) query = query.eq('offer_type', offerType);

  const { data, error, count } = await query;
  if (error) throw new Error(`getActiveOffers: ${error.message}`);
  return { offers: data ?? [], total: count ?? 0 };
}