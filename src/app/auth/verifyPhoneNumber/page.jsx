"use client";
import { Provider } from "react-redux";
import store from "@/redux/store";
import VerifyPhoneNumber from "@/components/Auth/verifyPhoneNumber";

export default function VerifyPhoneNumberPage() {
  return (
    <Provider store={store}>
      <VerifyPhoneNumber />
    </Provider>
  );
}
