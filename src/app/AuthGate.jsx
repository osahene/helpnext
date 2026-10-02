"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";

// Mirrors HelpAdminNuxt/app/middleware/auth.global.ts — ONE global check
// instead of src/middleware.js (a separate server-side gate) plus a
// per-page RouteGuard wrapper. Those two kept drifting out of sync with
// each other (a path missing its leading slash in one but not the other,
// a redirect racing redux-persist's rehydration) and caused real
// regressions on their own, independent of whatever the "real" bug of the
// moment was — one place deciding this is simpler to get right and keep
// right.
//
// Next.js's App Router has no direct equivalent of defineNuxtRouteMiddleware
// (there's no single hook that runs on every client-side navigation with
// access to app state the way Nuxt's universal route middleware does), so
// this is that same logic ported into one client component mounted once,
// high in the tree (see app/layout.js), instead of a true middleware file.
const PUBLIC_ROUTES = [
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/confirmPassword",
  "/auth/forgottenPassword",
  "/auth/successConfirm",
  "/auth/verifyEmail",
  "/auth/verifyPhoneNumber",
  "/auth/verifyPhoneNumberOTP",
  "/emergencylines",
  "/guestInvite",
  "/legal/delete",
  "/legal/privacy",
  "/legal/terms",
  "/verifyEmerg",
];

// Authenticated visitors get bounced off these specifically (not just "any
// public route") — there's no reason to show a logged-in user a login or
// registration form.
const AUTH_ONLY_ROUTES = ["/auth/login", "/auth/register"];

function matches(pathname, routes) {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export default function AuthGate({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const isPublicRoute = matches(pathname, PUBLIC_ROUTES);
  const isAuthOnlyRoute = matches(pathname, AUTH_ONLY_ROUTES);
  const shouldRedirectAway =
    (isAuthenticated && isAuthOnlyRoute) || (!isAuthenticated && !isPublicRoute);

  useEffect(() => {
    if (isAuthenticated && isAuthOnlyRoute) {
      router.replace("/contact");
    } else if (!isAuthenticated && !isPublicRoute) {
      router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [pathname, isAuthenticated, isAuthOnlyRoute, isPublicRoute, router]);

  // Renders nothing of the actual page while a redirect is about to fire —
  // without this, the protected page's real content (or the login form, for
  // an already-authenticated visitor) would flash on screen for one frame
  // before the effect above navigates away from it.
  if (shouldRedirectAway) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return children;
}
