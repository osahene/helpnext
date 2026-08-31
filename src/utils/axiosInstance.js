import { jwtDecode } from "jwt-decode";
import axios from "axios";
import dayjs from "dayjs";
import { store } from "../redux/store"; // Redux store
import { logout, refreshToken } from "../redux/authSlice"; // Redux actions
import { setGlobalLoading } from "../redux/globalSlice";
import { getAccessToken, getRefreshToken } from "./authCookies";

const $axios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL
    ? process.env.NEXT_PUBLIC_BASE_URL
    : "http://127.0.0.1:8000",
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
    "X-API-KEY": process.env.FRONTEND_API_KEY,
  },
});

// Returns { access_token, refresh_token } on success, null when the refresh
// token itself is genuinely invalid/expired (the server said so explicitly —
// a 401/403 from the refresh endpoint), or the string "network-error" for
// anything else (timeout, offline, 5xx, a cold-started Render instance
// being slow to wake up). That distinction matters to every caller below:
// only a real null means "this session is actually over."
const TakeRefreshToken = async (retriesLeft = 1) => {
  let refresh_token = getRefreshToken();
  if (!refresh_token) return null;

  if (refresh_token.startsWith('"') && refresh_token.endsWith('"')) {
    refresh_token = refresh_token.slice(1, -1);
  }

  try {
    const response = await axios.post(
      `${$axios.defaults.baseURL}/account/token/refresh/`,
      {
        refresh: refresh_token,
      }
    );
    const { access, refresh } = response.data;
    if (!access) return null;

    store.dispatch(
      refreshToken({
        accessToken: access,
        refreshToken: refresh || refresh_token,
      })
    ); // Dispatch Redux action
    return {
      access_token: access,
      refresh_token: refresh || refresh_token,
    };
  } catch (error) {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      // The server explicitly rejected this refresh token — it's genuinely
      // dead (expired/blacklisted/revoked). No amount of retrying helps.
      return null;
    }

    // Everything else (network blip, timeout, 502/503 during a cold start)
    // is not proof the refresh token is bad. Retry once before giving up —
    // logging out a session that was still perfectly valid, just because
    // one HTTP call happened to fail, is worse than a brief extra delay.
    if (retriesLeft > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return TakeRefreshToken(retriesLeft - 1);
    }
    return "network-error";
  }
};

const scheduleTokenRefresh = () => {
  if (typeof window === "undefined") return; // Don't run on server

  setInterval(async () => {
    const accessToken = getAccessToken();
    const refresh_token = getRefreshToken();

    if (accessToken && refresh_token) {
      try {
        const user = jwtDecode(accessToken);
        // .diff() defaults to milliseconds — this used to compare against
        // 60 of those (a 60ms buffer, not the 1-minute one the comment
        // described), so the 30s poll below almost never caught a token
        // before it expired. 'second' makes this an actual 60s buffer.
        const isExpired = dayjs.unix(user.exp).diff(dayjs(), "second") < 60;

        if (isExpired) {
          await TakeRefreshToken();
        }
      } catch (error) {
        console.error("Token refresh scheduling error:", error);
      }
    }
  }, 30000); // Check every 30 seconds
};

// Call this when your app initializes
scheduleTokenRefresh();

$axios.interceptors.request.use(
  async (req) => {
    store.dispatch(setGlobalLoading(true));
    let accessToken = getAccessToken();
    if (accessToken) {
      try {
        const user = jwtDecode(accessToken);
        const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

        if (!isExpired) {
          req.headers.Authorization = `Bearer ${accessToken}`;
        } else {
          // Refresh the token if expired
          const tokens = await TakeRefreshToken();
          if (tokens && tokens.access_token) {
            req.headers.Authorization = `Bearer ${tokens.access_token}`;
          } else if (tokens === "network-error") {
            // Not a real auth failure — the refresh token is still good for
            // all we know, the network/server just didn't cooperate this
            // time. Let this one request go out without a fresh token
            // (it'll likely 401 once) rather than tearing down a session
            // that's still valid; the next request gets another chance.
          } else {
            store.dispatch(logout()); // Clear Redux state
            window.location.href = "/auth/login";
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

$axios.interceptors.response.use(
  (response) => {
    store.dispatch(setGlobalLoading(false));
    return response;
  },
  (error) => {
    store.dispatch(setGlobalLoading(false));

    // error.response is undefined when the request never reached the
    // server (timeout, offline, DNS failure, CORS, etc) — every access
    // below must be optional-chained so a plain network failure can't
    // itself throw inside this interceptor.
    const message =
      error.message ||
      error.response?.detail ||
      error.response?.data ||
      error.response?.data?.detail ||
      error.response?.data?.data ||
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.response?.data?.data?.message ||
      error.response?.data?.data?.detail ||
      error.response?.data?.data?.error ||
      (error.response
        ? "Request failed"
        : "Network error. Please check your connection and try again.");

    store.dispatch({
      type: "notifications/addNotification",
      payload: {
        title: "Error",
        message,
        type: "danger",
      },
    });
    return Promise.reject(error);
  }
);
export default $axios;
