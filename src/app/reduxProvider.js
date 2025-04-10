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
          ? "972387283638-ad9c1rcda4sc1ki137f80u87po7f07l5.apps.googleusercontent.com"
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
