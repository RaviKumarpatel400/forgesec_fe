import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  try {
    const session = request.cookies.get("sessionid");
    const pathname = request.nextUrl.pathname;
    const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/subscription") || pathname.startsWith("/configuration") || pathname.startsWith("/scan") || pathname.startsWith("/os-scanner") || pathname.startsWith("/api-scanner") || pathname.startsWith("/network-scanner") || pathname.startsWith("/ai-scanner") || pathname.startsWith("/reports");

    if (session && pathname === "/login") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (!session && isProtectedRoute) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
      const response = NextResponse.redirect(loginUrl);
      response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      response.headers.set("Pragma", "no-cache");
      response.headers.set("Expires", "0");
      return response;
    }

    if (session && isProtectedRoute) {
      const response = NextResponse.next();
      response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      response.headers.set("Pragma", "no-cache");
      response.headers.set("Expires", "0");
      return response;
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Proxy error:", error);
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    return response;
  }
}

export const config = {
  matcher: [
    "/((?!api|backend|_next/static|_next/image|favicon.ico|.*\\..*).*)"
  ]
};
