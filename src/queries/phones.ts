/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/lib/supabase/public";
import type { PhoneCardData, PhoneWithDetails } from "@/types/database";
import type { FeatureCategory } from "@/lib/constants";

const PHONE_CARD_SELECT = `
  *,
  brand:brands(id, name, slug),
  specs:phone_specs(ram_gb, storage_gb, display_size, main_camera_mp, battery_mah, os, network_type),
  images:phone_images(id, cloudinary_public_id, is_primary, sort_order)
`;

// phone_specs is a 1:1 relation but Supabase returns joined 1:1 tables as
// an array when selected this way unless we tell it otherwise; this helper
// normalizes the shape and picks the primary image.
function normalizeCard(row: any): PhoneCardData {
  const specsRaw = Array.isArray(row.specs) ? row.specs[0] : row.specs;
  const images = row.images ?? [];
  const primary = images.find((i: any) => i.is_primary) ?? images[0] ?? null;
  return {
    ...row,
    specs: specsRaw ?? null,
    primary_image: primary,
  };
}

function normalizeDetails(row: any): PhoneWithDetails {
  const specsRaw = Array.isArray(row.specs) ? row.specs[0] : row.specs;
  return {
    ...row,
    specs: specsRaw ?? null,
    images: (row.images ?? []).sort(
      (a: any, b: any) => a.sort_order - b.sort_order,
    ),
  };
}

export async function getPhoneBySlug(
  slug: string,
): Promise<PhoneWithDetails | null> {
  const { data, error } = await supabase
    .from("phones")
    .select(`*, brand:brands(*), specs:phone_specs(*), images:phone_images(*)`)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(`getPhoneBySlug: ${error.message}`);
  return data ? normalizeDetails(data) : null;
}

