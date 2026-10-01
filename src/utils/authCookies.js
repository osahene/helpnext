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
// of either JWT's own lifetime — so even long after a session was really
// over, the (non-httpOnly, script-readable) cookies kept sitting in the
// browser for up to a month. FALLBACK_DAYS only applies if a token can't be
// decoded (malformed) — short on purpose, since that should never happen
// with a real JWT.
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
//
// Both cookies share ONE browser-side expiry, derived from the refresh
// token's own exp — never from the access token's. The access token's much
// shorter exp (15 minutes server-side) is a purely logical thing the axios
// request interceptor checks at call time via jwtDecode; it must not also
// bound the cookie's physical lifetime in the browser.
//
// This used to key the access-token cookie's expiry off the access token's
// own exp, so the cookie — and the token string inside it — physically
// vanished from the browser ~15 minutes after every login/refresh. Once
// that happened, getAccessToken() started returning null, which skips the
// request interceptor's entire refresh-check branch (`if (accessToken)`)
// and the scheduleTokenRefresh interval's own `if (accessToken &&
// refresh_token)` gate — both require a *truthy* (if stale) access token
// to even look at the still-perfectly-valid refresh token. The visible
// symptom was every session silently becoming unrecoverable ~15 minutes
// in, surfacing on the next page load/refresh as a forced logout. The
// access token's cookie needs to physically outlive its own exp so there's
// still something there for the interceptor to notice is stale and act on.
export function setAuthCookies({ accessToken, refreshToken } = {}) {
  if (typeof document === "undefined") return;

  const expires = refreshToken
    ? expiryDateFor(refreshToken)
    : accessToken
      ? expiryDateFor(accessToken)
      : undefined;

  if (accessToken) {
    Cookies.set(ACCESS_TOKEN_COOKIE, accessToken, { ...cookieOptions, expires });
  } else {
    Cookies.remove(ACCESS_TOKEN_COOKIE, { path: "/" });
  }

  if (refreshToken) {
    Cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, { ...cookieOptions, expires });
  } else {
    Cookies.remove(REFRESH_TOKEN_COOKIE, { path: "/" });
  }
}

export function clearAuthCookies() {
  if (typeof document === "undefined") return;
  Cookies.remove(ACCESS_TOKEN_COOKIE, { path: "/" });
  Cookies.remove(REFRESH_TOKEN_COOKIE, { path: "/" });
}
