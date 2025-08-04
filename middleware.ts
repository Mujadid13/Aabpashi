import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";
const secretKeyUint8 = new TextEncoder().encode(SECRET_KEY);

const publicApiRoutes = ["/api/auth"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ 1. Token validation for protected API routes
  if (
    pathname.startsWith("/api") &&
    !publicApiRoutes.some((route) => pathname.startsWith(route))
  ) {
    try {
      const token = req.cookies.get("token")?.value;
      if (!token) {
        return NextResponse.json(
          { error: "Unauthorized - No token" },
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

  // ✅ 2. Handle "/" root redirect with preferred locale from cookies
  if (pathname === "/") {
    const cookieLocale = req.cookies.get("NEXT_LOCALE")?.value;
    const detectedLocale = cookieLocale || routing.defaultLocale || "ur";

    const url = req.nextUrl.clone();
    url.pathname = `/${detectedLocale}`;
    return NextResponse.redirect(url);
  }

  // ✅ 3. Run i18n detection
  return intlMiddleware(req);
}

export const config = {
  matcher: ["/", "/(en|ur)?", "/((?!_next|.*\\..*).*)", "/api/:path*"],
};
