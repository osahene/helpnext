"use client";
import { Provider } from "react-redux";
import store from "@/redux/store";
import VerifyEmail from "@/components/Auth/verifyEmail";

export default function VerifyEmailPage() {
  return (
    <Provider store={store}>
      <VerifyEmail />
    </Provider>
  );
}
