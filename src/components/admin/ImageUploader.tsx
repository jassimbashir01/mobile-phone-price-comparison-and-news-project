"use client";

import { useState } from "react";
import CloudinaryImage from "@/components/cloudinary-image";
import { Star, Trash2, ArrowUp, ArrowDown } from "lucide-react";

export interface ManagedImage {
  id?: string;
  cloudinary_public_id: string;
  is_primary: boolean;
  sort_order: number;
}

export function ImageUploader({
  images,
  onChange,
}: {
  images: ManagedImage[];
  onChange: (images: ManagedImage[]) => void;
}) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    setUploading(false);
    if (data.publicId) {
      onChange([
        ...images,
        {
          cloudinary_public_id: data.publicId,
          is_primary: images.length === 0,
          sort_order: images.length,
        },
      ]);
    }
    e.target.value = "";
  }

  function setPrimary(index: number) {
    onChange(images.map((img, i) => ({ ...img, is_primary: i === index })));
  }

  function remove(index: number) {
    const next = images
      .filter((_, i) => i !== index)
      .map((img, i) => ({ ...img, sort_order: i }));
    if (next.length > 0 && !next.some((i) => i.is_primary))
      next[0].is_primary = true;
    onChange(next);
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next.map((img, i) => ({ ...img, sort_order: i })));
  }

  return (
    <div>
      <div className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
        {images.map((img, i) => (
          <div
            key={img.cloudinary_public_id + i}
            className="relative rounded-md border border-border p-1"
          >
            <div className="relative aspect-square overflow-hidden rounded">
              <CloudinaryImage
                src={img.cloudinary_public_id}
                alt=""
                width={200}
                height={200}
                sizes="120px"
                className="h-full w-full object-contain"
              />
            </div>
            {img.is_primary && (
              <span className="absolute left-1 top-1 rounded bg-primary px-1 text-[9px] font-semibold">
                Primary
              </span>
            )}
            <div className="mt-1 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setPrimary(i)}
                title="Set as primary"
                className="text-ink/50 hover:text-primary"
              >
                <Star
                  size={14}
                  fill={img.is_primary ? "currentColor" : "none"}
                />
              </button>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="text-ink/40 hover:text-primary disabled:opacity-20"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === images.length - 1}
                  className="text-ink/40 hover:text-primary disabled:opacity-20"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="text-ink/40 hover:text-red-600"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        disabled={uploading}
        className="text-sm"
      />
      {uploading && <p className="mt-1 text-xs text-ink/40">Uploading…</p>}
    </div>
  );
}
