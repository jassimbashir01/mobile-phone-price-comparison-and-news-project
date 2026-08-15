import Link from "next/link";
import Image from "next/image";
import { cloudinaryUrl } from "@/lib/cloudinaryUrl";
import { formatPKR } from "@/lib/utils";
import type { PhoneCardData } from "@/types/database";

export function PhoneCard({
  phone,
  priority,
}: {
  phone: PhoneCardData;
  priority?: boolean;
}) {
  const showExpectedTag =
    phone.status === "coming_soon" && phone.expected_price_pkr != null;
  // Only tag a discontinued phone that has a price — one without a price
  // shows "Discontinued" in the price slot itself, so a tag above it would
  // just repeat the word.
  const showDiscontinuedTag =
    phone.status === "discontinued" && phone.price_pkr != null;

  const imageUrl = phone.primary_image
    ? cloudinaryUrl(phone.primary_image.cloudinary_public_id, {
        width: 170,
        height: 310,
      })
    : null;

  function priceLabel() {
    if (phone.status === "coming_soon") {
      return phone.expected_price_pkr != null
        ? formatPKR(phone.expected_price_pkr)
        : "Coming Soon";
    }
    if (phone.status === "discontinued") {
      return phone.price_pkr != null
        ? formatPKR(phone.price_pkr)
        : "Discontinued";
    }
    return phone.price_pkr != null ? formatPKR(phone.price_pkr) : "Price N/A";
  }

  return (
    <Link
      href={`/phone/${phone.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-white transition hover:shadow-md"
    >
      <div className="relative mx-auto aspect-[85/155] w-full max-w-[85px] bg-surface">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${phone.name} price in Pakistan`}
            width={85}
            height={155}
            className="h-full w-full object-contain p-1"
            priority={priority}
            unoptimized
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
        <div className="mt-auto flex flex-col gap-0.5 pt-0.5">
          {showExpectedTag && (
            <span className="w-fit rounded bg-accent px-1 text-[8px] font-semibold">
              Expected Price
            </span>
          )}
          {showDiscontinuedTag && (
            <span className="w-fit rounded bg-ink/10 px-1 text-[8px] font-semibold text-ink/60">
              Discontinued
            </span>
          )}
          <p className="text-xs font-semibold text-primary">{priceLabel()}</p>
        </div>
      </div>
    </Link>
  );
}
