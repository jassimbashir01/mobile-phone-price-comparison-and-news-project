/** @type {import('next-sitemap').IConfig} */

if (!process.env.NEXT_PUBLIC_SITE_URL) {
  throw new Error(
    'NEXT_PUBLIC_SITE_URL is not set — next-sitemap needs it to generate absolute URLs. Check .env.local (local) or your Vercel project environment variables (production).'
  );
}

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  generateRobotsTxt: true,
  exclude: ['/admin', '/admin/*', '/login', '/compare', '/search', '/api/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/login', '/api/*'],
      },
    ],
  },
  changefreq: 'daily',
  priority: 0.7,
};