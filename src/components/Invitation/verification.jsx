"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import apiService from "@/utils/axios";
import toast from "react-hot-toast";

export default function Verification() {
  const [names, setNames] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  // Where the sender is — from the verify endpoint, which is idempotent and
  // returns the current position. Re-fetched every 15s while they're sharing
  // live location, so this page follows them until sharing stops.
  const [alertInfo, setAlertInfo] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const router = useRouter();
  const search = useSearchParams();
  const code = search.get("code");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiService.decodeEmrgencyToken(code);
        if (res.data.verification_status) setVerificationStatus("verified");
        setNames(res.data);
      } catch (err) {
        setError(err.response?.data?.error || "Invalid or expired token.");
      } finally {
        setLoading(false);
      }
    };
    if (code) fetchData();
    else { setError("No verification code provided."); setLoading(false); }
  }, [code]);

  const loadLocation = useCallback(async () => {
    try {
      const res = await apiService.verifyEmergency(code, { silent: true });
      setAlertInfo(res.data);
      setUpdatedAt(new Date());
    } catch {
      // Keep the last known position; the next refresh tries again.
    }
  }, [code]);

  // Opened again after verifying: still show where they are.
  useEffect(() => {
    if (verificationStatus === "verified" && !alertInfo) loadLocation();
  }, [verificationStatus, alertInfo, loadLocation]);

  const isLive = isLiveSharing(alertInfo);
  useEffect(() => {
    if (!isLive) return undefined;
    const timer = setInterval(loadLocation, 15000);
    return () => clearInterval(timer);
  }, [isLive, loadLocation]);

  const handleVerification = async () => {
    try {
      const res = await apiService.verifyEmergency(code);
      if (res.status === 200) {
        toast.success("Verified successfully.", { duration: 5000 });
        setVerificationStatus("verified");
        setAlertInfo(res.data);
        setUpdatedAt(new Date());
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
          background: "var(--hoh-bg-ffffff)", borderRadius: "28px", padding: "48px 24px",
          textAlign: "center", boxShadow: "0 24px 80px rgba(0,0,0,0.12)",
          border: "1px solid var(--hoh-line-dde3f5)",
        }}>
          <div style={{
            width: "56px", height: "56px", borderRadius: "50%",
            border: "3px solid var(--hoh-line-dde3f5)", borderTopColor: "#2C5FD4",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 16px",
          }} />
          <p style={{ color: "var(--hoh-text-0f1b3e)", fontWeight: 700, fontSize: "16px", marginBottom: "6px" }}>
            Loading verification…
          </p>
          <p style={{ color: "var(--hoh-text-8b94b2)", fontSize: "13px" }}>Please wait a moment</p>
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
          background: "var(--hoh-bg-ffffff)", borderRadius: "28px",
          overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.15)",
          border: "1px solid var(--hoh-line-dde3f5)",
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
            <div style={{ background: "var(--hoh-bg-fff8f8)", borderRadius: "14px", padding: "14px 16px", border: "1px solid var(--hoh-line-ffe0e0)", marginBottom: "20px" }}>
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
      <div style={{ width: "100%", maxWidth: "480px", padding: "20px" }}>
        <div style={{
          background: "var(--hoh-bg-ffffff)", borderRadius: "28px",
          overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.15)",
          border: "1px solid var(--hoh-line-dde3f5)",
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
            <div style={{ background: "var(--hoh-bg-edfbf3)", borderRadius: "14px", padding: "14px 16px", border: "1px solid var(--hoh-line-b2eecc)", marginBottom: "20px" }}>
              <p style={{ color: "var(--hoh-text-0f1b3e)", fontSize: "14px", lineHeight: 1.65 }}>
                Thank you for confirming this emergency alert. The sender has been notified that you&apos;ve seen it.
              </p>
            </div>
            {(alertInfo?.safety || names?.safety) && (
              <SafetyReport safety={alertInfo?.safety || names.safety} />
            )}
            {alertInfo && <SenderLocation info={alertInfo} isLive={isLive} updatedAt={updatedAt} />}
            {alertInfo && (
              <AlertAnswer
                code={code}
                senderFirstName={names?.user_first_name || "them"}
                contactFirstName={names?.contact_first_name}
                initialAnswer={alertInfo.response}
                initialResponders={alertInfo.responders || []}
                ringAgain={Boolean(alertInfo.ring_again)}
              />
            )}
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
        background: "var(--hoh-bg-ffffff)", borderRadius: "28px",
        overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
        border: "1px solid var(--hoh-line-dde3f5)",
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
              background: "var(--hoh-bg-fff8f8)", borderRadius: "16px",
              padding: "16px 18px", border: "1px solid var(--hoh-line-ffe0e0)", marginBottom: "16px",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "var(--hoh-bg-fff0f0)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                  <svg style={{ width: "16px", height: "16px", color: "#CC2222" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <p style={{ color: "var(--hoh-text-0f1b3e)", fontSize: "14px", lineHeight: 1.65 }}>
                    This is an authentic emergency alert from{" "}
                    <strong style={{ color: "#CC2222" }}>
                      {names.user_first_name} {names.user_last_name}
                    </strong>.
                    Please verify to confirm you{"'"}ve received it.
                  </p>
                </div>
              </div>
            </div>
          )}

          {names?.safety && <SafetyReport safety={names.safety} />}

          {/* Location info note */}
          <div style={{
            background: "var(--hoh-bg-f0f4ff)", borderRadius: "14px",
            padding: "12px 14px", border: "1px solid var(--hoh-line-dde3f5)",
            display: "flex", alignItems: "center", gap: "10px", marginBottom: "22px",
          }}>
            <svg style={{ width: "15px", height: "15px", color: "#2C5FD4", flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p style={{ color: "var(--hoh-text-8b94b2)", fontSize: "12.5px" }}>
              Verifying confirms you are aware of this emergency.
            </p>
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
            <div style={{ flex: 1, height: "1px", background: "var(--hoh-bg-dde3f5)" }} />
            <p style={{ color: "var(--hoh-text-8b94b2)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.8px" }}>YOUR RESPONSE</p>
            <div style={{ flex: 1, height: "1px", background: "var(--hoh-bg-dde3f5)" }} />
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => router.push("/")}
              style={{
                flex: 1, padding: "14px", borderRadius: "16px",
                background: "var(--hoh-bg-f0f4ff)", color: "var(--hoh-text-8b94b2)",
                fontWeight: 600, fontSize: "14px",
                border: "1px solid var(--hoh-line-dde3f5)", cursor: "pointer",
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

          <p style={{ textAlign: "center", color: "var(--hoh-text-8b94b2)", fontSize: "11.5px", marginTop: "14px" }}>
            Your confirmation will be sent to the alert sender.
          </p>
        </div>
      </div>
    </div>
  );
}

// "I'm on my way" / "I can't help". Each asks for confirmation first —
// the sender is notified the moment it's sent. The other answer stays
// available so a contact can change their mind (also confirmed).
const ANSWERS = {
  on_my_way: {
    label: "I'm on my way",
    color: "#1A9E5C",
    ask: (name) => `Tell ${name} you're on your way?`,
    detail: (name) => `${name} will be notified straight away that you're coming. Please only confirm if you can actually go.`,
    confirm: "Yes, I'm on my way",
    done: (name) => `${name} knows you're on your way.`,
  },
  cant_help: {
    label: "I can't help",
    color: "var(--hoh-text-4b5563)",
    ask: (name) => `Tell ${name} you can't help?`,
    detail: (name) => `${name} will be notified straight away, so they can turn to someone else. Their other contacts have been alerted too.`,
    confirm: "Yes, I can't help",
    done: (name) => `${name} knows you can't help.`,
  },
};

// ringAgain: they said "I can't help" once and were called again, in case
// it was a mis-tap — "I can't help" stays tappable so they can confirm it.
function AlertAnswer({ code, senderFirstName, contactFirstName, initialAnswer, initialResponders, ringAgain }) {
  const [answer, setAnswer] = useState(initialAnswer || null);
  const [responders, setResponders] = useState(initialResponders);
  const [confirmingDecline, setConfirmingDecline] = useState(ringAgain && initialAnswer === "cant_help");
  const [confirming, setConfirming] = useState(null);
  const [sending, setSending] = useState(false);

  const send = async (key) => {
    setConfirming(null);
    setSending(true);
    try {
      const res = await apiService.respondToAlert(code, key);
      setAnswer(key);
      setConfirmingDecline(false);
      setResponders(res.data.responders || []);
    } catch (err) {
      toast.error(err.response?.data?.error || "Couldn't send that. Please try again.", { duration: 5000 });
    } finally {
      setSending(false);
    }
  };

  // Everyone else who has answered (the list includes this contact too).
  const others = responders.filter(
    (r) => !(r.first_name === contactFirstName && r.response === answer)
  );

  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "4px 0 14px" }}>
        <div style={{ flex: 1, height: "1px", background: "var(--hoh-bg-dde3f5)" }} />
        <p style={{ color: "var(--hoh-text-8b94b2)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.8px" }}>CAN YOU HELP?</p>
        <div style={{ flex: 1, height: "1px", background: "var(--hoh-bg-dde3f5)" }} />
      </div>

      {others.length > 0 && (
        <div style={{ marginBottom: "12px" }}>
          {others.map((r) => (
            <p key={`${r.first_name}-${r.response}`} style={{ color: "var(--hoh-text-5b6481)", fontSize: "13px", textAlign: "center", margin: "0 0 4px" }}>
              {r.response === "on_my_way" ? `🏃 ${r.first_name} is on the way` : `${r.first_name} can't help`}
            </p>
          ))}
        </div>
      )}

      {confirmingDecline && (
        <p style={{ color: "#B45309", fontWeight: 700, fontSize: "14px", textAlign: "center", marginBottom: "12px" }}>
          You said you can&apos;t help, and {senderFirstName} still needs someone. Did you mean it?
          Tap &quot;I can&apos;t help&quot; again to confirm, or &quot;I&apos;m on my way&quot; if you can go.
        </p>
      )}

      {answer && !confirmingDecline && (
        <p style={{ color: "var(--hoh-text-0f1b3e)", fontWeight: 700, fontSize: "14px", textAlign: "center", marginBottom: "12px" }}>
          {ANSWERS[answer].done(senderFirstName)}
        </p>
      )}

      <div style={{ display: "flex", gap: "12px" }}>
        {Object.entries(ANSWERS).map(([key, a]) => {
          const selected = answer === key && !(confirmingDecline && key === "cant_help");
          return (
            <button
              key={key}
              disabled={sending || selected}
              onClick={() => setConfirming(key)}
              style={{
                flex: 1, padding: "14px 8px", borderRadius: "16px", border: selected ? "2px solid #0F1B3E" : "none",
                background: a.color, color: "#fff", fontWeight: 700, fontSize: "14.5px",
                cursor: sending || selected ? "default" : "pointer",
                opacity: sending && !selected ? 0.5 : 1,
              }}
            >
              {selected ? "✓ " : ""}{a.label}
            </button>
          );
        })}
      </div>

      {confirming && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setConfirming(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 60, background: "rgba(15,27,62,0.55)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: "16px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: "var(--hoh-bg-ffffff)", borderRadius: "22px", padding: "24px", maxWidth: "380px", width: "100%", boxShadow: "0 24px 80px rgba(0,0,0,0.25)" }}
          >
            <p style={{ color: "var(--hoh-text-0f1b3e)", fontWeight: 800, fontSize: "17px", marginBottom: "8px" }}>
              {ANSWERS[confirming].ask(senderFirstName)}
            </p>
            <p style={{ color: "var(--hoh-text-5b6481)", fontSize: "13.5px", lineHeight: 1.6, marginBottom: "18px" }}>
              {ANSWERS[confirming].detail(senderFirstName)}
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setConfirming(null)}
                style={{ flex: 1, padding: "12px", borderRadius: "14px", border: "1px solid var(--hoh-line-dde3f5)", background: "var(--hoh-bg-ffffff)", color: "var(--hoh-text-5b6481)", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={() => send(confirming)}
                style={{ flex: 1, padding: "12px", borderRadius: "14px", border: "none", background: ANSWERS[confirming].color, color: "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}
              >
                {ANSWERS[confirming].confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function isLiveSharing(info) {
  if (!info?.live_location_enabled) return false;
  const expires = info.live_location_expires_at ? new Date(info.live_location_expires_at) : null;
  return !expires || expires > new Date();
}

// Map of where the sender is. While they share live location it shows a LIVE
// badge and follows them (the parent re-fetches every 15s); the embedded map
// only reloads when the position actually changes, so it doesn't flicker.
function SenderLocation({ info, isLive, updatedAt }) {
  const coords = info.coordinates;
  const lat = coords ? Number(coords.latitude).toFixed(5) : null;
  const lng = coords ? Number(coords.longitude).toFixed(5) : null;

  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
        <p style={{ color: "var(--hoh-text-0f1b3e)", fontWeight: 700, fontSize: "14px", flex: 1 }}>
          {info.user_name ? `${info.user_name}'s location` : "Sender's location"}
        </p>
        {isLive && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "#CC2222", color: "#fff", borderRadius: "999px",
            padding: "4px 10px", fontSize: "11px", fontWeight: 800, letterSpacing: "1px",
          }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--hoh-bg-ffffff)", animation: "livePulse 1.2s ease-in-out infinite" }} />
            LIVE
          </span>
        )}
      </div>
      {info.location && (
        <p style={{ color: "var(--hoh-text-8b94b2)", fontSize: "13px", marginBottom: "10px" }}>{info.location}</p>
      )}
      {coords ? (
        <>
          <div style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid var(--hoh-line-dde3f5)", height: "240px" }}>
            <iframe
              key={`${lat},${lng}`}
              title="Sender location"
              src={`https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`}
              style={{ width: "100%", height: "100%", border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p style={{ color: isLive ? "#CC2222" : "var(--hoh-text-8b94b2)", fontSize: "12px", marginTop: "8px", fontWeight: 600 }}>
            {isLive
              ? `Sharing live location — this map follows them${updatedAt ? ` · updated ${updatedAt.toLocaleTimeString()}` : ""}`
              : info.live_location_enabled
                ? "Live location sharing has ended. Showing the last position."
                : "Location when the alert was sent."}
          </p>
          {/* Old or rough position (backend Emergency.location_note()): e.g.
              their location was off and this is the last one their phone
              remembered. Shown so nobody mistakes it for where they are now. */}
          {info.location_note && (
            <p style={{ color: "var(--hoh-text-b45309)", fontSize: "12.5px", marginTop: "6px", fontWeight: 600 }}>
              {info.location_note}
            </p>
          )}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block", textAlign: "center", marginTop: "10px", padding: "12px",
              borderRadius: "14px", border: "1px solid var(--hoh-line-dde3f5)", color: "#2C5FD4",
              fontWeight: 700, fontSize: "14px", textDecoration: "none",
            }}
          >
            Open in Google Maps
          </a>
        </>
      ) : (
        <p style={{ color: "var(--hoh-text-8b94b2)", fontSize: "13px" }}>Location not available for this alert.</p>
      )}
      <style jsx global>{`@keyframes livePulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
    </div>
  );
}

// ── Safety Companion report ───────────────────────────────
// What a Safety Companion alert carries (backend Emergency.safety_details):
// why it went off and, for a journey, where they were going, who they were
// visiting and the vehicle — the details a contact (and the police) act on.
const SAFETY_HEADLINES = {
  journey_overdue: "Hasn't confirmed arriving safely",
  duress: "Sent a silent alert — may be in danger",
  missed_checkin: "Missed their daily check-in",
  panic: "Pressed their panic button",
};

const SAFETY_ADVICE = {
  journey_overdue:
    "Call them now. If you can't reach them, contact the person they were visiting, then the police (191).",
  duress:
    "Calling them openly may put them at risk. Contact the police (191 or 112) and go to their location if it is safe.",
  missed_checkin: "Please call or visit them to make sure they are fine.",
  panic: "They may not be able to talk. Contact them or the police (191 or 112).",
};

function clock(value) {
  if (!value) return "";
  return new Date(value).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function SafetyReport({ safety }) {
  const journey = safety.journey || {};
  const visiting = [journey.visiting_name, journey.visiting_phone].filter(Boolean).join(" · ");
  const rows = [
    ["From", journey.from],
    ["Going to", journey.to],
    ["Changed plans", journey.plan_changed_at
      ? `${clock(journey.plan_changed_at)}${journey.original_to ? ` (first going to ${journey.original_to})` : ""}`
      : null],
    ["Set off", clock(journey.started_at)],
    ["Expected by", clock(journey.expected_by)],
    ["Visiting", visiting],
    ["Vehicle", journey.vehicle_details],
    ["Last seen", clock(journey.last_seen_at)],
    ["Check-in due by", safety.check_in?.check_by],
  ].filter(([, value]) => value);

  return (
    <div style={{
      background: "var(--hoh-bg-f7f0ff)", borderRadius: "16px", padding: "16px 18px",
      border: "1px solid var(--hoh-line-e2ccff)", marginBottom: "16px",
    }}>
      <p style={{ color: "var(--hoh-text-5a189a)", fontSize: "11px", fontWeight: 700, letterSpacing: "1.2px", marginBottom: "6px" }}>
        SAFETY COMPANION
      </p>
      <p style={{ color: "var(--hoh-text-0f1b3e)", fontWeight: 800, fontSize: "16px", marginBottom: "6px" }}>
        {SAFETY_HEADLINES[safety.kind] || SAFETY_HEADLINES.panic}
      </p>
      <p style={{ color: "var(--hoh-text-4a5272)", fontSize: "13.5px", lineHeight: 1.6, marginBottom: rows.length || journey.note ? "12px" : 0 }}>
        {SAFETY_ADVICE[safety.kind] || SAFETY_ADVICE.panic}
      </p>
      {journey.note && (
        <p style={{ color: "var(--hoh-text-0f1b3e)", fontStyle: "italic", fontSize: "14.5px", marginBottom: "12px" }}>
          “{journey.note}”
        </p>
      )}
      {rows.length > 0 && (
        <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 14px", margin: 0 }}>
          {rows.map(([label, value]) => (
            <React.Fragment key={label}>
              <dt style={{ color: "var(--hoh-text-8b94b2)", fontSize: "13px" }}>{label}</dt>
              <dd style={{ color: "var(--hoh-text-0f1b3e)", fontSize: "13.5px", fontWeight: 600, margin: 0, overflowWrap: "anywhere" }}>{value}</dd>
            </React.Fragment>
          ))}
        </dl>
      )}
      {journey.visiting_phone && (
        <a
          href={`tel:${journey.visiting_phone}`}
          style={{
            display: "inline-block", marginTop: "12px", padding: "10px 14px", borderRadius: "12px",
            background: "#7B22CE", color: "#fff", fontWeight: 700, fontSize: "13.5px", textDecoration: "none",
          }}
        >
          Call {journey.visiting_name || "who they were visiting"}
        </a>
      )}
    </div>
  );
}
