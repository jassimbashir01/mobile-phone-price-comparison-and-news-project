"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { Brand } from "@/types/database";

// getActiveBrands returns Brand plus a derived hasNewPhone flag — true when
// the brand has a phone released within NEW_WINDOW_MONTHS. It's computed at
// read time rather than stored, so it can never drift out of sync with the
// per-phone badge.
type BrandWithNew = Brand & { hasNewPhone?: boolean };

export function BrandsDropdown({ brands }: { brands: BrandWithNew[] }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-1 hover:text-primary"
      >
        Brands <ChevronDown size={14} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-40 max-h-80 w-48 overflow-y-auto rounded-md border border-border bg-white py-2 shadow-lg"
        >
          {brands.map((b) => (
            <Link
              key={b.id}
              href={`/brand/${b.slug}`}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-1.5 px-4 py-1.5 text-sm hover:bg-primary-light"
            >
              {b.name}
              {b.hasNewPhone && (
                <span className="rounded bg-primary px-1 text-[8px] font-bold uppercase text-white">
                  New
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
