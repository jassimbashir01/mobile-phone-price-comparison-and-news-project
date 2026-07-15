/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '@/lib/supabase/public';
import type { PhoneCardData } from '@/types/database';

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

export async function getHomepageSectionPhones(sectionKey: string): Promise<{
  title: string;
  phones: PhoneCardData[];
} | null> {

  const { data: section, error: sectionError } = await supabase
    .from('homepage_sections')
    .select('*')
    .eq('section_key', sectionKey)
    .eq('is_active', true)
    .maybeSingle();

  if (sectionError) throw new Error(`getHomepageSectionPhones: ${sectionError.message}`);
  if (!section || section.phone_ids.length === 0) {
    return section ? { title: section.title ?? sectionKey, phones: [] } : null;
  }

  const { data: phones, error: phonesError } = await supabase
    .from('phones')
    .select(PHONE_CARD_SELECT)
    .in('id', section.phone_ids);

  if (phonesError) throw new Error(`getHomepageSectionPhones: ${phonesError.message}`);

  // Preserve the manually-curated order from phone_ids, not DB order.
  const ordered = section.phone_ids
    .map((id: string) => phones?.find((p: any) => p.id === id))
    .filter(Boolean)
    .map(normalizeCard);

  return { title: section.title ?? sectionKey, phones: ordered };
}