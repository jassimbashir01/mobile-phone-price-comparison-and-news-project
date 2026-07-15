import { siteUrl } from '@/lib/site';

export async function triggerRevalidate(paths: string[]) {
  try {
    await fetch(`${siteUrl}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-secret": process.env.REVALIDATE_SECRET!,
      },
      body: JSON.stringify({ paths }),
    });
  } catch {
    // Best-effort — ISR still refreshes naturally on its own schedule even
    // if this on-demand call fails for some reason (e.g. during local dev
    // before the dev server has finished starting).
  }
}

export async function pingIndexNow(urls: string[]) {
  const key = process.env.INDEXNOW_KEY;
  if (!key) return;

  try {
    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: new URL(siteUrl).hostname,
        key,
        keyLocation: `${siteUrl}/${key}.txt`,
        urlList: urls.map((u) => `${siteUrl}${u}`),
      }),
    });
  } catch {
    // Best-effort — not calling this is not a failure of the save itself.
  }
}
