"use client";
import { Provider } from "react-redux";
import store from "@/redux/store";
import VerifyPhoneNumberOTP from "@/components/Auth/verifyPhoneNumberOTP";

export default function VerifyPhoneNumberOTPPage() {
  return (
    <Provider store={store}>
      <VerifyPhoneNumberOTP />
    </Provider>
  );
}
