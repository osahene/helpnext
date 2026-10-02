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

// Only a refresh token the backend explicitly rejects (SimpleJWT's
// {"code": "token_not_valid"} — expired, blacklisted by a logout, or
// tampered with) ends the session. Everything else — no connection, a
// timeout, a cold-started backend, a 5xx — just fails this one attempt and
// the next request tries again. Mirrors helpFlutter's AuthInterceptor:
// users stay signed in until they log out themselves.
const isDeadRefreshToken = (error) => {
  const status = error?.response?.status;
  const code = error?.response?.data?.code;
  return (status === 401 || status === 403) && code === "token_not_valid";
};

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
      if (isDeadRefreshToken(error)) {
        // No navigation from here — src/app/AuthGate.jsx watches
        // `isAuthenticated` and redirects on its own once this lands.
        store.dispatch(logout());
      }
      return null;
    }
  })();

  try {
    return await refreshRequest;
  } finally {
    refreshRequest = null;
  }
};

const isExpiringWithin = (token, minutes) => {
  try {
    return dayjs.unix(jwtDecode(token).exp).diff(dayjs(), "minute") < minutes;
  } catch {
    // Undecodable/malformed — treat as expired so it goes through the
    // refresh path instead of being sent as-is.
    return true;
  }
};

// ----------------------------------------------------------------
// Token refresh scheduler — keeps the access token fresh in the
// background. Never logs anyone out: there is deliberately no inactivity
// timeout (someone opening the site mid-emergency must not meet a login
// form), and a refresh token the server rejects is handled in
// takeRefreshToken() above.
// ----------------------------------------------------------------
const scheduleTokenRefresh = () => {
  if (typeof window === "undefined") return; // Don't run on server

  setInterval(async () => {
    if (!getRefreshToken()) return;
    const accessToken = getAccessToken();
    if (!accessToken || isExpiringWithin(accessToken, 2)) {
      await takeRefreshToken();
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
    let accessToken = getAccessToken();

    // A missing access cookie with a refresh cookie still present is just
    // an access token that needs renewing, not a signed-out user.
    if ((!accessToken && getRefreshToken()) || (accessToken && isExpiringWithin(accessToken, 0))) {
      const tokens = await takeRefreshToken();
      accessToken = tokens?.accessToken ?? null;
      // If that refresh failed transiently the request goes out
      // unauthenticated and fails on its own; the next one retries.
    }

    if (accessToken) {
      req.headers.Authorization = `Bearer ${accessToken}`;
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
