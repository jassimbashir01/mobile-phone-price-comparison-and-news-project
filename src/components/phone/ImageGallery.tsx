'use client';

import { useState } from 'react';
import CloudinaryImage from '@/components/cloudinary-image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PhoneImage } from '@/types/database';

export function ImageGallery({ images, phoneName }: { images: PhoneImage[]; phoneName: string }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="mx-auto flex aspect-[195/365] w-full max-w-[320px] items-center justify-center rounded-lg border border-border bg-surface text-sm text-ink/30">
        No images yet
      </div>
    );
  }

  const current = images[active];

  function prev() {
    setActive((i) => (i === 0 ? images.length - 1 : i - 1));
  }
  function next() {
    setActive((i) => (i === images.length - 1 ? 0 : i + 1));
  }

  return (
    <div>
      <div className="relative mx-auto aspect-[195/365] w-full max-w-[320px] overflow-hidden rounded-lg border border-border bg-surface">
        <CloudinaryImage
          src={current.cloudinary_public_id}
          alt={`${phoneName} image ${active + 1}`}
          width={390}
          height={730}
          sizes="320px"
          className="h-full w-full object-contain p-3"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-border bg-white p-1.5 shadow"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-border bg-white p-1.5 shadow"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex justify-center gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              className={`relative aspect-[85/155] w-11 shrink-0 overflow-hidden rounded-md border ${
                i === active ? 'border-primary' : 'border-border'
              }`}
            >
              <CloudinaryImage
                src={img.cloudinary_public_id}
                alt={`${phoneName} thumbnail ${i + 1}`}
                width={85}
                height={155}
                sizes="44px"
                className="h-full w-full object-contain p-0.5"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}