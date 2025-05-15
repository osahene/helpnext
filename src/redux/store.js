import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import authReducer from "./authSlice";
import globalReducer from "./globalSlice";
import contactReducer from "./userSlice";
// import notificationReducer from "./notificationSlice";
// Persist configuration for auth and contact
// const authPersistConfig = {
//   key: "auth",
//   storage,
//   whitelist: ["accessToken", "refreshToken", "isAuthenticated"],
// };
const rootPersistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Only persist the auth slice
  // Optional: add timeout to prevent initial state issues
  timeout: null, // No timeout
};

// const contactPersistConfig = {
//   key: "contact",
//   storage,
// };

// const rootReducer = combineReducers({
//   auth: authReducer,
//   auth: persistReducer(authPersistConfig, authReducer),
//   global: globalReducer, // Non-persisted reducer
//   contact: persistReducer(contactPersistConfig, contactReducer),
//   // notifications: notificationReducer,
//   // contact: contactReducer,
// });

// const persistConfig = {
//   key: "root",
//   storage,
//   whitelist: ["auth"], // Only persist the `auth` state
// };
const rootReducer = combineReducers({
  auth: authReducer, // No nested persist
  global: globalReducer,
  contact: contactReducer,
});
const persistedReducer = persistReducer(rootPersistConfig, rootReducer);
// const persistedReducer = persistReducer({ key: "root", storage }, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"], // Ignore redux-persist actions
      },
    }),
});

export const persistor = persistStore(store);

export default persistor;
