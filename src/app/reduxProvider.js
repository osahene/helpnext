"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/redux/store";
import GoogleOAuthInitializer from "./GoogleOAuthInitializer";

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GoogleOAuthInitializer>{children}</GoogleOAuthInitializer>
      </PersistGate>
    </Provider>
  );
}
