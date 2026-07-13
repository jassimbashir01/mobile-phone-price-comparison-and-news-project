export function buildOrganizationJsonLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PKPhones',
    url: siteUrl,
  };
}

export function buildWebsiteJsonLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'PKPhones',
    url: siteUrl,
  };
}