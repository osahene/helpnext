"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";

import TakeRefreshToken from "./api/axiosConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.clear();
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("access_token", JSON.stringify(userData.access));
    localStorage.setItem("refresh_token", JSON.stringify(userData.refresh));
    localStorage.setItem("first_name", JSON.stringify(userData.first_name));
    localStorage.setItem("last_name", JSON.stringify(userData.last_name));
    localStorage.setItem(
      "userPhoneNumber",
      JSON.stringify(userData.phone_number)
    );
    // scheduleTokenCheck();
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedInUser = localStorage.getItem("user");
      const accessToken = localStorage.getItem("access_token");

      if (loggedInUser && accessToken) {
        setUser(JSON.parse(loggedInUser));
        setIsAuthenticated(true);
      }

      // Schedule token refresh
      const scheduleTokenRefresh = async () => {
        try {
          const user = jwtDecode(accessToken);
          const timeUntilExpiry = dayjs.unix(user.exp).diff(dayjs());

          if (timeUntilExpiry > 0) {
            setTimeout(async () => {
              await TakeRefreshToken();
              scheduleTokenRefresh();
            }, timeUntilExpiry - 60000);
          }
        } catch (error) {
          console.error("Error decoding token or refreshing:", error);
        }
      };

      if (accessToken) {
        scheduleTokenRefresh();
      }

      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
