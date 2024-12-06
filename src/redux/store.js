import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import authReducer from "./authSlice";
import globalReducer from "./globalSlice"; // Optional: for global state like loading

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: authReducer,
    global: globalReducer,
    persistReduce: persistedReducer,
  },
});

export const persistor = persistStore(store);

export default store;
