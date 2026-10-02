"use client";
import Link from "next/link";

// Shared "you need to be logged in" content — originally only existed
// inline inside components/Cards/cardTrigger.jsx's modal. RouteGuard now
// renders this same prompt instead of hard-redirecting to /auth/login, so
// both call sites render the exact same thing instead of two near-
// identical copies drifting apart over time.
export default function AuthRequiredPrompt({
  title = "Authentication Required",
  message = "This service is only available to authenticated users. Please register or log in.",
}) {
  return (
    <div className="flex flex-col items-center text-center px-2 pb-2">
      <div
        style={{
          width: "72px", height: "72px", borderRadius: "50%",
          background: "linear-gradient(135deg, #2C5FD4, #5B3FE8)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "16px",
          boxShadow: "0 8px 24px rgba(44,95,212,0.35)",
        }}
      >
        <svg style={{ width: "32px", height: "32px", color: "#fff" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <p style={{ color: "#0F1B3E", fontSize: "18px", fontWeight: 800, marginBottom: "8px" }}>
        {title}
      </p>
      <p style={{ color: "#8B94B2", fontSize: "14px", lineHeight: 1.6, marginBottom: "20px" }}>
        {message}
      </p>
      <div className="flex gap-3 w-full">
        <Link href="/auth/register" className="flex-1">
          <button
            style={{
              width: "100%", padding: "11px", borderRadius: "14px",
              background: "linear-gradient(135deg, #2C5FD4, #5B3FE8)",
              color: "#fff", fontWeight: 700, fontSize: "14px",
              boxShadow: "0 6px 18px rgba(91,63,232,0.35)",
            }}
          >
            Register
          </button>
        </Link>
        <Link href="/auth/login" className="flex-1">
          <button
            style={{
              width: "100%", padding: "11px", borderRadius: "14px",
              background: "#F0F4FF", color: "#2C5FD4",
              fontWeight: 700, fontSize: "14px",
              border: "1px solid #DDE3F5",
            }}
          >
            Login
          </button>
        </Link>
      </div>
    </div>
  );
}
