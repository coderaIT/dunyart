import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from "./lib/admin-session";

const intlMiddleware = createMiddleware(routing);

function matchAdminPath(pathname: string) {
  const match = pathname.match(/^\/(ar|tr|en)\/admin(\/.*)?$/);
  if (!match) return null;
  const locale = match[1]!;
  const rest = match[2] ?? "";
  const isLogin = rest === "/login" || rest === "/login/";
  return { locale, isLogin };
}

export default async function middleware(request: NextRequest) {
  const admin = matchAdminPath(request.nextUrl.pathname);

  if (admin) {
    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const authenticated = await verifyAdminSessionToken(token);

    if (!admin.isLogin && !authenticated) {
      const url = request.nextUrl.clone();
      url.pathname = `/${admin.locale}/admin/login`;
      return NextResponse.redirect(url);
    }

    if (admin.isLogin && authenticated) {
      const url = request.nextUrl.clone();
      url.pathname = `/${admin.locale}/admin`;
      return NextResponse.redirect(url);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - API routes
  // - Next.js internals (_next)
  // - Vercel internals (_vercel)
  // - Files with an extension (e.g. /uploads/img.png, favicon.ico)
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
