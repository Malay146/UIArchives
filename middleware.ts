import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;

  // Only protect /admin and subroutes
  if (currentPath.startsWith("/admin")) {
    const adminAuthCookie = request.cookies.get("admin-auth");

    // If the cookie doesn't exist or isn't our expected "true", deny access
    if (!adminAuthCookie || adminAuthCookie.value !== "true") {
      // Allow direct access to /admin/login underneath to avoid loops
      if (currentPath === "/admin/login") {
        return NextResponse.next();
      }

      // Instead of redirecting to login, REWRITE to the login page
      // so the browser URL states uiarchives.com/admin/add-resource
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.rewrite(loginUrl);
    } else {
      // If they are already authenticated, stop them from hitting /admin/login directly
      if (currentPath === "/admin/login") {
        return NextResponse.redirect(
          new URL("/admin/add-resource", request.url),
        );
      }
    }
  }

  return NextResponse.next();
}

// Config to explicitly target only /admin routes matching for performance
export const config = {
  matcher: ["/admin/:path*"],
};
