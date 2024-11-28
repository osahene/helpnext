import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { Store } from "react-notifications-component";

const $axios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000",
  withCredentials: true,
  headers: { "Content-type": "application/json" },
});

const TakeRefreshToken = async () => {
  let refresh_token = localStorage.getItem("refresh_token");
  if (!refresh_token) return null;

  try {
    if (refresh_token.startsWith('"') && refresh_token.endsWith('"')) {
      refresh_token = refresh_token.slice(1, -1);
    }
    const response = await axios.post(
      `${$axios.defaults.baseURL}/account/token/refresh/`,
      { refresh: refresh_token }
    );
    const { access, refresh } = response.data;
    if (access) {
      $axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;
      localStorage.setItem("access_token", access);
      if (refresh) {
        localStorage.setItem("refresh_token", refresh);
      }
      return { access_token: access, refresh_token: refresh || refresh_token };
    }
  } catch (error) {
    Store.addNotification({
      title: "Token Error",
      message: "Error refreshing token",
      type: "danger",
      insert: "top",
      container: "top-right",
      dismiss: { duration: 3000, onScreen: true },
    });
    return null;
  }
};

$axios.interceptors.request.use(
  async (req) => {
    let accessToken = localStorage.getItem("access_token");
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
          const tokens = await TakeRefreshToken();
          if (tokens && tokens.access_token) {
            req.headers.Authorization = `Bearer ${tokens.access_token}`;
          } else {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            window.location.href = "/login";
          }
        }
      } catch (error) {
        console.error("Token decoding error:", error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    }
    return req;
  },
  (error) => Promise.reject(error)
);

$axios.interceptors.response.use(
  (response) => {
    Store.addNotification({
      title: "Success",
      message: response.data.message || "Request completed successfully",
      type: "success",
      insert: "top",
      container: "top-right",
      dismiss: { duration: 2000, onScreen: true },
    });
    return response;
  },
  (error) => {
    Store.addNotification({
      title: "Error",
      message:
        error.response?.data?.detail || error.message || "Request failed",
      type: "danger",
      insert: "top",
      container: "top-right",
      dismiss: { duration: 3000, onScreen: true },
    });
    return Promise.reject(error);
  }
);

export default $axios;
