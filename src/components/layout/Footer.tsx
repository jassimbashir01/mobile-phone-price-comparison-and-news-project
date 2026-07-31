import Link from "next/link";
import { getFooterBrands } from "@/queries/settings";
import { getFooterBanner } from "@/queries/settings";
import { FooterBanner } from "./FooterBanner";
import { PRICE_RANGES, FEATURE_TYPES } from "@/lib/constants";
import { SITE_NAME } from "@/lib/site-config";

const FOOTER_PRICE_SLUGS = [
  "10000-15000",
  "15000-25000",
  "25000-35000",
  "35000-45000",
  "45000-55000",
  "55000-105000",
];

export async function Footer() {
  const [footerBrands, footerBanner] = await Promise.all([
    getFooterBrands(),
    getFooterBanner(),
  ]);
  const footerPriceRanges = FOOTER_PRICE_SLUGS.map((slug) =>
    PRICE_RANGES.find((p) => p.slug === slug),
  ).filter((p): p is (typeof PRICE_RANGES)[number] => Boolean(p));

  return (
    <footer className="mt-12 border-t border-border bg-ink text-white/80">
      <FooterBanner banner={footerBanner} />
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-10 text-sm md:grid-cols-4">
        <div>
          <h3 className="mb-3 font-display font-semibold text-white">
            Top Brands
          </h3>
          <ul className="space-y-1.5">
            {footerBrands.map((b) => (
              <li key={b.id}>
                <Link href={`/brand/${b.slug}`} className="hover:text-accent">
                  {b.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-display font-semibold text-white">
            Popular Price Ranges
          </h3>
          <ul className="space-y-1.5">
            {footerPriceRanges.map((p) => (
              <li key={p.slug}>
                <Link href={`/price/${p.slug}`} className="hover:text-accent">
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-display font-semibold text-white">
            By Feature
          </h3>
          <ul className="space-y-1.5">
            {FEATURE_TYPES.slice(0, 6).map((f) => (
              <li key={f.slug}>
                <Link href={`/type/${f.slug}`} className="hover:text-accent">
                  {f.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-display font-semibold text-white">
            Company
          </h3>
          <ul className="space-y-1.5">
            <li>
              <Link href="/contact" className="hover:text-accent">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/advertise" className="hover:text-accent">
                Advertise With Us
              </Link>
            </li>
            <li>
              <Link href="/offers" className="hover:text-accent">
                Deals & Offers
              </Link>
            </li>
            <li>
              <Link href="/media-kit" className="hover:text-accent">
                Media Kit
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-accent">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/news" className="hover:text-accent">
                Latest News
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/50">
        <p>
          © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
        <p className="mt-1">
          Prices are collected from local markets and official sources and may
          vary by city and retailer. Always confirm the final price before
          purchase.
        </p>
      </div>
    </footer>
  );
}
