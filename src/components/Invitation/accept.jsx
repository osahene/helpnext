"use client";
import React, { useEffect } from "react";
import { ContactInfo, Invite } from "@/redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Accept() {
  const contDetail = useSelector((state) => state.contact.contactDetails || []);
  const dispatch = useDispatch();
  const router = useRouter();
  const search = useSearchParams();
  const contactId = search.get("contact_id");
  const token = search.get("token");

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        await dispatch(ContactInfo(contactId)).unwrap();
      } catch {
        toast.error("Failed to fetch contact information.");
      }
    };
    fetchContactData();
  }, [contactId, dispatch]);

  const handleStatusChange = async (status) => {
    try {
      const response = await dispatch(Invite({ contact_id: contactId, action: status, token }));
      if (response.meta.requestStatus === "fulfilled") {
        toast.success(response.payload?.message || "Status updated successfully.", { duration: 5000 });
        router.push("/guestInvite/invite");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status.", { duration: 5000 });
    }
  };

  const isAccept = true; // used to derive a neutral layout — both actions available

  return (
    <div style={{ width: "100%", maxWidth: "480px", padding: "20px" }}>
      {/* ── Card ─────────────────────────────────────────── */}
      <div style={{
        background: "#fff",
        borderRadius: "28px",
        overflow: "hidden",
        boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
        border: "1px solid #DDE3F5",
      }}>
        {/* Gradient header */}
        <div style={{
          background: "linear-gradient(135deg, #1A0A0A 0%, #6B0F0F 100%)",
          padding: "28px 24px",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Bubbles */}
          <div style={{ position: "absolute", top: "-24px", right: "-24px", width: "110px", height: "110px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-16px", left: "-16px", width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

          {/* Icon */}
          <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(255,255,255,0.14)", border: "1.5px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
            <svg style={{ width: "26px", height: "26px", color: "#fff" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>

          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px", marginBottom: "6px" }}>
            NOMINATION CONSENT
          </p>
          <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
            Hello, {contDetail.contact_first_name} {contDetail.contact_last_name} 👋
          </h2>
        </div>

        {/* Body */}
        <div style={{ padding: "24px" }}>
          {/* Info box */}
          <div style={{
            background: "#F0F4FF",
            borderRadius: "16px",
            padding: "16px 18px",
            border: "1px solid #DDE3F5",
            marginBottom: "22px",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                <svg style={{ width: "16px", height: "16px", color: "#5B3FE8" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <p style={{ color: "#0F1B3E", fontSize: "14px", lineHeight: 1.65 }}>
                <strong style={{ color: "#CC2222" }}>{contDetail.sender_name}</strong> has nominated you as an emergency contact. In case of an emergency, you will be notified on their behalf.
              </p>
            </div>
          </div>

          {/* Divider label */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
            <div style={{ flex: 1, height: "1px", background: "#DDE3F5" }} />
            <p style={{ color: "#8B94B2", fontSize: "11px", fontWeight: 600, letterSpacing: "0.8px" }}>YOUR RESPONSE</p>
            <div style={{ flex: 1, height: "1px", background: "#DDE3F5" }} />
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "12px" }}>
            {/* Reject */}
            <button
              onClick={() => handleStatusChange("rejected")}
              style={{
                flex: 1, padding: "14px", borderRadius: "16px",
                background: "#FFF0F0", color: "#CC2222",
                fontWeight: 700, fontSize: "14.5px",
                border: "1.5px solid #FFCCCC", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#FFE0E0"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#FFF0F0"; }}
            >
              <svg style={{ width: "17px", height: "17px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reject
            </button>

            {/* Accept */}
            <button
              onClick={() => handleStatusChange("approved")}
              style={{
                flex: 2, padding: "14px", borderRadius: "16px",
                background: "linear-gradient(135deg, #1A9E5C, #0D7A45)",
                color: "#fff", fontWeight: 700, fontSize: "14.5px",
                border: "none", cursor: "pointer",
                boxShadow: "0 8px 24px rgba(26,158,92,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.92"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            >
              <svg style={{ width: "17px", height: "17px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Accept
            </button>
          </div>

          <p style={{ textAlign: "center", color: "#8B94B2", fontSize: "11.5px", marginTop: "14px" }}>
            Your response will be sent to {contDetail.sender_name}.
          </p>
        </div>
      </div>
    </div>
  );
}
