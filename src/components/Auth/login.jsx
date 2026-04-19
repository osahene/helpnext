"use client";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { verifyPhoneNumber, setPhoneNumbers } from "@/redux/authSlice";
import { useRouter } from "next/navigation";
import mainLogo from "../../../public/svg/Help Logo.svg";
import toast from "react-hot-toast";
import allCountries from "../../app/countries.json";

// ── Country options ────────────────────────────────────────────────────────────
export const countryOptions = allCountries.map((c) => ({
  name: c.name,
  code: c.dial_code,
  flag: `https://flagcdn.com/w20/${c.code.toLowerCase()}.png`,
  iso: c.code.toLowerCase(),
}));

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

// ── Country Dropdown ──────────────────────────────────────────────────────────
function CountryDropdown({ selected, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  const filtered = countryOptions.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.includes(search)
  );

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => { setOpen(o => !o); setSearch(""); }}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          height: 54, padding: "0 12px",
          background: C.surface,
          border: `1.5px solid ${open ? C.accent : C.border}`,
          borderRadius: 14,
          cursor: "pointer",
          whiteSpace: "nowrap",
          transition: "border-color 0.2s",
          fontFamily: "inherit",
        }}
      >
        <img
          src={selected.flag}
          alt={selected.name}
          width={20}
          height={14}
          style={{ borderRadius: 3, objectFit: "cover", flexShrink: 0 }}
          onError={e => { e.target.style.display = "none"; }}
        />
        <span style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>{selected.code}</span>
        <svg
          width="14" height="14" fill="none" viewBox="0 0 24 24"
          stroke={C.textSecondary} strokeWidth={2}
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", left: 0,
          width: 280, maxHeight: 320,
          background: C.white,
          border: `1.5px solid ${C.border}`,
          borderRadius: 14,
          boxShadow: "0 8px 32px rgba(15,23,42,0.12)",
          zIndex: 100,
          overflow: "hidden",
          display: "flex", flexDirection: "column",
        }}>
          {/* Search */}
          <div style={{ padding: "10px 12px", borderBottom: `1px solid ${C.border}` }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: C.surface, borderRadius: 10,
              padding: "8px 12px",
              border: `1px solid ${C.border}`,
            }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke={C.accent} strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                autoFocus
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search country or code..."
                style={{
                  border: "none", outline: "none", background: "transparent",
                  fontSize: 13, color: C.textPrimary, width: "100%", fontFamily: "inherit",
                }}
              />
            </div>
          </div>

          {/* List */}
          <div style={{ overflowY: "auto", flex: 1 }}>
            {filtered.length === 0 ? (
              <p style={{ textAlign: "center", color: C.textSecondary, fontSize: 13, padding: 16 }}>
                No countries found
              </p>
            ) : filtered.map((country, idx) => {
              const isSelected = country.code === selected.code && country.name === selected.name;
              return (
                <button
                  key={`${country.iso}-${idx}`}
                  type="button"
                  onClick={() => { onChange(country); setOpen(false); }}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 14px", border: "none", cursor: "pointer",
                    background: isSelected ? C.accentLight : "transparent",
                    textAlign: "left", fontFamily: "inherit",
                    borderBottom: `1px solid ${C.border}`,
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = C.surface; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                >
                  <img
                    src={country.flag} alt={country.name}
                    width={20} height={14}
                    style={{ borderRadius: 3, objectFit: "cover", flexShrink: 0 }}
                    onError={e => { e.target.style.display = "none"; }}
                  />
                  <span style={{
                    flex: 1, fontSize: 14, color: isSelected ? C.accent : C.textPrimary,
                    fontWeight: isSelected ? 700 : 500,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{country.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: isSelected ? C.accent : C.textSecondary, flexShrink: 0 }}>
                    {country.code}
                  </span>
                  {isSelected && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={C.accent}>
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Brand panel ───────────────────────────────────────────────────────────────
function BrandPanel() {
  return (
    <div style={{
      flex: "0 0 420px",
      background: "linear-gradient(145deg, #0F172A 0%, #1E3A5F 60%, #1A1A2E 100%)",
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      padding: "48px 44px", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(79,142,247,0.08)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -60, left: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(79,142,247,0.06)", pointerEvents: "none" }} />

      <div style={{ display: "flex", alignItems: "center", gap: 12, zIndex: 1 }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(79,142,247,0.15)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(79,142,247,0.3)" }}>
          <Image src={mainLogo} alt="Help OO Help" width={28} height={28} />
        </div>
        <span style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.3px" }}>Help OO Help</span>
      </div>

      <div style={{ zIndex: 1 }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(79,142,247,0.15)", border: "1px solid rgba(79,142,247,0.3)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#4F8EF7" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 3h3m-3 3h.008v.008H10.5v-.008z" />
          </svg>
        </div>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: 32, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.5px", lineHeight: 1.15, margin: "0 0 14px" }}>
          Welcome<br />Back
        </h2>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: 0 }}>
          Enter your phone number to receive a one-time verification code.
        </p>

        <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 12 }}>
          {["Choose your country code", "Enter your phone number", "Receive OTP via SMS"].map((text, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(79,142,247,0.15)", border: "1px solid rgba(79,142,247,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#4F8EF7" }}>{i + 1}</span>
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

// ── Main Login component ──────────────────────────────────────────────────────
export default function Login() {
  const [selectedCountry, setSelectedCountry] = useState(countryOptions[79]);
  const [phone_number, setPhone_Number] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const isValid = phone_number.trim().length > 5;
  const fullNumber = `${selectedCountry.code}${phone_number}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setIsLoading(true);
    try {
      const result = await dispatch(verifyPhoneNumber({ phone_number: fullNumber }));
      if (result.meta.requestStatus === "fulfilled") {
        dispatch(setPhoneNumbers(fullNumber));
        toast.success(result.payload?.message || "OTP sent. Redirecting...");
        router.push("/auth/verifyPhoneNumberOTP");
      } else {
        toast.error(result.payload?.message || "Request failed. Please try again.");
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
        <div className="brand-panel"><BrandPanel /></div>

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
                  <CountryDropdown selected={selectedCountry} onChange={setSelectedCountry} />
                  <input
                    type="tel"
                    className="phone-input"
                    value={phone_number}
                    onChange={e => {
                      const v = e.target.value.replace(/\D/g, "");
                      setPhone_Number(v);
                    }}
                    placeholder="244 123 456"
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
                      <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/>
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
 <p style={{ textAlign: "center", fontSize: 14, color: C.textSecondary, margin: 0 }}>
                Don't have an account?{" "}
                <Link href="/auth/register" style={{ color: C.accent, fontWeight: 700, textDecoration: "none" }}>
                  Register
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
