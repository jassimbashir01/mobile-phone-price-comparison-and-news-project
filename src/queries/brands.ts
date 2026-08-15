import { cache } from "react";
import { supabase } from "@/lib/supabase/public";
import { NEW_WINDOW_MONTHS } from "@/lib/phoneStatus";
import type { Brand } from "@/types/database";

export async function getActiveBrands(): Promise<
  (Brand & { hasNewPhone: boolean })[]
> {
  const { data: brands, error } = await supabase
    .from("brands")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (error) throw new Error(`getActiveBrands: ${error.message}`);

  // One query for every recently-released phone, rather than one per brand.
  // NEW_WINDOW_MONTHS is imported rather than hardcoded so the brand badge
  // and the phone badge can never disagree about what "new" means.
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - NEW_WINDOW_MONTHS);

  const { data: recent, error: recentError } = await supabase
    .from("phones")
    .select("brand_id")
    .not("release_date", "is", null)
    .gte("release_date", cutoff.toISOString().split("T")[0]);

  if (recentError) throw new Error(`getActiveBrands: ${recentError.message}`);

  const brandsWithNew = new Set((recent ?? []).map((p) => p.brand_id));

  return (brands ?? []).map((b) => ({
    ...b,
    hasNewPhone: brandsWithNew.has(b.id),
  }));
}

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw new Error(`getBrandBySlug: ${error.message}`);
  return data;
}

export async function getAllBrandSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from("brands")
    .select("slug")
    .eq("is_active", true);
  if (error) throw new Error(`getAllBrandSlugs: ${error.message}`);
  return (data ?? []).map((b) => b.slug);
}
