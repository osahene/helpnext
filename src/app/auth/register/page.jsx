"use client";
import { Provider } from "react-redux";
import store from "@/redux/store";
import Register from "@/components/Auth/register";

export default function RegisterPage() {
  return (
    <Provider store={store}>
      <Register />
    </Provider>
  );
}
