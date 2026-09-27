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
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "./authCookieNames";

const cookieOptions = {
  path: "/",
  sameSite: "lax",
  // Local dev runs over plain http; only require the Secure flag once
  // the app is actually served over https.
  secure: process.env.NODE_ENV === "production",
};

// These cookies used to carry a blanket `expires: 30` (30 days) regardless
// of the JWT's own lifetime — so even after an access token expired server-
// side, the (non-httpOnly, script-readable) cookie holding it kept sitting
// in the browser for up to a month. That's the single biggest exposure
// window here: anything that can read document.cookie (e.g. an XSS) had a
// month, not minutes, to grab a still-fresh-looking token. This decodes
// each token's own `exp` claim and expires the cookie at that exact moment
// instead, so the cookie's lifetime can never outlive the token it holds.
// FALLBACK_DAYS only applies if a token can't be decoded (malformed) —
// short on purpose, since that should never happen with a real JWT.
const FALLBACK_DAYS = 1;

function expiryDateFor(token) {
  try {
    const { exp } = jwtDecode(token);
    if (typeof exp === "number") return new Date(exp * 1000);
  } catch {
    // fall through to the fallback below
  }
  return new Date(Date.now() + FALLBACK_DAYS * 24 * 60 * 60 * 1000);
}

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
    Cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
      ...cookieOptions,
      expires: expiryDateFor(accessToken),
    });
  } else {
    Cookies.remove(ACCESS_TOKEN_COOKIE, { path: "/" });
  }

  if (refreshToken) {
    Cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
      ...cookieOptions,
      expires: expiryDateFor(refreshToken),
    });
  } else {
    Cookies.remove(REFRESH_TOKEN_COOKIE, { path: "/" });
  }
}

export function clearAuthCookies() {
  if (typeof document === "undefined") return;
  Cookies.remove(ACCESS_TOKEN_COOKIE, { path: "/" });
  Cookies.remove(REFRESH_TOKEN_COOKIE, { path: "/" });
}
