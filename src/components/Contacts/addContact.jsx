"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createContact } from "@/redux/userSlice";
import toast from "react-hot-toast";
import allCountries from "../../app/countries.json";

const countryOptions = allCountries.map((c) => ({
  c_name: c.name,
  c_code: c.dial_code,
  c_flag: `https://flagcdn.com/w20/${c.code.toLowerCase()}.png`,
}));

const situations = ["Health Crisis", "Robbery Attack", "Fire Outbreak", "Flood Alert", "Call Emergency", "Violence Alert"];

const situationColors = {
  "Health Crisis": "#1A9E5C",
  "Robbery Attack": "#CC2222",
  "Fire Outbreak": "#E8500A",
  "Flood Alert": "#0A72C4",
  "Call Emergency": "#7B22CE",
  "Violence Alert": "#8B5C00",
};

const SectionLabel = ({ color, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
    <div style={{ width: "4px", height: "16px", background: color, borderRadius: "2px" }} />
    <p style={{ color, fontSize: "11px", fontWeight: 700, letterSpacing: "1.4px" }}>
      {label.toUpperCase()}
    </p>
  </div>
);

const InputField = ({ label, icon, error, ...props }) => (
  <div>
    <label style={{ display: "block", color: "#0F1B3E", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
      {label}
    </label>
    <div style={{ position: "relative" }}>
      <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#8B94B2" }}>
        {icon}
      </span>
      <input
        {...props}
        style={{
          width: "100%",
          padding: "13px 14px 13px 42px",
          borderRadius: "14px",
          border: `1px solid ${error ? "#f87171" : "#DDE3F5"}`,
          background: "#fff",
          color: "#0F1B3E",
          fontSize: "14px",
          fontWeight: 500,
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.2s",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#2C5FD4")}
        onBlur={(e) => (e.target.style.borderColor = error ? "#f87171" : "#DDE3F5")}
      />
    </div>
    {error && <p style={{ color: "#ef4444", fontSize: "11.5px", marginTop: "4px" }}>{error}</p>}
  </div>
);

export default function AddContacts() {
  const [selectedCountry, setSelectedCountry] = useState(countryOptions[79]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [selectedSituations, setSelectedSituations] = useState([]);
  const [formData, setFormData] = useState({
    first_name: "", last_name: "", email_address: "", phone_number: "", relation: "",
  });
  const dispatch = useDispatch();

  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const validatePhone = (p) => /^\+?[0-9\s\-\(\)]{6,}$/.test(p);

  const errors = {
    first_name: formData.first_name && formData.first_name.trim() === "" ? "Required" : null,
    last_name: formData.last_name && formData.last_name.trim() === "" ? "Required" : null,
    email_address: formData.email_address && !validateEmail(formData.email_address) ? "Invalid email" : null,
    phone_number: formData.phone_number && !validatePhone(formData.phone_number) ? "Invalid phone" : null,
    relation: formData.relation && formData.relation.trim() === "" ? "Required" : null,
  };

  const isValid = formData.first_name.trim() && formData.last_name.trim() &&
    validateEmail(formData.email_address) && validatePhone(formData.phone_number) &&
    formData.relation.trim();

  const formChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const toggleSituation = (s) =>
    setSelectedSituations((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(createContact({ ...formData, country_code: selectedCountry.c_code, situations: selectedSituations }));
      if (result.meta.requestStatus === "fulfilled") {
        setFormData({ first_name: "", last_name: "", email_address: "", phone_number: "", relation: "" });
        setSelectedSituations([]);
      }
      toast.success(result.payload?.message || "Contact created successfully.", { duration: 5000 });
    } catch (err) {
      toast.error("An error occurred. Please try again.", { duration: 5000 });
    }
  };

  const filteredCountries = countryOptions.filter(
    (c) => c.c_name.toLowerCase().includes(countrySearch.toLowerCase()) || c.c_code.includes(countrySearch)
  );

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          background: "#fff",
          borderRadius: "22px",
          padding: "24px",
          boxShadow: "0 4px 24px rgba(44,95,212,0.08)",
          border: "1px solid #DDE3F5",
        }}
      >
        {/* ── Personal Info ─────────────────────────────── */}
        <SectionLabel color="#2C5FD4" label="Personal Info" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <InputField
            label="First Name" name="first_name" type="text" placeholder="Ama"
            value={formData.first_name} onChange={formChange} required
            error={errors.first_name}
            icon={<svg style={{ width: "16px", height: "16px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
          />
          <InputField
            label="Last Name" name="last_name" type="text" placeholder="Henewaa"
            value={formData.last_name} onChange={formChange} required
            error={errors.last_name}
            icon={<svg style={{ width: "16px", height: "16px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
          />
        </div>

        {/* ── Contact Details ───────────────────────────── */}
        <SectionLabel color="#5B3FE8" label="Contact Details" />
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
          <InputField
            label="Email Address" name="email_address" type="email" placeholder="amahenewaa@example.com"
            value={formData.email_address} onChange={formChange} required
            error={errors.email_address}
            icon={<svg style={{ width: "16px", height: "16px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
          />

          {/* Phone row */}
          <div>
            <label style={{ display: "block", color: "#0F1B3E", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
              Phone Number
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              {/* Country selector */}
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  onClick={() => setShowCountryPicker(true)}
                  style={{
                    height: "48px", padding: "0 12px",
                    borderRadius: "14px", border: "1px solid #DDE3F5",
                    background: "#fff", display: "flex", alignItems: "center", gap: "6px",
                    cursor: "pointer", whiteSpace: "nowrap",
                  }}
                >
                  <img src={selectedCountry.c_flag} alt={selectedCountry.c_name} style={{ width: "20px", height: "14px", borderRadius: "2px" }} />
                  <span style={{ color: "#0F1B3E", fontWeight: 700, fontSize: "13.5px" }}>{selectedCountry.c_code}</span>
                  <svg style={{ width: "14px", height: "14px", color: "#8B94B2" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              {/* Number input */}
              <input
                name="phone_number" type="tel" placeholder="241123456"
                value={formData.phone_number} onChange={formChange} required
                style={{
                  flex: 1, padding: "13px 14px", borderRadius: "14px",
                  border: `1px solid ${errors.phone_number ? "#f87171" : "#DDE3F5"}`,
                  background: "#fff", color: "#0F1B3E", fontSize: "14px",
                  fontWeight: 500, outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#2C5FD4")}
                onBlur={(e) => (e.target.style.borderColor = errors.phone_number ? "#f87171" : "#DDE3F5")}
              />
            </div>
            {errors.phone_number && <p style={{ color: "#ef4444", fontSize: "11.5px", marginTop: "4px" }}>{errors.phone_number}</p>}
          </div>

          <InputField
            label="Relationship (Who are you to them?)" name="relation" type="text" placeholder="e.g. Father, Sister, Friend"
            value={formData.relation} onChange={formChange} required
            error={errors.relation}
            icon={<svg style={{ width: "16px", height: "16px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
          />
        </div>

        {/* ── Notify For ────────────────────────────────── */}
        <SectionLabel color="#E07A1A" label="Notify For" />
        <p style={{ color: "#8B94B2", fontSize: "12.5px", marginBottom: "12px", lineHeight: 1.5 }}>
          Select the situations this contact should be alerted for.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "28px" }}>
          {situations.map((s) => {
            const sel = selectedSituations.includes(s);
            const col = situationColors[s];
            return (
              <button
                key={s} type="button" onClick={() => toggleSituation(s)}
                style={{
                  padding: "8px 14px", borderRadius: "20px",
                  background: sel ? `${col}15` : "#F0F4FF",
                  border: `${sel ? 1.8 : 1}px solid ${sel ? col : "#DDE3F5"}`,
                  color: sel ? col : "#8B94B2",
                  fontSize: "13px", fontWeight: sel ? 700 : 500,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: "5px",
                  transition: "all 0.2s ease",
                  boxShadow: sel ? `0 4px 12px ${col}33` : "none",
                }}
              >
                {sel ? (
                  <svg style={{ width: "13px", height: "13px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg style={{ width: "13px", height: "13px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                )}
                {s}
              </button>
            );
          })}
        </div>

        {/* ── Actions ───────────────────────────────────── */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            type="button"
            onClick={() => setFormData({ first_name: "", last_name: "", email_address: "", phone_number: "", relation: "" })}
            style={{
              flex: 1, padding: "14px", borderRadius: "16px",
              background: "#F0F4FF", color: "#8B94B2",
              fontWeight: 600, fontSize: "14.5px",
              border: "1px solid #DDE3F5", cursor: "pointer",
            }}
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={!isValid}
            style={{
              flex: 2, padding: "14px", borderRadius: "16px",
              background: isValid
                ? "linear-gradient(135deg, #2C5FD4, #5B3FE8)"
                : "#DDE3F5",
              color: isValid ? "#fff" : "#8B94B2",
              fontWeight: 700, fontSize: "14.5px",
              boxShadow: isValid ? "0 8px 24px rgba(91,63,232,0.35)" : "none",
              border: "none", cursor: isValid ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              transition: "all 0.2s ease",
            }}
          >
            <svg style={{ width: "17px", height: "17px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Save Contact
          </button>
        </div>
      </div>

      {/* ── Country Picker Modal ──────────────────────── */}
      {showCountryPicker && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
          onClick={() => setShowCountryPicker(false)}
        >
          <div
            style={{ background: "#fff", borderRadius: "28px 28px 0 0", width: "100%", maxWidth: "480px", maxHeight: "72vh", display: "flex", flexDirection: "column", overflow: "hidden" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ width: "40px", height: "4px", background: "#DDE3F5", borderRadius: "2px", margin: "12px auto 8px" }} />
            <div style={{ padding: "0 20px 12px", borderBottom: "1px solid #F0F4FF" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <div style={{ width: "4px", height: "16px", background: "#2C5FD4", borderRadius: "2px" }} />
                <p style={{ color: "#2C5FD4", fontSize: "11px", fontWeight: 700, letterSpacing: "1.4px" }}>SELECT COUNTRY CODE</p>
              </div>
              <input
                placeholder="Search country…"
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                style={{
                  width: "100%", padding: "11px 14px 11px 38px",
                  borderRadius: "14px", border: "1px solid #DDE3F5",
                  background: "#F0F4FF", color: "#0F1B3E", fontSize: "14px", outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ overflowY: "auto", padding: "8px 16px 24px" }}>
              {filteredCountries.map((c, i) => {
                const isSel = selectedCountry.c_code === c.c_code && selectedCountry.c_name === c.c_name;
                return (
                  <button
                    key={i} type="button"
                    onClick={() => { setSelectedCountry(c); setShowCountryPicker(false); setCountrySearch(""); }}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: "12px",
                      padding: "11px 12px", borderRadius: "12px", border: "none",
                      background: isSel ? "#EEF4FF" : "transparent",
                      cursor: "pointer", marginBottom: "4px", textAlign: "left",
                    }}
                  >
                    <img src={c.c_flag} alt={c.c_name} style={{ width: "22px", height: "15px", borderRadius: "2px", flexShrink: 0 }} />
                    <span style={{ flex: 1, color: isSel ? "#2C5FD4" : "#0F1B3E", fontSize: "14px", fontWeight: isSel ? 700 : 500 }}>{c.c_name}</span>
                    <span style={{ color: isSel ? "#2C5FD4" : "#8B94B2", fontSize: "13.5px", fontWeight: 600 }}>{c.c_code}</span>
                    {isSel && <svg style={{ width: "16px", height: "16px", color: "#2C5FD4" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
