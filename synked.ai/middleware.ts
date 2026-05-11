import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const allowedRoutes = [
  "/dashboard",
  "/admin",
  "/sign-in",
  "/business-audit",
  "/api/auth",
  "/api/audit",
  "/api/admin",
  "/api/user",
  "/contact",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow auth-related and dashboard routes
  const isAllowed = allowedRoutes.some((route) => pathname.startsWith(route));

  if (!isAllowed) {
    // Redirect all disabled routes to sign-in
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Protect dashboard behind auth
  if (pathname.startsWith("/dashboard")) {
    const sessionCookie = req.cookies.get("better-auth.session_token");
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  // Protect admin behind auth
  if (pathname.startsWith("/admin")) {
    const sessionCookie = req.cookies.get("better-auth.session_token");
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  // Protect admin API behind auth
  if (pathname.startsWith("/api/admin")) {
    const sessionCookie = req.cookies.get("better-auth.session_token");
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Protect user API behind auth
  if (pathname.startsWith("/api/user")) {
    const sessionCookie = req.cookies.get("better-auth.session_token");
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
