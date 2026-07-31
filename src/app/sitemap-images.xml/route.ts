import { supabase } from "@/lib/supabase/public";
import { siteUrl } from "@/lib/site";

export const revalidate = 21600; // matches phone page ISR cadence

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  const { data: phones, error } = await supabase
    .from("phones")
    .select("slug, name, images:phone_images(cloudinary_public_id)");

  if (error) {
    return new Response("Error generating image sitemap", { status: 500 });
  }

  const urlEntries = (phones ?? [])
    .filter((p) => p.images && p.images.length > 0)
    .map((p) => {
      const imageTags = p.images
        .map(
          (img: { cloudinary_public_id: string }) => `
    <image:image>
      <image:loc>https://res.cloudinary.com/${cloudName}/image/upload/${img.cloudinary_public_id}</image:loc>
      <image:title>${escapeXml(p.name)}</image:title>
    </image:image>`,
        )
        .join("");
      return `
  <url>
    <loc>${siteUrl}/phone/${p.slug}</loc>${imageTags}
  </url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urlEntries}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
