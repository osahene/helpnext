"use client";

import React from "react";

export default function RemoveInfo({ contact, onDelete, onCancel }) {
  return (
    <div className="modal-content w-full max-w-sm mx-auto p-4">
      <div
        style={{
          background: "#fff",
          borderRadius: "22px",
          padding: "24px",
          boxShadow: "0 4px 24px rgba(44,95,212,0.08)",
          border: "1px solid #DDE3F5",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* ── Warning Badge Icon ────────────────────────── */}
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "#CC222215", // Subtle red background transparency
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px",
          }}
        >
          <svg
            style={{ width: "24px", height: "24px", color: "#CC2222" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>

        {/* ── Title ────────────────────────────────────── */}
        <h5
          style={{
            color: "#CC2222",
            fontSize: "18px",
            fontWeight: 700,
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}
        >
          Heads Up!
        </h5>

        {/* ── Confirmation Message ──────────────────────── */}
        <p
          style={{
            color: "#0F1B3E",
            fontSize: "14.5px",
            fontWeight: 500,
            lineHeight: 1.6,
            marginBottom: "24px",
          }}
        >
          Do you want to delete{" "}
          <span style={{ fontWeight: 700, color: "#5B3FE8" }}>
            {contact?.first_name} {contact?.last_name}
          </span>{" "}
          from your emergency list?
        </p>

        {/* ── Actions ───────────────────────────────────── */}
        <div style={{ display: "flex", gap: "12px", width: "100%" }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "13px",
              borderRadius: "16px",
              background: "#F0F4FF",
              color: "#8B94B2",
              fontWeight: 600,
              fontSize: "14px",
              border: "1px solid #DDE3F5",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onDelete}
            style={{
              flex: 1.5,
              padding: "13px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #CC2222, #E8500A)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "14px",
              boxShadow: "0 6px 20px rgba(204,34,34,0.25)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              transition: "all 0.2s ease",
            }}
          >
            Yes, Proceed
          </button>
        </div>
      </div>
    </div>
  );
}