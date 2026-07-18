/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import type { Brand } from '@/types/database';
import CloudinaryImage from '../cloudinary-image';

export function BrandShowcase({ brands }: { brands: Brand[] }) {
  if (brands.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="mb-3 text-lg font-bold">Shop by Brand</h2>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {brands.map((b) => (
          <Link
            key={b.id}
            href={`/brand/${b.slug}`}
            className="flex flex-col items-center gap-2 rounded-lg border border-border bg-white p-4 hover:border-primary"
          >
            {b.logo_url ? (
              <CloudinaryImage src={b.logo_url} alt={`${b.name} logo`} width={40} height={40} sizes="40px" className="h-10 w-10 object-contain" />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-sm font-bold text-primary-dark">
                {b.name.charAt(0)}
              </span>
            )}
            <span className="text-xs font-medium">{b.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}