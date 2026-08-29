// Next.js App Router robots convention (served at /robots.txt).
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://helpoohelp.com";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // Protected user portal — gated behind login by RouteGuard +
          // src/middleware.js, nothing useful for a crawler to index.
          "/contact",
          "/notifications",
          // Token-based one-time links, not search-landing content.
          "/guestInvite",
          "/verifyEmerg",
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
