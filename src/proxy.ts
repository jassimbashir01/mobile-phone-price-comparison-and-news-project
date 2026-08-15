import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export default async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // Excludes static assets, images, and API routes.
    //
    // API routes are excluded because updateSession runs a Supabase auth
    // check on every matched request. /api/cache-version is polled every
    // five minutes by the PWA and needs no session at all — it was spending
    // over a second in middleware for nothing. The routes that do need
    // auth (/api/upload, /api/revalidate) enforce it themselves via
    // requireRole or a secret comparison, not via middleware.
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
