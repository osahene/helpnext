import { configureStore } from "@reduxjs/toolkit";
import authReducer, { registerUser } from "./authSlice";
import globalReducer from "./globalSlice"; // Optional: for global state like loading

export const store = configureStore({
  reducer: {
    reg: registerUser,
    auth: authReducer,
    global: globalReducer, // Include global reducer if used
  },
});

export default store;
