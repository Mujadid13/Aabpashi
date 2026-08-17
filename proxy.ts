import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";
const secretKeyUint8 = new TextEncoder().encode(SECRET_KEY);

const publicApiRoutes = ["/api/auth", "/api/openapi", "/api/docs", "/api/sync", "/api/health"];

// NOTE: API key authentication is NOT possible in middleware because file system access is not allowed in the Edge Runtime.
// API key authentication must be handled in API routes using `export const runtime = 'nodejs';`.

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ 1. JWT validation for protected API routes
  if (
    pathname.startsWith("/api") &&
    !publicApiRoutes.some((route) => pathname.startsWith(route))
  ) {
    try {
      const token = req.cookies.get("token")?.value;
      if (!token) {
        return NextResponse.json(
          { error: "Unauthorized - No valid authentication provided" },
          { status: 401 }
        );
      }

      const { payload } = await jwtVerify(token, secretKeyUint8);
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-user-id", payload.userId as string);
      requestHeaders.set("x-user-phone", payload.phone as string);

      return NextResponse.next({ request: { headers: requestHeaders } });
    } catch (err) {
      console.error("JWT error:", err);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // ✅ 2. Skip internationalization for API routes
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // ✅ 3. Handle "/" root redirect with preferred locale from cookies
  if (pathname === "/") {
    const cookieLocale = req.cookies.get("NEXT_LOCALE")?.value;
    const detectedLocale = cookieLocale || routing.defaultLocale || "ur";

    const url = req.nextUrl.clone();
    url.pathname = `/${detectedLocale}`;
    return NextResponse.redirect(url);
  }

  // ✅ 4. Run i18n detection for non-API routes
  return intlMiddleware(req);
}

export const config = {
  matcher: ["/", "/(en|ur)?", "/((?!_next|.*\\..*).*)", "/api/:path*"],
};
