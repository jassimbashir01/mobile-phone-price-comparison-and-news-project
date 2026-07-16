'use server';

import { z } from 'zod';
import { requireRole } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { triggerRevalidate } from '@/lib/revalidate';
import type { SocialLink } from '@/types/database';

const rateSchema = z.object({ rate: z.coerce.number().positive() });

export async function updateExchangeRate(rate: number) {
  await requireRole(['admin', 'editor']);
  const parsed = rateSchema.parse({ rate });

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key: 'usd_exchange_rate', value: { rate: parsed.rate } }, { onConflict: 'key' });

  if (error) throw new Error(error.message);
  await triggerRevalidate(['/']);
}

const socialLinkSchema = z.object({
  platform: z.enum(['facebook', 'instagram', 'twitter', 'youtube', 'tiktok', 'whatsapp']),
  url: z.string().url().or(z.literal('')),
  enabled: z.boolean(),
});

export async function updateSocialLinks(links: SocialLink[]) {
  await requireRole(['admin', 'editor']);
  const parsed = z.array(socialLinkSchema).parse(links);

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key: 'social_links', value: parsed }, { onConflict: 'key' });

  if (error) throw new Error(error.message);
  await triggerRevalidate(['/']);
}