"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { brandSchema, type BrandFormValues } from "@/lib/validation/brand";
import { createBrand, updateBrand } from "@/lib/actions/brands";
import { SingleImageUploader } from "./SingleImageUploader";
import { AdminSuccessScreen } from "./AdminSuccessScreen";
import type { Brand } from "@/types/database";

export function BrandForm({ brand }: { brand?: Brand }) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [createdBrand, setCreatedBrand] = useState<{ name: string } | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: brand
      ? {
          name: brand.name,
          slug: brand.slug,
          logo_url: brand.logo_url ?? "",
          show_in_sidebar: brand.show_in_sidebar,
          description: brand.description ?? "",
          is_active: brand.is_active,
        }
      : { is_active: true, show_in_sidebar: true },
  });

  async function onSubmit(values: BrandFormValues) {
    setServerError("");
    try {
      if (brand) {
        await updateBrand(brand.id, values);
        router.push("/admin/brands");
        router.refresh();
      } else {
        const created = await createBrand(values);
        setCreatedBrand({ name: created.name });
      }
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  if (createdBrand) {
    return (
      <AdminSuccessScreen
        title="Brand created"
        message={`${createdBrand.name} has been created and is now live.`}
        primaryHref="/admin/brands"
        primaryLabel="Check Brands"
        createAnotherHref="/admin/brands/new"
        createAnotherLabel="Create Another Brand"
        onCreateAnother={() => {
          setCreatedBrand(null);
          reset();
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          {...register("name")}
          className="w-full rounded-md border border-border px-3 py-2 text-sm"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="slug" className="mb-1 block text-sm font-medium">
          Slug
        </label>
        <input
          id="slug"
          {...register("slug")}
          className="w-full rounded-md border border-border px-3 py-2 text-sm"
        />
        {errors.slug && (
          <p className="mt-1 text-xs text-red-600">{errors.slug.message}</p>
        )}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Logo</label>
        <Controller
          name="logo_url"
          control={control}
          render={({ field }) => (
            <SingleImageUploader
              value={field.value || null}
              onChange={(id) => field.onChange(id ?? "")}
            />
          )}
        />
      </div>
      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          {...register("description")}
          className="w-full rounded-md border border-border px-3 py-2 text-sm"
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register("is_active")} />
        Active (visible on the public site)
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register("show_in_sidebar")} />
        Show in sidebar (still searchable and indexable either way)
      </label>
      {serverError && <p className="text-sm text-red-600">{serverError}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
      >
        {isSubmitting ? "Saving…" : brand ? "Save Changes" : "Create Brand"}
      </button>
    </form>
  );
}