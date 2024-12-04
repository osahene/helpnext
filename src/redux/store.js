import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import globalReducer from "./globalSlice"; // Optional: for global state like loading

export const store = configureStore({
  reducer: {
    auth: authReducer,
    global: globalReducer,
  },
});

export default store;
