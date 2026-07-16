import { supabase } from '@/lib/supabase/public';
import type { SocialLink } from '@/types/database';

export async function getExchangeRate(): Promise<number> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'usd_exchange_rate')
    .maybeSingle();

  if (error) throw new Error(`getExchangeRate: ${error.message}`);
  const rate = (data?.value as { rate?: number } | null)?.rate;
  // Sane fallback if this row is ever somehow missing — never lets a
  // display break, just falls back to a reasonable placeholder rate.
  return typeof rate === 'number' && rate > 0 ? rate : 280;
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'social_links')
    .maybeSingle();

  if (error) throw new Error(`getSocialLinks: ${error.message}`);
  return (data?.value as SocialLink[] | null) ?? [];
}