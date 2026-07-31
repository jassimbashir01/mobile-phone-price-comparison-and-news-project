/** @type {import('next-sitemap').IConfig} */

if (!process.env.NEXT_PUBLIC_SITE_URL) {
  throw new Error(
    'NEXT_PUBLIC_SITE_URL is not set — next-sitemap needs it to generate absolute URLs. Check .env.local (local) or your Vercel project environment variables (production).'
  );
}

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
export const generateRobotsTxt = true;
export const exclude = ['/admin', '/admin/*', '/login', '/compare', '/search', '/media-kit', '/api/*'];
export const robotsTxtOptions = {
  policies: [
    {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/admin/*', '/login', '/api/*'],
    },
  ],
  additionalSitemaps: [`${process.env.NEXT_PUBLIC_SITE_URL}/sitemap-images.xml`],
};
export const changefreq = 'daily';
export const priority = 0.7;