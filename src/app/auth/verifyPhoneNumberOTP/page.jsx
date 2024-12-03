const {
  default: VerifyPhoneNumberOTP,
} = require("@/components/Auth/verifyPhoneNumberOTP");
const { default: store } = require("@/redux/store");
const { Provider } = require("react-redux");

export default function VerifyPhoneNumberOTPPage() {
  return (
    <Provider store={store}>
      <VerifyPhoneNumberOTP />
    </Provider>
  );
}
