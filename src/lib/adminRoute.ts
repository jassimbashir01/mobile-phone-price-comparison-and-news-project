// Single source of truth for the admin route prefix — used by proxy.ts
// (server) to decide what to rewrite/block, and by every admin
// component/page (client or server) to generate correct internal links.
export const ADMIN_ROUTE_PREFIX = process.env.NEXT_PUBLIC_ADMIN_ROUTE || 'admin';

export function adminPath(path: string = ''): string {
  return `/${ADMIN_ROUTE_PREFIX}${path}`;
}