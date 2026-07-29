import Link from "next/link";
import { getActiveBrands } from "@/queries/brands";
import {
  PRICE_RANGES,
  RAM_OPTIONS,
  SCREEN_SIZES,
  CAMERA_OPTIONS,
  FEATURE_TYPES,
  OS_TYPES,
  NETWORK_TYPES,
} from "@/lib/constants";

function CategoryBlock({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details open={defaultOpen} className="group border-b border-border py-3">
      <summary className="flex items-center justify-between text-sm font-semibold text-ink">
        {title}
        <span className="text-ink/40 group-open:hidden">+</span>
        <span className="hidden text-ink/40 group-open:inline">−</span>
      </summary>
      <ul className="mt-2 space-y-1 pl-1 text-sm text-ink/80">{children}</ul>
    </details>
  );
}

export async function Sidebar() {
  const allBrands = await getActiveBrands();
  const brands = allBrands.filter((b) => b.show_in_sidebar);

  return (
    <aside className="w-full shrink-0 rounded-lg border border-border bg-white p-4 lg:w-64">
      <Link
        href="/stolen-phone-guide"
        className="mb-3 block rounded-md bg-primary-light px-3 py-2 text-sm font-semibold text-primary-dark"
      >
        📱 Stolen Phone Guide
      </Link>

      <CategoryBlock title="Network">
        {NETWORK_TYPES.map((n) => (
          <li key={n.slug}>
            <Link href={`/mobiles/${n.slug}`} className="hover:text-primary">
              {n.label}
            </Link>
          </li>
        ))}
      </CategoryBlock>

      <CategoryBlock title="Brands" defaultOpen>
        {brands.map((b) => (
          <li key={b.id}>
            <Link href={`/brand/${b.slug}`} className="hover:text-primary">
              {b.name}
            </Link>
          </li>
        ))}
      </CategoryBlock>

      <CategoryBlock title="Price">
        {PRICE_RANGES.map((p) => (
          <li key={p.slug}>
            <Link href={`/price/${p.slug}`} className="hover:text-primary">
              {p.label}
            </Link>
          </li>
        ))}
      </CategoryBlock>

      <CategoryBlock title="RAM">
        {RAM_OPTIONS.map((r) => (
          <li key={r.slug}>
            <Link href={`/ram/${r.slug}`} className="hover:text-primary">
              {r.label}
            </Link>
          </li>
        ))}
      </CategoryBlock>

      <CategoryBlock title="Screen Size">
        {SCREEN_SIZES.map((s) => (
          <li key={s.slug}>
            <Link href={`/screen/${s.slug}`} className="hover:text-primary">
              {s.label}
            </Link>
          </li>
        ))}
      </CategoryBlock>

      <CategoryBlock title="Camera">
        {CAMERA_OPTIONS.map((c) => (
          <li key={c.slug}>
            <Link href={`/camera/${c.slug}`} className="hover:text-primary">
              {c.label}
            </Link>
          </li>
        ))}
      </CategoryBlock>

      <CategoryBlock title="Type">
        {FEATURE_TYPES.map((f) => (
          <li key={f.slug}>
            <Link href={`/type/${f.slug}`} className="hover:text-primary">
              {f.label}
            </Link>
          </li>
        ))}
      </CategoryBlock>

      <CategoryBlock title="Operating System">
        {OS_TYPES.map((o) => (
          <li key={o.slug}>
            <Link href={`/os/${o.slug}`} className="hover:text-primary">
              {o.label}
            </Link>
          </li>
        ))}
      </CategoryBlock>
    </aside>
  );
}
