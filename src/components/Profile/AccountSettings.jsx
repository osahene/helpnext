"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import apiService from "@/utils/axios";
import { getRefreshToken } from "@/utils/authCookies";
import { logout } from "@/redux/authSlice";

// "Deactivate" and "Delete" both end the session immediately — is_active is
// checked on every authenticated request (see account.authentication /
// JWTAuthentication.get_user()), so there is no way to stay logged in after
// either action succeeds, and no way to self-undo afterwards. That's why
// both confirmations below say so explicitly rather than leaving it implied.
export default function AccountSettings() {
  const dispatch = useDispatch();
  const router = useRouter();
  const first_name = useSelector((state) => state.auth.first_name);
  const last_name = useSelector((state) => state.auth.last_name);
  const email = useSelector((state) => state.auth.email);
  const phone_number = useSelector((state) => state.auth.phone_number);
  const [busyAction, setBusyAction] = useState(null); // 'deactivate' | 'delete' | null

  const initials = `${first_name?.[0] ?? ""}${last_name?.[0] ?? ""}`.toUpperCase();

  const endSession = () => {
    dispatch(logout());
    router.push("/");
  };

  const runAccountAction = async (action, confirmMessage) => {
    if (!window.confirm(confirmMessage)) return;
    setBusyAction(action);
    try {
      await apiService.updateAccountStatus(action, getRefreshToken());
      toast.success(
        action === "deactivate"
          ? "Your account has been deactivated."
          : "Your account is scheduled for permanent deletion in 30 days.",
        { duration: 6000 }
      );
      endSession();
    } catch (error) {
      console.error(`Failed to ${action} account:`, error);
      toast.error("That didn't go through. Please try again.");
    } finally {
      setBusyAction(null);
    }
  };

  return (
    <div style={{ background: "#F0F4FF", minHeight: "100vh" }} className="pt-20 pb-10">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="px-5 pt-6 pb-4">
        <div style={{
          background: "linear-gradient(135deg, #0D1B4B, #2C5FD4)",
          borderRadius: "22px", padding: "20px",
          boxShadow: "0 8px 32px rgba(44,95,212,0.25)",
          display: "flex", alignItems: "center", gap: "14px",
        }}>
          <div style={{
            width: "52px", height: "52px", borderRadius: "16px",
            background: "rgba(255,255,255,0.14)", border: "1.5px solid rgba(255,255,255,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 800, fontSize: "18px", flexShrink: 0,
          }}>
            {initials || "?"}
          </div>
          <div>
            <p style={{ color: "#fff", fontWeight: 800, fontSize: "19px", letterSpacing: "-0.02em", marginBottom: "3px" }}>
              {first_name} {last_name}
            </p>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>Profile &amp; Account</p>
          </div>
        </div>
      </div>

      <div className="px-5" style={{ maxWidth: "640px", margin: "0 auto" }}>
        {/* ── Account info ──────────────────────────────── */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "22px", marginBottom: "20px", border: "1px solid #DDE3F5", boxShadow: "0 4px 16px rgba(44,95,212,0.06)" }}>
          <p style={{ color: "#8B94B2", fontSize: "11px", fontWeight: 700, letterSpacing: "1.2px", marginBottom: "14px" }}>ACCOUNT INFORMATION</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <p style={{ color: "#8B94B2", fontSize: "12px" }}>Email</p>
              <p style={{ color: "#0F1B3E", fontWeight: 600, fontSize: "14.5px" }}>{email || "—"}</p>
            </div>
            <div>
              <p style={{ color: "#8B94B2", fontSize: "12px" }}>Phone Number</p>
              <p style={{ color: "#0F1B3E", fontWeight: 600, fontSize: "14.5px" }}>{phone_number || "—"}</p>
            </div>
          </div>
        </div>

        {/* ── Danger zone ────────────────────────────────── */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "22px", border: "1.5px solid #FFCCCC", boxShadow: "0 4px 16px rgba(204,34,34,0.06)" }}>
          <p style={{ color: "#CC2222", fontSize: "11px", fontWeight: 700, letterSpacing: "1.2px", marginBottom: "14px" }}>ACCOUNT ACTIONS</p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ background: "#F8FAFF", borderRadius: "16px", padding: "16px", border: "1px solid #DDE3F5" }}>
              <p style={{ color: "#0F1B3E", fontWeight: 700, fontSize: "14.5px", marginBottom: "4px" }}>Deactivate Account</p>
              <p style={{ color: "#8B94B2", fontSize: "13px", lineHeight: 1.6, marginBottom: "12px" }}>
                Logs you out immediately and stops all alerts/notifications. Nothing is deleted — contact support to reactivate.
              </p>
              <button
                disabled={busyAction !== null}
                onClick={() => runAccountAction(
                  "deactivate",
                  "Deactivate your account? You'll be logged out immediately and won't be able to log back in yourself — contact support to reactivate."
                )}
                style={{
                  padding: "9px 16px", borderRadius: "12px", border: "1px solid #DDE3F5",
                  background: "#fff", color: "#0F1B3E", fontWeight: 700, fontSize: "13.5px",
                  cursor: busyAction !== null ? "not-allowed" : "pointer",
                  opacity: busyAction !== null ? 0.6 : 1,
                }}
              >
                {busyAction === "deactivate" ? "Deactivating…" : "Deactivate Account"}
              </button>
            </div>

            <div style={{ background: "#FFF8F8", borderRadius: "16px", padding: "16px", border: "1px solid #FFE0E0" }}>
              <p style={{ color: "#0F1B3E", fontWeight: 700, fontSize: "14.5px", marginBottom: "4px" }}>Delete Account</p>
              <p style={{ color: "#8B94B2", fontSize: "13px", lineHeight: 1.6, marginBottom: "12px" }}>
                Logs you out immediately. Your account and all data — emergency contacts, alert history, everything — is permanently deleted after 30 days. See our{" "}
                <Link href="/legal/delete" style={{ color: "#2C5FD4" }}>data deletion policy</Link>.
              </p>
              <button
                disabled={busyAction !== null}
                onClick={() => runAccountAction(
                  "delete",
                  "Delete your account? You'll be logged out immediately, and everything — your profile, emergency contacts, and alert history — will be permanently deleted in 30 days. This cannot be undone by you once it starts; contact support within 30 days if you change your mind."
                )}
                style={{
                  padding: "9px 16px", borderRadius: "12px", border: "none",
                  background: "#CC2222", color: "#fff", fontWeight: 700, fontSize: "13.5px",
                  cursor: busyAction !== null ? "not-allowed" : "pointer",
                  opacity: busyAction !== null ? 0.6 : 1,
                }}
              >
                {busyAction === "delete" ? "Submitting…" : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
