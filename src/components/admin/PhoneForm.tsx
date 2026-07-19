"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { phoneSchema, type PhoneFormValues } from "@/lib/validation/phone";
import {
  createPhone,
  updatePhone,
  savePhoneImages,
} from "@/lib/actions/phones";
import { ImageUploader, type ManagedImage } from "./ImageUploader";
import { RichTextEditor } from "./RichTextEditor";
import type { Brand, PhoneWithDetails } from "@/types/database";

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

const inputClass = "w-full rounded-md border border-border px-3 py-2 text-sm";

export function PhoneForm({
  phone,
  brands,
  onCreated,
}: {
  phone?: PhoneWithDetails;
  brands: Brand[];
  onCreated?: (phone: { id: string; slug: string; name: string }) => void;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [images, setImages] = useState<ManagedImage[]>(
    phone?.images.map((img) => ({
      id: img.id,
      cloudinary_public_id: img.cloudinary_public_id,
      is_primary: img.is_primary,
      sort_order: img.sort_order,
    })) ?? [],
  );
  const [savingImages, setSavingImages] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: phone
      ? {
          brand_id: phone.brand_id,
          name: phone.name,
          slug: phone.slug,
          status: phone.status,
          price_pkr: phone.price_pkr ?? undefined,
          is_featured: phone.is_featured,
          sort_order: phone.sort_order,
          seo_description: phone.seo_description ?? "",
          overview: phone.overview ?? "",
          description: phone.description ?? "",
          network_type: phone.specs?.network_type ?? "",
          os: phone.specs?.os ?? "",
          ram_gb: phone.specs?.ram_gb ?? undefined,
          storage_gb: phone.specs?.storage_gb ?? undefined,
          display_size: phone.specs?.display_size ?? undefined,
          main_camera_mp: phone.specs?.main_camera_mp ?? undefined,
          battery_mah: phone.specs?.battery_mah ?? undefined,
          processor: phone.specs?.processor ?? "",
          display_type: phone.specs?.display_type ?? "",
          bluetooth: phone.specs?.bluetooth ?? false,
          wifi: phone.specs?.wifi ?? false,
          dual_sim: phone.specs?.dual_sim ?? false,
          fm_radio: phone.specs?.fm_radio ?? false,
          memory_card: phone.specs?.memory_card ?? false,
          mp3: phone.specs?.mp3 ?? false,
          video_recording: phone.specs?.video_recording ?? false,
          has_camera: phone.specs?.has_camera ?? false,
        }
      : { status: "available", is_featured: false, sort_order: 0 },
  });

  async function onSubmit(values: PhoneFormValues) {
    setServerError("");
    try {
      if (phone) {
        await updatePhone(phone.id, values);
        router.refresh();
      } else {
        const created = await createPhone(values);
        if (onCreated) {
          onCreated({ id: created.id, slug: created.slug, name: created.name });
        } else {
          router.push(`/admin/phones/${created.id}/edit`);
        }
      }
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  async function handleSaveImages() {
    if (!phone) return;
    setSavingImages(true);
    try {
      await savePhoneImages(phone.id, images, phone.slug);
      router.refresh();
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Failed to save images");
    } finally {
      setSavingImages(false);
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field id="brand_id" label="Brand" error={errors.brand_id?.message}>
            <select
              id="brand_id"
              {...register("brand_id")}
              className={inputClass}
            >
              <option value="">Select a brand</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </Field>
          <Field id="status" label="Status">
            <select id="status" {...register("status")} className={inputClass}>
              <option value="available">Available</option>
              <option value="coming_soon">Coming Soon</option>
              <option value="discontinued">Discontinued</option>
            </select>
          </Field>
          <Field id="name" label="Name" error={errors.name?.message}>
            <input id="name" {...register("name")} className={inputClass} />
          </Field>
          <Field id="slug" label="Slug" error={errors.slug?.message}>
            <input id="slug" {...register("slug")} className={inputClass} />
          </Field>
          <Field id="price_pkr" label="Price (PKR)">
            <input
              id="price_pkr"
              type="number"
              {...register("price_pkr")}
              className={inputClass}
            />
          </Field>
          <Field id="sort_order" label="Sort Order">
            <input
              id="sort_order"
              type="number"
              {...register("sort_order")}
              className={inputClass}
            />
          </Field>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("is_featured")} /> Featured
        </label>

        <Field
          id="seo_description"
          label="SEO Meta Description (plain text, shown in search results)"
        >
          <textarea
            id="seo_description"
            rows={3}
            {...register("seo_description")}
            className={inputClass}
          />
        </Field>

        <div>
          <label className="mb-1 block text-sm font-medium">Overview</label>
          <Controller
            name="overview"
            control={control}
            render={({ field }) => (
              <RichTextEditor
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder="A short overview shown right after the price and share buttons…"
              />
            )}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Full Description
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <RichTextEditor
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder="The full write-up, shown after the spec table — as long and detailed as you want…"
              />
            )}
          />
        </div>

        <fieldset className="rounded-lg border border-border p-4">
          <legend className="px-1 text-sm font-semibold">Specifications</legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field id="network_type" label="Network Type">
              <select
                id="network_type"
                {...register("network_type")}
                className={inputClass}
              >
                <option value="">—</option>
                <option value="2G">2G</option>
                <option value="3G">3G</option>
                <option value="4G">4G</option>
                <option value="5G">5G</option>
              </select>
            </Field>
            <Field id="os" label="Operating System">
              <select id="os" {...register("os")} className={inputClass}>
                <option value="">—</option>
                <option value="Android">Android</option>
                <option value="iOS">iOS</option>
                <option value="Windows">Windows</option>
                <option value="Feature Phone">Feature Phone</option>
              </select>
            </Field>
            <Field id="ram_gb" label="RAM (GB)">
              <input
                id="ram_gb"
                type="number"
                {...register("ram_gb")}
                className={inputClass}
              />
            </Field>
            <Field id="storage_gb" label="Storage (GB)">
              <input
                id="storage_gb"
                type="number"
                {...register("storage_gb")}
                className={inputClass}
              />
            </Field>
            <Field id="display_size" label="Display Size (inches)">
              <input
                id="display_size"
                type="number"
                step="0.1"
                {...register("display_size")}
                className={inputClass}
              />
            </Field>
            <Field id="display_type" label="Display Type">
              <input
                id="display_type"
                {...register("display_type")}
                className={inputClass}
              />
            </Field>
            <Field id="main_camera_mp" label="Main Camera (MP)">
              <input
                id="main_camera_mp"
                type="number"
                step="0.1"
                {...register("main_camera_mp")}
                className={inputClass}
              />
            </Field>
            <Field id="battery_mah" label="Battery (mAh)">
              <input
                id="battery_mah"
                type="number"
                {...register("battery_mah")}
                className={inputClass}
              />
            </Field>
            <Field id="processor" label="Processor">
              <input
                id="processor"
                {...register("processor")}
                className={inputClass}
              />
            </Field>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(
              [
                "bluetooth",
                "wifi",
                "dual_sim",
                "fm_radio",
                "memory_card",
                "mp3",
                "video_recording",
                "has_camera",
              ] as const
            ).map((field) => (
              <label
                key={field}
                className="flex items-center gap-2 text-sm capitalize"
              >
                <input type="checkbox" {...register(field)} />{" "}
                {field.replace("_", " ")}
              </label>
            ))}
          </div>
        </fieldset>

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving…"
            : phone
              ? "Save Changes"
              : "Create Phone & Continue to Images"}
        </button>
      </form>

      {phone && (
        <div className="max-w-3xl">
          <h2 className="mb-2 text-sm font-semibold">Images</h2>
          <ImageUploader images={images} onChange={setImages} />
          <button
            onClick={handleSaveImages}
            disabled={savingImages}
            className="mt-3 rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary-light disabled:opacity-50"
          >
            {savingImages ? "Saving…" : "Save Images"}
          </button>
        </div>
      )}
    </div>
  );
}
