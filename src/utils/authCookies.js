// ─────────────────────────────────────────────────────────────────────────
// Cookie-based storage for auth tokens (access + refresh).
//
// Tokens used to live only in redux-persist -> localStorage, the weakest
// auth storage option available (readable by any script on the page, no
// path/expiry scoping). They now live in cookies instead:
//   - src/redux/store.js's `authCookieSyncMiddleware` is the one write
//     path — it mirrors Redux's auth.accessToken/auth.refreshToken into
//     these cookies whenever a login/refresh/logout action changes them.
//   - src/utils/axiosInstance.js and src/app/AuthGate.jsx read the token
//     values from here directly (not from Redux — Redux's copy is only
//     kept as convenient in-memory state for the tab).
//
// These are plain, non-httpOnly cookies (they're written from client-side
// JS, not set by the Django backend as Set-Cookie headers), so this isn't
// a defense against XSS reading the token — nothing short of a backend
// change to httpOnly cookies would be. What this DOES fix is unbounded
// localStorage persistence.
//
// Both cookies share one plain, fixed expiry — deliberately NOT derived
// from either JWT's own `exp` claim. An earlier version decoded the token
// to set the cookie's expiry to that exact moment, which for the access
// token (a short-lived 15 minutes server-side) meant the cookie physically
// vanished from the browser ~15 minutes after every login. Once
// getAccessToken() started returning null, the request interceptor's
// entire refresh-check branch was skipped — it never got to look at the
// still-perfectly-valid refresh token — and every session silently became
// unrecoverable ~15 minutes in. A plain fixed duration, matching
// HelpAdminNuxt's cookies, avoids that whole class of bug: the cookie's
// lifetime in the browser and the token's cryptographic validity are two
// different things, and tying them together is what kept causing this.
// ─────────────────────────────────────────────────────────────────────────
import Cookies from "js-cookie";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "./authCookieNames";

// Matches the backend's USER_REFRESH_TOKEN_LIFETIME (EmergencyBackend
// settings). Every token refresh rewrites these cookies, so like the
// token itself this is a sliding window — a user only has to sign in again
// after this long with no visits at all, or after logging out themselves.
const COOKIE_EXPIRY_DAYS = 90;

const cookieOptions = {
  path: "/",
  sameSite: "lax",
  // Local dev runs over plain http; only require the Secure flag once
  // the app is actually served over https.
  secure: process.env.NODE_ENV === "production",
  expires: COOKIE_EXPIRY_DAYS,
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
