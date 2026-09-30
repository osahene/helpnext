"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { stopLiveLocation } from "@/utils/liveLocation";

// Renders nothing unless a live-location session is actually running (see
// redux/liveLocationSlice.js) — this is the only way to see it's on and
// stop it early once the trigger modal it was turned on in has closed.
export default function LiveLocationBanner() {
  const active = useSelector((state) => state.liveLocation.active);
  const expiresAt = useSelector((state) => state.liveLocation.expiresAt);
  const [, forceTick] = useState(0);

  useEffect(() => {
    if (!active) return;
    // Re-render every 30s purely to keep the "Xm left" text fresh.
    const id = setInterval(() => forceTick((n) => n + 1), 30000);
    return () => clearInterval(id);
  }, [active]);

  if (!active) return null;

  const remainingMs = expiresAt ? new Date(expiresAt).getTime() - Date.now() : null;
  const minutesLeft = remainingMs && remainingMs > 0 ? Math.floor(remainingMs / 60000) : 0;

  return (
    <div
      style={{
        position: "fixed", top: "12px", left: "50%", transform: "translateX(-50%)",
        zIndex: 60, display: "flex", alignItems: "center", gap: "10px",
        background: "#FFF0F0", border: "1px solid #FFCDD2", borderRadius: "999px",
        padding: "8px 8px 8px 14px", boxShadow: "0 8px 24px rgba(204,34,34,0.15)",
        maxWidth: "92vw",
      }}
    >
      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#D32F2F", flexShrink: 0 }} />
      <span style={{ color: "#B71C1C", fontSize: "13px", fontWeight: 600, whiteSpace: "nowrap" }}>
        {minutesLeft > 0 ? `Sharing live location — ${minutesLeft}m left` : "Sharing live location"}
      </span>
      <button
        onClick={() => stopLiveLocation()}
        style={{
          background: "transparent", border: "none", color: "#D32F2F",
          fontWeight: 700, fontSize: "12.5px", padding: "4px 8px",
          borderRadius: "999px", cursor: "pointer",
        }}
      >
        Stop
      </button>
    </div>
  );
}
