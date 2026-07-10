import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - API routes
  // - Next.js internals (_next)
  // - Vercel internals (_vercel)
  // - Files with an extension (e.g. /uploads/img.png, favicon.ico)
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
