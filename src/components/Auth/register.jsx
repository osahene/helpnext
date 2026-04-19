"use client";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { setEmail, registerUser, googleLogin } from "@/redux/authSlice";
import { GetContact, GetDependants } from "@/redux/userSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import mainLogo from "../../../public/svg/Help Logo.svg";
import toast from "react-hot-toast";
import allCountries from "../../app/countries.json";

// ── Country options ────────────────────────────────────────────────────────────
const countryOptions = allCountries.map((c) => ({
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
      <button
        type="button"
        onClick={() => { setOpen(o => !o); setSearch(""); }}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          height: 54, padding: "0 12px",
          background: C.surface,
          border: `1.5px solid ${open ? C.accent : C.border}`,
          borderRadius: 14,
          cursor: "pointer", whiteSpace: "nowrap",
          transition: "border-color 0.2s", fontFamily: "inherit",
        }}
      >
        <img src={selected.flag} alt={selected.name} width={20} height={14}
          style={{ borderRadius: 3, objectFit: "cover", flexShrink: 0 }}
          onError={e => { e.target.style.display = "none"; }}
        />
        <span style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>{selected.code}</span>
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke={C.textSecondary} strokeWidth={2}
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", left: 0,
          width: 280, maxHeight: 300,
          background: C.white, border: `1.5px solid ${C.border}`,
          borderRadius: 14, boxShadow: "0 8px 32px rgba(15,23,42,0.12)",
          zIndex: 200, overflow: "hidden", display: "flex", flexDirection: "column",
        }}>
          <div style={{ padding: "10px 12px", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.surface, borderRadius: 10, padding: "8px 12px", border: `1px solid ${C.border}` }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke={C.accent} strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input autoFocus type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search country or code..."
                style={{ border: "none", outline: "none", background: "transparent", fontSize: 13, color: C.textPrimary, width: "100%", fontFamily: "inherit" }}
              />
            </div>
          </div>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {filtered.length === 0 ? (
              <p style={{ textAlign: "center", color: C.textSecondary, fontSize: 13, padding: 16 }}>No countries found</p>
            ) : filtered.map((country, idx) => {
              const isSelected = country.code === selected.code && country.name === selected.name;
              return (
                <button key={`${country.iso}-${idx}`} type="button"
                  onClick={() => { onChange(country); setOpen(false); }}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 14px", border: "none", cursor: "pointer",
                    background: isSelected ? C.accentLight : "transparent",
                    textAlign: "left", fontFamily: "inherit",
                    borderBottom: `1px solid ${C.border}`, transition: "background 0.15s",
                  }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = C.surface; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                >
                  <img src={country.flag} alt={country.name} width={20} height={14}
                    style={{ borderRadius: 3, objectFit: "cover", flexShrink: 0 }}
                    onError={e => { e.target.style.display = "none"; }}
                  />
                  <span style={{ flex: 1, fontSize: 14, color: isSelected ? C.accent : C.textPrimary, fontWeight: isSelected ? 700 : 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {country.name}
                  </span>
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

// ── Confirmation Modal ────────────────────────────────────────────────────────
function ConfirmModal({ firstName, lastName, fullPhone, countryFlag, countryName, onCancel, onConfirm }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
      animation: "fadeIn 0.2s ease",
    }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}
      </style>
      <div style={{
        background: C.white, borderRadius: 24, padding: 32,
        width: "100%", maxWidth: 440,
        boxShadow: "0 24px 64px rgba(15,23,42,0.18)",
        animation: "slideUp 0.3s cubic-bezier(0.22,1,0.36,1)",
      }}>
        {/* Icon */}
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke={C.accent} strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>

        <h3 style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: C.textPrimary, textAlign: "center", margin: "0 0 8px", letterSpacing: "-0.3px" }}>
          Confirm Registration
        </h3>
        <div style={{ height: 1, background: C.border, margin: "16px 0" }} />

        {/* Message */}
        <p style={{ fontSize: 15, color: C.textSecondary, textAlign: "center", lineHeight: 1.6, margin: "0 0 16px" }}>
          Hello{" "}
          <span style={{ color: C.textPrimary, fontWeight: 700 }}>{firstName} {lastName}</span>
          , you are registering with the phone number{" "}
          <span style={{ color: C.accent, fontWeight: 700 }}>{fullPhone}</span>.
        </p>

        {/* Info card */}
        <div style={{ background: C.accentLight, borderRadius: 12, padding: "12px 16px", border: `1px solid rgba(79,142,247,0.2)`, display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <img src={countryFlag} alt={countryName} width={24} height={17} style={{ borderRadius: 3, objectFit: "cover", flexShrink: 0 }} onError={e => { e.target.style.display = "none"; }} />
          <div>
            <p style={{ fontSize: 12, color: C.textSecondary, margin: 0 }}>{countryName}</p>
            <p style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary, margin: 0 }}>{fullPhone}</p>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onCancel} style={{
            flex: 1, height: 46, border: `1.5px solid ${C.border}`, borderRadius: 12,
            background: "transparent", color: C.textSecondary, fontSize: 15, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = C.surface; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >
            Cancel
          </button>
          <button onClick={onConfirm} style={{
            flex: 1, height: 46, border: "none", borderRadius: 12,
            background: C.accent, color: C.white, fontSize: 15, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 4px 14px rgba(79,142,247,0.35)",
            transition: "background 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#3b7de8"; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.accent; }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Input field wrapper ───────────────────────────────────────────────────────
function InputField({ label, icon, error, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", letterSpacing: "0.3px" }}>
        {label}
      </label>
      <div
        style={{
          display: "flex", alignItems: "center",
          background: C.surface, border: `1.5px solid ${error ? C.error : C.border}`,
          borderRadius: 14, overflow: "hidden", transition: "border-color 0.2s",
        }}
        onFocusCapture={e => e.currentTarget.style.borderColor = error ? C.error : C.accent}
        onBlurCapture={e => e.currentTarget.style.borderColor = error ? C.error : C.border}
      >
        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 48, color: C.accent, flexShrink: 0 }}>
          {icon}
        </span>
        {children}
      </div>
      {error && (
        <p style={{ fontSize: 12, color: C.error, margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

const inputStyle = {
  flex: 1, border: "none", outline: "none", background: "transparent",
  fontSize: 15, color: "#0F172A", fontWeight: 500,
  padding: "16px 16px 16px 0", fontFamily: "inherit",
};

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
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
          </svg>
        </div>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: 32, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.5px", lineHeight: 1.15, margin: "0 0 14px" }}>
          Create Your<br />Account
        </h2>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: 0 }}>
          Fill in your details and select your country to get started in seconds.
        </p>
        <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 12 }}>
          {["Enter your first and last name", "Select your country code", "Receive your OTP via SMS"].map((text, i) => (
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

// ── Main Register component ───────────────────────────────────────────────────
export default function Register() {
  const [selectedCountry, setSelectedCountry] = useState(countryOptions[79]);
  const [phone_number, setPhone_Number] = useState("");
  const [formData, setFormData] = useState({ first_name: "", last_name: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const fullNumber = `${selectedCountry.code}${phone_number}`;

  const isFormValid = () =>
    formData.first_name.trim() !== "" &&
    formData.last_name.trim() !== "" &&
    phone_number.trim().length > 5;

  const formChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    const result = await dispatch(googleLogin(credentialResponse.credential));
    try {
      if (result.meta.requestStatus === "fulfilled" && result.payload.status === "redirect") {
        toast.success(result.payload.message || "Verify phone number", { duration: 5000 });
        router.push(result.payload.redirectUrl);
      } else if (result.meta.requestStatus === "fulfilled") {
        dispatch(GetContact());
        dispatch(GetDependants());
        toast.success(result.payload.message || "Google Login Successful", { duration: 5000 });
        router.push("/");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleConfirmSubmit = async () => {
    setShowModal(false);
    setIsLoading(true);
    try {
      const result = await dispatch(registerUser({ ...formData, phone_number: fullNumber }));
      if (result.meta.requestStatus === "fulfilled") {
        dispatch(setEmail(formData.email));
        toast.success("OTP sent. Proceed to verify your phone number.");
        router.push("/auth/verifyEmail");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid()) return;
    setShowModal(true);
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
          padding: 48px 32px; background: #FFFFFF; overflow-y: auto;
          animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both;
        }
        .form-inner { width: 100%; max-width: 440px; }
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
        .name-grid { display: grid; grid-template-columns: 1fr; gap: 18px; }
        @media (min-width: 560px) { .name-grid { grid-template-columns: 1fr 1fr; } }
        .phone-input {
          flex: 1; border: 1.5px solid #E2E8F0; border-radius: 14px;
          background: #F7F9FC; padding: 0 16px; height: 54px;
          font-size: 15px; font-weight: 500; color: #0F172A;
          outline: none; font-family: inherit; transition: border-color 0.2s;
        }
        .phone-input:focus { border-color: #4F8EF7; }
        .phone-input::placeholder { color: #94A3B8; }
      `}</style>

      {showModal && (
        <ConfirmModal
          firstName={formData.first_name}
          lastName={formData.last_name}
          fullPhone={fullNumber}
          countryFlag={selectedCountry.flag}
          countryName={selectedCountry.name}
          onCancel={() => setShowModal(false)}
          onConfirm={handleConfirmSubmit}
        />
      )}

      <div className="auth-root">
        <div className="brand-panel"><BrandPanel /></div>

        <div className="form-panel">
          <div className="form-inner">

            {/* Icon badge */}
            <div style={{ width: 52, height: 52, borderRadius: 16, background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke={C.accent} strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
            </div>

            <h1 style={{ fontFamily: "Georgia, serif", fontSize: 30, fontWeight: 700, color: C.textPrimary, letterSpacing: "-0.5px", lineHeight: 1.1, margin: "0 0 8px" }}>
              Create Account
            </h1>
            <p style={{ fontSize: 15, color: C.textSecondary, margin: "0 0 32px", lineHeight: 1.5 }}>
              Fill in the details below to get started.
            </p>

            {/* Google Sign Up
            <div style={{ marginBottom: 20 }}>
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={() => toast.error("Google Login Failed. Please try again.")}
                useOneTap theme="outline" size="large"
                text="signup_with" shape="rectangular"
                logo_alignment="left" width="440"
              />
            </div>

            
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div style={{ flex: 1, height: 1, background: C.border }} />
              <span style={{ fontSize: 13, color: C.textSecondary, whiteSpace: "nowrap" }}>or fill in manually</span>
              <div style={{ flex: 1, height: 1, background: C.border }} />
            </div> */}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

              {/* Name row */}
              <div className="name-grid">
                <InputField
                  label="First Name"
                  error={formData.first_name !== "" && !formData.first_name.trim() ? "Required" : ""}
                  icon={
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke={C.accent} strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  }
                >
                  <input
                    type="text" name="first_name"
                    value={formData.first_name} onChange={formChange}
                    placeholder="e.g. Ama" style={inputStyle} required
                  />
                </InputField>

                <InputField
                  label="Last Name"
                  error={formData.last_name !== "" && !formData.last_name.trim() ? "Required" : ""}
                  icon={
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke={C.accent} strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  }
                >
                  <input
                    type="text" name="last_name"
                    value={formData.last_name} onChange={formChange}
                    placeholder="e.g. Henewaa" style={inputStyle} required
                  />
                </InputField>
              </div>

              {/* Phone Number */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", letterSpacing: "0.3px", display: "block", marginBottom: 8 }}>
                  Phone Number
                </label>
                <div style={{ display: "flex", gap: 10 }}>
                  <CountryDropdown selected={selectedCountry} onChange={setSelectedCountry} />
                  <input
                    type="tel"
                    className="phone-input"
                    value={phone_number}
                    onChange={e => setPhone_Number(e.target.value.replace(/\D/g, ""))}
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
                      <span style={{ color: C.textPrimary, fontWeight: 600 }}>{fullNumber}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: C.border, margin: "4px 0" }} />

              {/* Submit */}
              <button
                type="submit"
                disabled={!isFormValid() || isLoading}
                className="submit-btn"
                style={{
                  background: isFormValid() && !isLoading ? C.accent : C.border,
                  color: isFormValid() && !isLoading ? C.white : C.textSecondary,
                  boxShadow: isFormValid() && !isLoading ? "0 4px 14px rgba(79,142,247,0.35)" : "none",
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
                    Create Account
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                )}
              </button>

              <p style={{ textAlign: "center", fontSize: 14, color: C.textSecondary, margin: 0 }}>
                Already have an account?{" "}
                <Link href="/auth/login" style={{ color: C.accent, fontWeight: 700, textDecoration: "none" }}>
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
