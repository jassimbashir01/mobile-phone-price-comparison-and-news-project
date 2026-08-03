/// <reference lib="webworker" />

import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import {
  Serwist,
  CacheFirst,
  NetworkFirst,
  StaleWhileRevalidate,
  ExpirationPlugin,
} from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // Version endpoint — MUST be first and network-first, or invalidation
    // silently stops working (a cached version number can never change).
    {
      matcher: ({ url }) => url.pathname === "/api/cache-version",
      handler: new NetworkFirst({
        cacheName: "cache-version",
        networkTimeoutSeconds: 5,
      }),
    },
    // Admin — never cached. Stale admin data would be genuinely harmful.
    {
      matcher: ({ url }) =>
        url.pathname.startsWith("/admin") || url.pathname.startsWith("/login"),
      handler: new NetworkFirst({
        cacheName: "admin-no-cache",
        networkTimeoutSeconds: 10,
      }),
    },
    // Cloudinary images — cache-first, long-lived. A replaced image always
    // gets a new public_id, so a cached URL can never go stale.
    {
      matcher: ({ url }) => url.hostname === "res.cloudinary.com",
      handler: new CacheFirst({
        cacheName: "cloudinary-images",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 1000,
            maxAgeSeconds: 60 * 60 * 24 * 90, // 90 days
            purgeOnQuotaError: true,
          }),
        ],
      }),
    },
    // Next.js build assets — immutable, hashed filenames.
    {
      matcher: ({ url }) => url.pathname.startsWith("/_next/static/"),
      handler: new CacheFirst({
        cacheName: "next-static",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 300,
            maxAgeSeconds: 60 * 60 * 24 * 365,
          }),
        ],
      }),
    },
    // Fonts — immutable.
    {
      matcher: ({ request }) => request.destination === "font",
      handler: new CacheFirst({
        cacheName: "fonts",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 30,
            maxAgeSeconds: 60 * 60 * 24 * 365,
          }),
        ],
      }),
    },
    // Local images (banners, icons) — cache-first.
    {
      matcher: ({ request, url }) =>
        request.destination === "image" && url.origin === self.location.origin,
      handler: new CacheFirst({
        cacheName: "local-images",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 200,
            maxAgeSeconds: 60 * 60 * 24 * 60,
            purgeOnQuotaError: true,
          }),
        ],
      }),
    },
    // Internal API (search, phone lookup) — stale-while-revalidate keeps it
    // instant while still refreshing in the background.
    {
      matcher: ({ url }) => url.pathname.startsWith("/api/"),
      handler: new StaleWhileRevalidate({
        cacheName: "api",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 200,
            maxAgeSeconds: 60 * 60 * 24,
          }),
        ],
      }),
    },
    // Every page navigation — aggressive cache-first, purged on admin edit
    // via the version watcher.
    {
      matcher: ({ request }) => request.mode === "navigate",
      handler: new CacheFirst({
        cacheName: "pages",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 400,
            maxAgeSeconds: 60 * 60 * 24 * 30,
            purgeOnQuotaError: true,
          }),
        ],
      }),
    },
    // Next.js RSC data payloads for client-side navigation.
    {
      matcher: ({ url }) =>
        url.pathname.startsWith("/_next/data/") || url.search.includes("_rsc"),
      handler: new CacheFirst({
        cacheName: "rsc-data",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 400,
            maxAgeSeconds: 60 * 60 * 24 * 30,
            purgeOnQuotaError: true,
          }),
        ],
      }),
    },
    ...defaultCache,
  ],
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher: ({ request }) => request.destination === "document",
      },
    ],
  },
});

// Purge every content cache when the admin changes something.
self.addEventListener("message", (event: ExtendableMessageEvent) => {
  if (event.data?.type === "PURGE_CACHES") {
    event.waitUntil(
      caches
        .keys()
        .then((names) =>
          Promise.all(
            names
              .filter(
                (n) =>
                  ["pages", "rsc-data", "api", "local-images"].includes(n) ||
                  n.startsWith("serwist"),
              )
              .map((n) => caches.delete(n)),
          ),
        ),
    );
  }
});

serwist.addEventListeners();
