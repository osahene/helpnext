"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/redux/store";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function ReduxProvider({ children }) {
  return (
    <GoogleOAuthProvider
      clientId={
        process.env.NODE_ENV === "development"
          ? process.env.NEXT_PUBLIC_CLIENT_ID
          : process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
      }
    >
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  );
}
