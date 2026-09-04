import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "./utils/authCookieNames";

// Now that auth tokens live in cookies (see src/utils/authCookies.js)
// instead of only redux-persist/localStorage, the server can finally see
// whether a request is authenticated before a protected page even
// renders — something the old localStorage-only setup could never
// support (see the comment that used to be in
// src/components/Auth/RouteGuard.jsx).
//
// This is a *replacement in addition to*, not instead of, RouteGuard:
// RouteGuard still runs client-side to catch token expiry (this check is
// deliberately kept simple/fast) and to keep Redux's `isAuthenticated`
// flag in sync. Route prefixes here should match whatever RouteGuard wraps
// (currently src/app/contact/layout.jsx and src/app/notifications/layout.jsx).
const PROTECTED_PATH_PREFIXES = ["/contact", "/notifications"];

function isTokenValid(token) {
  if (!token) return false;
  try {
    const { exp } = jwtDecode(token);
    return typeof exp === "number" && exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
  if (!isProtected) return NextResponse.next();

  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!isTokenValid(accessToken) && !isTokenValid(refreshToken)) {
    const loginUrl = new URL("/auth/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/contact/:path*", "/notifications/:path*"],
};
