// Next.js App Router sitemap convention (served at /sitemap.xml).
// Only lists routes that are genuinely public and stable — not the
// protected /contact portal (RouteGuard + src/middleware.js gate it
// behind login), not /notifications, and not token-based one-time links
// like /guestInvite/* or /verifyEmerg/* (those aren't meaningful search
// landing pages).
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://helpoohelp.com";

const routes = [
  "",
  "/emergencylines",
  "/legal/privacy",
  "/legal/terms",
  "/legal/delete",
  "/auth/login",
  "/auth/register",
];

export default function sitemap() {
  const lastModified = new Date();
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
  }));
}
