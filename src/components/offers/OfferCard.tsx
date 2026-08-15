import Image from "next/image";
import { Clock } from "lucide-react";
import { cloudinaryUrl } from "@/lib/cloudinaryUrl";
import { formatPKR, formatOfferExpiry } from "@/lib/utils";
import type { Offer } from "@/types/database";

export function OfferCard({ offer }: { offer: Offer }) {
  const hasDiscount =
    offer.original_price_pkr != null &&
    offer.price_pkr != null &&
    offer.original_price_pkr > offer.price_pkr;

  // null when there's no expiry set — render nothing rather than an empty row.
  const expiry = formatOfferExpiry(offer.expires_at);

  return (
    <a
      href={offer.destination_url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="flex flex-col overflow-hidden rounded-lg border border-border bg-white transition hover:shadow-md"
    >
      <div className="relative aspect-square bg-surface">
        {offer.image_public_id ? (
          <Image
            src={cloudinaryUrl(offer.image_public_id, {
              width: 600,
              height: 600,
            })}
            alt={offer.title}
            width={300}
            height={300}
            unoptimized
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-ink/30">
            No image
          </div>
        )}
        <span className="absolute left-2 top-2 rounded bg-accent px-1.5 py-0.5 text-[10px] font-semibold">
          {offer.offer_type === "affiliate" ? "Deal" : "Local Offer"}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        {offer.shop_name && (
          <span className="text-xs text-ink/50">
            {offer.shop_name}
            {offer.shop_location ? ` · ${offer.shop_location}` : ""}
          </span>
        )}

        <h3 className="line-clamp-2 text-sm font-semibold">{offer.title}</h3>

        {offer.description && (
          <p className="line-clamp-2 text-xs text-ink/60">
            {offer.description}
          </p>
        )}

        <div className="mt-auto flex items-baseline gap-2 pt-1">
          {offer.price_pkr != null && (
            <span className="text-sm font-semibold text-primary">
              {formatPKR(offer.price_pkr)}
            </span>
          )}
          {hasDiscount && (
            <span className="text-xs text-ink/40 line-through">
              {formatPKR(offer.original_price_pkr)}
            </span>
          )}
        </div>

        {expiry && (
          <p
            className={`flex items-center gap-1 pt-0.5 text-[11px] ${
              expiry.isEndingSoon ? "font-semibold text-red-600" : "text-ink/40"
            }`}
          >
            <Clock size={11} />
            {expiry.isEndingSoon ? "Ends" : "Valid until"} {expiry.label}
          </p>
        )}
      </div>
    </a>
  );
}
