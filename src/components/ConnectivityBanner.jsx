"use client";
import React, { useEffect, useRef, useState } from "react";

// A thin strip at the very top, like Chrome's: "No internet connection" when
// the browser goes offline, "Back online" when it reconnects. Each shows for
// about SHOW_FOR_MS, then slides away. Mounted once in app/layout.js.
const SHOW_FOR_MS = 3000;

const STYLES = {
  offline: { background: "#000000", color: "#FFFFFF", label: "No internet connection" },
  online: { background: "#F8B4A9", color: "#3A3A3A", label: "Back online" },
};

function CloudOffIcon({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 2l20 20" />
      <path d="M5.8 8.3A6 6 0 0 0 6 20h11a4 4 0 0 0 2.6-.97M21.6 15.3A4 4 0 0 0 18 10h-1.26a8 8 0 0 0-6.6-5.97" />
    </svg>
  );
}

function GlobeIcon({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20" />
    </svg>
  );
}

export default function ConnectivityBanner() {
  const [banner, setBanner] = useState(null); // "offline" | "online" | null
  const [visible, setVisible] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    const show = (kind) => {
      clearTimeout(timer.current);
      setBanner(kind);
      setVisible(true);
      timer.current = setTimeout(() => setVisible(false), SHOW_FOR_MS);
    };
    const goOffline = () => show("offline");
    const goOnline = () => show("online");

    // Opened without a connection: say so straight away.
    if (typeof navigator !== "undefined" && navigator.onLine === false) goOffline();

    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      clearTimeout(timer.current);
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  if (!banner) return null;
  const style = STYLES[banner];

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 10000,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        padding: "6px 16px",
        paddingTop: "max(6px, env(safe-area-inset-top))",
        background: style.background, color: style.color,
        fontSize: 13, fontWeight: 500, pointerEvents: "none",
        transform: visible ? "translateY(0)" : "translateY(-100%)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.25s ease-out, opacity 0.25s ease-out",
      }}
    >
      {banner === "offline" ? <CloudOffIcon color={style.color} /> : <GlobeIcon color={style.color} />}
      {style.label}
    </div>
  );
}
