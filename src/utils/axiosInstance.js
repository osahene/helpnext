import { jwtDecode } from "jwt-decode";
import axios from "axios";
import dayjs from "dayjs";
import { store } from "../redux/store"; // Redux store
import { logout, refreshToken } from "../redux/authSlice"; // Redux actions
import { setGlobalLoading } from "../redux/globalSlice";

const $axios = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || "http://127.0.0.1:8000",
  withCredentials: true,
  headers: { "Content-type": "application/json" },
});

const TakeRefreshToken = async () => {
  const state = store.getState();
  let refresh_token = state.auth.refreshToken;
  if (!refresh_token) return null;

  try {
    if (refresh_token) {
      if (refresh_token.startsWith('"') && refresh_token.endsWith('"')) {
        refresh_token = refresh_token.slice(1, -1);
      }
      const response = await axios.post(
        `${$axios.defaults.baseURL}/account/token/refresh/`,
        {
          refresh: refresh_token,
        }
      );
      const { access, refresh } = response.data;
      if (access) {
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
      }
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.detail || error.message || "Error refreshing token";
    store.dispatch({
      type: "notifications/addNotification",
      payload: {
        title: "Token Error",
        message: errorMessage,
        type: "danger",
      },
    });
    return null;
  }
};

// Axios interceptors for requests and responses
$axios.interceptors.request.use(
  async (req) => {
    store.dispatch(setGlobalLoading(true));
    const state = store.getState();
    let accessToken = state.auth.accessToken;
    if (accessToken) {
      if (accessToken.startsWith('"') && accessToken.endsWith('"')) {
        accessToken = accessToken.slice(1, -1);
      }

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
          } else {
            store.dispatch(logout()); // Clear Redux state
            window.location.href = "/login";
          }
        }
      } catch (error) {
        console.error("Token decoding error:", error);
        store.dispatch(logout());
      }
    }
    return req;
  },
  (error) => {
    store.dispatch(setGlobalLoading(false));
    Promise.reject(error);
  }
);

$axios.interceptors.response.use(
  (response) => {
    store.dispatch(setGlobalLoading(false));
    store.dispatch({
      type: "notifications/addNotification",
      payload: {
        title: "Success",
        message: response.data.message || "Request completed successfully",
        type: "success",
      },
    });
    return response;
  },
  (error) => {
    store.dispatch(setGlobalLoading(false));

    store.dispatch({
      type: "notifications/addNotification",
      payload: {
        title: "Error",
        message:
          error.response?.data?.detail || error.message || "Request failed",
        type: "danger",
      },
    });
    return Promise.reject(error);
  }
);
export default $axios;
