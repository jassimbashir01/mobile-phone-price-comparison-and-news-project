import { SITE_NAME } from '@/lib/site-config';
import type { PhoneImage } from '@/types/database';

export function buildOrganizationJsonLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: siteUrl,
  };
}

export function buildWebsiteJsonLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: siteUrl,
  };
}

export function buildBreadcrumbJsonLd(items: { label: string; href?: string }[], siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${siteUrl}${item.href}` } : {}),
    })),
  };
}

export function buildItemListJsonLd(phones: { name: string; slug: string }[], siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: phones.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${siteUrl}/phone/${p.slug}`,
      name: p.name,
    })),
  };
}

export function buildProductJsonLd(
  phone: { name: string; seo_description: string | null; price_pkr: number | null; images: PhoneImage[] },
  siteUrl: string,
  cloudName: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: phone.name,
    description: phone.seo_description ?? phone.name,
    image: phone.images.map(
      (img) => `https://res.cloudinary.com/${cloudName}/image/upload/${img.cloudinary_public_id}`
    ),
    ...(phone.price_pkr != null
      ? {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'PKR',
            price: phone.price_pkr,
            availability: 'https://schema.org/InStock',
          },
        }
      : {}),
  };
}