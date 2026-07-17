import Link from 'next/link';
import { CldImage } from 'next-cloudinary';
import type { HomepageBannerSetting } from '@/types/database';

export function HomepageBanner({ banner }: { banner: HomepageBannerSetting }) {
  if (!banner.enabled || !banner.cloudinary_public_id || !banner.link_url) return null;

  const isExternal = banner.link_url.startsWith('http');

  return (
    <Link
      href={banner.link_url}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer sponsored' : undefined}
      className="mb-6 block overflow-hidden rounded-lg border border-border"
    >
      <div className="relative aspect-6/1 w-full bg-surface">
        <CldImage
          src={banner.cloudinary_public_id}
          alt={banner.alt_text || 'Sponsored'}
          width={1200}
          height={200}
          sizes="100vw"
          className="h-full w-full object-cover"
        />
      </div>
    </Link>
  );
}