export async function getAllPhoneSlugs(): Promise<string[]> {
  const slugs: string[] = [];
  const PAGE_SIZE = 1000;
  let offset = 0;

  // Supabase silently caps every query at 1,000 rows — without paging,
  // 1,500+ phones would be missing from prerendering and the sitemap.
  while (true) {
    const { data, error } = await supabase
      .from("phones")
      .select("slug")
      .order("created_at", { ascending: true })
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) throw new Error(`getAllPhoneSlugs: ${error.message}`);
    if (!data || data.length === 0) break;

    slugs.push(...data.map((p) => p.slug));
    if (data.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  return slugs;
}

export async function getFeaturedPhones(limit = 8): Promise<PhoneCardData[]> {
  const { data, error } = await supabase
    .from("phones")
    .select(PHONE_CARD_SELECT)
    .eq("is_featured", true)
    .order("sort_order")
    .limit(limit);

  if (error) throw new Error(`getFeaturedPhones: ${error.message}`);
  return (data ?? []).map(normalizeCard);
}

export async function getLatestPhones(limit = 12): Promise<PhoneCardData[]> {
  const { data, error } = await supabase
    .from("phones")
    .select(PHONE_CARD_SELECT)
    .eq("status", "available")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(`getLatestPhones: ${error.message}`);
  return (data ?? []).map(normalizeCard);
}

export async function getComingSoonPhones(
  limit = 12,
): Promise<PhoneCardData[]> {
  const { data, error } = await supabase
    .from("phones")
    .select(PHONE_CARD_SELECT)
    .eq("status", "coming_soon")
    .order("sort_order")
    .limit(limit);

  if (error) throw new Error(`getComingSoonPhones: ${error.message}`);
  return (data ?? []).map(normalizeCard);
}

export async function getPhonesByBrandSlug(
  brandSlug: string,
  { page = 1, limit = 24 }: { page?: number; limit?: number } = {},
): Promise<{ phones: PhoneCardData[]; total: number }> {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from("phones")
    .select(
      `*, brand:brands!inner(id, name, slug), specs:phone_specs(ram_gb, storage_gb, display_size, main_camera_mp, battery_mah, os, network_type), images:phone_images(id, cloudinary_public_id, is_primary, sort_order)`,
      { count: "exact" },
    )
    .eq("brand.slug", brandSlug)
    .order("sort_tier", { ascending: true })
    .order("sort_price", { ascending: false })
    .range(from, to);

  if (error) throw new Error(`getPhonesByBrandSlug: ${error.message}`);

  const filtered = (data ?? []).filter(
    (row: any) => row.brand?.slug === brandSlug,
  );
  return {
    phones: filtered.map(normalizeCard),
    total: count ?? filtered.length,
  };
}

// Generic filter used by every /price /ram /screen /camera /os /mobiles page.
export interface PhoneFilter {
  priceMin?: number | null;
  priceMax?: number | null;
  ramMin?: number | null;
  ramMax?: number | null;
  displayMin?: number | null;
  displayMax?: number | null;
  cameraMin?: number | null;
  cameraMax?: number | null;
  cameraNone?: boolean; // "without-camera"
  networkType?: string;
  os?: string;
  excludeOs?: string; // used by "all-smartphones" to exclude feature phones
  feature?: FeatureCategory["column"];
  limit?: number;
  page?: number;
}

export async function filterPhones(
  filter: PhoneFilter,
): Promise<{ phones: PhoneCardData[]; total: number }> {
  const limit = filter.limit ?? 24;
  const page = filter.page ?? 1;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("phones")
    .select(
      `*, brand:brands!inner(id, name, slug), specs:phone_specs!inner(ram_gb, storage_gb, display_size, main_camera_mp, battery_mah, os, network_type, bluetooth, wifi, dual_sim, fm_radio, memory_card, mp3, video_recording, has_camera), images:phone_images(id, cloudinary_public_id, is_primary, sort_order)`,
      { count: "exact" },
    );

  if (filter.priceMin != null) query = query.gte("price_pkr", filter.priceMin);
  if (filter.priceMax != null) query = query.lte("price_pkr", filter.priceMax);
  if (filter.ramMin != null) query = query.gte("specs.ram_gb", filter.ramMin);
  if (filter.ramMax != null) query = query.lte("specs.ram_gb", filter.ramMax);
  if (filter.displayMin != null)
    query = query.gte("specs.display_size", filter.displayMin);
  if (filter.displayMax != null)
    query = query.lte("specs.display_size", filter.displayMax);
  if (filter.cameraMin != null)
    query = query.gte("specs.main_camera_mp", filter.cameraMin);
  if (filter.cameraMax != null)
    query = query.lte("specs.main_camera_mp", filter.cameraMax);
  if (filter.cameraNone) query = query.eq("specs.has_camera", false);
  if (filter.networkType)
    query = query.eq("specs.network_type", filter.networkType);
  if (filter.os) query = query.eq("specs.os", filter.os);
  if (filter.excludeOs) query = query.neq("specs.os", filter.excludeOs);
  if (filter.feature) query = query.eq(`specs.${filter.feature}`, true);

  query = query
    .order("sort_tier", { ascending: true })
    .order("sort_price", { ascending: false })
    .range(from, to);

  const { data, error, count } = await query;
  if (error) throw new Error(`filterPhones: ${error.message}`);

  return { phones: (data ?? []).map(normalizeCard), total: count ?? 0 };
}

export async function getRelatedPhones(
  phoneId: string,
  brandId: string,
  limit = 6,
): Promise<PhoneCardData[]> {
  const { data, error } = await supabase
    .from("phones")
    .select(PHONE_CARD_SELECT)
    .eq("brand_id", brandId)
    .neq("id", phoneId)
    .eq("status", "available")
    .order("sort_order")
    .limit(limit);

  if (error) throw new Error(`getRelatedPhones: ${error.message}`);
  return (data ?? []).map(normalizeCard);
}

export async function searchPhones(
  q: string,
  page = 1,
  limit = 20,
): Promise<{ phones: PhoneCardData[]; total: number }> {
  const trimmed = q.trim();
  if (!trimmed) return { phones: [], total: 0 };

  const offset = (page - 1) * limit;
  const { data: matched, error: rpcError } = await supabase.rpc(
    "search_phones",
    {
      search_query: trimmed,
      result_limit: limit,
      result_offset: offset,
    },
  );

  if (rpcError) throw new Error(`searchPhones: ${rpcError.message}`);
  if (!matched || matched.length === 0) return { phones: [], total: 0 };

  const total = Number(matched[0]?.total_count ?? 0);
  const ids = matched.map((p: any) => p.id);

  const { data, error } = await supabase
    .from("phones")
    .select(PHONE_CARD_SELECT)
    .in("id", ids);
  if (error) throw new Error(`searchPhones: ${error.message}`);

  const byId = new Map((data ?? []).map((p: any) => [p.id, p]));
  const phones = ids
    .map((id: string) => byId.get(id))
    .filter(Boolean)
    .map(normalizeCard);

  return { phones, total };
}

export async function getSimilarPricedPhones(
  phoneId: string,
  price: number | null,
  limit = 6,
): Promise<PhoneCardData[]> {
  if (price == null) return [];
  const lower = Math.round(price * 0.7);
  const upper = Math.round(price * 1.3);

  const { data, error } = await supabase
    .from("phones")
    .select(PHONE_CARD_SELECT)
    .neq("id", phoneId)
    .eq("status", "available")
    .gte("price_pkr", lower)
    .lte("price_pkr", upper)
    .order("sort_order")
    .limit(limit);

  if (error) throw new Error(`getSimilarPricedPhones: ${error.message}`);
  return (data ?? []).map(normalizeCard);
}

export async function getBetterAlternatives(
  phoneId: string,
  price: number | null,
  limit = 4,
): Promise<PhoneCardData[]> {
  if (price == null) return [];
  const upperBound = Math.round(price * 1.6);

  const { data, error } = await supabase
    .from("phones")
    .select(PHONE_CARD_SELECT)
    .neq("id", phoneId)
    .eq("status", "available")
    .gt("price_pkr", price)
    .lte("price_pkr", upperBound)
    .order("price_pkr", { ascending: true }) // closest "step up" first
    .limit(limit);

  if (error) throw new Error(`getBetterAlternatives: ${error.message}`);
  return (data ?? []).map(normalizeCard);
}

export async function getCheaperAlternatives(
  phoneId: string,
  price: number | null,
  limit = 4,
): Promise<PhoneCardData[]> {
  if (price == null) return [];
  const lowerBound = Math.round(price * 0.5);

  const { data, error } = await supabase
    .from("phones")
    .select(PHONE_CARD_SELECT)
    .neq("id", phoneId)
    .eq("status", "available")
    .gte("price_pkr", lowerBound)
    .lt("price_pkr", price)
    .order("price_pkr", { ascending: false }) // closest "step down" first
    .limit(limit);

  if (error) throw new Error(`getCheaperAlternatives: ${error.message}`);
  return (data ?? []).map(normalizeCard);
}

export async function getSameChipsetPhones(
  phoneId: string,
  processor: string | null,
  limit = 4,
): Promise<PhoneCardData[]> {
  if (!processor) return [];

  const { data, error } = await supabase
    .from("phones")
    .select(
      `*, brand:brands(id, name, slug), specs:phone_specs!inner(ram_gb, storage_gb, display_size, main_camera_mp, battery_mah, os, network_type, processor), images:phone_images(id, cloudinary_public_id, is_primary, sort_order)`,
    )
    .neq("id", phoneId)
    .eq("status", "available")
    .ilike("specs.processor", `%${processor}%`)
    .order("sort_order")
    .limit(limit);

  if (error) throw new Error(`getSameChipsetPhones: ${error.message}`);
  // Same defensive JS-level filter noted back in Phase 5 for joined-column
  // filters — belt-and-suspenders against PostgREST's join-filter quirks.
  return (data ?? [])
    .filter(
      (row: any) =>
        row.specs?.some?.((s: any) =>
          s.processor?.toLowerCase().includes(processor.toLowerCase()),
        ) ?? true,
    )
    .map(normalizeCard);
}

export async function getAdjacentPhones(
  phoneId: string,
  brandId: string,
): Promise<{
  prev: { name: string; slug: string } | null;
  next: { name: string; slug: string } | null;
}> {
  // No status filter — a Coming Soon or Discontinued phone should still have
  // prev/next navigation. Filtering to `available` meant findIndex returned
  // -1 for those phones and the buttons never rendered at all.
  //
  // Ordered by sort_tier/sort_price to match every listing page, so "next"
  // is the phone the user would actually have seen next while browsing.
  // Capped at 1,000 deliberately: no single brand approaches that, and it
  // bounds the query cost on every phone page load.
  const { data, error } = await supabase
    .from("phones")
    .select("id, name, slug")
    .eq("brand_id", brandId)
    .order("sort_tier", { ascending: true })
    .order("sort_price", { ascending: false })
    .limit(1000);

  if (error) throw new Error(`getAdjacentPhones: ${error.message}`);
  const list = data ?? [];
  const index = list.findIndex((p) => p.id === phoneId);
  if (index === -1 || list.length <= 1) return { prev: null, next: null };

  // Wraps around — the first phone's "previous" is the last in the brand and
  // vice versa, so every phone gets both buttons and browsing never
  // dead-ends on a missing control.
  const prevIndex = index === 0 ? list.length - 1 : index - 1;
  const nextIndex = index === list.length - 1 ? 0 : index + 1;

  return { prev: list[prevIndex], next: list[nextIndex] };
}

export async function getPhoneExtendedSpecs(
  phoneId: string,
): Promise<import("@/types/database").PhoneExtendedSpecs | null> {
  const { data, error } = await supabase
    .from("phone_extended_specs")
    .select("*")
    .eq("phone_id", phoneId)
    .maybeSingle();

  if (error) throw new Error(`getPhoneExtendedSpecs: ${error.message}`);
  return data;
}
