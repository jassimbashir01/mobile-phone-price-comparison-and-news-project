import Link from 'next/link';
import { CldImage } from 'next-cloudinary';
import { formatPKR } from '@/lib/utils';
import type { PhoneCardData } from '@/types/database';

export function PhoneCard({ phone }: { phone: PhoneCardData }) {
  const specLine = phone.specs
    ? [
        phone.specs.ram_gb && `${phone.specs.ram_gb}GB RAM`,
        phone.specs.display_size && `${phone.specs.display_size}"`,
        phone.specs.main_camera_mp && `${phone.specs.main_camera_mp}MP`,
      ]
        .filter(Boolean)
        .join(' • ')
    : null;

  return (
    <Link
      href={`/phone/${phone.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-white transition hover:shadow-md"
    >
      <div className="relative aspect-square bg-surface">
        {phone.primary_image ? (
          <CldImage
            src={phone.primary_image.cloudinary_public_id}
            alt={`${phone.name} price in Pakistan`}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-contain p-3"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-ink/30">
            No image
          </div>
        )}
        {phone.is_sponsored && (
          <span className="absolute left-2 top-2 rounded bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-ink">
            Sponsored
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <span className="text-xs text-ink/50">{phone.brand.name}</span>
        <h3 className="line-clamp-2 text-sm font-semibold text-ink group-hover:text-primary">
          {phone.name}
        </h3>
        <div className="mt-auto pt-1">
          <span className="price-tag text-sm">{formatPKR(phone.price_pkr)}</span>
        </div>
        {specLine && <p className="text-[11px] text-ink/50">{specLine}</p>}
      </div>
    </Link>
  );
}