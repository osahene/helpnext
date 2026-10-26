"use client";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { loginWithPasskey, requestOTP, setPhoneNumbers } from "@/redux/authSlice";
import { isPasskeySupported } from "@/utils/webauthn";
import { useRouter } from "next/navigation";
import mainLogo from "../../../public/svg/Help Logo.svg";
import toast from "react-hot-toast";
import CountryDropdown from "@/utils/countryDropdown";
import { DEFAULT_COUNTRY, sanitizePhoneInput, stashRegisterPrefill } from "@/utils/phone";


// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  accent: "#4F8EF7",
  accentLight: "#EAF1FE",
  surface: "#F7F9FC",
  border: "#E2E8F0",
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  white: "#FFFFFF",
  error: "#EF4444",
};

// ── Main Login component ──────────────────────────────────────────────────────
export default function Login() {
  const [selectedCountry, setSelectedCountry] = useState(DEFAULT_COUNTRY);
  const [phone_number, setPhone_Number] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // { country, phone } once the server says this number has no account.
  const [newHere, setNewHere] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const goToRegister = () => {
    stashRegisterPrefill(newHere.country, newHere.phone);
    router.push("/auth/register");
  };

  const isValid = phone_number.trim().length > 5;
  // Passkey sign-in is the alternative to an OTP, for anyone who did step 3
  // in a browser (the browser offers the passkeys it holds).
  const [canUsePasskey, setCanUsePasskey] = useState(false);
  useEffect(() => setCanUsePasskey(isPasskeySupported()), []);

  const handlePasskey = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const result = await dispatch(loginWithPasskey());
      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Signed in.");
        router.push("/");
      } else if (!result.payload?.cancelled) {
        toast.error(result.payload?.error || "Passkey sign-in failed. Please use your phone number.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setIsLoading(true);
    try {
      const cleanPhone = sanitizePhoneInput(phone_number, selectedCountry.code);
      const result = await dispatch(
        requestOTP({ phone_number: cleanPhone, country_code: selectedCountry.code })
      );
      if (result.meta.requestStatus === "fulfilled") {
        dispatch(setPhoneNumbers({ country_code: selectedCountry.code, phone_number: cleanPhone }));
        toast.success(result.payload?.message || "OTP sent. Redirecting...");
        router.push("/auth/verifyPhoneNumberOTP");
      } else if (result.payload?.code === "account_not_found") {
        // Nearly always a first-time user who typed their number here
        // instead of tapping Register: welcome them (it isn't an error) and
        // carry the number across. Mirrors helpflutter's LoginScreen.
        setNewHere({ country: selectedCountry, phone: cleanPhone });
      } else {
        toast.error(result.payload?.error || "Request failed. Please try again.");
      }
    } catch (error) {
      toast.error(error.response?.error || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .auth-root { min-height: 100vh; display: flex; align-items: stretch; font-family: 'Lora', Georgia, serif; }
        .form-panel {
          flex: 1; display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          padding: 48px 32px; background: #FFFFFF;
          animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both;
        }
        .form-inner { width: 100%; max-width: 440px; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .submit-btn {
          width: 100%; height: 52px; border: none; border-radius: 14px;
          font-size: 16px; font-weight: 700; letter-spacing: 0.2px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          gap: 8px; transition: all 0.2s; font-family: inherit;
        }
        .submit-btn:active { transform: scale(0.985); }
        .submit-btn:disabled { cursor: not-allowed; }
        .brand-panel { display: none; }
        @media (min-width: 900px) { .brand-panel { display: flex; flex-direction: column; } }
        .phone-row { display: flex; gap: 10px; align-items: flex-start; }
        .phone-input {
          flex: 1; border: 1.5px solid #E2E8F0; border-radius: 14px;
          background: #F7F9FC; padding: 0 16px; height: 54px;
          font-size: 15px; font-weight: 500; color: #0F172A;
          outline: none; font-family: inherit;
          transition: border-color 0.2s;
        }
        .phone-input:focus { border-color: #4F8EF7; }
        .phone-input::placeholder { color: #94A3B8; }
      `}</style>

      <div className="auth-root">
        <div className="form-panel">
          <div className="form-inner">

            {/* Icon badge */}
            <div style={{ width: 52, height: 52, borderRadius: 16, background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke={C.accent} strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 3h3m-3 3h.008v.008H10.5v-.008z" />
              </svg>
            </div>

            <h1 style={{ fontFamily: "Georgia, serif", fontSize: 30, fontWeight: 700, color: C.textPrimary, letterSpacing: "-0.5px", lineHeight: 1.1, margin: "0 0 8px" }}>
              Sign In
            </h1>
            <p style={{ fontSize: 15, color: C.textSecondary, margin: "0 0 36px", lineHeight: 1.5 }}>
              Enter your phone number to receive a one-time code.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

              {/* Phone number label */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", letterSpacing: "0.3px", display: "block", marginBottom: 8 }}>
                  Phone Number
                </label>

                {/* Country selector + input row */}
                <div className="phone-row">
                  <CountryDropdown
                    selected={selectedCountry}
                    onChange={(c) => {
                      setSelectedCountry(c);
                      setPhone_Number((p) => sanitizePhoneInput(p, c.code));
                    }}
                  />
                  <input
                    type="tel"
                    className="phone-input"
                    value={phone_number}
                    onChange={(e) =>
                      setPhone_Number(sanitizePhoneInput(e.target.value, selectedCountry.code))
                    }
                    placeholder="244123456"
                    required
                  />
                </div>

                {/* Full number preview */}
                {phone_number.length > 0 && (
                  <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent }} />
                    <span style={{ fontSize: 12, color: C.textSecondary }}>
                      Full number:{" "}
                      <span style={{ color: C.textPrimary, fontWeight: 600 }}>
                        {selectedCountry.code} {phone_number}
                      </span>
                    </span>
                  </div>
                )}
              </div>

              {/* Helper note */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "12px 14px", background: C.accentLight, borderRadius: 12, border: `1px solid rgba(79,142,247,0.2)` }}>
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke={C.accent} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                <p style={{ fontSize: 13, color: C.textSecondary, margin: 0, lineHeight: 1.5 }}>
                  We&apos;ll send a 6-digit OTP to this number via SMS.
                </p>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: C.border }} />

              {/* Submit */}
              <button
                type="submit"
                disabled={!isValid || isLoading}
                className="submit-btn"
                style={{
                  background: isValid && !isLoading ? C.accent : C.border,
                  color: isValid && !isLoading ? C.white : C.textSecondary,
                  boxShadow: isValid && !isLoading ? "0 4px 14px rgba(79,142,247,0.35)" : "none",
                }}
              >
                {isLoading ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
                      <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" />
                    </path>
                  </svg>
                ) : (
                  <>
                    Send OTP
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  </>
                )}
              </button>
              {canUsePasskey && (
                <button
                  type="button"
                  onClick={handlePasskey}
                  disabled={isLoading}
                  className="submit-btn"
                  style={{ background: C.white, color: C.accent, border: `1.5px solid ${C.accent}` }}
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33" />
                  </svg>
                  Sign in with a passkey
                </button>
              )}
              <p style={{ textAlign: "center", fontSize: 14, color: C.textSecondary, margin: 0 }}>
                Don{"'"}t have an account?{" "}
                <Link href="/auth/register" style={{ color: C.accent, fontWeight: 700, textDecoration: "none" }}>
                  Register
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      {newHere && (
        <div
          onClick={() => setNewHere(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 100, background: "rgba(15,23,42,0.55)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-here-title"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%", maxWidth: 400, background: C.white, borderRadius: 24,
              padding: "28px 24px 20px", textAlign: "center",
              boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
            }}
          >
            <div style={{
              width: 64, height: 64, borderRadius: "50%", background: C.accentLight,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 18px", fontSize: 30,
            }}>
              👋
            </div>
            <h2 id="new-here-title" style={{ fontSize: 20, fontWeight: 800, color: C.textPrimary, margin: "0 0 10px", letterSpacing: "-0.3px" }}>
              Welcome! You&apos;re new here
            </h2>
            <p style={{ fontSize: 14.5, color: C.textSecondary, lineHeight: 1.5, margin: "0 0 24px" }}>
              <strong style={{ color: C.textPrimary }}>{newHere.country.code} {newHere.phone}</strong>{" "}
              doesn&apos;t have an account yet. Create one first — it takes about a minute,
              and we&apos;ll keep the number you entered.
            </p>
            <button
              type="button"
              onClick={goToRegister}
              className="submit-btn"
              style={{ background: C.accent, color: C.white, boxShadow: "0 4px 14px rgba(79,142,247,0.35)" }}
            >
              Create my account
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setNewHere(null)}
              style={{
                marginTop: 8, background: "none", border: "none", cursor: "pointer",
                color: C.textSecondary, fontSize: 14, fontWeight: 600, padding: 10, fontFamily: "inherit",
              }}
            >
              I typed the wrong number
            </button>
          </div>
        </div>
      )}
    </>
  );
}
