import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import authReducer from "./authSlice";
import globalReducer from "./globalSlice";
import contactReducer from "./userSlice";

// Persist configuration for auth and contact
const authPersistConfig = {
  key: "auth",
  storage,
};

const contactPersistConfig = {
  key: "contact",
  storage,
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  global: globalReducer, // Non-persisted reducer
  contact: persistReducer(contactPersistConfig, contactReducer),
});

const persistedReducer = persistReducer({ key: "root", storage }, rootReducer);

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
