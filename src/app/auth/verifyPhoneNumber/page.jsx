const {
  default: VerifyPhoneNumber,
} = require("@/components/Auth/verifyPhoneNumber");
const { default: store } = require("@/redux/store");
const { Provider } = require("react-redux");

export default function VerifyPhoneNumberPage() {
  return (
    <Provider store={store}>
      <VerifyPhoneNumber />
    </Provider>
  );
}
