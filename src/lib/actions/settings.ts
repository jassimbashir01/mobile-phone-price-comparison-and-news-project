'use server';

import { z } from 'zod';
import { requireRole } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { triggerRevalidate } from '@/lib/revalidate';
import type { SocialLink, MediaKitStats, HomepageBannerSetting } from '@/types/database';

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

const mediaKitSchema = z.object({
  monthly_visitors: z.string().max(100),
  monthly_pageviews: z.string().max(100),
  avg_session_duration: z.string().max(100),
  top_regions: z.string().max(200),
  audience_description: z.string().max(500),
});

export async function updateMediaKitStats(stats: MediaKitStats) {
  await requireRole(['admin', 'editor']);
  const parsed = mediaKitSchema.parse(stats);

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key: 'media_kit_stats', value: parsed }, { onConflict: 'key' });

  if (error) throw new Error(error.message);
  await triggerRevalidate(['/media-kit']);
}

const homepageBannerSchema = z.object({
  cloudinary_public_id: z.string(),
  link_url: z.string().url().or(z.literal('')),
  alt_text: z.string().max(200),
  enabled: z.boolean(),
});

export async function updateHomepageBanner(banner: HomepageBannerSetting) {
  await requireRole(['admin', 'editor']);
  const parsed = homepageBannerSchema.parse(banner);

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key: 'homepage_banner', value: parsed }, { onConflict: 'key' });

  if (error) throw new Error(error.message);
  await triggerRevalidate(['/']);
}

const bannerSettingSchema = z.object({
  cloudinary_public_id: z.string(),
  link_url: z.string().url().or(z.literal('')),
  alt_text: z.string().max(200),
  enabled: z.boolean(),
});

export async function updateSidebarBanner(banner: import('@/types/database').SidebarBannerSetting) {
  await requireRole(['admin', 'editor']);
  const parsed = bannerSettingSchema.parse(banner);

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key: 'sidebar_banner', value: parsed }, { onConflict: 'key' });

  if (error) throw new Error(error.message);
  await triggerRevalidate(['/']);
}

const brandShowcaseSchema = z.object({
  brand_ids: z.array(z.string().uuid()),
  enabled: z.boolean(),
});

export async function updateBrandShowcase(showcase: import('@/types/database').BrandShowcaseSetting) {
  await requireRole(['admin', 'editor']);
  const parsed = brandShowcaseSchema.parse(showcase);

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key: 'brand_showcase', value: parsed }, { onConflict: 'key' });

  if (error) throw new Error(error.message);
  await triggerRevalidate(['/']);
}