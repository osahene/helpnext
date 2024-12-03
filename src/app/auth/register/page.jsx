const { default: Register } = require("@/components/Auth/register");
const { default: store } = require("@/redux/store");
const { Provider } = require("react-redux");

export default function RegisterPage() {
  return (
    <Provider store={store}>
      <Register />
    </Provider>
  );
}
