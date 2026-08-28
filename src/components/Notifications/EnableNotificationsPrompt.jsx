"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getNotificationPermission,
  isPushSupported,
  requestPushPermissionAndRegister,
} from "@/utils/push";

const SESSION_FLAG = "titbit_push_prompt_shown";

// A one-time-per-session, user-initiated prompt to enable web push. Never
// calls Notification.requestPermission() on its own — only in response to
// the "Enable notifications" button click, per browser best practice.
// Renders nothing (and does no work) unless the user is authenticated,
// the browser supports push, permission is still "default", and this
// particular tab session hasn't shown/dismissed it already.
export default function EnableNotificationsPrompt() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setVisible(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        if (typeof window === "undefined") return;
        if (window.sessionStorage.getItem(SESSION_FLAG)) return;

        const supported = await isPushSupported();
        if (!supported || cancelled) return;

        const permission = getNotificationPermission();
        if (permission !== "default") return;

        if (!cancelled) setVisible(true);
      } catch (error) {
        // Silently stay hidden — push is simply unavailable.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const dismiss = () => {
    try {
      window.sessionStorage.setItem(SESSION_FLAG, "1");
    } catch (error) {
      // ignore (e.g. sessionStorage blocked)
    }
    setVisible(false);
  };

  const handleEnable = async () => {
    setBusy(true);
    try {
      await requestPushPermissionAndRegister();
    } catch (error) {
      // requestPushPermissionAndRegister already catches internally; this
      // is just an extra safety net so a click can never throw into render.
    } finally {
      setBusy(false);
      dismiss();
    }
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        right: "20px",
        maxWidth: "380px",
        margin: "0 auto",
        zIndex: 70,
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        border: "1px solid #DDE3F5",
        padding: "16px",
        display: "flex",
        gap: "12px",
        alignItems: "flex-start",
      }}
    >
      <span
        style={{
          flexShrink: 0,
          width: "36px",
          height: "36px",
          borderRadius: "10px",
          background: "#EEF2FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "16px",
        }}
        aria-hidden="true"
      >
        🔔
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: "13.5px", fontWeight: 700, color: "#14213D", margin: 0 }}>
          Stay in the loop
        </p>
        <p style={{ fontSize: "12.5px", color: "#5B6483", margin: "3px 0 10px" }}>
          Enable notifications to get hazard warnings and updates the moment they happen.
        </p>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={handleEnable}
            disabled={busy}
            style={{
              padding: "8px 14px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #2C5FD4, #5B3FE8)",
              color: "#fff",
              fontSize: "12.5px",
              fontWeight: 700,
              border: "none",
              cursor: busy ? "default" : "pointer",
              opacity: busy ? 0.7 : 1,
            }}
          >
            {busy ? "Enabling…" : "Enable notifications"}
          </button>
          <button
            onClick={dismiss}
            style={{
              padding: "8px 14px",
              borderRadius: "10px",
              background: "#F0F4FF",
              color: "#5B6483",
              fontSize: "12.5px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
