"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { logout } from "@/redux/authSlice";

function isTokenValid(token) {
  if (!token) return false;
  try {
    const clean =
      token.startsWith('"') && token.endsWith('"') ? token.slice(1, -1) : token;
    const { exp } = jwtDecode(clean);
    return exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

// Client-side gate for private routes. Auth lives only in redux-persist
// (localStorage), so this can't be done in Next.js middleware — there's
// no cookie/session for the server to check.
export default function RouteGuard({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const refreshToken = useSelector((state) => state.auth.refreshToken);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
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
  }, [isAuthenticated, accessToken, refreshToken, dispatch, router]);

  if (!authorized) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return children;
}
