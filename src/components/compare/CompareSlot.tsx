"use client";

import Image from "next/image";
import { cloudinaryUrl } from "@/lib/cloudinaryUrl";
import { formatPKR } from "@/lib/utils";
import type { PhoneWithDetails } from "@/types/database";

export function CompareSlot({
  phone,
  onPick,
}: {
  phone: PhoneWithDetails | null;
  onPick: () => void;
}) {
  if (!phone) {
    return (
      <button
        onClick={onPick}
        className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-white text-sm text-ink/50 hover:border-primary hover:text-primary"
      >
        <span className="text-2xl">+</span>
        Add a phone to compare
      </button>
    );
  }

  const primary = phone.images.find((i) => i.is_primary) ?? phone.images[0];

  return (
    <div className="rounded-lg border border-border bg-white p-4 text-center">
      <div className="relative mx-auto mb-2 aspect-[45/100] w-16">
        {primary ? (
          <Image
            src={cloudinaryUrl(primary.cloudinary_public_id, {
              width: 128,
              height: 284,
            })}
            alt={phone.name}
            width={64}
            height={142}
            unoptimized
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-ink/30">
            No image
          </div>
        )}
      </div>
      <h2 className="text-sm font-semibold">{phone.name}</h2>
      <p className="mt-1 text-sm font-semibold text-primary">
        {formatPKR(phone.price_pkr)}
      </p>
      <button
        onClick={onPick}
        className="mt-2 block w-full text-xs text-primary hover:underline"
      >
        Change phone
      </button>
    </div>
  );
}
