// Mirrors HelpAdminNuxt/app/plugins/axiosInstance.ts closely — same
// cookie-based JWT storage, proactive-only refresh (no reactive "401 ->
// force logout" anywhere), and an activity-tracked refresh/logout
// scheduler. Adapted for Redux instead of Pinia and same-origin /api/proxy
// instead of a runtime-config baseURL (see src/app/api/proxy/[...path]/route.js).
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import dayjs from "dayjs";
import { store } from "../redux/store";
import { logout, refreshToken } from "../redux/authSlice";
import { setGlobalLoading } from "../redux/globalSlice";
import { getAccessToken, getRefreshToken } from "./authCookies";

// Same-origin: the browser never talks to the Django backend directly.
// Requests go to this Next.js app's own /api/proxy route, which forwards
// them to the real backend server-side and attaches the X-API-KEY there —
// a plain env var that never ships in the client bundle.
const $axios = axios.create({
  baseURL: "/api/proxy",
  headers: {
    "Content-Type": "application/json",
  },
});

// ----------------------------------------------------------------
// Refresh token logic
// ----------------------------------------------------------------
const refreshClient = axios.create({
  baseURL: "/api/proxy",
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshRequest = null;

const takeRefreshToken = async () => {
  let refresh_token = getRefreshToken();
  if (!refresh_token) return null;
  if (refreshRequest) return refreshRequest;

  if (refresh_token.startsWith('"') && refresh_token.endsWith('"')) {
    refresh_token = refresh_token.slice(1, -1);
  }

  refreshRequest = (async () => {
    try {
      const response = await refreshClient.post("/account/token/refresh/", {
        refresh: refresh_token,
      });

      const { access, refresh } = response.data;
      if (access) {
        store.dispatch(
          refreshToken({
            accessToken: access,
            refreshToken: refresh || refresh_token,
          })
        );
        return { accessToken: access, refreshToken: refresh || refresh_token };
      }
      return null;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return null;
    }
  })();

  try {
    return await refreshRequest;
  } finally {
    refreshRequest = null;
  }
};

// ----------------------------------------------------------------
// Activity tracking (client-only)
// ----------------------------------------------------------------
const LAST_ACTIVE_KEY = "hoh_last_active";
let userIsActive = true;

const setUserActive = () => {
  userIsActive = true;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LAST_ACTIVE_KEY, new Date().toISOString());
    } catch {
      // Private browsing / storage disabled — activity tracking just
      // degrades to "always active", which is the safer direction to fail.
    }
  }
};

if (typeof window !== "undefined") {
  window.addEventListener("mousemove", setUserActive);
  window.addEventListener("keydown", setUserActive);
  window.addEventListener("scroll", setUserActive);
}

// ----------------------------------------------------------------
// Token refresh scheduler
// ----------------------------------------------------------------
const scheduleTokenRefresh = () => {
  if (typeof window === "undefined") return; // Don't run on server

  setInterval(async () => {
    const accessToken = getAccessToken();
    const refresh_token = getRefreshToken();

    if (!accessToken || !refresh_token) return;

    try {
      const decodedAccess = jwtDecode(accessToken);
      const decodedRefresh = jwtDecode(refresh_token);
      const now = dayjs();
      const accessExp = dayjs.unix(decodedAccess.exp);
      const refreshExp = dayjs.unix(decodedRefresh.exp);

      if (accessExp.diff(now, "minute") <= 1 && userIsActive) {
        await takeRefreshToken();
      }

      if (refreshExp.diff(now, "minute") <= 1 && userIsActive) {
        await takeRefreshToken();
      }

      // Auto logout if the refresh token is about to expire while the user
      // has been inactive — an active user who's mid-refresh-window still
      // gets a fresh token above; this only catches someone who genuinely
      // walked away.
      let lastActiveDate = now;
      try {
        const stored = localStorage.getItem(LAST_ACTIVE_KEY);
        if (stored) lastActiveDate = dayjs(stored);
      } catch {
        // Can't read it back — treat as active rather than force a logout
        // off a storage failure.
      }

      if (now.diff(lastActiveDate, "minute") >= 10 && refreshExp.diff(now, "minute") <= 1) {
        store.dispatch(logout());
        userIsActive = false;
      }
    } catch (error) {
      console.error("Token refresh scheduler error:", error);
    }
  }, 30000); // Check every 30 seconds
};

// Call this when your app initializes
scheduleTokenRefresh();

// ----------------------------------------------------------------
// Request interceptor: add auth header
// ----------------------------------------------------------------
$axios.interceptors.request.use(
  async (req) => {
    store.dispatch(setGlobalLoading(true));
    const accessToken = getAccessToken();

    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        const isExpired = dayjs.unix(decoded.exp).diff(dayjs()) < 1;

        if (!isExpired) {
          req.headers.Authorization = `Bearer ${accessToken}`;
        } else {
          const tokens = await takeRefreshToken();
          if (tokens?.accessToken) {
            req.headers.Authorization = `Bearer ${tokens.accessToken}`;
          } else {
            // Don't force a navigation here — this interceptor fires for
            // every request, including background polling, and a hard
            // redirect from inside it was the exact source of a past
            // regression (any unrelated 401 looked like "the whole session
            // is dead"). Clearing the session is enough: src/app/AuthGate.jsx
            // is already watching `isAuthenticated` on every route and
            // redirects on its own the moment this dispatch lands.
            store.dispatch(logout());
          }
        }
      } catch (error) {
        store.dispatch(logout());
      }
    }
    return req;
  },
  (error) => {
    store.dispatch(setGlobalLoading(false));
    return Promise.reject(error);
  }
);

// ----------------------------------------------------------------
// Response interceptor: surface only what the caller can't explain itself
// ----------------------------------------------------------------
$axios.interceptors.response.use(
  (response) => {
    store.dispatch(setGlobalLoading(false));
    return response;
  },
  (error) => {
    store.dispatch(setGlobalLoading(false));

    // Only a generic toast here for failures no page/form is in a position
    // to explain: the network being down (no response at all) or an
    // unexpected server-side error (5xx). Ordinary 4xx responses are left
    // to the calling code, which already turns them into specific,
    // contextual messages (e.g. login's field-level validation errors) —
    // a blanket toast on top of those would just be duplicate noise.
    if (!error.response) {
      store.dispatch({
        type: "notifications/addNotification",
        payload: {
          title: "Error",
          message: "Unable to reach the server. Please check your connection and try again.",
          type: "danger",
        },
      });
    } else if (error.response.status >= 500) {
      store.dispatch({
        type: "notifications/addNotification",
        payload: {
          title: "Error",
          message: "The server ran into a problem processing that request. Please try again shortly.",
          type: "danger",
        },
      });
    }

    return Promise.reject(error);
  }
);

export default $axios;
