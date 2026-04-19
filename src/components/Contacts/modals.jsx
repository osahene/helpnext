/* ─── dependantActionCard.jsx ─────────────────────────────────────────────── */
"use client";
import React, { useState } from "react";

export function DependantAction({ contact, onAction, onCancel, actionType }) {
  const isApprove = actionType === "approve";
  const name = `${contact.first_name} ${contact.last_name}`;

  return (
    <div style={{ background: "#fff", borderRadius: "24px", width: "100%", maxWidth: "380px", overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.25)" }}>
      {/* Header */}
      <div style={{
        background: isApprove ? "linear-gradient(135deg, #1A9E5C, #0D7A45)" : "linear-gradient(135deg, #CC2222, #8B0000)",
        padding: "24px 20px",
      }}>
        <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
          <svg style={{ width: "26px", height: "26px", color: "#fff" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {isApprove
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />}
          </svg>
        </div>
        <p style={{ color: "#fff", fontWeight: 800, fontSize: "18px" }}>Heads Up!</p>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "13px", marginTop: "3px" }}>Please confirm your action</p>
      </div>

      <div style={{ padding: "22px 20px 20px" }}>
        <div style={{ background: "#F0F4FF", borderRadius: "14px", padding: "14px 16px", marginBottom: "20px", border: "1px solid #DDE3F5" }}>
          <p style={{ color: "#0F1B3E", fontSize: "14px", lineHeight: 1.6 }}>
            Do you want to <strong style={{ color: isApprove ? "#1A9E5C" : "#CC2222" }}>{actionType}</strong>{" "}
            <strong>{name}</strong> as your dependent?
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={onCancel}
            style={{ flex: 1, padding: "13px", borderRadius: "14px", background: "#F0F4FF", color: "#8B94B2", fontWeight: 600, fontSize: "14px", border: "1px solid #DDE3F5", cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            onClick={onAction}
            style={{
              flex: 2, padding: "13px", borderRadius: "14px",
              background: isApprove ? "linear-gradient(135deg, #1A9E5C, #0D7A45)" : "linear-gradient(135deg, #CC2222, #8B0000)",
              color: "#fff", fontWeight: 700, fontSize: "14px",
              boxShadow: isApprove ? "0 6px 18px rgba(26,158,92,0.4)" : "0 6px 18px rgba(204,34,34,0.4)",
              border: "none", cursor: "pointer",
            }}
          >
            Yes, Proceed
          </button>
        </div>
      </div>
    </div>
  );
}

export default DependantAction;


/* ─── editInfo.jsx ─────────────────────────────────────────────────────────── */
export function EditContact({ contact, onSave, onCancel }) {
  const [formData, setFormData] = useState(contact);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };

  const fields = [
    { name: "first_name", label: "First Name", type: "text", placeholder: "John" },
    { name: "last_name", label: "Last Name", type: "text", placeholder: "Musah" },
    { name: "phone_number", label: "Phone Number", type: "text", placeholder: "+233123456789" },
    { name: "email_address", label: "Email Address", type: "email", placeholder: "johnmusah@example.com" },
    { name: "relation", label: "Relation", type: "text", placeholder: "Father" },
  ];

  return (
    <div style={{ background: "#fff", borderRadius: "24px", width: "100%", maxWidth: "420px", overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.25)" }}>
      <div style={{ background: "linear-gradient(135deg, #2C5FD4, #5B3FE8)", padding: "22px 20px" }}>
        <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
          <svg style={{ width: "22px", height: "22px", color: "#fff" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <p style={{ color: "#fff", fontWeight: 800, fontSize: "18px" }}>Edit Contact</p>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", marginTop: "3px" }}>Update emergency contact info</p>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
          {fields.map((f) => (
            <div key={f.name}>
              <label style={{ display: "block", color: "#0F1B3E", fontSize: "12px", fontWeight: 600, marginBottom: "5px", letterSpacing: "0.3px" }}>
                {f.label}
              </label>
              <input
                type={f.type} name={f.name} value={formData[f.name] || ""}
                onChange={handleChange} placeholder={f.placeholder} required
                style={{
                  width: "100%", padding: "12px 14px", borderRadius: "13px",
                  border: "1px solid #DDE3F5", background: "#F0F4FF",
                  color: "#0F1B3E", fontSize: "14px", fontWeight: 500,
                  outline: "none", boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#2C5FD4")}
                onBlur={(e) => (e.target.style.borderColor = "#DDE3F5")}
              />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button type="button" onClick={onCancel}
            style={{ flex: 1, padding: "13px", borderRadius: "14px", background: "#F0F4FF", color: "#8B94B2", fontWeight: 600, fontSize: "14px", border: "1px solid #DDE3F5", cursor: "pointer" }}>
            Cancel
          </button>
          <button type="submit"
            style={{ flex: 2, padding: "13px", borderRadius: "14px", background: "linear-gradient(135deg, #2C5FD4, #5B3FE8)", color: "#fff", fontWeight: 700, fontSize: "14px", border: "none", cursor: "pointer", boxShadow: "0 6px 18px rgba(91,63,232,0.35)" }}>
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}


/* ─── removeInfo.jsx ───────────────────────────────────────────────────────── */
export function RemoveInfo({ contact, onDelete, onCancel }) {
  const name = `${contact.first_name} ${contact.last_name}`;
  return (
    <div style={{ background: "#fff", borderRadius: "24px", width: "100%", maxWidth: "380px", overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.25)" }}>
      <div style={{ background: "linear-gradient(135deg, #CC2222, #8B0000)", padding: "24px 20px" }}>
        <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
          <svg style={{ width: "26px", height: "26px", color: "#fff" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <p style={{ color: "#fff", fontWeight: 800, fontSize: "18px" }}>Remove Contact</p>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", marginTop: "3px" }}>This action cannot be undone</p>
      </div>
      <div style={{ padding: "22px 20px 20px" }}>
        <div style={{ background: "#FFF8F8", borderRadius: "14px", padding: "14px 16px", marginBottom: "20px", border: "1px solid #FFE0E0" }}>
          <p style={{ color: "#0F1B3E", fontSize: "14px", lineHeight: 1.6 }}>
            Are you sure you want to remove{" "}
            <strong style={{ color: "#CC2222" }}>{name}</strong>{" "}
            from your emergency list?
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onCancel}
            style={{ flex: 1, padding: "13px", borderRadius: "14px", background: "#F0F4FF", color: "#8B94B2", fontWeight: 600, fontSize: "14px", border: "1px solid #DDE3F5", cursor: "pointer" }}>
            Cancel
          </button>
          <button onClick={onDelete}
            style={{ flex: 2, padding: "13px", borderRadius: "14px", background: "linear-gradient(135deg, #CC2222, #8B0000)", color: "#fff", fontWeight: 700, fontSize: "14px", border: "none", cursor: "pointer", boxShadow: "0 6px 18px rgba(204,34,34,0.4)" }}>
            Yes, Remove
          </button>
        </div>
      </div>
    </div>
  );
}
