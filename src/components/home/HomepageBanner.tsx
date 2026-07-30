import Link from "next/link";
import Image from "next/image";
import CloudinaryImage from "@/components/cloudinary-image";
import type { HomepageBannerSetting } from "@/types/database";

export function HomepageBanner({ banner }: { banner: HomepageBannerSetting }) {
  const hasRealBanner =
    banner.enabled && banner.cloudinary_public_id && banner.link_url;

  if (!hasRealBanner) {
    return (
      <Link
        href="/advertise"
        className="mb-6 block overflow-hidden rounded-lg border border-border"
      >
        <div className="relative aspect-[3/1] w-full bg-surface sm:aspect-[6/1]">
          <Image
            src="/homepage-banner-default.jpg"
            alt="MobileWala — Compare Mobile Phone Prices, Specs & News in Pakistan. Advertise your brand here."
            fill
            sizes="100vw"
            className="h-full w-full object-cover"
            priority
          />
        </div>
      </Link>
    );
  }

  const isExternal = banner.link_url.startsWith("http");

  return (
    <Link
      href={banner.link_url}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer sponsored" : undefined}
      className="mb-6 block overflow-hidden rounded-lg border border-border"
    >
      <div className="relative aspect-[3/1] w-full bg-surface sm:aspect-[6/1]">
        <CloudinaryImage
          src={banner.cloudinary_public_id}
          alt={banner.alt_text || "Sponsored"}
          width={1200}
          height={200}
          sizes="100vw"
          className="h-full w-full object-cover"
          priority
        />
      </div>
    </Link>
  );
}
