import Link from "next/link";
import CloudinaryImage from "@/components/cloudinary-image";
import { formatPKR } from "@/lib/utils";
import type { PhoneCardData } from "@/types/database";

export function PhoneCard({ phone }: { phone: PhoneCardData }) {
  return (
    <Link
      href={`/phone/${phone.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-white transition hover:shadow-md"
    >
      <div className="relative mx-auto aspect-[85/155] w-full max-w-[85px] bg-surface">
        {phone.primary_image ? (
          <CloudinaryImage
            src={phone.primary_image.cloudinary_public_id}
            alt={`${phone.name} price in Pakistan`}
            width={85}
            height={155}
            sizes="85px"
            className="h-full w-full object-contain p-1"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[10px] text-ink/30">
            No image
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-0.5 p-2">
        <span className="text-[10px] text-ink/50">{phone.brand.name}</span>
        <h3 className="line-clamp-2 text-xs font-semibold text-ink group-hover:text-primary">
          {phone.name}
        </h3>
        <p className="mt-auto pt-0.5 text-xs font-semibold text-primary">
          {phone.status === "coming_soon"
            ? phone.expected_price_pkr != null
              ? `${formatPKR(phone.expected_price_pkr)} (Expected)`
              : "Coming Soon"
            : phone.price_pkr != null
              ? formatPKR(phone.price_pkr)
              : "Price N/A"}
        </p>
      </div>
    </Link>
  );
}
