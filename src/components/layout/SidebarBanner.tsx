import Link from "next/link";
import CloudinaryImage from "@/components/cloudinary-image";
import type { SidebarBannerSetting } from "@/types/database";

export function SidebarBanner({ banner }: { banner: SidebarBannerSetting }) {
  if (!banner.enabled || !banner.cloudinary_public_id || !banner.link_url)
    return null;

  const isExternal = banner.link_url.startsWith("http");

  return (
    <Link
      href={banner.link_url}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer sponsored" : undefined}
      className="block overflow-hidden rounded-lg border border-border"
    >
      <div className="relative aspect-square w-full bg-surface">
        <CloudinaryImage
          src={banner.cloudinary_public_id}
          alt={banner.alt_text || "Sponsored"}
          width={256}
          height={256}
          sizes="256px"
          className="h-full w-full object-cover"
        />
      </div>
    </Link>
  );
}
