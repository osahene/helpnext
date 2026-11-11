// Next.js App Router robots convention (served at /robots.txt).
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://helpoohelp.com";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // Protected user portals — gated behind login by
          // src/app/AuthGate.jsx, nothing useful for a crawler to index.
          "/contact",
          "/notifications",
          "/profile",
          // Token-based one-time links, not search-landing content.
          "/guestInvite",
          "/verifyEmerg",
          // QR-code redirector for printed posters — always 302s elsewhere,
          // nothing for a crawler to index.
          "/get",
          // Mid-flow auth steps that depend on in-progress session state
          // (OTP/email verification, password reset) — not useful as
          // standalone search results.
          "/auth/confirmPassword",
          "/auth/forgottenPassword",
          "/auth/successConfirm",
          "/auth/verifyEmail",
          "/auth/verifyPhoneNumber",
          "/auth/verifyPhoneNumberOTP",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
