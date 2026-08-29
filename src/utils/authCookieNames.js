// Plain string constants only — no imports. This file is shared by
// src/utils/authCookies.js (browser, uses js-cookie/document.cookie) and
// src/middleware.js (Next.js Edge runtime, no `document`, cannot depend on
// js-cookie), so it has to stay dependency-free to be safe in both places.
export const ACCESS_TOKEN_COOKIE = "hoh_access_token";
export const REFRESH_TOKEN_COOKIE = "hoh_refresh_token";
