"use client";
import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/redux/store";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function ReduxProvider({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only render after mounting to ensure localStorage is available
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
        >
          {children}
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  );
}
