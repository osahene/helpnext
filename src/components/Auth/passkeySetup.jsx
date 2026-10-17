"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { clearEnrollment, registerPasskey } from "@/redux/authSlice";
import { hasPendingEnrollment } from "@/utils/enrollment";
import { isPasskeySupported } from "@/utils/webauthn";

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  accent: "#4F8EF7",
  accentLight: "#EAF1FE",
  surface: "#F7F9FC",
  border: "#E2E8F0",
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  white: "#FFFFFF",
};

// Step 3 of 3 on the web. Reached only after a correct OTP (the auth slice
// holds a 24h enrollment token); no session exists until a passkey does.
export default function PasskeySetup() {
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector((state) => state.auth);
  const pending = hasPendingEnrollment(auth);
  const [supported, setSupported] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => setSupported(isPasskeySupported()), []);

  // Nothing to do here without a pending step 3 (or once it's finished).
  useEffect(() => {
    if (auth.isAuthenticated) router.replace("/");
    else if (!pending) router.replace("/auth/login");
  }, [auth.isAuthenticated, pending, router]);

  const handleCreate = async () => {
    if (busy) return;
    setBusy(true);
    const result = await dispatch(registerPasskey());
    setBusy(false);
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("You're all set.", { duration: 4000 });
      router.push("/");
      return;
    }
    const error = result.payload || {};
    if (error.cancelled) return; // closed the browser prompt — just let them retry
    toast.error(error.error || "We couldn't set up a passkey. Please try again.", { duration: 6000 });
    if (error.code === "enrollment_expired") router.push("/auth/login");
  };

  const useDifferentNumber = () => {
    dispatch(clearEnrollment());
    router.push("/auth/login");
  };

  if (!pending) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .auth-root { min-height: 100vh; display: flex; align-items: stretch; font-family: 'Lora', Georgia, serif; }
        .form-panel {
          flex: 1; display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          padding: 48px 16px; background: #FFFFFF;
          animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both;
        }
        .form-inner { width: 100%; max-width: 420px; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .submit-btn {
          width: 100%; height: 52px; border: none; border-radius: 14px;
          font-size: 16px; font-weight: 700; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          gap: 8px; transition: all 0.2s; font-family: inherit;
        }
        .submit-btn:active { transform: scale(0.985); }
        .submit-btn:disabled { cursor: not-allowed; }
        .link-btn {
          background: none; border: none; font-family: inherit; cursor: pointer;
          font-size: 14px; color: #64748B; padding: 8px; width: 100%;
        }
      `}</style>

      <div className="auth-root">
        <div className="form-panel">
          <div className="form-inner">
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.4px", color: C.textSecondary, margin: "0 0 8px" }}>
              STEP 3 OF 3
            </p>
            <div style={{ height: 4, borderRadius: 4, background: C.accent, marginBottom: 28 }} />

            <div style={{ width: 52, height: 52, borderRadius: 16, background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke={C.accent} strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33" />
              </svg>
            </div>

            <h1 style={{ fontFamily: "Georgia, serif", fontSize: 30, fontWeight: 700, color: C.textPrimary, letterSpacing: "-0.5px", lineHeight: 1.1, margin: "0 0 8px" }}>
              {auth.first_name ? `${auth.first_name}, secure your account` : "Secure your account"}
            </h1>
            <p style={{ fontSize: 15, color: C.textSecondary, margin: "0 0 28px", lineHeight: 1.6 }}>
              {supported
                ? "Your phone number is verified. Last step: create a passkey — your fingerprint, face, or this device's PIN. It stays on your device; we never receive it. Next time you can sign in with the passkey or an SMS code."
                : "This browser can't create passkeys. Please use an up-to-date Chrome, Safari, Edge or Firefox, or finish signing up in the Help OO Help app."}
            </p>

            {supported && (
              <button
                type="button"
                onClick={handleCreate}
                disabled={busy}
                className="submit-btn"
                style={{
                  background: busy ? C.border : C.accent,
                  color: busy ? C.textSecondary : C.white,
                  boxShadow: busy ? "none" : "0 4px 14px rgba(79,142,247,0.35)",
                }}
              >
                {busy ? "Waiting for your device…" : "Create passkey"}
              </button>
            )}

            <div style={{ height: 12 }} />
            <button type="button" className="link-btn" onClick={useDifferentNumber} disabled={busy}>
              Use a different number
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
