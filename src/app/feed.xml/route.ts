import { getPublishedNews } from '@/queries/news';
import { siteUrl } from '@/lib/site';
import { SITE_NAME } from '@/lib/site-config';

export async function GET() {
  const { news } = await getPublishedNews({ limit: 20 });

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
    <title>${SITE_NAME} News</title>
    <link>${siteUrl}/news</link>
    <description>Latest mobile phone news from ${SITE_NAME}</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}