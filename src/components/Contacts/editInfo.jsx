"use client";

import React, { useState } from "react";
import CountryDropdown from "@/utils/countryDropdown";
import { DEFAULT_COUNTRY, sanitizePhoneInput, splitPhone } from "@/utils/phone";

const C = {
  primary: "#2C5FD4",
  accent: "#5B3FE8",
  surface: "#F0F4FF",
  border: "#DDE3F5",
  text: "#0F1B3E",
  muted: "#8B94B2",
  error: "#EF4444",
};

const situationsList = [
  "Health Crisis", "Robbery Attack", "Fire Outbreak",
  "Flood Alert", "Call Emergency", "Violence Alert",
];

const situationColors = {
  "Health Crisis": "#1A9E5C",
  "Robbery Attack": "#CC2222",
  "Fire Outbreak": "#E8500A",
  "Flood Alert": "#0A72C4",
  "Call Emergency": "#7B22CE",
  "Violence Alert": "#8B5C00",
};

const SectionLabel = ({ color, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
    <div style={{ width: 4, height: 16, background: color, borderRadius: 2 }} />
    <p style={{ color, fontSize: 11, fontWeight: 700, letterSpacing: "1.4px", margin: 0 }}>
      {label.toUpperCase()}
    </p>
  </div>
);

const InputField = ({ label, icon, error, ...props }) => (
  <div>
    <label style={{ display: "block", color: C.text, fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
      {label}
    </label>
    <div style={{ position: "relative" }}>
      <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: C.muted, display: "flex" }}>
        {icon}
      </span>
      <input
        {...props}
        style={{
          width: "100%", padding: "13px 14px 13px 42px", borderRadius: 14,
          border: `1.5px solid ${error ? C.error : C.border}`,
          background: "#fff", color: C.text, fontSize: 14, fontWeight: 500,
          outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
        }}
        onFocus={(e) => (e.target.style.borderColor = C.primary)}
        onBlur={(e) => (e.target.style.borderColor = error ? C.error : C.border)}
      />
    </div>
    {error && <p style={{ color: C.error, fontSize: 11.5, marginTop: 4 }}>{error}</p>}
  </div>
);

const userIcon = (
  <svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export default function EditContact({ contact, onSave, onCancel }) {
  // Resolve whatever shape the saved number is in (E.164 or national + country_code)
  const initial = () => splitPhone(contact?.phone_number || "", contact?.country_code || "");

  const [selectedCountry, setSelectedCountry] = useState(() => initial().country || DEFAULT_COUNTRY);
  const [phoneNumber, setPhoneNumber] = useState(() => initial().national);

  const [selectedSituations, setSelectedSituations] = useState(
    Array.isArray(contact?.situations)
      ? contact.situations
      : contact?.situations
        ? [contact.situations]
        : []
  );

  const [formData, setFormData] = useState({
    first_name: contact?.first_name || "",
    last_name: contact?.last_name || "",
    email_address: contact?.email_address || "",
    relation: contact?.relation || "",
  });

  const validPhone = /^[1-9]\d{5,14}$/.test(phoneNumber);

  const errors = {
    first_name: !formData.first_name.trim() ? "Required" : null,
    last_name: !formData.last_name.trim() ? "Required" : null,
    phone_number: phoneNumber && !validPhone ? "Enter a valid number" : null,
    relation: !formData.relation.trim() ? "Required" : null,
  };

  const isValid =
    formData.first_name.trim() &&
    formData.last_name.trim() &&
    validPhone &&
    formData.relation.trim() &&
    selectedSituations.length > 0;

  const formChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const toggleSituation = (s) =>
    setSelectedSituations((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid || !onSave) return;
    onSave({
      ...contact,
      ...formData,
      country_code: selectedCountry.code,
      phone_number: sanitizePhoneInput(phoneNumber, selectedCountry.code),
      situations: selectedSituations,
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 560, margin: "0 auto" }}>
      <div style={{
        background: "#fff", borderRadius: 24, overflow: "hidden",
        border: `1px solid ${C.border}`, boxShadow: "0 12px 40px rgba(44,95,212,0.12)",
        display: "flex", flexDirection: "column", maxHeight: "88vh",
      }}>

        {/* ── Gradient header ─────────────────────────── */}
        <div style={{
          position: "relative", overflow: "hidden",
          background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`,
          padding: "22px 24px",
        }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
          <div style={{ position: "absolute", bottom: -30, left: -20, width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative" }}>
            <div style={{
              width: 46, height: 46, borderRadius: 14,
              background: "rgba(255,255,255,0.18)", border: "1.5px solid rgba(255,255,255,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <svg style={{ width: 20, height: 20, color: "#fff" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div style={{ minWidth: 0 }}>
              <h5 style={{ color: "#fff", fontSize: 19, fontWeight: 800, margin: 0, letterSpacing: "-0.3px" }}>
                Update Contact Information
              </h5>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12.5, margin: "2px 0 0" }}>
                {contact?.first_name
                  ? `Editing ${contact.first_name} ${contact.last_name || ""}`.trim()
                  : "Edit this emergency contact"}
              </p>
            </div>
          </div>
        </div>

        {/* ── Scrollable body ─────────────────────────── */}
        <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>

          <SectionLabel color={C.primary} label="Personal Info" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginBottom: 24 }}>
            <InputField
              label="First Name" name="first_name" type="text" placeholder="Ama"
              value={formData.first_name} onChange={formChange}
              error={errors.first_name} icon={userIcon} required
            />
            <InputField
              label="Last Name" name="last_name" type="text" placeholder="Henewaa"
              value={formData.last_name} onChange={formChange}
              error={errors.last_name} icon={userIcon} required
            />
          </div>

          <SectionLabel color={C.accent} label="Contact Details" />
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
            <InputField
              label="Email Address (Optional)" name="email_address" type="email"
              placeholder="amahenewaa@example.com"
              value={formData.email_address} onChange={formChange}
              icon={
                <svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />

            <div>
              <label style={{ display: "block", color: C.text, fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                Phone Number
              </label>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <CountryDropdown
                  height={48}
                  selected={selectedCountry}
                  onChange={(c) => {
                    setSelectedCountry(c);
                    setPhoneNumber((p) => sanitizePhoneInput(p, c.code));
                  }}
                />
                <input
                  type="tel"
                  placeholder="244123456"
                  value={phoneNumber}
                  onChange={(e) =>
                    setPhoneNumber(sanitizePhoneInput(e.target.value, selectedCountry.code))
                  }
                  required
                  style={{
                    flex: 1, height: 48, padding: "0 14px", borderRadius: 14,
                    border: `1.5px solid ${errors.phone_number ? C.error : C.border}`,
                    background: "#fff", color: C.text, fontSize: 14, fontWeight: 500,
                    outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = C.primary)}
                  onBlur={(e) => (e.target.style.borderColor = errors.phone_number ? C.error : C.border)}
                />
              </div>

              {errors.phone_number ? (
                <p style={{ color: C.error, fontSize: 11.5, marginTop: 6 }}>{errors.phone_number}</p>
              ) : phoneNumber ? (
                <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.primary }} />
                  <span style={{ fontSize: 12, color: C.muted }}>
                    Full number:{" "}
                    <span style={{ color: C.text, fontWeight: 600 }}>
                      {selectedCountry.code} {phoneNumber}
                    </span>
                  </span>
                </div>
              ) : (
                <p style={{ color: C.muted, fontSize: 12, marginTop: 6 }}>
                  Enter the number without the leading 0.
                </p>
              )}
            </div>

            <InputField
              label="Relationship (Who are you to them?)" name="relation" type="text"
              placeholder="e.g. Father, Sister, Friend"
              value={formData.relation} onChange={formChange}
              error={errors.relation} required
              icon={
                <svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
            />
          </div>

          <SectionLabel color="#E07A1A" label="Notify For" />
          <p style={{ color: C.muted, fontSize: 12.5, marginBottom: 12, lineHeight: 1.5 }}>
            Select the situations this contact should be alerted for.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {situationsList.map((s) => {
              const sel = selectedSituations.includes(s);
              const col = situationColors[s];
              return (
                <button
                  key={s} type="button" onClick={() => toggleSituation(s)}
                  style={{
                    padding: "8px 14px", borderRadius: 20,
                    background: sel ? `${col}15` : C.surface,
                    border: `${sel ? 1.8 : 1}px solid ${sel ? col : C.border}`,
                    color: sel ? col : C.muted,
                    fontSize: 13, fontWeight: sel ? 700 : 500, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 5,
                    transition: "all 0.2s ease",
                    boxShadow: sel ? `0 4px 12px ${col}33` : "none",
                  }}
                >
                  {sel ? (
                    <svg style={{ width: 13, height: 13 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg style={{ width: 13, height: 13 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="9" />
                    </svg>
                  )}
                  {s}
                </button>
              );
            })}
          </div>
          {selectedSituations.length === 0 && (
            <p style={{ color: C.error, fontSize: 11.5, marginTop: 8 }}>
              Select at least one situation.
            </p>
          )}
        </div>

        {/* ── Sticky action bar ───────────────────────── */}
        <div style={{
          display: "flex", gap: 12, padding: "16px 24px",
          borderTop: `1px solid ${C.border}`, background: "#fff",
        }}>
          <button
            type="button" onClick={onCancel}
            style={{
              flex: 1, padding: 14, borderRadius: 16, background: C.surface,
              color: C.muted, fontWeight: 600, fontSize: 14.5,
              border: `1px solid ${C.border}`, cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="submit" disabled={!isValid}
            style={{
              flex: 2, padding: 14, borderRadius: 16,
              background: isValid ? `linear-gradient(135deg, ${C.primary}, ${C.accent})` : C.border,
              color: isValid ? "#fff" : C.muted,
              fontWeight: 700, fontSize: 14.5,
              boxShadow: isValid ? "0 8px 24px rgba(91,63,232,0.35)" : "none",
              border: "none", cursor: isValid ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "all 0.2s ease",
            }}
          >
            <svg style={{ width: 17, height: 17 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Save Changes
          </button>
        </div>
      </div>
    </form>
  );
}