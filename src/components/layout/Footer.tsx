import Link from "next/link";
import { getActiveBrands } from "@/queries/brands";
import { PRICE_RANGES, FEATURE_TYPES } from "@/lib/constants";

export async function Footer() {
  const brands = await getActiveBrands();
  const topBrands = brands.slice(0, 6);

  return (
    <footer className="mt-12 border-t border-border bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-10 text-sm md:grid-cols-4">
        <div>
          <h3 className="mb-3 font-display font-semibold text-ink">
            Top Brands
          </h3>
          <ul className="space-y-1.5 text-ink/70">
            {topBrands.map((b) => (
              <li key={b.id}>
                <Link href={`/brand/${b.slug}`} className="hover:text-primary">
                  {b.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-display font-semibold text-ink">
            Popular Price Ranges
          </h3>
          <ul className="space-y-1.5 text-ink/70">
            {PRICE_RANGES.slice(1, 7).map((p) => (
              <li key={p.slug}>
                <Link href={`/price/${p.slug}`} className="hover:text-primary">
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-display font-semibold text-ink">
            By Feature
          </h3>
          <ul className="space-y-1.5 text-ink/70">
            {FEATURE_TYPES.slice(0, 6).map((f) => (
              <li key={f.slug}>
                <Link href={`/type/${f.slug}`} className="hover:text-primary">
                  {f.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-display font-semibold text-ink">Company</h3>
          <ul className="space-y-1.5 text-ink/70">
            <li>
              <Link href="/privacy-policy" className="hover:text-primary">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-primary">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/stolen-phone-guide" className="hover:text-primary">
                Stolen Phone Guide
              </Link>
            </li>
            <li>
              <Link href="/news" className="hover:text-primary">
                Latest News
              </Link>
            </li>
            <li>
              <Link href="/compare" className="hover:text-primary">
                Compare Phones
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border px-4 py-4 text-center text-xs text-ink/50">
        <p>© {new Date().getFullYear()} PKPhones. All rights reserved.</p>
        <p className="mt-1">
          Prices are collected from local markets and official sources and may
          vary by city and retailer. Always confirm the final price before
          purchase.
        </p>
      </div>
    </footer>
  );
}
