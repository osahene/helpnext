"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import apiService from "@/utils/axios";
import { getRefreshToken } from "@/utils/authCookies";
import { logout } from "@/redux/authSlice";
import RequestHistory from "./RequestHistory";

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

  // Runs after the user picked a reason and approved the goodbye modal.
  const runAccountAction = async (action, reason, reasonDetails) => {
    setBusyAction(action);
    try {
      await apiService.updateAccountStatus(action, getRefreshToken(), reason, reasonDetails);
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

        {/* ── Alert stats + request history ─────────────── */}
        <RequestHistory />

        {/* ── Account actions ────────────────────────────── */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "22px", border: "1.5px solid #FFCCCC", boxShadow: "0 4px 16px rgba(204,34,34,0.06)" }}>
          <p style={{ color: "#CC2222", fontSize: "11px", fontWeight: 700, letterSpacing: "1.2px", marginBottom: "14px" }}>ACCOUNT ACTIONS</p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <AccountActionButton action={DEACTIVATE} busy={busyAction} onConfirmed={runAccountAction} />
            <AccountActionButton action={DELETE} busy={busyAction} onConfirmed={runAccountAction} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Reason keys must match helpflutter's profile_screen.dart and
// HelpAdminNuxt's users/[id].vue (which shows them to admins).
const DEACTIVATE_REASONS = [
  { key: "break", label: "I need a break and will come back later" },
  { key: "notifications", label: "I'm getting too many notifications" },
  { key: "new_phone", label: "I'm changing my phone or phone number" },
  { key: "privacy_location", label: "I'm not comfortable sharing my location right now" },
  { key: "not_working", label: "The app isn't working properly for me" },
];

const DELETE_REASONS = [
  { key: "no_longer_needed", label: "I no longer need an emergency alert app" },
  { key: "data_privacy", label: "I'm worried about how my personal data is used" },
  { key: "found_alternative", label: "I've found another app that works better for me" },
  { key: "contacts_unresponsive", label: "My emergency contacts don't use it or respond to it" },
  { key: "delivery_problems", label: "Alerts or login codes didn't reach me or my contacts" },
];

const DEACTIVATE = {
  key: "deactivate",
  title: "Deactivate Account",
  description:
    "You'll be logged out straight away and your contacts will stop receiving your alerts. Nothing is deleted, but you can't reactivate it yourself — contact support to come back.",
  reasons: DEACTIVATE_REASONS,
  color: "#0F1B3E",
  goodbye: "Your account will be deactivated now. We hope you come back soon.",
};

const DELETE = {
  key: "delete",
  title: "Delete Account",
  description: (
    <>
      You&apos;ll be logged out straight away. After 30 days your account and everything in it — emergency contacts and alert history — is permanently deleted and can&apos;t be recovered. Contact support within 30 days if you change your mind. See our{" "}
      <Link href="/legal/delete" style={{ color: "#2C5FD4" }}>data deletion policy</Link>.
    </>
  ),
  reasons: DELETE_REASONS,
  color: "#CC2222",
  goodbye: "Your account will be deactivated now and permanently deleted after 30 days. We hope to see you again.",
};

// The flow: button -> modal asking why (one listed reason, or "Other" in
// their own words) -> "We are sorry to see you leave" -> Confirm starts it.
// Cancel at either step stops everything; nothing is sent until then.
function AccountActionButton({ action, busy, onConfirmed }) {
  const [step, setStep] = useState(null); // null | "reason" | "goodbye"
  const [choice, setChoice] = useState(null);

  const cancel = () => {
    setStep(null);
    setChoice(null);
  };

  return (
    <>
      <button
        disabled={busy !== null}
        onClick={() => setStep("reason")}
        style={{
          width: "100%", padding: "13px 16px", borderRadius: "12px", border: "none",
          background: action.color, color: "#fff", fontWeight: 700, fontSize: "14px",
          cursor: busy === null ? "pointer" : "not-allowed", opacity: busy === null ? 1 : 0.4,
        }}
      >
        {busy === action.key ? "Please wait…" : action.title}
      </button>

      {step === "reason" && (
        <ReasonModal
          action={action}
          onCancel={cancel}
          onConfirm={(picked) => {
            setChoice(picked);
            setStep("goodbye");
          }}
        />
      )}
      {step === "goodbye" && (
        <GoodbyeModal
          action={action}
          onCancel={cancel}
          onConfirm={() => {
            const picked = choice;
            cancel();
            onConfirmed(action.key, picked.reason, picked.details);
          }}
        />
      )}
    </>
  );
}

function Modal({ onCancel, children, maxWidth = "420px" }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
      style={{
        position: "fixed", inset: 0, zIndex: 60, background: "rgba(15,27,62,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "16px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: "22px", padding: "24px",
          maxWidth, width: "100%", maxHeight: "calc(100vh - 32px)", overflowY: "auto",
          boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function ModalActions({ color, canConfirm = true, onCancel, onConfirm }) {
  return (
    <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
      <button
        onClick={onCancel}
        style={{
          flex: 1, padding: "12px", borderRadius: "14px", border: "1px solid #DDE3F5",
          background: "#fff", color: "#5B6481", fontWeight: 700, fontSize: "14px", cursor: "pointer",
        }}
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        disabled={!canConfirm}
        style={{
          flex: 1, padding: "12px", borderRadius: "14px", border: "none",
          background: color, color: "#fff", fontWeight: 700, fontSize: "14px",
          cursor: canConfirm ? "pointer" : "not-allowed", opacity: canConfirm ? 1 : 0.4,
        }}
      >
        Confirm
      </button>
    </div>
  );
}

// Step 1: what this does, and why they're leaving.
function ReasonModal({ action, onCancel, onConfirm }) {
  const [reason, setReason] = useState(null);
  const [other, setOther] = useState("");
  const options = [...action.reasons, { key: "other", label: "Other" }];
  const canConfirm = Boolean(reason && (reason !== "other" || other.trim()));

  return (
    <Modal onCancel={onCancel}>
      <p style={{ color: "#0F1B3E", fontWeight: 800, fontSize: "18px", marginBottom: "6px" }}>{action.title}</p>
      <p style={{ color: "#5B6481", fontSize: "13.5px", lineHeight: 1.6, marginBottom: "14px" }}>{action.description}</p>

      <p style={{ color: "#0F1B3E", fontWeight: 700, fontSize: "13px", marginBottom: "8px" }}>Please tell us why</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {options.map((option) => (
          <label key={option.key} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13.5px", color: "#0F1B3E", cursor: "pointer" }}>
            <input
              type="radio"
              name={`${action.key}-reason`}
              value={option.key}
              checked={reason === option.key}
              onChange={() => setReason(option.key)}
              style={{ accentColor: action.color, width: "16px", height: "16px", flexShrink: 0 }}
            />
            {option.label}
          </label>
        ))}
      </div>
      {reason === "other" && (
        <textarea
          autoFocus
          value={other}
          onChange={(e) => setOther(e.target.value)}
          maxLength={500}
          rows={3}
          placeholder="Tell us in your own words"
          style={{
            width: "100%", padding: "10px 12px", borderRadius: "12px", border: "1px solid #DDE3F5",
            fontSize: "13.5px", marginTop: "10px", background: "#F8FAFF", resize: "vertical",
          }}
        />
      )}

      <ModalActions
        color={action.color}
        canConfirm={canConfirm}
        onCancel={onCancel}
        onConfirm={() => onConfirm({ reason, details: reason === "other" ? other.trim() : "" })}
      />
    </Modal>
  );
}

// Step 2, the last chance to back out.
function GoodbyeModal({ action, onCancel, onConfirm }) {
  return (
    <Modal onCancel={onCancel} maxWidth="380px">
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "44px", marginBottom: "10px" }} aria-hidden="true">😔</div>
        <p style={{ color: "#0F1B3E", fontWeight: 800, fontSize: "18px", lineHeight: 1.4, marginBottom: "8px" }}>
          We are sorry to see you leave
        </p>
        <p style={{ color: "#5B6481", fontSize: "13.5px", lineHeight: 1.6 }}>{action.goodbye}</p>
      </div>
      <ModalActions color={action.color} onCancel={onCancel} onConfirm={onConfirm} />
    </Modal>
  );
}
