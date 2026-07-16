import Link from "next/link";
import { formatPKR } from "@/lib/utils";
import type { PhoneCardData } from "@/types/database";
import CloudinaryImage from "../cloudinary-image";

export function PhoneCard({ phone }: { phone: PhoneCardData }) {
  return (
    <Link
      href={`/phone/${phone.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-white transition hover:shadow-md"
    >
      <div className="relative mx-auto aspect-45/100 w-full max-w-27.5 bg-surface">
        {phone.primary_image ? (
          <CloudinaryImage
            src={phone.primary_image.cloudinary_public_id}
            alt={`${phone.name} price in Pakistan`}
            width={90}
            height={200}
            sizes="110px"
            className="h-full w-full object-contain p-1"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-ink/30">
            No image
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <span className="text-xs text-ink/50">{phone.brand.name}</span>
        <h3 className="line-clamp-2 text-sm font-semibold text-ink group-hover:text-primary">
          {phone.name}
        </h3>
        <p className="mt-auto pt-1 text-sm font-semibold text-primary">
          {formatPKR(phone.price_pkr)}
        </p>
      </div>
    </Link>
  );
}
