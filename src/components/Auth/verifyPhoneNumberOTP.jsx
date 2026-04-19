"use client";
import React, { useState, useEffect, useRef } from "react";
import { verifyPhoneNumberOTP, requestOTP } from "@/redux/authSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  accent:        "#4F8EF7",
  accentLight:   "#EAF1FE",
  surface:       "#F7F9FC",
  border:        "#E2E8F0",
  textPrimary:   "#0F172A",
  textSecondary: "#64748B",
  white:         "#FFFFFF",
  error:         "#EF4444",
};

const TOTAL = 70; // 1 min 10 sec

function maskPhone(phone) {
  if (!phone || phone.length <= 4) return phone || "";
  return phone.slice(0, -4).replace(/\d/g, "*") + phone.slice(-4);
}

// ── Individual digit box ──────────────────────────────────────────────────────
function DigitBox({ value, isFocused, inputRef, onChange, onKeyDown, onPaste, index }) {
  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      maxLength={1}
      value={value}
      onChange={e => onChange(index, e.target.value)}
      onKeyDown={e => onKeyDown(index, e)}
      onPaste={onPaste}
      onFocus={() => {}}
      style={{
        width: 56, height: 68,
        textAlign: "center",
        fontSize: 26, fontWeight: 700,
        color: C.textPrimary,
        background: value ? C.accentLight : C.surface,
        border: `${value || isFocused ? 2 : 1.5}px solid ${value ? C.accent : isFocused ? C.accent : C.border}`,
        borderRadius: 14,
        outline: "none",
        transition: "border-color 0.2s, background 0.2s, transform 0.1s",
        fontFamily: "Georgia, serif",
        caretColor: C.accent,
        transform: value ? "scale(1.03)" : "scale(1)",
      }}
    />
  );
}

