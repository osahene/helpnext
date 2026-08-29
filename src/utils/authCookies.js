// ─────────────────────────────────────────────────────────────────────────
// Cookie-based storage for auth tokens (access + refresh).
//
// Tokens used to live only in redux-persist -> localStorage, the weakest
// auth storage option available (readable by any script on the page, no
// path/expiry scoping, and no way for the server to see it before a page
// renders). They now live in cookies instead:
//   - src/redux/store.js's `authCookieSyncMiddleware` is the one write
//     path — it mirrors Redux's auth.accessToken/auth.refreshToken into
//     these cookies whenever a login/refresh/logout action changes them.
//   - src/utils/axiosInstance.js and src/components/Auth/RouteGuard.jsx
//     read the token values from here directly (not from Redux — Redux's
//     copy is only kept as convenient in-memory state for the tab).
//   - src/middleware.js also reads these same cookies (via the shared
//     name constants in authCookieNames.js) to gate protected routes on
//     the server, before a protected page is even sent to the browser —
//     something localStorage could never support.
//
// These are plain, non-httpOnly cookies (they're written from client-side
// JS, not set by the Django backend as Set-Cookie headers), so this isn't
// a defense against XSS reading the token — nothing short of a backend
// change to httpOnly cookies would be. What this DOES fix: no more
// unbounded localStorage persistence, real expiry, and — via
// src/middleware.js — actual server-checkable route protection.
// ─────────────────────────────────────────────────────────────────────────
import Cookies from "js-cookie";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "./authCookieNames";

const cookieOptions = {
  path: "/",
  sameSite: "lax",
  // Local dev runs over plain http; only require the Secure flag once
  // the app is actually served over https.
  secure: process.env.NODE_ENV === "production",
  expires: 30, // days
};

export function getAccessToken() {
  if (typeof document === "undefined") return null;
  return Cookies.get(ACCESS_TOKEN_COOKIE) || null;
}

export function getRefreshToken() {
  if (typeof document === "undefined") return null;
  return Cookies.get(REFRESH_TOKEN_COOKIE) || null;
}

// Writes whichever of accessToken/refreshToken are provided; clears the
// corresponding cookie for any that are missing/falsy.
export function setAuthCookies({ accessToken, refreshToken } = {}) {
  if (typeof document === "undefined") return;

  if (accessToken) {
    Cookies.set(ACCESS_TOKEN_COOKIE, accessToken, cookieOptions);
  } else {
    Cookies.remove(ACCESS_TOKEN_COOKIE, { path: "/" });
  }

  if (refreshToken) {
    Cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, cookieOptions);
  } else {
    Cookies.remove(REFRESH_TOKEN_COOKIE, { path: "/" });
  }
}

export function clearAuthCookies() {
  if (typeof document === "undefined") return;
  Cookies.remove(ACCESS_TOKEN_COOKIE, { path: "/" });
  Cookies.remove(REFRESH_TOKEN_COOKIE, { path: "/" });
}
