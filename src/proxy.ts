import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const protectedPaths = ["/admin", "/profile"];
const authPaths = ["/login", "/signup", "/verify-email"];

function getPathWithoutLocale(pathname: string): string {
  const localePattern = new RegExp(`^/(${routing.locales.join("|")})(?=/|$)`);
  return pathname.replace(localePattern, "") || "/";
}

export default function proxy(request: NextRequest) {
  console.log("[PROXY] Intercepting request for:", request.nextUrl.pathname);
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
    console.log("[PROXY] Redirect unauthenticated:", {
      from: request.nextUrl.pathname,
      to: loginUrl.pathname + loginUrl.search,
    });
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && token) {
    const profileUrl = new URL(
      `/${routing.defaultLocale}/profile`,
      request.url,
    );
    console.log("[PROXY] Redirect authenticated auth-page:", {
      from: request.nextUrl.pathname,
      to: profileUrl.pathname + profileUrl.search,
    });
    return NextResponse.redirect(profileUrl);
  }

  const response = intlMiddleware(request);
  const rewrite = response.headers.get("x-middleware-rewrite");
  const location = response.headers.get("location");
  if (rewrite || location) {
    console.log("[PROXY] intlMiddleware output:", {
      request: request.nextUrl.pathname,
      rewrite,
      location,
    });
  }
  return response;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
