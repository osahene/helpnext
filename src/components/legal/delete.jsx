"use client";

import Link from "next/link";

const COMPANY = "TeenByte Tech Lab";
const APP = "Help OO Help";
const EMAIL = "privacy@helpoohelp.com";

const steps = [
  {
    number: "01",
    color: "#2C5FD4",
    bg: "#EEF4FF",
    title: "Log In to Your Account",
    detail: "Open the Help OO Help app on your mobile device or visit the web app at helpoohelp.com. Sign in with the phone number you registered with.",
  },
  {
    number: "02",
    color: "#E07A1A",
    bg: "#FFF3EE",
    title: "Navigate to Your Profile",
    detail: "From the home screen, tap the profile avatar in the top-left corner of the navigation bar, or tap the menu icon and select 'Profile'.",
  },
  {
    number: "03",
    color: "#CC2222",
    bg: "#FFF0F0",
    title: "Select 'Delete Account'",
    detail: "Scroll to the bottom of your Profile page. You will find a 'Delete Account' button highlighted in red. Tap it to begin the deletion process.",
  },
  {
    number: "04",
    color: "#7B22CE",
    bg: "#F3EEFF",
    title: "Confirm Your Identity",
    detail: "For security purposes, you will receive a one-time OTP (One-Time Password) to the phone number linked to your account. Enter the OTP to verify that you are the authorised account owner.",
  },
  {
    number: "05",
    color: "#1A9E5C",
    bg: "#EDFBF3",
    title: "Confirm Deletion",
    detail: "A final confirmation dialog will appear, summarising what will be permanently deleted. Read the summary carefully, then tap 'Confirm & Delete' to proceed. This action is irreversible.",
  },
  {
    number: "06",
    color: "#8B5C00",
    bg: "#FFF8EE",
    title: "Deletion Processed",
    detail: "Your account, personal data, emergency contacts, dependents, and alert history will be permanently deleted within 30 days. You will receive a confirmation message at the email or phone number on file.",
  },
];

const deletedData = [
  { icon: "👤", label: "Account Information", detail: "Name, phone number, email address, and login credentials" },
  { icon: "📋", label: "Emergency Contact List", detail: "All contacts you have added as your emergency contacts" },
  { icon: "👥", label: "Dependent Records", detail: "All records of people who have added you as their contact" },
  { icon: "📍", label: "Location History", detail: "All GPS coordinates captured during past emergency alerts" },
  { icon: "📣", label: "Alert History", detail: "All triggered alert records, timestamps, and delivery logs" },
  { icon: "🔒", label: "Authentication Tokens", detail: "All session tokens, OTPs, and verification tokens" },
];

const retained = [
  { label: "Anonymised statistical data", detail: "Aggregated, non-identifiable usage statistics retained for app improvement." },
  { label: "Legal compliance records", detail: "Records required to be retained by applicable law, such as financial or anti-fraud records (if any), for the legally prescribed period." },
  { label: "Communication logs with support", detail: "If you have contacted our support team, those communications may be retained for up to 90 days." },
];

