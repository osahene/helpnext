"use client";

import Link from "next/link";

const COMPANY = "TeenByte Tech Lab";
const APP = "Help OO Help";
const EMAIL = "admin@teenbytetechlab.com";
const WHATSAPP_DISPLAY = "+233 54 053 1370";
const WHATSAPP_LINK = "https://wa.me/233540531370";

const faqs = [
  {
    id: "getting-started",
    title: "Getting Started",
    color: "#2C5FD4",
    content: `Download ${APP} and register with your phone number — we send a one-time passcode (OTP) by SMS to verify it's really you. Once verified, you can set up a passkey or biometric sign-in (fingerprint / Face ID) so you don't need to re-enter a password every time.

If the OTP doesn't arrive within a couple of minutes, check that your number was typed correctly and that your carrier isn't blocking short codes, then request a new code. If it still doesn't arrive, contact us below with your registered number.`,
  },
  {
    id: "emergency-contacts",
    title: "Adding & Approving Emergency Contacts",
    color: "#7B22CE",
    content: `Before anyone can receive your alerts, you need at least one approved emergency contact. This is a mutual-consent process:

1. You add a contact's name and phone number, and choose which emergency types they should be notified for (e.g. only Health Crisis, or everything).
2. That person gets a request and must explicitly approve it before they can receive anything from you — nobody is added to your alert list without their knowledge.
3. A contact only ever receives alerts for the emergency types they were approved for. If they weren't set up for "Fire Outbreak," they won't be paged for one.

If a contact says they never received an approval request, ask them to check spam/blocked messages, or re-send the invite from your Profile.`,
  },
  {
    id: "triggering-alert",
    title: "Triggering an Emergency Alert",
    color: "#E8500A",
    content: `From the home screen, tap one of the six emergency types: Robbery Attack, Health Crisis, Fire Outbreak, Flood Alert, Accident Alert, or Call Emergency. Only your approved contacts for that specific type are notified — their phone rings with an automated voice call, and they get a WhatsApp message (or SMS if WhatsApp doesn't reach them) plus an email if one is on file. The message includes your name, the emergency type, your GPS location, and a link they use to respond "I'm on my way" or "I can't help." You'll see who your alert reached.

If you triggered an alert by accident, contact your recipients directly to let them know, and consider reaching out to us if you'd like the alert record corrected.`,
  },
  {
    id: "live-location",
    title: "Live Location Sharing",
    color: "#CC2222",
    content: `When you send an alert, you can choose to keep sharing your live location with your contacts for up to 1 hour afterwards (it's off by default — each alert is a one-time location share unless you turn it on). You can stop sharing at any time from the alert screen, and it stops automatically after 1 hour or if you revoke the app's location permission or turn off device location services mid-session.

If contacts say your live location isn't updating, check that location services are still enabled for ${APP} in your device settings.`,
  },
  {
    id: "live-report",
    title: "Live Report to Response Agencies (Mobile App)",
    color: "#1A9E5C",
    content: `In the mobile app, you can send a Live Report — a message, photos, video, or voice notes, plus your location — directly to partner response agencies you select. This is separate from alerting your personal emergency contacts and is meant for situations where you want a response agency involved directly.`,
  },
  {
    id: "sign-in",
    title: "Signing In & Passkeys",
    color: "#0A72C4",
    content: `You normally sign in with your phone number and an OTP. If you've set up a passkey, you can instead use your device's fingerprint, Face ID, or screen lock to sign in instantly — no code needed. Lost access to your device? Sign in with your phone number and OTP as usual, then set up a passkey again on the new device from your Profile.`,
  },
  {
    id: "account",
    title: "Managing or Deleting Your Account",
    color: "#8B5C00",
    content: `You can update your profile details, manage your emergency contacts, and review your alert history from the Profile tab at any time. If you'd rather delete your account entirely, you can do that yourself in-app, or follow our step-by-step `,
    linkAfter: { href: "/legal/delete", label: "Data Deletion Instructions" },
    contentAfter: ` page. Your account is deactivated immediately and permanently erased 30 days later.`,
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    color: "#5B3FE8",
    items: [
      "OTP never arrives: confirm the number is correct and has signal, then request a new code — contact us if it persists.",
      "An alert didn't reach a contact: check that the contact's status is \"Approved\" (not pending) and that they're set up for that specific emergency type, under your emergency contacts list.",
      "Location isn't included in an alert: location services must be enabled for the app at the moment you trigger the alert.",
      "Push notifications aren't showing up: check notification permissions for the app in your device settings, and that battery optimisation isn't restricting the app in the background.",
      "App feels stuck after tapping an alert type: the button shows a brief \"Sending…\" state while the alert is dispatched — please wait for it rather than tapping again, to avoid sending duplicate alerts.",
    ],
  },
  {
    id: "not-a-replacement",
    title: "Important: Not a Replacement for Official Emergency Services",
    color: "#CC2222",
    content: `${APP} alerts your own approved contacts — it does not automatically notify the police, fire service, or ambulance. In a genuine emergency, always also contact official services directly:

Ghana Police Service: 191 / 18555
Ghana National Fire Service: 192
National Ambulance Service: 193
NADMO: 112`,
  },
];

