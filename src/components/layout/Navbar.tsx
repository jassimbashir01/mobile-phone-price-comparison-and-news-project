import Link from "next/link";
import { getActiveBrands } from "@/queries/brands";
import { SearchBar } from "./SearchBar";
import { MobileMenu } from "./MobileMenu";
import { Sidebar } from "./Sidebar";
import { BrandsDropdown } from "./BrandsDropdown";
import {
  SITE_NAME_PRIMARY_PART,
  SITE_NAME_ACCENT_PART,
} from "@/lib/site-config";

export async function Navbar() {
  const brands = await getActiveBrands();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 lg:justify-start">
        <Link href="/" className="font-display text-xl font-bold text-primary">
          {SITE_NAME_PRIMARY_PART}
          <span className="text-accent">{SITE_NAME_ACCENT_PART}</span>
        </Link>

        <SearchBar className="hidden flex-1 lg:block" />

        <nav className="ml-auto hidden items-center gap-6 text-sm font-medium lg:flex">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <BrandsDropdown brands={brands} />
          <Link href="/news" className="hover:text-primary">
            News
          </Link>
          <Link href="/compare" className="hover:text-primary">
            Compare Phone
          </Link>
          <Link href="/offers" className="hover:text-primary">
            Deals &amp; Offers
          </Link>
          <Link href="/contact" className="hover:text-primary">
            Contact
          </Link>
        </nav>

        <MobileMenu>
          <Sidebar />
        </MobileMenu>
      </div>

      <div className="border-t border-border px-4 py-2 lg:hidden">
        <SearchBar />
      </div>

      <nav className="flex flex-wrap items-center justify-center gap-4 border-t border-border px-4 py-2 text-sm font-medium lg:hidden">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <Link href="/news" className="hover:text-primary">
          News
        </Link>
        <Link href="/compare" className="hover:text-primary">
          Compare
        </Link>
        <Link href="/offers" className="hover:text-primary">
          Offers
        </Link>
        <Link href="/contact" className="hover:text-primary">
          Contact
        </Link>
      </nav>
    </header>
  );
}
