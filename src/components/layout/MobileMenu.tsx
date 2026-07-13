'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/price/all-mobiles', label: 'Brands' },
  { href: '/news', label: 'News' },
  { href: '/compare', label: 'Compare Phone' },
  { href: '/contact', label: 'Contact' },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle menu"
        className="p-2 text-ink"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {open && (
        <nav className="absolute inset-x-0 top-full z-40 border-t border-border bg-white shadow-md">
          <ul className="flex flex-col p-2">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded px-3 py-2 text-sm hover:bg-primary-light"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}