"use client";
import React from "react";
import { useSelector } from "react-redux";
import Link from "next/link";

export default function Invite() {
  const contactData = useSelector((state) => state.contact.contactDetails || []);

  const steps = [
    {
      number: "01",
      color: "#2C5FD4",
      bg: "#EEF4FF",
      title: "Enable Location",
      desc: "Turn on your device's location services for accurate emergency alerts.",
    },
    {
      number: "02",
      color: "#E8500A",
      bg: "#FFF3EE",
      title: "Tap Your Emergency",
      desc: "Select the type of emergency situation you are facing.",
    },
    {
      number: "03",
      color: "#1A9E5C",
      bg: "#EDFBF3",
      title: "Contacts Notified",
      desc: "Your ICE list receives an automated message and voice call instantly.",
    },
  ];

  return (
    <div style={{ width: "100%", maxWidth: "480px", padding: "20px" }}>
      <div style={{
        background: "#fff",
        borderRadius: "28px",
        overflow: "hidden",
        boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
        border: "1px solid #DDE3F5",
      }}>
        {/* Gradient header */}
        <div style={{
          background: "linear-gradient(135deg, #0D1B4B 0%, #2C5FD4 100%)",
          padding: "28px 24px",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: "-24px", right: "-24px", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-18px", left: "-18px", width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

          {/* Animated live dot */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <span style={{ position: "relative", display: "inline-flex" }}>
              <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#FF3B3B", opacity: 0.7, animation: "ping 1s cubic-bezier(0,0,0.2,1) infinite" }} />
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#FF3B3B", display: "block", position: "relative" }} />
            </span>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "11px", fontWeight: 700, letterSpacing: "1.4px" }}>
              YOU'VE BEEN INVITED
            </p>
          </div>

          <h2 style={{ color: "#fff", fontSize: "21px", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "5px" }}>
            Hello, {contactData.contact_first_name} {contactData.contact_last_name}! 👋
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13.5px", lineHeight: 1.5 }}>
            Welcome to Help OO Help — your personal emergency alert platform.
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: "24px" }}>
          {/* Intro text */}
          <div style={{
            background: "#F0F4FF",
            borderRadius: "16px",
            padding: "16px 18px",
            border: "1px solid #DDE3F5",
            marginBottom: "20px",
          }}>
            <p style={{ color: "#0F1B3E", fontSize: "13.5px", lineHeight: 1.7 }}>
              Help OO Help lets people quickly reach their loved ones during emergencies.
              With <strong>location enabled</strong> and a single tap, an automated message
              and voice call is sent to their <strong>In Case of Emergency (ICE)</strong> list.
              Click <strong>Let's Go</strong> to create your own ICE list now.
            </p>
          </div>

          {/* How it works */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <div style={{ width: "4px", height: "16px", background: "#2C5FD4", borderRadius: "2px" }} />
            <p style={{ color: "#2C5FD4", fontSize: "11px", fontWeight: 700, letterSpacing: "1.4px" }}>HOW IT WORKS</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
            {steps.map((s, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: "12px",
                background: "#F8FAFF", borderRadius: "14px",
                padding: "13px 14px", border: "1px solid #DDE3F5",
              }}>
                <div style={{
                  width: "34px", height: "34px", borderRadius: "10px",
                  background: s.bg, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ color: s.color, fontWeight: 800, fontSize: "12px" }}>{s.number}</span>
                </div>
                <div>
                  <p style={{ color: "#0F1B3E", fontWeight: 700, fontSize: "13.5px", marginBottom: "2px" }}>{s.title}</p>
                  <p style={{ color: "#8B94B2", fontSize: "12px", lineHeight: 1.5 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "12px" }}>
            <Link href="/" style={{ flex: 1 }}>
              <button style={{
                width: "100%", padding: "13px", borderRadius: "16px",
                background: "#F0F4FF", color: "#8B94B2",
                fontWeight: 600, fontSize: "14px",
                border: "1px solid #DDE3F5", cursor: "pointer",
              }}>
                Maybe Later
              </button>
            </Link>
            <Link href="/auth/register" style={{ flex: 2 }}>
              <button style={{
                width: "100%", padding: "13px", borderRadius: "16px",
                background: "linear-gradient(135deg, #2C5FD4, #5B3FE8)",
                color: "#fff", fontWeight: 700, fontSize: "14px",
                border: "none", cursor: "pointer",
                boxShadow: "0 8px 24px rgba(91,63,232,0.38)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              }}>
                <svg style={{ width: "16px", height: "16px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                Let's Go
              </button>
            </Link>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
