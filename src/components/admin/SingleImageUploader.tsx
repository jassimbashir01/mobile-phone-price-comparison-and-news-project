'use client';

import { useState } from 'react';
import { CldImage } from 'next-cloudinary';

export function SingleImageUploader({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (publicId: string | null) => void;
}) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    setUploading(false);
    if (data.publicId) onChange(data.publicId);
  }

  return (
    <div>
      {value ? (
        <div className="relative mb-2 aspect-video w-full max-w-xs overflow-hidden rounded-md border border-border">
          <CldImage src={value} alt="Cover" fill sizes="320px" className="object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute right-1 top-1 rounded-full bg-white/90 px-2 py-0.5 text-xs"
          >
            Remove
          </button>
        </div>
      ) : (
        <p className="mb-2 text-xs text-ink/40">No cover image uploaded yet.</p>
      )}
      <input id="cover-image-upload" type="file" accept="image/*" onChange={handleFile} disabled={uploading} className="text-sm" />
      {uploading && <p className="mt-1 text-xs text-ink/40">Uploading…</p>}
    </div>
  );
}