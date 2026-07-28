"use client";

import { useEffect, useRef, useState } from "react";

const SLOT_IDS: Record<string, string> = {
  "header-banner": "REPLACE_WITH_HEADER_BANNER_UNIT_ID",
  "sidebar-top": "REPLACE_WITH_SIDEBAR_TOP_UNIT_ID",
  "sidebar-bottom": "REPLACE_WITH_SIDEBAR_BOTTOM_UNIT_ID",
  "phone-detail-incontent-1": "REPLACE_WITH_PHONE_DETAIL_UNIT_ID",
  "phone-detail-incontent-2": "REPLACE_WITH_PHONE_DETAIL_UNIT_ID_2",
  "phone-detail-multiplex": "REPLACE_WITH_PHONE_DETAIL_MULTIPLEX_UNIT_ID",
  "news-article-incontent-1": "REPLACE_WITH_NEWS_ARTICLE_UNIT_ID",
  "news-article-multiplex": "REPLACE_WITH_NEWS_ARTICLE_MULTIPLEX_UNIT_ID",
  "homepage-between-sections": "REPLACE_WITH_HOMEPAGE_SECTION_UNIT_ID",
  "category-mid-grid": "REPLACE_WITH_CATEGORY_MID_GRID_UNIT_ID",
  "category-mid-grid-2": "REPLACE_WITH_CATEGORY_MID_GRID_2_UNIT_ID",
  "before-footer": "REPLACE_WITH_BEFORE_FOOTER_UNIT_ID",
  "anchor-mobile": "REPLACE_WITH_ANCHOR_UNIT_ID",
  "compare-below-table": "REPLACE_WITH_COMPARE_UNIT_ID",
  "offers-mid-grid": "REPLACE_WITH_OFFERS_MID_GRID_UNIT_ID",
};

// Multiplex units use AdSense's "autorelaxed" format — a native grid of
// related-content-style cards, distinct from the "auto" display format
// used everywhere else. Listing here rather than passing a prop from every
// call site keeps each usage a one-liner: <AdSlot slot="..." />.
const MULTIPLEX_SLOTS = new Set([
  "phone-detail-multiplex",
  "news-article-multiplex",
]);

// Shared "is this ad genuinely ready to serve" check — single source of
// truth, reused by AdSlot itself and by any wrapper component (e.g.
// AnchorAd) that needs to know before rendering its own chrome around it.
export function isAdSlotConfigured(slot: keyof typeof SLOT_IDS): boolean {
  const pubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;
  const unitId = SLOT_IDS[slot];
  return (
    Boolean(pubId) &&
    !pubId!.includes("0000000000000000") &&
    !unitId.startsWith("REPLACE_WITH_")
  );
}

export function AdSlot({ slot }: { slot: keyof typeof SLOT_IDS }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const pushed = useRef(false);

  const pubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;
  const unitId = SLOT_IDS[slot];
  const isMultiplex = MULTIPLEX_SLOTS.has(slot);
  const isConfigured = isAdSlotConfigured(slot);

  // Don't attempt to render or push a real ad slot until both the AdSense
  // account is genuinely configured and this specific unit's placeholder
  // ID has been replaced with a real one — prevents sending malformed ad
  // requests to Google using literal "REPLACE_WITH_..." strings, which
  // risks policy flags on the account.
  useEffect(() => {
    if (!isConfigured || !containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isConfigured]);

  useEffect(() => {
    if (!isConfigured || !visible || pushed.current) return;
    pushed.current = true;
    try {
      // @ts-expect-error - adsbygoogle is injected by the AdSense script in the root layout
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense script not loaded yet — fail silently.
    }
  }, [isConfigured, visible]);

  if (!isConfigured) return null;

  return (
    <div
      ref={containerRef}
      style={{ minHeight: isMultiplex ? 250 : 90 }}
      data-testid={`ad-${slot}`}
    >
      {visible && (
        <ins
          className="adsbygoogle block w-full"
          style={{ display: "block", minHeight: isMultiplex ? 250 : 90 }}
          data-ad-client={pubId}
          data-ad-slot={unitId}
          data-ad-format={isMultiplex ? "autorelaxed" : "auto"}
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
