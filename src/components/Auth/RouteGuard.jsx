"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { logout } from "@/redux/authSlice";
import { getAccessToken, getRefreshToken } from "@/utils/authCookies";

function isTokenValid(token) {
  if (!token) return false;
  try {
    const { exp } = jwtDecode(token);
    return exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

// Client-side gate for private routes. The tokens themselves now live in
// cookies (see src/utils/authCookies.js), read directly here rather than
// via Redux — Redux's copy is only kept as convenient in-memory state and
// isn't guaranteed to be populated yet on first render after a hard
// refresh, while the cookie is available synchronously. src/middleware.js
// checks the same cookies server-side before a protected page is even
// sent to the browser; this component is the client-side backstop that
// additionally verifies the token hasn't expired and keeps Redux's
// `isAuthenticated` flag in sync.
export default function RouteGuard({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    const hasValidSession =
      isAuthenticated &&
      (isTokenValid(accessToken) || isTokenValid(refreshToken));

    if (!hasValidSession) {
      setAuthorized(false);
      if (isAuthenticated) dispatch(logout());
      router.replace("/auth/login");
      return;
    }

    setAuthorized(true);
  }, [isAuthenticated, dispatch, router]);

  if (!authorized) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return children;
}
