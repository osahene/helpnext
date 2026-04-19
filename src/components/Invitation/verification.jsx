"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import apiService from "@/utils/axios";
import toast from "react-hot-toast";

export default function Verification() {
  const [names, setNames] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const router = useRouter();
  const search = useSearchParams();
  const token = search.get("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiService.decodeEmrgencyToken(token);
        if (res.data.verification_status) setVerificationStatus("verified");
        setNames(res.data);
      } catch (err) {
        setError(err.response?.data?.error || "Invalid or expired token.");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
    else { setError("No verification token provided."); setLoading(false); }
  }, [token]);

  const handleVerification = async () => {
    try {
      const res = await apiService.verifyEmergency(token);
      if (res.status === 200) {
        toast.success("Verified successfully.", { duration: 5000 });
        setVerificationStatus("verified");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Verification failed.", { duration: 5000 });
    }
  };

  // ── Loading ─────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ width: "100%", maxWidth: "420px", padding: "20px" }}>
        <div style={{
          background: "#fff", borderRadius: "28px", padding: "48px 24px",
          textAlign: "center", boxShadow: "0 24px 80px rgba(0,0,0,0.12)",
          border: "1px solid #DDE3F5",
        }}>
          <div style={{
            width: "56px", height: "56px", borderRadius: "50%",
            border: "3px solid #DDE3F5", borderTopColor: "#2C5FD4",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 16px",
          }} />
          <p style={{ color: "#0F1B3E", fontWeight: 700, fontSize: "16px", marginBottom: "6px" }}>
            Loading verification…
          </p>
          <p style={{ color: "#8B94B2", fontSize: "13px" }}>Please wait a moment</p>
          <style jsx global>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────
  if (error) {
    return (
      <div style={{ width: "100%", maxWidth: "420px", padding: "20px" }}>
        <div style={{
          background: "#fff", borderRadius: "28px",
          overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.15)",
          border: "1px solid #DDE3F5",
        }}>
          <div style={{ background: "linear-gradient(135deg, #CC2222, #8B0000)", padding: "28px 24px" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <svg style={{ width: "26px", height: "26px", color: "#fff" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p style={{ color: "#fff", fontWeight: 800, fontSize: "20px", textAlign: "center", marginBottom: "4px" }}>Something went wrong</p>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", textAlign: "center" }}>Token error</p>
          </div>
          <div style={{ padding: "22px 24px 24px" }}>
            <div style={{ background: "#FFF8F8", borderRadius: "14px", padding: "14px 16px", border: "1px solid #FFE0E0", marginBottom: "20px" }}>
              <p style={{ color: "#CC2222", fontSize: "14px", lineHeight: 1.6 }}>{error}</p>
            </div>
            <button
              onClick={() => router.push("/")}
              style={{
                width: "100%", padding: "14px", borderRadius: "16px",
                background: "linear-gradient(135deg, #2C5FD4, #5B3FE8)",
                color: "#fff", fontWeight: 700, fontSize: "14.5px",
                border: "none", cursor: "pointer",
                boxShadow: "0 8px 24px rgba(91,63,232,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              }}
            >
              <svg style={{ width: "16px", height: "16px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Already verified ─────────────────────────────────────
  if (verificationStatus === "verified") {
    return (
      <div style={{ width: "100%", maxWidth: "420px", padding: "20px" }}>
        <div style={{
          background: "#fff", borderRadius: "28px",
          overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.15)",
          border: "1px solid #DDE3F5",
        }}>
          <div style={{ background: "linear-gradient(135deg, #1A9E5C, #0D7A45)", padding: "32px 24px", textAlign: "center" }}>
            <div style={{ position: "relative", width: "72px", height: "72px", margin: "0 auto 16px" }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(255,255,255,0.2)", animation: "pingOnce 1s ease-out forwards" }} />
              <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.35)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <svg style={{ width: "32px", height: "32px", color: "#fff" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <p style={{ color: "#fff", fontWeight: 800, fontSize: "21px", marginBottom: "5px" }}>Verified! ✓</p>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "13.5px" }}>Alert confirmed successfully</p>
          </div>
          <div style={{ padding: "22px 24px 24px" }}>
            <div style={{ background: "#EDFBF3", borderRadius: "14px", padding: "14px 16px", border: "1px solid #B2EECC", marginBottom: "20px" }}>
              <p style={{ color: "#0F1B3E", fontSize: "14px", lineHeight: 1.65 }}>
                Thank you for confirming this emergency alert. The sender has been notified of your response.
              </p>
            </div>
            <button
              onClick={() => router.push("/")}
              style={{
                width: "100%", padding: "14px", borderRadius: "16px",
                background: "linear-gradient(135deg, #2C5FD4, #5B3FE8)",
                color: "#fff", fontWeight: 700, fontSize: "14.5px",
                border: "none", cursor: "pointer",
                boxShadow: "0 8px 24px rgba(91,63,232,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              }}
            >
              <svg style={{ width: "16px", height: "16px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Awaiting verification ────────────────────────────────
  return (
    <div style={{ width: "100%", maxWidth: "480px", padding: "20px" }}>
      <div style={{
        background: "#fff", borderRadius: "28px",
        overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
        border: "1px solid #DDE3F5",
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #3D0000 0%, #CC2222 100%)",
          padding: "28px 24px", position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: "-24px", right: "-24px", width: "110px", height: "110px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-16px", left: "-16px", width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

          <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(255,255,255,0.14)", border: "1.5px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
            <svg style={{ width: "26px", height: "26px", color: "#fff" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px", marginBottom: "6px" }}>
            EMERGENCY ALERT VERIFICATION
          </p>
          {names && (
            <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
              Hello, {names.contact_first_name} {names.contact_last_name} 👋
            </h2>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: "24px" }}>
          {names && (
            <div style={{
              background: "#FFF8F8", borderRadius: "16px",
              padding: "16px 18px", border: "1px solid #FFE0E0", marginBottom: "16px",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#FFF0F0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                  <svg style={{ width: "16px", height: "16px", color: "#CC2222" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <p style={{ color: "#0F1B3E", fontSize: "14px", lineHeight: 1.65 }}>
                    This is an authentic emergency alert from{" "}
                    <strong style={{ color: "#CC2222" }}>
                      {names.user_first_name} {names.user_last_name}
                    </strong>.
                    Please verify to confirm you've received it.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Location info note */}
          <div style={{
            background: "#F0F4FF", borderRadius: "14px",
            padding: "12px 14px", border: "1px solid #DDE3F5",
            display: "flex", alignItems: "center", gap: "10px", marginBottom: "22px",
          }}>
            <svg style={{ width: "15px", height: "15px", color: "#2C5FD4", flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p style={{ color: "#8B94B2", fontSize: "12.5px" }}>
              Verifying confirms you are aware of this emergency.
            </p>
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
            <div style={{ flex: 1, height: "1px", background: "#DDE3F5" }} />
            <p style={{ color: "#8B94B2", fontSize: "11px", fontWeight: 600, letterSpacing: "0.8px" }}>YOUR RESPONSE</p>
            <div style={{ flex: 1, height: "1px", background: "#DDE3F5" }} />
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => router.push("/")}
              style={{
                flex: 1, padding: "14px", borderRadius: "16px",
                background: "#F0F4FF", color: "#8B94B2",
                fontWeight: 600, fontSize: "14px",
                border: "1px solid #DDE3F5", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
              }}
            >
              <svg style={{ width: "15px", height: "15px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Exit
            </button>
            <button
              onClick={handleVerification}
              style={{
                flex: 2, padding: "14px", borderRadius: "16px",
                background: "linear-gradient(135deg, #CC2222, #8B0000)",
                color: "#fff", fontWeight: 700, fontSize: "14.5px",
                border: "none", cursor: "pointer",
                boxShadow: "0 8px 24px rgba(204,34,34,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.92"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            >
              <svg style={{ width: "17px", height: "17px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Verify Alert
            </button>
          </div>

          <p style={{ textAlign: "center", color: "#8B94B2", fontSize: "11.5px", marginTop: "14px" }}>
            Your confirmation will be sent to the alert sender.
          </p>
        </div>
      </div>
    </div>
  );
}
