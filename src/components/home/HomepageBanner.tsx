import Link from "next/link";
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
          {/* Real art direction — a genuinely different, purpose-cropped
              image per breakpoint, not a CSS crop of one wide image. This
              is what <picture>/<source media> exists for: the browser only
              downloads whichever image actually matches, never both. */}
          <picture>
            <source
              media="(min-width: 640px)"
              srcSet="/homepage-banner-default.jpg"
            />
            <img
              src="/homepage-banner-mobile.jpg"
              alt="MobileWala — Compare Mobile Phone Prices, Specs & News in Pakistan"
              className="h-full w-full object-cover"
              // Native browser priority hints, since this bypasses
              // next/image's automatic preload injection for this
              // specific art-directed case.
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
