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
 * row doesn't silently prevent the others from being processed.
 */

/**
 * Removes deleted phone IDs from homepage_sections.phone_ids.
 *
 * That column is a uuid[] with no foreign key, so nothing cascades into it.
 * A stale ID is harmless at render time — getHomepageSectionPhones filters
 * out IDs that don't resolve and auto-fills the slot instead — but it leaves
 * the admin's pinned list showing phantom entries and quietly grows over
 * time.
 *
 * Only sections that actually contain one of the deleted IDs are written to.
 * Exported so single-phone deletes can reuse it.
 */
export async function pruneDeletedPhoneIdsFromSections(
  deletedIds: string[],
): Promise<void> {
  if (deletedIds.length === 0) return;

  try {
    const supabase = createAdminClient();
    const { data: sections, error } = await supabase
      .from("homepage_sections")
      .select("section_key, phone_ids");

    if (error || !sections) {
      console.error(
        "pruneDeletedPhoneIdsFromSections: fetch failed",
        error?.message,
      );
      return;
    }

    const deleted = new Set(deletedIds);

    await Promise.all(
      sections
        .filter((s) => (s.phone_ids ?? []).some((id: string) => deleted.has(id)))
        .map((s) => {
          const pruned = (s.phone_ids ?? []).filter(
            (id: string) => !deleted.has(id),
          );
          return supabase
            .from("homepage_sections")
            .update({ phone_ids: pruned })
            .eq("section_key", s.section_key);
        }),
    );
  } catch (err) {
    // Non-fatal — the phones are already deleted, and a stale pinned ID
    // degrades gracefully. Better to log than to fail the whole action.
    console.error("pruneDeletedPhoneIdsFromSections threw:", err);
  }
}

export async function bulkDeletePhones(ids: string[]): Promise<BulkDeleteResult> {
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
  await pruneDeletedPhoneIdsFromSections(ids);
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
    (articles ?? []).map((a) => destroyCloudinaryAsset(a.cover_image_public_id)),
  );
  await triggerRevalidate([
    "/",
    "/news",
    ...(articles ?? []).map((a) => `/news/${a.slug}`),
  ]);

  return { deleted: ids.length, failed: [] };
}

export async function bulkDeleteOffers(ids: string[]): Promise<BulkDeleteResult> {
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