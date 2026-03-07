import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;

  // Completely block the admin dashboard and generation tools in production environments
  if (
    process.env.NODE_ENV === "production" &&
    (currentPath.startsWith("/admin") ||
      currentPath.startsWith("/api/generate-resource"))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Only protect /admin and subroutes
  if (currentPath.startsWith("/admin")) {
    // Let the login page flow through without cookie check, to avoid redirect loops
    if (currentPath === "/admin/login") {
      return NextResponse.next();
    }

    const adminAuthCookie = request.cookies.get("admin-auth");

    // If the cookie doesn't exist or isn't our expected "true", deny access
    if (!adminAuthCookie || adminAuthCookie.value !== "true") {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Config to explicitly target routes matching for performance
export const config = {
  matcher: ["/admin/:path*", "/api/generate-resource"],
};
