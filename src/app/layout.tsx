import type { Metadata } from 'next';
import Script from 'next/script';
import { spaceGrotesk, inter } from './fonts';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AdSlot } from '@/components/ads/AdSlot';
import { AnchorAd } from '@/components/ads/AnchorAd';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildOrganizationJsonLd } from '@/lib/seo';
import { siteUrl } from '@/lib/site';
import { SITE_NAME } from '@/lib/site-config';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME} — Mobile Prices & News in Pakistan`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Compare mobile phone prices in Pakistan, browse full specifications, and read the latest phone news.',
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_PK',
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: {
    types: { 'application/rss+xml': '/feed.xml' },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;
  const adsenseReady = pubId && !pubId.includes('0000000000000000');

  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <head>
        {adsenseReady && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body>
        <JsonLd data={buildOrganizationJsonLd(siteUrl)} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-2">
          <AdSlot slot="header-banner" />
        </div>
        <main id="main-content">{children}</main>
        <div className="mx-auto max-w-7xl px-4 py-2">
          <AdSlot slot="before-footer" />
        </div>
        <Footer />
        <AnchorAd />
      </body>
    </html>
  );
}