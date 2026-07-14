'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { brandSchema, type BrandFormValues } from '@/lib/validation/brand';
import { createBrand, updateBrand } from '@/lib/actions/brands';
import type { Brand } from '@/types/database';

export function BrandForm({ brand }: { brand?: Brand }) {
  const router = useRouter();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: brand
      ? {
          name: brand.name,
          slug: brand.slug,
          logo_url: brand.logo_url ?? '',
          description: brand.description ?? '',
          is_active: brand.is_active,
        }
      : { is_active: true },
  });

  async function onSubmit(values: BrandFormValues) {
    setServerError('');
    try {
      if (brand) await updateBrand(brand.id, values);
      else await createBrand(values);
      router.push('/admin/brands');
      router.refresh();
    } catch (e) {
      setServerError(e instanceof Error ? e.message : 'Something went wrong');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">Name</label>
        <input id="name" {...register('name')} className="w-full rounded-md border border-border px-3 py-2 text-sm" />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="slug" className="mb-1 block text-sm font-medium">Slug</label>
        <input id="slug" {...register('slug')} className="w-full rounded-md border border-border px-3 py-2 text-sm" />
        {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug.message}</p>}
      </div>
      <div>
        <label htmlFor="logo_url" className="mb-1 block text-sm font-medium">Logo URL</label>
        <input id="logo_url" {...register('logo_url')} className="w-full rounded-md border border-border px-3 py-2 text-sm" />
        {errors.logo_url && <p className="mt-1 text-xs text-red-600">{errors.logo_url.message}</p>}
      </div>
      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium">Description</label>
        <textarea id="description" rows={3} {...register('description')} className="w-full rounded-md border border-border px-3 py-2 text-sm" />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register('is_active')} />
        Active (visible on the public site)
      </label>
      {serverError && <p className="text-sm text-red-600">{serverError}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
      >
        {isSubmitting ? 'Saving…' : brand ? 'Save Changes' : 'Create Brand'}
      </button>
    </form>
  );
}