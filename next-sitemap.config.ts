import type { IConfig } from 'next-sitemap';

const config: IConfig = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
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

export default config;