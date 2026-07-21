/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAdminClient } from "@/lib/supabase/admin";
import { getHomepageSectionPhones } from "@/queries/homepage";
import {
  HOMEPAGE_PRICE_RANGES,
  homepagePriceSectionKey,
} from "@/lib/constants";
import type { Brand, News, PhoneWithDetails } from "@/types/database";

export async function getAllBrandsAdmin(): Promise<Brand[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .order("name");
  if (error) throw new Error(`getAllBrandsAdmin: ${error.message}`);
  return data ?? [];
}

export async function getBrandByIdAdmin(id: string): Promise<Brand | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("id", id)
    .maybeSingle();
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
    .from("phones")
    .select("*, brand:brands(id, name, slug)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (search) query = query.ilike("name", `%${search}%`);

  const { data, error, count } = await query;
  if (error) throw new Error(`getAllPhonesAdmin: ${error.message}`);
  return { phones: data ?? [], total: count ?? 0 };
}

export async function getPhoneByIdAdmin(
  id: string,
): Promise<PhoneWithDetails | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("phones")
    .select("*, brand:brands(*), specs:phone_specs(*), images:phone_images(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`getPhoneByIdAdmin: ${error.message}`);
  if (!data) return null;
  const specsRaw = Array.isArray((data as any).specs)
    ? (data as any).specs[0]
    : (data as any).specs;
  return {
    ...(data as any),
    specs: specsRaw ?? null,
    images: ((data as any).images ?? []).sort(
      (a: any, b: any) => a.sort_order - b.sort_order,
    ),
  };
}

export async function getAllNewsAdmin(
  page = 1,
  limit = 20,
): Promise<{ news: News[]; total: number }> {
  const supabase = createAdminClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from("news")
    .select("*, brand:brands(id, name, slug)", { count: "exact" })
    .order("published_at", { ascending: false, nullsFirst: false })
    .range(from, to);

  if (error) throw new Error(`getAllNewsAdmin: ${error.message}`);
  return { news: data ?? [], total: count ?? 0 };
}

export async function getNewsByIdAdmin(id: string): Promise<News | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`getNewsByIdAdmin: ${error.message}`);
  return data;
}

export async function getDashboardCounts() {
  const supabase = createAdminClient();
  const [
    { count: phoneCount },
    { count: brandCount },
    { count: newsCount },
    { count: messageCount },
  ] = await Promise.all([
    supabase.from("phones").select("*", { count: "exact", head: true }),
    supabase.from("brands").select("*", { count: "exact", head: true }),
    supabase.from("news").select("*", { count: "exact", head: true }),
    supabase
      .from("contact_messages")
      .select("*", { count: "exact", head: true }),
  ]);

  return {
    phones: phoneCount ?? 0,
    brands: brandCount ?? 0,
    news: newsCount ?? 0,
    messages: messageCount ?? 0,
  };
}

const SECTION_DISPLAY_ORDER = [
  "featured_slider",
  "latest_phones",
  ...HOMEPAGE_PRICE_RANGES.map(homepagePriceSectionKey),
  "coming_soon",
];

export async function getHomepageSectionsAdmin() {
  const supabase = createAdminClient();
  const { data: sections, error } = await supabase
    .from("homepage_sections")
    .select("*");
  if (error) throw new Error(`getHomepageSectionsAdmin: ${error.message}`);

  const priceBracketMap = new Map(
    HOMEPAGE_PRICE_RANGES.map((r) => [homepagePriceSectionKey(r), r]),
  );

  const resolved = await Promise.all(
    (sections ?? []).map(async (s) => {
      const bracket = priceBracketMap.get(s.section_key);
      const result = await getHomepageSectionPhones(s.section_key, {
        fallback: bracket
          ? { priceMin: bracket.min, priceMax: bracket.max }
          : undefined,
      });
      return { ...s, phones: result?.phones ?? [] };
    }),
  );

  resolved.sort(
    (a, b) =>
      SECTION_DISPLAY_ORDER.indexOf(a.section_key) -
      SECTION_DISPLAY_ORDER.indexOf(b.section_key),
  );

  return resolved;
}

export async function getAllBrandsAdminPaginated(
  page = 1,
  limit = 20,
): Promise<{ brands: Brand[]; total: number }> {
  const supabase = createAdminClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from("brands")
    .select("*", { count: "exact" })
    .order("name")
    .range(from, to);

  if (error) throw new Error(`getAllBrandsAdminPaginated: ${error.message}`);
  return { brands: data ?? [], total: count ?? 0 };
}

export async function getAllOffersAdmin(
  page = 1,
  limit = 20,
): Promise<{ offers: import("@/types/database").Offer[]; total: number }> {
  const supabase = createAdminClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from("offers")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw new Error(`getAllOffersAdmin: ${error.message}`);
  return { offers: data ?? [], total: count ?? 0 };
}

export async function getOfferByIdAdmin(
  id: string,
): Promise<import("@/types/database").Offer | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("offers")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`getOfferByIdAdmin: ${error.message}`);
  return data;
}

export async function getPhoneExtendedSpecsAdmin(
  phoneId: string,
): Promise<import("@/types/database").PhoneExtendedSpecs | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("phone_extended_specs")
    .select("*")
    .eq("phone_id", phoneId)
    .maybeSingle();

  if (error) throw new Error(`getPhoneExtendedSpecsAdmin: ${error.message}`);
  return data;
}

export async function getAllContactMessagesAdmin(
  page = 1,
  limit = 20,
): Promise<{
  messages: import("@/types/database").ContactMessage[];
  total: number;
}> {
  const supabase = createAdminClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from("contact_messages")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw new Error(`getAllContactMessagesAdmin: ${error.message}`);
  return { messages: data ?? [], total: count ?? 0 };
}
