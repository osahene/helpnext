const isDev = process.env.NODE_ENV !== "production";

// Third-party origins this app actually loads something from in the
// browser. Keep this in sync with what src/utils/push.js (Firebase) and
// @react-oauth/google actually call.
const GOOGLE_OAUTH_ORIGIN = "https://accounts.google.com";
const FIREBASE_CONNECT_ORIGINS =
  "https://firebaseinstallations.googleapis.com https://fcmregistrations.googleapis.com";

// src/app/globals.css and a few Auth components (login/register/OTP)
// @import Google Fonts stylesheets directly (Material Symbols icon fonts,
// Lora) — the CSP has to allow fetching that stylesheet from
// fonts.googleapis.com *and* the actual font files it references, which
// Google always serves from the separate fonts.gstatic.com domain.
const GOOGLE_FONTS_STYLESHEET_ORIGIN = "https://fonts.googleapis.com";
const GOOGLE_FONTS_FILE_ORIGIN = "https://fonts.gstatic.com";

const CSP = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ""} ${GOOGLE_OAUTH_ORIGIN}`,
  `style-src 'self' 'unsafe-inline' ${GOOGLE_FONTS_STYLESHEET_ORIGIN}`,
  `img-src 'self' data: blob: https://lh3.googleusercontent.com https://flagcdn.com`,
  `font-src 'self' data: ${GOOGLE_FONTS_FILE_ORIGIN}`,
  `connect-src 'self' ${FIREBASE_CONNECT_ORIGINS} ${GOOGLE_OAUTH_ORIGIN}`,
  `frame-src ${GOOGLE_OAUTH_ORIGIN}`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `frame-ancestors 'none'`,
]
  .join("; ")
  .replace(/\s+/g, " ")
  .trim();

const BASE_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
      },
    ],
  },
  // Every apiService call in src/utils/axios.js targets a trailing-slash
  // Django URL (APPEND_SLASH). Next's default trailing-slash redirect runs
  // ahead of route matching, so it would 308 /api/proxy/account/foo/ ->
  // /api/proxy/account/foo *before* route.js ever saw the request — losing
  // the slash Django needs and, since axios/fetch auto-follow redirects,
  // silently corrupting every proxied call. This opts the whole app out of
  // that auto-redirect so route.js's own pathname handling is authoritative.
  skipTrailingSlashRedirect: true,
  async headers() {
    return [
      // Applies everywhere, including the Firebase service worker file —
      // none of these interfere with it.
      { source: "/:path*", headers: BASE_HEADERS },
      // CSP is scoped away from /firebase-messaging-sw.js: that file runs
      // outside the Next.js bundle and loads the Firebase SDK from
      // gstatic.com via importScripts() (see the file itself for why), which
      // this page-level script-src intentionally doesn't allow.
      {
        source: "/((?!firebase-messaging-sw.js$).*)",
        headers: [{ key: "Content-Security-Policy", value: CSP }],
      },
    ];
  },
};

export default nextConfig;
