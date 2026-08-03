import Link from "next/link";
import Image from "next/image";
import { cloudinaryUrl } from "@/lib/cloudinaryUrl";
import type { HomepageBannerSetting } from "@/types/database";

export function FooterBanner({ banner }: { banner: HomepageBannerSetting }) {
  if (!banner.enabled || !banner.cloudinary_public_id || !banner.link_url)
    return null;

  const isExternal = banner.link_url.startsWith("http");

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6">
      <Link
        href={banner.link_url}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer sponsored" : undefined}
        className="block overflow-hidden rounded-lg border border-white/10"
      >
        <div className="relative aspect-[3/1] w-full bg-white/5 sm:aspect-[6/1]">
          <Image
            src={cloudinaryUrl(banner.cloudinary_public_id, {
              width: 1800,
              height: 300,
            })}
            alt={banner.alt_text || "Sponsored"}
            width={1800}
            height={300}
            unoptimized
            className="h-full w-full object-cover"
          />
        </div>
      </Link>
    </div>
  );
}
