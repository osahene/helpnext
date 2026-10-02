"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFire,
  faHandFist,
  faHeartPulse,
  faPhoneVolume,
  faTriangleExclamation,
  faUserSecret,
  faUsers,
  faWater,
} from "@fortawesome/free-solid-svg-icons";
import apiService from "@/utils/axios";

// Web counterpart of helpflutter's profile_screen.dart stats row + request
// history. Alerts are stored by their canonical code (Emergency.ALERT_TYPES);
// names and colors match the situation labels used in
// components/Contacts/addContact.jsx.
const SITUATIONS = {
  health: { label: "Health Crisis", color: "#1A9E5C", icon: faHeartPulse },
  robbery: { label: "Robbery Attack", color: "#CC2222", icon: faUserSecret },
  fire: { label: "Fire Outbreak", color: "#E8500A", icon: faFire },
  flood: { label: "Flood Alert", color: "#0A72C4", icon: faWater },
  other: { label: "Call Emergency", color: "#7B22CE", icon: faPhoneVolume },
  violence: { label: "Violence Alert", color: "#8B5C00", icon: faHandFist },
};

const STATUS = {
  success: { label: "Sent", color: "#1A9E5C", bg: "#E8F7EF" },
  partial: { label: "Partial", color: "#B7791F", bg: "#FFF6E0" },
  pending: { label: "Pending", color: "#8B94B2", bg: "#F0F2F8" },
  failed: { label: "Failed", color: "#CC2222", bg: "#FFECEC" },
};

const situationFor = (item) =>
  SITUATIONS[item.action] ?? {
    label: item.alert || item.action || "Emergency",
    color: "#8B94B2",
    icon: faTriangleExclamation,
  };

const formatDate = (iso) => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
};

const card = {
  background: "#fff",
  borderRadius: "20px",
  border: "1px solid #DDE3F5",
  boxShadow: "0 4px 16px rgba(44,95,212,0.06)",
};

const StatCard = ({ value, label, color }) => (
  <div style={{ ...card, flex: 1, padding: "16px 10px", textAlign: "center" }}>
    <p style={{ color, fontWeight: 800, fontSize: "24px", lineHeight: 1.1 }}>{value}</p>
    <p style={{ color: "#8B94B2", fontSize: "12px", fontWeight: 600, marginTop: "4px" }}>{label}</p>
  </div>
);

const HistoryItem = ({ item }) => {
  const situation = situationFor(item);
  const status = STATUS[item.mission_status] ?? STATUS.pending;
  const contacts = (item.recipients ?? []).map((r) => r.contact_name).filter(Boolean);

  return (
    <div style={{ ...card, padding: "14px 16px", display: "flex", alignItems: "center", gap: "14px" }}>
      <div style={{
        width: "44px", height: "44px", borderRadius: "14px", flexShrink: 0,
        background: `${situation.color}1A`, color: situation.color,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <FontAwesomeIcon icon={situation.icon} style={{ fontSize: "18px" }} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: "#0F1B3E", fontWeight: 700, fontSize: "14.5px" }}>{situation.label}</p>
        <p style={{
          color: "#8B94B2", fontSize: "12.5px", marginTop: "3px",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          <FontAwesomeIcon icon={faUsers} style={{ marginRight: "6px" }} />
          {contacts.length ? contacts.join(", ") : "No contacts notified"}
        </p>
      </div>

      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <p style={{ color: "#8B94B2", fontSize: "12px", marginBottom: "6px" }}>{formatDate(item.created_at)}</p>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          padding: "3px 10px", borderRadius: "999px",
          background: status.bg, color: status.color, fontSize: "12px", fontWeight: 700,
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: status.color }} />
          {status.label}
        </span>
      </div>
    </div>
  );
};

export default function RequestHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    apiService
      .getRequestHistory()
      .then((response) => {
        if (!cancelled) setHistory(response.data?.history ?? []);
      })
      .catch((err) => {
        console.error("Failed to load alert history:", err);
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const sent = history.filter((h) => h.mission_status === "success").length;
  const failed = history.filter((h) => h.mission_status === "failed").length;

  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
        <StatCard value={loading ? "–" : history.length} label="Total Alerts" color="#2C5FD4" />
        <StatCard value={loading ? "–" : sent} label="Sent" color="#1A9E5C" />
        <StatCard value={loading ? "–" : failed} label="Failed" color="#CC2222" />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <div style={{ width: "4px", height: "16px", background: "#CC2222", borderRadius: "2px" }} />
        <p style={{ color: "#CC2222", fontSize: "11px", fontWeight: 700, letterSpacing: "1.4px" }}>REQUEST HISTORY</p>
        {!loading && !error && (
          <p style={{ marginLeft: "auto", color: "#8B94B2", fontSize: "12px", fontWeight: 500 }}>
            {history.length} {history.length === 1 ? "alert" : "alerts"}
          </p>
        )}
      </div>

      {loading ? (
        <div style={{ ...card, padding: "28px", textAlign: "center", color: "#8B94B2", fontSize: "13.5px" }}>
          Loading your alerts…
        </div>
      ) : error ? (
        <div style={{ ...card, padding: "28px", textAlign: "center", color: "#CC2222", fontSize: "13.5px" }}>
          Couldn&apos;t load your alert history. Please refresh to try again.
        </div>
      ) : history.length === 0 ? (
        <div style={{ ...card, padding: "28px", textAlign: "center" }}>
          <p style={{ color: "#0F1B3E", fontWeight: 700, fontSize: "14.5px", marginBottom: "4px" }}>No alerts yet</p>
          <p style={{ color: "#8B94B2", fontSize: "13px" }}>Alerts you send will appear here.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {history.map((item) => (
            <HistoryItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
