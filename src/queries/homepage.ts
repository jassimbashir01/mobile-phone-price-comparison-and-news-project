/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/lib/supabase/public";
import type { PhoneCardData } from "@/types/database";

const PHONE_CARD_SELECT = `
  *,
  brand:brands(id, name, slug),
  specs:phone_specs(ram_gb, storage_gb, display_size, main_camera_mp, battery_mah, os, network_type),
  images:phone_images(id, cloudinary_public_id, is_primary, sort_order)
`;

function normalizeCard(row: any): PhoneCardData {
  const specsRaw = Array.isArray(row.specs) ? row.specs[0] : row.specs;
  const images = row.images ?? [];
  const primary = images.find((i: any) => i.is_primary) ?? images[0] ?? null;
  return { ...row, specs: specsRaw ?? null, primary_image: primary };
}

export interface HomepageSectionResult {
  title: string;
  phones: (PhoneCardData & { isPinned: boolean })[];
}

export interface SectionFallback {
  priceMin?: number | null;
  priceMax?: number | null;
  /**
   * Which phone status the auto-fill should draw from. Also governs which
   * pinned phones remain visible — a Coming Soon section shouldn't drop a
   * pinned phone just because it isn't "available".
   */
  status?: "available" | "coming_soon";
}

export async function getHomepageSectionPhones(
  sectionKey: string,
  options: {
    slotCount?: number;
    fallback?: SectionFallback;
  } = {},
): Promise<HomepageSectionResult | null> {
  const slotCount = options.slotCount ?? 6;
  const status = options.fallback?.status ?? "available";

  const { data: section, error: sectionError } = await supabase
    .from("homepage_sections")
    .select("*")
    .eq("section_key", sectionKey)
    .eq("is_active", true)
    .maybeSingle();

  if (sectionError)
    throw new Error(`getHomepageSectionPhones: ${sectionError.message}`);
  if (!section) return null;

  // Pinned phones — manually picked by an admin, always shown first, in the
  // order they were saved.
  let pinnedPhones: PhoneCardData[] = [];
  if (section.phone_ids.length > 0) {
    const { data: phones, error: phonesError } = await supabase
      .from("phones")
      .select(PHONE_CARD_SELECT)
      .eq("status", status)
      .in("id", section.phone_ids);

    if (phonesError)
      throw new Error(`getHomepageSectionPhones: ${phonesError.message}`);

    pinnedPhones = section.phone_ids
      .map((id: string) => phones?.find((p: any) => p.id === id))
      .filter(Boolean)
      .map(normalizeCard);
  }

  const pinnedIds = new Set(pinnedPhones.map((p) => p.id));
  let autoPhones: PhoneCardData[] = [];

  // Auto-fill whatever slots aren't pinned. Every section now passes a
  // fallback: price sections filter by bracket, Latest and Coming Soon
  // filter only by status and take the newest. Pin none → all auto; pin
  // three → those three plus three auto.
  const remaining = slotCount - pinnedPhones.length;
  if (options.fallback && remaining > 0) {
    let query = supabase
      .from("phones")
      .select(PHONE_CARD_SELECT)
      .eq("status", status)
      .order("created_at", { ascending: false })
      .limit(remaining + pinnedIds.size); // buffer in case of overlap

    if (options.fallback.priceMin != null)
      query = query.gte("price_pkr", options.fallback.priceMin);
    if (options.fallback.priceMax != null)
      query = query.lte("price_pkr", options.fallback.priceMax);

    const { data: candidates, error: fallbackError } = await query;
    if (fallbackError)
      throw new Error(
        `getHomepageSectionPhones (fallback): ${fallbackError.message}`,
      );

    autoPhones = (candidates ?? [])
      .filter((p: any) => !pinnedIds.has(p.id))
      .slice(0, remaining)
      .map(normalizeCard);
  }

  const phones = [
    ...pinnedPhones.map((p) => ({ ...p, isPinned: true })),
    ...autoPhones.map((p) => ({ ...p, isPinned: false })),
  ];

  return { title: section.title ?? sectionKey, phones };
}
