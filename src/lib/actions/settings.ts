"use server";

import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { triggerRevalidate } from "@/lib/revalidate";
import { destroyCloudinaryAsset } from "@/lib/cloudinary";
import type {
  SocialLink,
  MediaKitStats,
  HomepageBannerSetting,
  SidebarBannerSetting,
} from "@/types/database";

const httpUrlSchema = z
  .string()
  .refine((val) => val === "" || /^https?:\/\//i.test(val), {
    message: "Must be a valid https:// or http:// URL",
  });

const rateSchema = z.object({ rate: z.coerce.number().positive() });

export async function updateExchangeRate(rate: number) {
  await requireRole(["admin", "editor"]);
  const parsed = rateSchema.parse({ rate });

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("site_settings")
    .upsert(
      { key: "usd_exchange_rate", value: { rate: parsed.rate } },
      { onConflict: "key" },
    );

  if (error) throw new Error(error.message);
  await triggerRevalidate(["/"]);
}

const socialLinkSchema = z.object({
  platform: z.enum([
    "facebook",
    "instagram",
    "twitter",
    "youtube",
    "tiktok",
    "whatsapp",
  ]),
  url: httpUrlSchema,
  enabled: z.boolean(),
});

export async function updateSocialLinks(links: SocialLink[]) {
  await requireRole(["admin", "editor"]);
  const parsed = z.array(socialLinkSchema).parse(links);

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key: "social_links", value: parsed }, { onConflict: "key" });

  if (error) throw new Error(error.message);
  await triggerRevalidate(["/"]);
}

const mediaKitSchema = z.object({
  monthly_visitors: z.string().max(100),
  monthly_pageviews: z.string().max(100),
  avg_session_duration: z.string().max(100),
  top_regions: z.string().max(200),
  audience_description: z.string().max(500),
});

export async function updateMediaKitStats(stats: MediaKitStats) {
  await requireRole(["admin", "editor"]);
  const parsed = mediaKitSchema.parse(stats);

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key: "media_kit_stats", value: parsed }, { onConflict: "key" });

  if (error) throw new Error(error.message);
  await triggerRevalidate(["/media-kit"]);
}

const bannerSettingSchema = z.object({
  cloudinary_public_id: z.string(),
  link_url: httpUrlSchema,
  alt_text: z.string().max(200),
  enabled: z.boolean(),
});

async function getExistingBannerPublicId(
  key: string,
): Promise<string | undefined> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  return (data?.value as { cloudinary_public_id?: string } | null)
    ?.cloudinary_public_id;
}

export async function updateHomepageBanner(banner: HomepageBannerSetting) {
  await requireRole(["admin", "editor"]);
  const parsed = bannerSettingSchema.parse(banner);

  const existingPublicId = await getExistingBannerPublicId("homepage_banner");

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key: "homepage_banner", value: parsed }, { onConflict: "key" });

  if (error) throw new Error(error.message);

  if (existingPublicId && existingPublicId !== parsed.cloudinary_public_id) {
    await destroyCloudinaryAsset(existingPublicId);
  }

  await triggerRevalidate(["/"]);
}

export async function updateSidebarBanner(banner: SidebarBannerSetting) {
  await requireRole(["admin", "editor"]);
  const parsed = bannerSettingSchema.parse(banner);

  const existingPublicId = await getExistingBannerPublicId("sidebar_banner");

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key: "sidebar_banner", value: parsed }, { onConflict: "key" });

  if (error) throw new Error(error.message);

  if (existingPublicId && existingPublicId !== parsed.cloudinary_public_id) {
    await destroyCloudinaryAsset(existingPublicId);
  }

  await triggerRevalidate(["/"]);
}

export async function updateFooterBanner(banner: HomepageBannerSetting) {
  await requireRole(["admin", "editor"]);
  const parsed = bannerSettingSchema.parse(banner);

  const existingPublicId = await getExistingBannerPublicId("footer_banner");

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key: "footer_banner", value: parsed }, { onConflict: "key" });

  if (error) throw new Error(error.message);

  if (existingPublicId && existingPublicId !== parsed.cloudinary_public_id) {
    await destroyCloudinaryAsset(existingPublicId);
  }

  await triggerRevalidate(["/"]);
}

const footerBrandsSchema = z.object({
  brand_ids: z.array(z.string().uuid()),
});

export async function updateFooterBrands(brandIds: string[]) {
  await requireRole(["admin", "editor"]);
  const parsed = footerBrandsSchema.parse({ brand_ids: brandIds });

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key: "footer_brands", value: parsed }, { onConflict: "key" });

  if (error) throw new Error(error.message);
  await triggerRevalidate(["/"]);
}
