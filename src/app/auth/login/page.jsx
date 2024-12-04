"use client";
import { Provider } from "react-redux";
import store from "@/redux/store";
import Login from "@/components/Auth/login";

export default function LoginPage() {
  return (
    <Provider store={store}>
      <Login />
    </Provider>
  );
}