// ── Left brand panel ──────────────────────────────────────────────────────────
function BrandPanel({ phone }) {
  return (
    <div style={{
      flex: "0 0 420px",
      background: "linear-gradient(145deg, #0F172A 0%, #1E3A5F 60%, #1A1A2E 100%)",
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      padding: "48px 44px", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(79,142,247,0.08)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -60, left: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(79,142,247,0.06)", pointerEvents: "none" }} />

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, zIndex: 1 }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(79,142,247,0.15)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(79,142,247,0.3)" }}>
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#4F8EF7" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
        </div>
        <span style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.3px" }}>Help OO Help</span>
      </div>

      {/* Middle */}
      <div style={{ zIndex: 1 }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(79,142,247,0.15)", border: "1px solid rgba(79,142,247,0.3)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#4F8EF7" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 3h3m-3 3h.008v.008H10.5v-.008z" />
          </svg>
        </div>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: 32, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.5px", lineHeight: 1.15, margin: "0 0 14px" }}>
          Phone<br />Verification
        </h2>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: 0 }}>
          We sent a 6-digit code to{" "}
          <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>{maskPhone(phone)}</span>.
          Enter it below to verify your identity.
        </p>

        {/* Steps */}
        <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { step: "1", text: "Check your phone for the SMS" },
            { step: "2", text: "Enter the 6-digit code" },
            { step: "3", text: "You'll be redirected automatically" },
          ].map(({ step, text }) => (
            <div key={step} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(79,142,247,0.15)", border: "1px solid rgba(79,142,247,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#4F8EF7" }}>{step}</span>
              </div>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0, zIndex: 1 }}>
        © {new Date().getFullYear()} Help OO Help. All rights reserved.
      </p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function VerifyPhoneNumberOTP() {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL);
  const [isLoading, setIsLoading] = useState(false);

  const inputRefs = useRef([]);
  const dispatch = useDispatch();
  const phone_number = useSelector((state) => state.auth.phone_number);
  const router = useRouter();

  const otp = digits.join("");
  const isComplete = otp.length === 6;
  const canResend = timeLeft === 0;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = otp.length / 6;

  // Countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [timeLeft]);

  // Auto-focus first box
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const focusBox = (index) => {
    if (index >= 0 && index < 6) {
      inputRefs.current[index]?.focus();
      setFocusedIndex(index);
    }
  };

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...digits];
    next[index] = value.slice(-1);
    setDigits(next);
    if (value && index < 5) focusBox(index + 1);
    // auto-submit
    if (next.join("").length === 6) submitOtp(next.join(""));
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) focusBox(index - 1);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = [...digits];
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    focusBox(Math.min(pasted.length, 5));
    if (pasted.length === 6) submitOtp(pasted);
  };

  const submitOtp = async (code) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const result = await dispatch(verifyPhoneNumberOTP({ otp: code, phone_number }));
      if (result.meta.requestStatus === "fulfilled") {
        toast.success(result.payload?.message || "Phone number verified successfully. Redirecting...", { duration: 5000 });
        router.push("/");
      } else {
        toast.error("Verification failed. Please try again.", { duration: 5000 });
        setDigits(["", "", "", "", "", ""]);
        setTimeout(() => focusBox(0), 100);
      }
    } catch (error) {
      toast.error("An error occurred during verification.", { duration: 5000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (isComplete) submitOtp(otp);
  };

  const resendOTP = async (e) => {
    e.preventDefault();
    if (!canResend) return;
    setTimeLeft(TOTAL);
    setDigits(["", "", "", "", "", ""]);
    setTimeout(() => focusBox(0), 100);
    try {
      await dispatch(requestOTP({ email: phone_number }));
      toast.success("OTP sent to your phone number", { duration: 5000 });
    } catch (error) {
      toast.error("Failed to resend OTP");
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
        .brand-panel { display: none; }
        @media (min-width: 900px) { .brand-panel { display: flex; flex-direction: column; } }
        .digit-row { display: flex; gap: 10px; justify-content: space-between; }
        .resend-btn {
          background: none; border: none; font-family: inherit;
          font-size: 14px; font-weight: 700; padding: 0;
          transition: opacity 0.2s;
        }
        .resend-btn:not(:disabled) { cursor: pointer; }
        .resend-btn:not(:disabled):hover { opacity: 0.75; }
      `}</style>

      <div className="auth-root">
        <div className="brand-panel">
          <BrandPanel phone={phone_number} />
        </div>

        <div className="form-panel">
          <div className="form-inner">

            {/* Icon badge */}
            <div style={{ width: 52, height: 52, borderRadius: 16, background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke={C.accent} strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>

            <h1 style={{ fontFamily: "Georgia, serif", fontSize: 30, fontWeight: 700, color: C.textPrimary, letterSpacing: "-0.5px", lineHeight: 1.1, margin: "0 0 8px" }}>
              Enter OTP Code
            </h1>
            <p style={{ fontSize: 15, color: C.textSecondary, margin: "0 0 36px", lineHeight: 1.6 }}>
              A 6-digit code was sent to{" "}
              <span style={{ color: C.textPrimary, fontWeight: 700 }}>{maskPhone(phone_number)}</span>.
            </p>

            <form onSubmit={handleManualSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* 6 digit boxes */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", letterSpacing: "0.3px", display: "block", marginBottom: 12 }}>
                  Verification Code
                </label>
                <div className="digit-row">
                  {digits.map((d, i) => (
                    <DigitBox
                      key={i}
                      index={i}
                      value={d}
                      isFocused={focusedIndex === i}
                      inputRef={el => (inputRefs.current[i] = el)}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      onPaste={handlePaste}
                    />
                  ))}
                </div>
              </div>

              {/* Progress strip */}
              <div>
                <div style={{ height: 4, borderRadius: 4, background: C.border, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${progress * 100}%`,
                    background: C.accent, borderRadius: 4,
                    transition: "width 0.25s ease",
                  }} />
                </div>
                <p style={{ fontSize: 12, color: C.textSecondary, margin: "6px 0 0" }}>
                  {otp.length} of 6 digits entered
                </p>
              </div>

              {/* Countdown + resend */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: C.surface, borderRadius: 12, border: `1px solid ${C.border}` }}>
                <div>
                  {canResend ? (
                    <p style={{ fontSize: 14, color: C.textSecondary, margin: 0 }}>
                      Didn&apos;t receive the code?
                    </p>
                  ) : (
                    <p style={{ fontSize: 14, color: C.textSecondary, margin: 0 }}>
                      Resend in{" "}
                      <span style={{ color: C.accent, fontWeight: 700 }}>
                        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                      </span>
                    </p>
                  )}
                </div>
                <button
                  className="resend-btn"
                  onClick={resendOTP}
                  disabled={!canResend}
                  style={{ color: canResend ? C.accent : C.border }}
                >
                  Resend OTP
                </button>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: C.border }} />

              {/* Verify button */}
              <button
                type="submit"
                disabled={!isComplete || isLoading}
                className="submit-btn"
                style={{
                  background: isComplete && !isLoading ? C.accent : C.border,
                  color: isComplete && !isLoading ? C.white : C.textSecondary,
                  boxShadow: isComplete && !isLoading ? "0 4px 14px rgba(79,142,247,0.35)" : "none",
                }}
              >
                {isLoading ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
                      <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/>
                    </path>
                  </svg>
                ) : (
                  <>
                    Verify Code
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </>
                )}
              </button>

              {/* Info card */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 14px", background: C.accentLight, borderRadius: 12, border: "1px solid rgba(79,142,247,0.2)" }}>
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke={C.accent} strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                <p style={{ fontSize: 13, color: C.textSecondary, margin: 0, lineHeight: 1.5 }}>
                  The OTP expires in 10 minutes. Never share it with anyone.
                </p>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}
