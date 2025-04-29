"use client";
import { useEffect, useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

export default function GoogleOAuthInitializer({ children }) {
  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    const id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!id) {
      console.error("Google Client ID is missing!");
      return;
    }
    setClientId(id);
  }, []);

  if (!clientId) return children;

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin onSuccess={handleGoogleLoginSuccess} />
      {children}
    </GoogleOAuthProvider>
  );
}