export default function DataDeletion() {
  return (
    <div style={{ background: "#F0F4FF", minHeight: "100vh" }}>
      {/* ── Hero ──────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, #3D0000 0%, #CC2222 100%)",
        padding: "80px 24px 60px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-30px", left: "-30px", width: "140px", height: "140px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "20px", padding: "5px 14px", marginBottom: "20px" }}>
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "11px", fontWeight: 700, letterSpacing: "1.4px" }}>YOUR DATA RIGHTS</span>
          </div>
          <h1 style={{ color: "#fff", fontSize: "clamp(26px, 5vw, 38px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "14px", lineHeight: 1.2 }}>
            Data Deletion Instructions
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "15px", lineHeight: 1.7, marginBottom: "18px", maxWidth: "620px" }}>
            You have the right to delete your account and all associated personal data from Help OO Help at any time. Follow the steps below or submit a manual request.
          </p>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "12.5px" }}>
            Data deletion is permanent and irreversible. All deletions are processed within 30 days.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* ── Warning notice ────────────────────────────── */}
        <div style={{
          background: "#FFF8F8", border: "1.5px solid #FFCCCC", borderRadius: "18px",
          padding: "18px 20px", marginBottom: "32px",
          display: "flex", alignItems: "flex-start", gap: "14px",
        }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "#FFF0F0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg style={{ width: "20px", height: "20px", color: "#CC2222" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p style={{ color: "#CC2222", fontWeight: 700, fontSize: "14.5px", marginBottom: "5px" }}>Important Warning</p>
            <p style={{ color: "#374151", fontSize: "13.5px", lineHeight: 1.7 }}>
              Deleting your account is <strong>permanent and cannot be undone</strong>. All your data, emergency contacts, dependent relationships, and alert history will be erased. Your emergency contacts will no longer be able to receive alerts from you, and any pending approvals will be cancelled.
            </p>
          </div>
        </div>

        {/* ── Step-by-step ──────────────────────────────── */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "28px", marginBottom: "20px", border: "1px solid #DDE3F5", boxShadow: "0 4px 16px rgba(44,95,212,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "22px" }}>
            <div style={{ width: "4px", height: "22px", background: "#CC2222", borderRadius: "2px" }} />
            <h2 style={{ color: "#0F1B3E", fontSize: "17px", fontWeight: 800 }}>How to Delete Your Account (In-App)</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {steps.map((step, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: "14px",
                background: "#F8FAFF", borderRadius: "16px",
                padding: "16px", border: "1px solid #DDE3F5",
              }}>
                {/* Number badge */}
                <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: step.bg, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: step.color, fontWeight: 800, fontSize: "13px" }}>{step.number}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "#0F1B3E", fontWeight: 700, fontSize: "14.5px", marginBottom: "4px" }}>{step.title}</p>
                  <p style={{ color: "#8B94B2", fontSize: "13.5px", lineHeight: 1.6 }}>{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Manual request ────────────────────────────── */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "28px", marginBottom: "20px", border: "1px solid #DDE3F5", boxShadow: "0 4px 16px rgba(44,95,212,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div style={{ width: "4px", height: "22px", background: "#2C5FD4", borderRadius: "2px" }} />
            <h2 style={{ color: "#0F1B3E", fontSize: "17px", fontWeight: 800 }}>Can{"'"}t Access the App? Submit a Manual Request</h2>
          </div>
          <p style={{ color: "#374151", fontSize: "14px", lineHeight: 1.8, marginBottom: "16px" }}>
            If you are unable to access your account or the in-app deletion option, you may submit a manual data deletion request by emailing us at:
          </p>
          <div style={{ background: "#F0F4FF", borderRadius: "14px", padding: "16px 18px", border: "1px solid #DDE3F5", marginBottom: "16px" }}>
            <p style={{ color: "#0F1B3E", fontWeight: 700, fontSize: "14px", marginBottom: "8px" }}>Email: <a href={`mailto:${EMAIL}`} style={{ color: "#2C5FD4" }}>{EMAIL}</a></p>
            <p style={{ color: "#374151", fontSize: "13.5px", lineHeight: 1.7 }}>
              <strong>Subject:</strong> Data Deletion Request — [Your Registered Phone Number]<br />
              <strong>Body:</strong> Please include your full name, the phone number linked to your account, and confirm that you wish to permanently delete your data. We may request a short identity verification step.
            </p>
          </div>
          <p style={{ color: "#8B94B2", fontSize: "13px", lineHeight: 1.6 }}>
            We will acknowledge your request within <strong>72 hours</strong> and complete the deletion within <strong>30 days</strong> of identity verification.
          </p>
        </div>

        {/* ── What gets deleted ─────────────────────────── */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "28px", marginBottom: "20px", border: "1px solid #DDE3F5", boxShadow: "0 4px 16px rgba(44,95,212,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
            <div style={{ width: "4px", height: "22px", background: "#CC2222", borderRadius: "2px" }} />
            <h2 style={{ color: "#0F1B3E", fontSize: "17px", fontWeight: 800 }}>What Data Is Deleted</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {deletedData.map((d, i) => (
              <div key={i} style={{ background: "#FFF8F8", borderRadius: "14px", padding: "14px 16px", border: "1px solid #FFE0E0", display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <span style={{ fontSize: "22px", flexShrink: 0 }}>{d.icon}</span>
                <div>
                  <p style={{ color: "#0F1B3E", fontWeight: 700, fontSize: "13.5px", marginBottom: "3px" }}>{d.label}</p>
                  <p style={{ color: "#8B94B2", fontSize: "12.5px", lineHeight: 1.5 }}>{d.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── What is retained ──────────────────────────── */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "28px", marginBottom: "20px", border: "1px solid #DDE3F5", boxShadow: "0 4px 16px rgba(44,95,212,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div style={{ width: "4px", height: "22px", background: "#E07A1A", borderRadius: "2px" }} />
            <h2 style={{ color: "#0F1B3E", fontSize: "17px", fontWeight: 800 }}>Data We May Retain (Limited Exceptions)</h2>
          </div>
          <p style={{ color: "#374151", fontSize: "14px", lineHeight: 1.7, marginBottom: "14px" }}>
            In limited cases required by law or legitimate business necessity, we may retain certain non-personal or anonymised data after account deletion:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {retained.map((r, i) => (
              <div key={i} style={{ background: "#FFFBF0", borderRadius: "13px", padding: "13px 15px", border: "1px solid #FFDEA0", display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#E07A1A", flexShrink: 0, marginTop: "5px" }} />
                <div>
                  <p style={{ color: "#0F1B3E", fontWeight: 700, fontSize: "13.5px", marginBottom: "3px" }}>{r.label}</p>
                  <p style={{ color: "#8B94B2", fontSize: "13px", lineHeight: 1.5 }}>{r.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Contact block ─────────────────────────────── */}
        <div style={{ background: "linear-gradient(135deg, #2C5FD4, #5B3FE8)", borderRadius: "20px", padding: "28px", border: "none", boxShadow: "0 8px 32px rgba(91,63,232,0.25)", marginBottom: "28px" }}>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", fontWeight: 700, letterSpacing: "1.4px", marginBottom: "8px" }}>NEED HELP?</p>
          <p style={{ color: "#fff", fontWeight: 800, fontSize: "17px", marginBottom: "8px" }}>We{"'"}re here to assist you.</p>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "13.5px", lineHeight: 1.65, marginBottom: "16px" }}>
            If you have questions about your data, the deletion process, or your rights under applicable data protection law, please reach out to us.
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <a href={`mailto:${EMAIL}`}
              style={{ padding: "11px 20px", borderRadius: "14px", background: "#fff", color: "#2C5FD4", fontWeight: 700, fontSize: "14px", textDecoration: "none", display: "flex", alignItems: "center", gap: "7px" }}>
              <svg style={{ width: "16px", height: "16px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Us
            </a>
            <Link href="/privacy"
              style={{ padding: "11px 20px", borderRadius: "14px", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", fontWeight: 600, fontSize: "14px", textDecoration: "none" }}>
              View Privacy Policy
            </Link>
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <Link href="/" style={{ color: "#CC2222", fontSize: "13.5px", fontWeight: 600, textDecoration: "none" }}>
            ← Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}