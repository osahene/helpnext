import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import authReducer from "./authSlice";
import globalReducer from "./globalSlice";
import contactReducer from "./userSlice";

const rootPersistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "contact"], // Only persist the auth slice
  timeout: null, // No timeout
};

const rootReducer = combineReducers({
  auth: authReducer, // No nested persist
  global: globalReducer,
  contact: contactReducer,
});
const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

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
