import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const protectedPaths = ["/admin", "/profile"];
const authPaths = ["/login", "/signup", "/verify-email"];

function getPathWithoutLocale(pathname: string): string {
  const localePattern = new RegExp(`^/(${routing.locales.join("|")})`);
  return pathname.replace(localePattern, "") || "/";
}

export default function proxy(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const path = getPathWithoutLocale(request.nextUrl.pathname);

  const isProtected = protectedPaths.some(
    (p) => path === p || path.startsWith(`${p}/`),
  );
  const isAuthPage = authPaths.some(
    (p) => path === p || path.startsWith(`${p}/`),
  );

  if (isProtected && !token) {
    const loginUrl = new URL(`/${routing.defaultLocale}/login`, request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(
      new URL(`/${routing.defaultLocale}/profile`, request.url),
    );
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(en|fr)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
