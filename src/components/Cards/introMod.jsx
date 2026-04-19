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

              {/* CTA button */}
              <button
                onClick={handleClose}
                style={{
                  width: "100%", padding: "15px", borderRadius: "18px",
                  background: "linear-gradient(135deg, #2C5FD4, #5B3FE8)",
                  color: "#fff", fontWeight: 700, fontSize: "15.5px",
                  boxShadow: "0 8px 24px rgba(91,63,232,0.35)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                  cursor: "pointer",
                }}
              >
                <svg style={{ width: "18px", height: "18px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                Proceed to App
              </button>

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
