"use client";
const { default: VerifyEmail } = require("@/components/Auth/verifyEmail");
const { default: store } = require("@/redux/store");
const { Provider } = require("react-redux");

export default function VerifyEmailPage() {
  return (
    <Provider store={store}>
      <VerifyEmail />
    </Provider>
  );
}
