import { supabase } from '@/lib/supabase/public';
import type { Offer } from '@/types/database';

export async function getActiveOffers(offerType?: 'affiliate' | 'local_deal'): Promise<Offer[]> {
  let query = supabase
    .from('offers')
    .select('*')
    .eq('is_active', true)
    .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())
    .order('sort_order', { ascending: true });

  if (offerType) query = query.eq('offer_type', offerType);

  const { data, error } = await query;
  if (error) throw new Error(`getActiveOffers: ${error.message}`);
  return data ?? [];
}