"use client";

import { useEffect } from "react";

const STORAGE_KEY = "mw-cache-version";

export function CacheVersionWatcher() {
  useEffect(() => {
    async function check() {
      try {
        const res = await fetch("/api/cache-version", { cache: "no-store" });
        if (!res.ok) return;
        const { version } = await res.json();
        const stored = localStorage.getItem(STORAGE_KEY);

        if (stored && stored !== String(version)) {
          // navigator.serviceWorker.controller is null on the first load
          // after install — using .ready/.active is reliable instead.
          const reg = await navigator.serviceWorker?.ready;
          reg?.active?.postMessage({ type: "PURGE_CACHES" });
          localStorage.setItem(STORAGE_KEY, String(version));
          window.location.reload();
          return;
        }
        localStorage.setItem(STORAGE_KEY, String(version));
      } catch {
        // Offline or endpoint unreachable — nothing to do
      }
    }

    check();
    const interval = setInterval(check, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return null;
}
