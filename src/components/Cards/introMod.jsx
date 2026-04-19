"use client";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import emergency from "../../../public/img/emergency.svg";

const steps = [
  {
    number: "01",
    color: "#2C5FD4",
    bg: "#EEF4FF",
    title: "Enable Location",
    description: "Make sure your device's location services are turned on for accurate alerts.",
  },
  {
    number: "02",
    color: "#E8500A",
    bg: "#FFF3EE",
    title: "Tap Your Emergency",
    description: "Select the type of emergency situation you are currently facing.",
  },
  {
    number: "03",
    color: "#1A9E5C",
    bg: "#EDFBF3",
    title: "Sit Back & Wait",
    description: "All approved contacts on your emergency list will be notified instantly.",
  },
];

export default function IntroModal({ onClose }) {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            style={{
              background: "#fff",
              borderRadius: "28px",
              width: "100%",
              maxWidth: "460px",
              overflow: "hidden",
              boxShadow: "0 32px 80px rgba(0,0,0,0.35)",
            }}
            initial={{ scale: 0.85, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.85, y: 24 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
          >
            {/* ── Gradient Header ──────────────────────────────── */}
            <div
              style={{
                background: "linear-gradient(135deg, #1A0A0A 0%, #6B0F0F 100%)",
                padding: "32px 28px 36px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Bubble decorations */}
              <div style={{
                position: "absolute", top: "-24px", right: "-24px",
                width: "120px", height: "120px", borderRadius: "50%",
                background: "rgba(255,255,255,0.05)", pointerEvents: "none",
              }} />
              <div style={{
                position: "absolute", bottom: "-16px", left: "-16px",
                width: "80px", height: "80px", borderRadius: "50%",
                background: "rgba(255,255,255,0.04)", pointerEvents: "none",
              }} />

              {/* Icon badge */}
              <div style={{
                width: "56px", height: "56px", borderRadius: "16px",
                background: "rgba(255,255,255,0.14)",
                border: "1.5px solid rgba(255,255,255,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "16px",
              }}>
                <Image src={emergency} alt="emergency" width={28} height={28}
                  style={{ filter: "brightness(0) invert(1)" }} />
              </div>

              <h2 style={{
                color: "#fff", fontSize: "22px", fontWeight: 800,
                letterSpacing: "-0.02em", marginBottom: "6px",
              }}>
                Welcome to Help OO Help
              </h2>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13.5px", lineHeight: 1.5 }}>
                Your personal emergency alert platform. Here's how it works.
              </p>

              {/* Live dot */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "14px" }}>
                <span style={{ position: "relative", display: "inline-flex" }}>
                  <span style={{
                    position: "absolute", inset: 0, borderRadius: "50%",
                    background: "#FF3B3B", opacity: 0.75,
                    animation: "ping 1s cubic-bezier(0,0,0.2,1) infinite",
                  }} />
                  <span style={{
                    width: "8px", height: "8px", borderRadius: "50%",
                    background: "#FF3B3B", display: "block", position: "relative",
                  }} />
                </span>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", fontWeight: 600, letterSpacing: "1.2px" }}>
                  ALWAYS READY
                </span>
              </div>
            </div>

            {/* ── Steps ────────────────────────────────────────── */}
            <div style={{ padding: "24px 24px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <div style={{ width: "4px", height: "16px", background: "#2C5FD4", borderRadius: "2px" }} />
                <p style={{ color: "#2C5FD4", fontSize: "11px", fontWeight: 700, letterSpacing: "1.4px" }}>
                  HOW TO USE
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
                {steps.map((step, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: "14px",
                      background: "#F8FAFF",
                      borderRadius: "16px", padding: "14px 16px",
                      border: "1px solid #DDE3F5",
                    }}
                  >
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "10px",
                      background: step.bg, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <span style={{ color: step.color, fontWeight: 800, fontSize: "13px" }}>
                        {step.number}
                      </span>
                    </div>
                    <div>
                      <p style={{ color: "#0F1B3E", fontWeight: 700, fontSize: "14px", marginBottom: "2px" }}>
                        {step.title}
                      </p>
                      <p style={{ color: "#8B94B2", fontSize: "12.5px", lineHeight: 1.5 }}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Buttons Section ────────────────────────── */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {/* Store Buttons Row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {/* App Store */}
                  <button
                    onClick={() => window.open("#", "_blank")}
                    style={{
                      background: "#000", color: "#fff", padding: "10px 12px", borderRadius: "12px",
                      display: "flex", alignItems: "center", gap: "8px", border: "none", cursor: "pointer"
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 384 512" fill="currentColor">
                      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 21.8-88.5 21.8-11.4 0-51.1-22.2-84.6-21-44 1.2-83.9 25.4-106.3 64.1-46 79.5-11.8 197.7 32.2 261.2 21.4 31.1 47.3 65.2 80.7 64 32.1-1.1 44.4-20.3 83.3-20.3 38.3 0 50 20.3 83.3 19.7 33.9-.6 56-30.5 77.3-61.5 24.5-35.5 34.5-69.9 34.8-71.6-.8-.3-67-25.7-67.2-102.5zM249.2 85.1C269.4 61.2 283.4 28.1 279.7 0c-26 1.1-57.4 17.2-76 38.6-16.7 19.3-31.1 52.7-27.2 79.7 29.1 2.3 58.4-15.6 72.7-33.2z"/>
                    </svg>
                    <div style={{ textAlign: "left", lineHeight: "1" }}>
                      <div style={{ fontSize: "9px", opacity: 0.8 }}>Download on the</div>
                      <div style={{ fontSize: "13px", fontWeight: "700" }}>App Store</div>
                    </div>
                  </button>

                  {/* Google Play */}
                  <button
                    onClick={() => window.open("#", "_blank")}
                    style={{
                      background: "#000", color: "#fff", padding: "10px 12px", borderRadius: "12px",
                      display: "flex", alignItems: "center", gap: "8px", border: "none", cursor: "pointer"
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 512 512" fill="currentColor">
                      <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-10.3 18-28.5-1.2-40.8zM325.3 277.7l60.1 60.1L104.6 499l220.7-221.3z"/>
                    </svg>
                    <div style={{ textAlign: "left", lineHeight: "1" }}>
                      <div style={{ fontSize: "9px", opacity: 0.8 }}>GET IT ON</div>
                      <div style={{ fontSize: "13px", fontWeight: "700" }}>Google Play</div>
                    </div>
                  </button>
                </div>

                {/* Main Proceed Button */}
                <button
                  onClick={handleClose}
                  style={{
                    width: "100%", padding: "16px", borderRadius: "18px",
                    background: "linear-gradient(135deg, #2C5FD4, #5B3FE8)",
                    color: "#fff", fontWeight: 700, fontSize: "16px",
                    boxShadow: "0 8px 24px rgba(91,63,232,0.35)",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                    border: "none", cursor: "pointer",
                  }}
                >
                  Proceed to Web App
                  <svg style={{ width: "18px", height: "18px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
              <p style={{ textAlign: "center", color: "#8B94B2", fontSize: "12px", marginTop: "12px" }}>
                By proceeding, you agree to share your location during emergencies.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
