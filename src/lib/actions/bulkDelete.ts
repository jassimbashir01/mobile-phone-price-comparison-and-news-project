"use server";

import { requireRole } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { destroyCloudinaryAsset } from "@/lib/cloudinary";
import { triggerRevalidate } from "@/lib/revalidate";

export interface BulkDeleteResult {
  deleted: number;
  failed: { id: string; error: string }[];
}

/**
 * Bulk delete is admin-only, matching single-item deletes — editors create
 * and edit, admins destroy. Each entity type cleans up its own Cloudinary
 * assets, because a database cascade does nothing to a remote CDN object.
 *
 * Failures are collected per-id rather than aborting the batch, so one bad
 * row doesn't silently prevent the other 49 from being processed.
 */

export async function bulkDeletePhones(
  ids: string[],
): Promise<BulkDeleteResult> {
  await requireRole(["admin"]);
  if (ids.length === 0) return { deleted: 0, failed: [] };

  const supabase = createAdminClient();
  const failed: BulkDeleteResult["failed"] = [];

  // Collect image public_ids and slugs before deleting — the rows are gone
  // afterwards, and ON DELETE CASCADE removes phone_images without touching
  // Cloudinary.
  const { data: phones } = await supabase
    .from("phones")
    .select("id, slug, images:phone_images(cloudinary_public_id)")
    .in("id", ids);

  const publicIds: string[] = [];
  const slugs: string[] = [];
  for (const p of phones ?? []) {
    slugs.push(p.slug);
    for (const img of (p.images ?? []) as { cloudinary_public_id: string }[]) {
      publicIds.push(img.cloudinary_public_id);
    }
  }

  const { error } = await supabase.from("phones").delete().in("id", ids);
  if (error) {
    return {
      deleted: 0,
      failed: ids.map((id) => ({ id, error: error.message })),
    };
  }

  await Promise.all(publicIds.map((pid) => destroyCloudinaryAsset(pid)));
  await triggerRevalidate(["/", ...slugs.map((s) => `/phone/${s}`)]);

  return { deleted: ids.length, failed };
}

export async function bulkDeleteNews(ids: string[]): Promise<BulkDeleteResult> {
  await requireRole(["admin"]);
  if (ids.length === 0) return { deleted: 0, failed: [] };

  const supabase = createAdminClient();

  const { data: articles } = await supabase
    .from("news")
    .select("id, slug, cover_image_public_id")
    .in("id", ids);

  const { error } = await supabase.from("news").delete().in("id", ids);
  if (error) {
    return {
      deleted: 0,
      failed: ids.map((id) => ({ id, error: error.message })),
    };
  }

  await Promise.all(
    (articles ?? []).map((a) =>
      destroyCloudinaryAsset(a.cover_image_public_id),
    ),
  );
  await triggerRevalidate([
    "/",
    "/news",
    ...(articles ?? []).map((a) => `/news/${a.slug}`),
  ]);

  return { deleted: ids.length, failed: [] };
}

export async function bulkDeleteOffers(
  ids: string[],
): Promise<BulkDeleteResult> {
  await requireRole(["admin"]);
  if (ids.length === 0) return { deleted: 0, failed: [] };

  const supabase = createAdminClient();

  const { data: offers } = await supabase
    .from("offers")
    .select("id, image_public_id")
    .in("id", ids);

  const { error } = await supabase.from("offers").delete().in("id", ids);
  if (error) {
    return {
      deleted: 0,
      failed: ids.map((id) => ({ id, error: error.message })),
    };
  }

  await Promise.all(
    (offers ?? []).map((o) => destroyCloudinaryAsset(o.image_public_id)),
  );
  await triggerRevalidate(["/offers"]);

  return { deleted: ids.length, failed: [] };
}

export async function bulkDeleteContactMessages(
  ids: string[],
): Promise<BulkDeleteResult> {
  await requireRole(["admin"]);
  if (ids.length === 0) return { deleted: 0, failed: [] };

  // No Cloudinary assets and nothing public to revalidate.
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("contact_messages")
    .delete()
    .in("id", ids);
  if (error) {
    return {
      deleted: 0,
      failed: ids.map((id) => ({ id, error: error.message })),
    };
  }
  return { deleted: ids.length, failed: [] };
}

export async function bulkDeleteSubscribers(
  ids: string[],
): Promise<BulkDeleteResult> {
  await requireRole(["admin"]);
  if (ids.length === 0) return { deleted: 0, failed: [] };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("email_subscribers")
    .delete()
    .in("id", ids);
  if (error) {
    return {
      deleted: 0,
      failed: ids.map((id) => ({ id, error: error.message })),
    };
  }
  return { deleted: ids.length, failed: [] };
}