export default function Support() {
  return (
    <div style={{ background: "#F0F4FF", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #003D33 0%, #1A9E5C 100%)",
        padding: "80px 24px 60px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-30px", left: "-30px", width: "140px", height: "140px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "20px", padding: "5px 14px", marginBottom: "20px" }}>
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "11px", fontWeight: 700, letterSpacing: "1.4px" }}>SUPPORT</span>
          </div>
          <h1 style={{ color: "#fff", fontSize: "clamp(26px, 5vw, 38px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "14px", lineHeight: 1.2 }}>
            Help & Support
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "15px", lineHeight: 1.7, marginBottom: "18px", maxWidth: "600px" }}>
            Answers to common questions about {APP}, and how to reach us if you need more help.
          </p>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "12.5px" }}>
            We typically respond within 24 hours &nbsp;·&nbsp; Operated by {COMPANY}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Contact block, up front */}
        <div style={{ background: "linear-gradient(135deg, #2C5FD4, #5B3FE8)", borderRadius: "20px", padding: "28px", border: "none", boxShadow: "0 8px 32px rgba(91,63,232,0.25)", marginBottom: "32px" }}>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", fontWeight: 700, letterSpacing: "1.4px", marginBottom: "8px" }}>CONTACT US</p>
          <p style={{ color: "#fff", fontWeight: 800, fontSize: "17px", marginBottom: "8px" }}>Can{"'"}t find what you{"'"}re looking for?</p>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "13.5px", lineHeight: 1.65, marginBottom: "16px" }}>
            Reach our support team directly by email or WhatsApp. Please include your registered phone number so we can find your account quickly.
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <a href={`mailto:${EMAIL}`}
              style={{ padding: "11px 20px", borderRadius: "14px", background: "#fff", color: "#2C5FD4", fontWeight: 700, fontSize: "14px", textDecoration: "none", display: "flex", alignItems: "center", gap: "7px" }}>
              <svg style={{ width: "16px", height: "16px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {EMAIL}
            </a>
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer"
              style={{ padding: "11px 20px", borderRadius: "14px", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", fontWeight: 600, fontSize: "14px", textDecoration: "none", display: "flex", alignItems: "center", gap: "7px" }}>
              WhatsApp: {WHATSAPP_DISPLAY}
            </a>
          </div>
        </div>

        {/* Table of contents */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "22px 24px", marginBottom: "32px", border: "1px solid #DDE3F5", boxShadow: "0 4px 16px rgba(44,95,212,0.07)" }}>
          <p style={{ color: "#1A9E5C", fontSize: "11px", fontWeight: 700, letterSpacing: "1.4px", marginBottom: "14px" }}>FREQUENTLY ASKED QUESTIONS</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {faqs.map((f) => (
              <a key={f.id} href={`#${f.id}`}
                style={{ color: "#0F1B3E", fontSize: "13.5px", textDecoration: "none", padding: "5px 0", display: "flex", alignItems: "center", gap: "8px", transition: "color 0.18s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#1A9E5C")}
                onMouseLeave={e => (e.currentTarget.style.color = "#0F1B3E")}
              >
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: f.color, flexShrink: 0 }} />
                {f.title}
              </a>
            ))}
          </div>
        </div>

        {/* FAQ sections */}
        {faqs.map((f) => (
          <div key={f.id} id={f.id} style={{ background: "#fff", borderRadius: "20px", padding: "28px", marginBottom: "16px", border: "1px solid #DDE3F5", boxShadow: "0 4px 16px rgba(44,95,212,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{ width: "4px", height: "22px", background: f.color, borderRadius: "2px" }} />
              <h2 style={{ color: "#0F1B3E", fontSize: "17px", fontWeight: 800, letterSpacing: "-0.01em" }}>{f.title}</h2>
            </div>

            {f.content && (
              <p style={{ color: "#374151", fontSize: "14px", lineHeight: 1.8, whiteSpace: "pre-line" }}>
                {f.content}
                {f.linkAfter && (
                  <Link href={f.linkAfter.href} style={{ color: "#2C5FD4", fontWeight: 600 }}>
                    {f.linkAfter.label}
                  </Link>
                )}
                {f.contentAfter}
              </p>
            )}

            {f.items && (
              <ul style={{ paddingLeft: "4px" }}>
                {f.items.map((item, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "10px" }}>
                    <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: f.color, flexShrink: 0, marginTop: "6px" }} />
                    <p style={{ color: "#374151", fontSize: "14px", lineHeight: 1.7 }}>{item}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        <div style={{ textAlign: "center", paddingTop: "12px" }}>
          <Link href="/legal/terms" style={{ color: "#2C5FD4", fontSize: "13.5px", fontWeight: 600, textDecoration: "none", marginRight: "24px" }}>
            Terms of Service
          </Link>
          <Link href="/legal/privacy" style={{ color: "#2C5FD4", fontSize: "13.5px", fontWeight: 600, textDecoration: "none", marginRight: "24px" }}>
            Privacy Policy
          </Link>
          <Link href="/" style={{ color: "#8B94B2", fontSize: "13.5px", fontWeight: 600, textDecoration: "none" }}>
            ← Home
          </Link>
        </div>
      </div>
    </div>
  );
}
