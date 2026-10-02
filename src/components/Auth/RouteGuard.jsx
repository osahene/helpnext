"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { logout } from "@/redux/authSlice";
import { getAccessToken, getRefreshToken } from "@/utils/authCookies";
import AuthRequiredPrompt from "./AuthRequiredPrompt";

function isTokenValid(token) {
  if (!token) return false;
  try {
    const { exp } = jwtDecode(token);
    return exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

// Client-side gate for private routes. The tokens themselves live in
// cookies (see src/utils/authCookies.js), read directly here rather than
// via Redux — Redux's copy is only kept as convenient in-memory state.
// src/middleware.js checks the same cookies server-side before a protected
// page is even sent to the browser; this component is the client-side
// backstop.
//
// This used to gate on a `useEffect` that computed validity async and
// called `router.replace("/auth/login")` once it decided the session was
// invalid — an extra render cycle (and, worse, a real navigation) between
// mount and the actual decision, which is exactly the kind of timing gap a
// stale/mid-rehydration read could fall into and misfire on. PersistGate
// (see src/app/reduxProvider.js) already guarantees redux-persist has
// finished rehydrating before *anything* wrapped in it — including this
// component — gets to render at all, so there's nothing left to wait for:
// `isAuthenticated` and the cookies are both read synchronously during
// render, and the decision is made immediately, every render, with no
// window where a real session could be misjudged invalid.
//
// It also no longer navigates anywhere on failure. It renders
// AuthRequiredPrompt in place — the same "please log in or register"
// content components/Cards/cardTrigger.jsx already shows for an
// unauthenticated action — instead of yanking the user to a different
// page. An authenticated visitor is completely unaffected by this; only
// what an unauthenticated one sees here has changed.
export default function RouteGuard({ children }) {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  const hasValidSession =
    isAuthenticated && (isTokenValid(accessToken) || isTokenValid(refreshToken));

  // Redux still thinks it's authenticated but neither token is actually
  // valid anymore (e.g. the refresh token finally expired) — clear that
  // stale flag. A dispatch during render isn't allowed, so this one bit of
  // cleanup stays in an effect; it doesn't gate what gets rendered above.
  useEffect(() => {
    if (isAuthenticated && !hasValidSession) {
      dispatch(logout());
    }
  }, [isAuthenticated, hasValidSession, dispatch]);

  if (!hasValidSession) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen px-4" style={{ background: "#F8FAFF" }}>
        <div
          style={{
            background: "#fff",
            borderRadius: "28px",
            width: "100%",
            maxWidth: "400px",
            padding: "32px 20px",
            boxShadow: "0 24px 80px rgba(15,27,62,0.08)",
          }}
        >
          <AuthRequiredPrompt />
        </div>
      </div>
    );
  }

  return children;
}
