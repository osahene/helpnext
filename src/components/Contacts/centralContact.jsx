'use client';
import { useState } from "react";
import AddContacts from "@/components/Contacts/addContact";
import Dependents from "@/components/Contacts/dependantlist";
import Emergency from "@/components/Contacts/emergencylist";

const tabs = [
  {
    id: "register",
    label: "Register",
    icon: (
      <svg style={{ width: "18px", height: "18px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
  },
  {
    id: "emergency",
    label: "My Contacts",
    icon: (
      <svg style={{ width: "18px", height: "18px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: "dependents",
    label: "Dependents",
    icon: (
      <svg style={{ width: "18px", height: "18px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
];

export default function ContactBook() {
  const [activeTab, setActiveTab] = useState("register");

  return (
    <div style={{ background: "#F0F4FF", minHeight: "100vh" }} className="pt-20 pb-24">
      {/* ── Page Header ────────────────────────────────────── */}
      <div className="px-5 pt-6 pb-4">
        <div
          style={{
            background: "linear-gradient(135deg, #2C5FD4, #5B3FE8)",
            borderRadius: "22px",
            padding: "20px",
            boxShadow: "0 8px 32px rgba(44,95,212,0.25)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Bubbles */}
          <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-15px", left: "-15px", width: "70px", height: "70px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg style={{ width: "22px", height: "22px", color: "#fff" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p style={{ color: "#fff", fontWeight: 800, fontSize: "19px", letterSpacing: "-0.02em", marginBottom: "3px" }}>My Contacts</p>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>Manage your emergency network</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tab Bar ────────────────────────────────────────── */}
      <div className="px-5 pb-4">
        <div
          style={{
            background: "#fff",
            borderRadius: "18px",
            padding: "5px",
            display: "flex",
            boxShadow: "0 2px 16px rgba(44,95,212,0.1)",
            border: "1px solid #DDE3F5",
          }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: "10px 6px",
                  borderRadius: "13px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                  background: isActive
                    ? "linear-gradient(135deg, #2C5FD4, #5B3FE8)"
                    : "transparent",
                  boxShadow: isActive ? "0 4px 14px rgba(91,63,232,0.35)" : "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <span style={{ color: isActive ? "#fff" : "#8B94B2", display: "flex" }}>
                  {tab.icon}
                </span>
                <span
                  style={{
                    color: isActive ? "#fff" : "#8B94B2",
                    fontSize: "12.5px",
                    fontWeight: isActive ? 700 : 500,
                    letterSpacing: isActive ? "0.01em" : 0,
                    whiteSpace: "nowrap",
                  }}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tab Content ────────────────────────────────────── */}
      <div className="px-5">
        {activeTab === "register" && <AddContacts />}
        {activeTab === "emergency" && <Emergency />}
        {activeTab === "dependents" && <Dependents />}
      </div>
    </div>
  );
}
