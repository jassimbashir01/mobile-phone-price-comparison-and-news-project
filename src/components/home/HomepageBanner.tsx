import Link from "next/link";
import Image from "next/image";
import { cloudinaryUrl } from "@/lib/cloudinaryUrl";
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
          {/* Real art direction — a genuinely different, purpose-cropped
              image per breakpoint. The browser only downloads whichever
              image actually matches, never both. */}
          <picture>
            <source
              media="(min-width: 640px)"
              srcSet="/homepage-banner-default.jpg"
            />
            <img
              src="/homepage-banner-mobile.jpg"
              alt="MobileWala — Compare Mobile Phone Prices, Specs & News in Pakistan"
              className="h-full w-full object-cover"
              fetchPriority="high"
              loading="eager"
              decoding="async"
            />
          </picture>
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
        <Image
          src={cloudinaryUrl(banner.cloudinary_public_id, {
            width: 1800,
            height: 300,
          })}
          alt={banner.alt_text || "Sponsored"}
          width={1800}
          height={300}
          priority
          unoptimized
          className="h-full w-full object-cover"
        />
      </div>
    </Link>
  );
}
