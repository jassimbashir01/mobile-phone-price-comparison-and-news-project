'use client';

import { useEffect, useRef, useState } from 'react';

const SLOT_IDS: Record<string, string> = {
  'header-banner': 'REPLACE_WITH_HEADER_BANNER_UNIT_ID',
  'sidebar-top': 'REPLACE_WITH_SIDEBAR_TOP_UNIT_ID',
  'sidebar-bottom': 'REPLACE_WITH_SIDEBAR_BOTTOM_UNIT_ID',
  'phone-detail-incontent-1': 'REPLACE_WITH_PHONE_DETAIL_UNIT_ID',
  'phone-detail-incontent-2': 'REPLACE_WITH_PHONE_DETAIL_UNIT_ID_2',
  'news-article-incontent-1': 'REPLACE_WITH_NEWS_ARTICLE_UNIT_ID',
  'homepage-between-sections': 'REPLACE_WITH_HOMEPAGE_SECTION_UNIT_ID',
  'category-mid-grid': 'REPLACE_WITH_CATEGORY_MID_GRID_UNIT_ID',
  'before-footer': 'REPLACE_WITH_BEFORE_FOOTER_UNIT_ID',
  'anchor-mobile': 'REPLACE_WITH_ANCHOR_UNIT_ID',
};

export function AdSlot({ slot }: { slot: keyof typeof SLOT_IDS }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const pushed = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // start loading slightly before it scrolls into view
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || pushed.current) return;
    pushed.current = true;
    try {
      // @ts-expect-error - adsbygoogle is injected by the AdSense script in the root layout
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense script not loaded yet (e.g. not yet approved) — fail silently.
    }
  }, [visible]);

  const pubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;
  const unitId = SLOT_IDS[slot];

  return (
    <div ref={containerRef} style={{ minHeight: 90 }} data-testid={`ad-${slot}`}>
      {visible && (
        <ins
          className="adsbygoogle block w-full"
          style={{ display: 'block', minHeight: 90 }}
          data-ad-client={pubId}
          data-ad-slot={unitId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}