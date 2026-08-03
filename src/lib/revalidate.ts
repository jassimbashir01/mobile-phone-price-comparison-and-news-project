import { siteUrl } from "@/lib/site";

import { createAdminClient } from "@/lib/supabase/admin";

async function bumpCacheVersion() {
  try {
    const supabase = createAdminClient();
    await supabase
      .from("site_settings")
      .upsert(
        { key: "cache_version", value: { version: Date.now() } },
        { onConflict: "key" },
      );
  } catch (err) {
    console.error("bumpCacheVersion failed:", err);
  }
}

export async function triggerRevalidate(paths: string[]) {
  try {
    const res = await fetch(`${siteUrl}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-secret": process.env.REVALIDATE_SECRET!,
      },
      body: JSON.stringify({ paths }),
    });
    if (!res.ok) {
      console.error(
        `triggerRevalidate failed (${res.status}) for paths:`,
        paths,
      );
    }
  } catch (err) {
    console.error("triggerRevalidate threw for paths:", paths, err);
  }
  // Every admin content change bumps the version, which causes every
  // installed PWA client to purge its page cache on next check.
  await bumpCacheVersion();
}

export async function pingIndexNow(urls: string[]) {
  const key = process.env.INDEXNOW_KEY;
  if (!key) return;

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: new URL(siteUrl).hostname,
        key,
        keyLocation: `${siteUrl}/${key}.txt`,
        urlList: urls.map((u) => `${siteUrl}${u}`),
      }),
    });
    if (!res.ok) {
      console.error(`pingIndexNow failed (${res.status}) for urls:`, urls);
    }
  } catch (err) {
    // Best-effort — not calling this is not a failure of the save itself.
    console.error("pingIndexNow threw for urls:", urls, err);
  }
}
