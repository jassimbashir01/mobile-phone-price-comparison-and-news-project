import { siteUrl } from "@/lib/site";

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
    // Best-effort — ISR still refreshes naturally on its own schedule even
    // if this on-demand call fails for some reason (e.g. during local dev
    // before the dev server has finished starting). Still log it, since a
    // silent failure here means pages quietly stop updating with zero trace.
    console.error("triggerRevalidate threw for paths:", paths, err);
  }
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
