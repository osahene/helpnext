"use client";
const { default: Login } = require("@/components/Auth/login");
const { default: store } = require("@/redux/store");
const { Provider } = require("react-redux");

export default function LoginPage() {
  return (
    <Provider store={store}>
      <Login />
    </Provider>
  );
}
