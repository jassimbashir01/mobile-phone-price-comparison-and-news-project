import { getPublishedNews } from '@/queries/news';

export async function GET() {
  const { news } = await getPublishedNews({ limit: 20 });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const items = news
    .map(
      (n) => `
    <item>
      <title><![CDATA[${n.title}]]></title>
      <link>${siteUrl}/news/${n.slug}</link>
      <guid>${siteUrl}/news/${n.slug}</guid>
      <description><![CDATA[${n.excerpt ?? ''}]]></description>
      <pubDate>${n.published_at ? new Date(n.published_at).toUTCString() : ''}</pubDate>
    </item>`
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>PKPhones News</title>
    <link>${siteUrl}/news</link>
    <description>Latest mobile phone news from PKPhones</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}