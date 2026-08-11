"use server";

import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { triggerRevalidate, pingIndexNow } from "@/lib/revalidate";
import { sanitizeRichText } from "@/lib/sanitize";
import { destroyCloudinaryAsset } from "@/lib/cloudinary";
import { pruneDeletedPhoneIdsFromSections } from "./bulkDelete";
import { phoneSchema, type PhoneFormValues } from "@/lib/validation/phone";
import type { ManagedImage } from "@/components/admin/ImageUploader";

function nullifyUndefined<T extends Record<string, unknown>>(obj: T): T {
  const out = { ...obj };
  for (const key in out) {
    if (out[key] === undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      out[key] = null as any;
    }
  }
  return out;
}

function splitPhoneAndSpecs(parsed: z.infer<typeof phoneSchema>) {
  const {
    network_type,
    os,
    ram_gb,
    storage_gb,
    display_size,
    main_camera_mp,
    battery_mah,
    processor,
    display_type,
    bluetooth,
    wifi,
    dual_sim,
    fm_radio,
    memory_card,
    mp3,
    video_recording,
    has_camera,
    overview,
    description,
    ...phoneFields
  } = parsed;

  return {
    phoneFields: nullifyUndefined({
      ...phoneFields,
      overview: sanitizeRichText(overview),
      description: sanitizeRichText(description),
    }),
    specFields: nullifyUndefined({
      network_type,
      os,
      ram_gb,
      storage_gb,
      display_size,
      main_camera_mp,
      battery_mah,
      processor,
      display_type,
      bluetooth,
      wifi,
      dual_sim,
      fm_radio,
      memory_card,
      mp3,
      video_recording,
      has_camera,
    }),
  };
}

export async function createPhone(values: PhoneFormValues) {
  await requireRole(["admin", "editor"]);
  const parsed = phoneSchema.parse(values);
  const { phoneFields, specFields } = splitPhoneAndSpecs(parsed);

  const supabase = createAdminClient();

  const { data: phone, error: phoneError } = await supabase
    .from("phones")
    .insert(phoneFields)
    .select()
    .single();
  if (phoneError) throw new Error(phoneError.message);

  const { error: specsError } = await supabase.from("phone_specs").insert({
    phone_id: phone.id,
    ...specFields,
  });
  if (specsError) throw new Error(specsError.message);

  await triggerRevalidate(["/", `/phone/${parsed.slug}`]);
  await pingIndexNow(["/", `/phone/${parsed.slug}`]);
  return phone;
}

export async function updatePhone(id: string, values: PhoneFormValues) {
  await requireRole(["admin", "editor"]);
  const parsed = phoneSchema.parse(values);
  const { phoneFields, specFields } = splitPhoneAndSpecs(parsed);

  const supabase = createAdminClient();

  const { error: phoneError } = await supabase
    .from("phones")
    .update(phoneFields)
    .eq("id", id);
  if (phoneError) throw new Error(phoneError.message);

  const { error: specsError } = await supabase
    .from("phone_specs")
    .upsert({ phone_id: id, ...specFields }, { onConflict: "phone_id" });
  if (specsError) throw new Error(specsError.message);

  await triggerRevalidate(["/", `/phone/${parsed.slug}`]);
  await pingIndexNow(["/", `/phone/${parsed.slug}`]);
}

export async function deletePhone(id: string, slug: string) {
  await requireRole(["admin"]);
  const supabase = createAdminClient();

  const { data: images } = await supabase
    .from("phone_images")
    .select("cloudinary_public_id")
    .eq("phone_id", id);

  const { error } = await supabase.from("phones").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await Promise.all(
    (images ?? []).map((img) =>
      destroyCloudinaryAsset(img.cloudinary_public_id),
    ),
  );
  // homepage_sections.phone_ids is a uuid[] with no foreign key, so nothing
  // cascades into it — prune the deleted ID explicitly.
  await pruneDeletedPhoneIdsFromSections([id]);

  await triggerRevalidate(["/", `/phone/${slug}`]);
}

export async function savePhoneImages(
  phoneId: string,
  images: ManagedImage[],
  slug: string,
) {
  await requireRole(["admin", "editor"]);
  const supabase = createAdminClient();

  const { data: oldImages } = await supabase
    .from("phone_images")
    .select("cloudinary_public_id")
    .eq("phone_id", phoneId);

  const { error: deleteError } = await supabase
    .from("phone_images")
    .delete()
    .eq("phone_id", phoneId);
  if (deleteError) throw new Error(deleteError.message);

  if (images.length > 0) {
    const { error: insertError } = await supabase.from("phone_images").insert(
      images.map((img, i) => ({
        phone_id: phoneId,
        cloudinary_public_id: img.cloudinary_public_id,
        is_primary: img.is_primary,
        sort_order: i,
      })),
    );
    if (insertError) throw new Error(insertError.message);
  }

  // Only destroy images that aren't still present in the new set — avoids
  // deleting an image the admin kept unchanged.
  const newIds = new Set(images.map((i) => i.cloudinary_public_id));
  const toDelete = (oldImages ?? []).filter(
    (old) => !newIds.has(old.cloudinary_public_id),
  );
  await Promise.all(
    toDelete.map((img) => destroyCloudinaryAsset(img.cloudinary_public_id)),
  );

  await triggerRevalidate([`/phone/${slug}`]);
}
