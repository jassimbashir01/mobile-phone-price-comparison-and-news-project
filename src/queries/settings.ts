import { supabase } from "@/lib/supabase/public";
import type {
  SocialLink,
  MediaKitStats,
  HomepageBannerSetting,
  SidebarBannerSetting,
  Brand,
} from "@/types/database";

export async function getExchangeRate(): Promise<number> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "usd_exchange_rate")
    .maybeSingle();

  if (error) throw new Error(`getExchangeRate: ${error.message}`);
  const rate = (data?.value as { rate?: number } | null)?.rate;
  return typeof rate === "number" && rate > 0 ? rate : 280;
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "social_links")
    .maybeSingle();

  if (error) throw new Error(`getSocialLinks: ${error.message}`);
  return (data?.value as SocialLink[] | null) ?? [];
}

const DEFAULT_MEDIA_KIT_STATS: MediaKitStats = {
  monthly_visitors: "Add your traffic number in Admin → Settings",
  monthly_pageviews: "Add your pageview number in Admin → Settings",
  avg_session_duration: "Add your average session duration",
  top_regions: "Add your top regions",
  audience_description: "Add a short description of your typical visitor",
};

export async function getMediaKitStats(): Promise<MediaKitStats> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "media_kit_stats")
    .maybeSingle();

  if (error) throw new Error(`getMediaKitStats: ${error.message}`);
  return (data?.value as MediaKitStats | null) ?? DEFAULT_MEDIA_KIT_STATS;
}

const DEFAULT_BANNER = {
  cloudinary_public_id: "",
  link_url: "",
  alt_text: "",
  enabled: false,
};

export async function getHomepageBanner(): Promise<HomepageBannerSetting> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "homepage_banner")
    .maybeSingle();

  if (error) throw new Error(`getHomepageBanner: ${error.message}`);
  return (data?.value as HomepageBannerSetting | null) ?? DEFAULT_BANNER;
}

export async function getSidebarBanner(): Promise<SidebarBannerSetting> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "sidebar_banner")
    .maybeSingle();

  if (error) throw new Error(`getSidebarBanner: ${error.message}`);
  return (data?.value as SidebarBannerSetting | null) ?? DEFAULT_BANNER;
}
export async function getFooterBrands(): Promise<Brand[]> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "footer_brands")
    .maybeSingle();

  if (error) throw new Error(`getFooterBrands: ${error.message}`);
  const brandIds =
    (data?.value as { brand_ids?: string[] } | null)?.brand_ids ?? [];

  if (brandIds.length === 0) {
    const { data: fallback, error: fallbackError } = await supabase
      .from("brands")
      .select("*")
      .eq("is_active", true)
      .order("name")
      .limit(6);
    if (fallbackError)
      throw new Error(`getFooterBrands (fallback): ${fallbackError.message}`);
    return fallback ?? [];
  }

  const { data: brands, error: brandsError } = await supabase
    .from("brands")
    .select("*")
    .in("id", brandIds)
    .eq("is_active", true);
  if (brandsError) throw new Error(`getFooterBrands: ${brandsError.message}`);

  return brandIds
    .map((id) => brands?.find((b) => b.id === id))
    .filter((b): b is Brand => Boolean(b));
}

export async function getFooterBrandIds(): Promise<string[]> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "footer_brands")
    .maybeSingle();

  if (error) throw new Error(`getFooterBrandIds: ${error.message}`);
  return (data?.value as { brand_ids?: string[] } | null)?.brand_ids ?? [];
}

export async function getFooterBanner(): Promise<HomepageBannerSetting> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "footer_banner")
    .maybeSingle();

  if (error) throw new Error(`getFooterBanner: ${error.message}`);
  return (data?.value as HomepageBannerSetting | null) ?? DEFAULT_BANNER;
}
