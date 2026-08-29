import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer, createTransform } from "redux-persist";
import authReducer from "./authSlice";
import globalReducer from "./globalSlice";
import contactReducer from "./userSlice";
import { setAuthCookies, clearAuthCookies } from "../utils/authCookies";

// Auth tokens used to live in this persisted blob (-> localStorage), the
// weakest storage option on the platform. They now live in cookies (see
// src/utils/authCookies.js) instead, kept in sync by
// authCookieSyncMiddleware below. This transform strips
// accessToken/refreshToken out of the auth slice on the way to
// localStorage (inbound) AND on the way back out of it (outbound) — the
// outbound strip matters so a stale token left over in an existing user's
// localStorage from before this change never gets rehydrated back into
// the app. Everything else in the auth slice (first_name, isAuthenticated,
// etc — plain display/UI state, not sensitive) keeps persisting as before.
const authTransform = createTransform(
  (inboundState) => {
    const { accessToken, refreshToken, ...rest } = inboundState || {};
    return rest;
  },
  (outboundState) => {
    const { accessToken, refreshToken, ...rest } = outboundState || {};
    return rest;
  },
  { whitelist: ["auth"] }
);

const rootPersistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "contact"], // Only persist the auth slice
  timeout: null, // No timeout
  transforms: [authTransform],
};

const rootReducer = combineReducers({
  auth: authReducer,
  global: globalReducer,
  contact: contactReducer,
});
const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

// The one "write" path for src/utils/authCookies.js: mirrors Redux's
// auth.accessToken/auth.refreshToken into cookies whenever they change, no
// matter which action changed them (login, google login, email/OTP
// verification, token refresh, logout, ...) — so none of those call sites
// need to know about cookies directly.
const authCookieSyncMiddleware = (storeAPI) => (next) => (action) => {
  const prevAuth = storeAPI.getState().auth;
  const result = next(action);
  const nextAuth = storeAPI.getState().auth;

  if (
    nextAuth &&
    (nextAuth.accessToken !== prevAuth?.accessToken ||
      nextAuth.refreshToken !== prevAuth?.refreshToken)
  ) {
    if (nextAuth.accessToken || nextAuth.refreshToken) {
      setAuthCookies({
        accessToken: nextAuth.accessToken,
        refreshToken: nextAuth.refreshToken,
      });
    } else {
      clearAuthCookies();
    }
  }

  return result;
};

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"], // Ignore redux-persist actions
      },
    }).concat(authCookieSyncMiddleware),
});

export const persistor = persistStore(store);

export default persistor;
