import Link from 'next/link';
import { getActiveBrands } from '@/queries/brands';
import { SearchBar } from './SearchBar';
import { MobileMenu } from './MobileMenu';
import { ChevronDown } from 'lucide-react';

export async function Navbar() {
  const brands = await getActiveBrands();

  return (
    <header className="relative border-b border-border bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3">
        <Link href="/" className="font-display text-xl font-bold text-primary">
          PK<span className="text-accent">Phones</span>
        </Link>

        <SearchBar className="hidden flex-1 md:block" />

        <nav className="ml-auto hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/" className="hover:text-primary">Home</Link>
          <div className="group relative">
            <button className="flex items-center gap-1 hover:text-primary">
              Brands <ChevronDown size={14} />
            </button>
            <div className="invisible absolute left-0 top-full z-40 w-48 rounded-md border border-border bg-white py-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
              {brands.map((b) => (
                <Link
                  key={b.id}
                  href={`/brand/${b.slug}`}
                  className="block px-4 py-1.5 text-sm hover:bg-primary-light"
                >
                  {b.name}
                </Link>
              ))}
            </div>
          </div>
          <Link href="/news" className="hover:text-primary">News</Link>
          <Link href="/compare" className="hover:text-primary">Compare Phone</Link>
          <Link href="/contact" className="hover:text-primary">Contact</Link>
        </nav>
        <MobileMenu />
      </div>

      <div className="border-t border-border px-4 py-2 md:hidden">
        <SearchBar />
      </div>
    </header>
  );
}