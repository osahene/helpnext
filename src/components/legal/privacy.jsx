"use client";

import Link from "next/link";

const COMPANY = "TeenByte Tech Lab";
const APP = "Help OO Help";
const EMAIL = "admin@teenbytetechlab.com";
const EFFECTIVE = "1 July 2025";

const sections = [
  {
    id: "overview",
    title: "1. Overview",
    color: "#2C5FD4",
    content: `${APP} ("the App", "we", "our", or "us"), developed and operated by ${COMPANY}, is an emergency response platform that enables users to rapidly alert their designated emergency contacts during six categories of crisis: robbery attack, fire outbreak, flood alert, accident alert, health crisis, and general call emergency.

This Privacy Policy explains what personal data we collect, why we collect it, how it is used, who it may be shared with, and what rights you have over your data. By using the App, you agree to the practices described in this Policy.`,
  },
  {
    id: "data-collected",
    title: "2. Data We Collect",
    color: "#E8500A",
    subsections: [
      {
        subtitle: "2.1 Account Registration Data",
        body: "When you register on Help OO Help, we collect your first name, last name, phone number (including country code), and optionally your email address. This information is used to create and maintain your account.",
      },
      {
        subtitle: "2.2 Emergency Contact Data",
        body: "When you add an emergency contact, we collect the contact's first name, last name, phone number, email address, and your relationship to them. This data is used exclusively to send emergency alerts on your behalf once the contact has granted their approval.",
      },
      {
        subtitle: "2.3 Real-Time Location Data",
        body: "When you trigger an emergency alert, the App captures your device's GPS coordinates (latitude, longitude, and accuracy) at that moment. This live location is included in the alert messages sent to your approved contacts so they can find and assist you. We do not continuously track or store your location outside of an active alert trigger.",
      },
      {
        subtitle: "2.4 Alert History",
        body: "We retain a log of alerts you have triggered, including the alert type, timestamp, and the contacts notified. This log is visible to you in your profile and is used for audit and support purposes.",
      },
      {
        subtitle: "2.5 Device & Usage Data",
        body: "We may collect anonymous device information (device type, OS version) and usage analytics to improve app performance and reliability. This data is not linked to your identity.",
      },
      {
        subtitle: "2.6 WhatsApp & SMS Communication Data",
        body: "When an emergency alert is triggered, we send WhatsApp messages and SMS to your approved contacts on your behalf via the WhatsApp Business API and SMS gateway. These messages contain your name, the type of emergency, your live GPS location link, and a verification link. We do not store the content of WhatsApp conversations; we only log delivery status.",
      },
    ],
  },
  {
    id: "how-we-use",
    title: "3. How We Use Your Data",
    color: "#1A9E5C",
    items: [
      "To create and maintain your user account",
      "To facilitate the emergency alert workflow — sending SMS, WhatsApp messages, and automated voice calls to your approved contacts",
      "To include your live GPS location in alert messages so your contacts can locate you",
      "To generate and send a verification link so alert recipients can confirm receipt and authenticity",
      "To display your alert history in your account profile",
      "To send transactional notifications (OTP verification, account updates)",
      "To improve app performance and resolve technical issues",
      "To comply with our legal obligations",
    ],
  },
  {
    id: "whatsapp",
    title: "4. WhatsApp Business API Usage",
    color: "#25D366",
    content: `Help OO Help uses the WhatsApp Business API, provided by Meta Platforms, Inc., solely for the purpose of delivering emergency alert messages to your approved contacts when you trigger an alert.

These messages contain: (a) your full name as the sender, (b) the category of emergency you have triggered, (c) a Google Maps or equivalent link to your live GPS coordinates, and (d) a one-time verification link.

By using the App, you acknowledge that:
• WhatsApp messages are delivered to your contacts' personal WhatsApp numbers.
• Contacts must have WhatsApp installed to receive these messages.
• Meta's own Terms of Service and Privacy Policy apply to the delivery of these messages on their platform.
• We do not use WhatsApp data for marketing or any purpose other than emergency alert delivery.

We comply fully with Meta's WhatsApp Business Policy and do not send unsolicited promotional content through this channel.`,
  },
  {
    id: "sharing",
    title: "5. Data Sharing & Disclosure",
    color: "#7B22CE",
    content: `We do not sell, rent, or trade your personal data to any third party.

We share data only in the following limited circumstances:

• Emergency Contacts: Your name, emergency type, live location, and a verification link are shared with your approved contacts as part of the alert mechanism. You have explicitly added and the contact has explicitly approved this relationship.

• Service Providers: We use trusted third-party providers for SMS delivery, WhatsApp Business API, cloud hosting, and analytics. These providers are contractually bound to process your data only as instructed by us and in accordance with applicable data protection law.

• Legal Obligations: We may disclose your data if required to do so by law, court order, or governmental authority.

• Business Transfers: In the event of a merger, acquisition, or sale of assets, your data may be transferred as part of that transaction, with notice provided to you.`,
  },
  {
    id: "retention",
    title: "6. Data Retention",
    color: "#0A72C4",
    content: `We retain your personal data for as long as your account is active. If you request account deletion, we will permanently delete your account and associated data within 5 working days of receiving a verified deletion request, except where retention is required by law (e.g., for fraud prevention or regulatory compliance).

Alert logs may be retained in anonymised form for statistical and safety research purposes after your account is deleted.`,
  },
  {
    id: "rights",
    title: "7. Your Rights",
    color: "#E07A1A",
    items: [
      "Right of Access — You may request a copy of the personal data we hold about you.",
      "Right of Rectification — You may update or correct inaccurate information from within the App or by contacting us.",
      "Right to Erasure — You may request deletion of your account and personal data (see Section 8 below and our Data Deletion page).",
      "Right to Restriction — You may request that we restrict processing of your data in certain circumstances.",
      "Right to Data Portability — You may request your data in a structured, machine-readable format.",
      "Right to Object — You may object to processing based on our legitimate interests.",
      "Right to Withdraw Consent — Where processing is based on consent, you may withdraw it at any time without affecting prior processing.",
    ],
    footer: `To exercise any of the above rights, contact us at ${EMAIL}. We will respond within 5 working days.`,
  },
  {
    id: "security",
    title: "8. Data Security",
    color: "#CC2222",
    content: `We implement industry-standard security measures including HTTPS/TLS encryption in transit, hashed storage of sensitive credentials, access controls, and regular security reviews. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.

In the event of a data breach that poses a risk to your rights and freedoms, we will notify you and the relevant supervisory authority in accordance with applicable law.`,
  },
  {
    id: "children",
    title: "9. Children's Privacy",
    color: "#8B5C00",
    content: `Help OO Help is not directed at children under the age of 13. We do not knowingly collect personal data from children. If you believe we have inadvertently collected data from a child, please contact us at ${EMAIL} and we will delete it promptly.`,
  },
  {
    id: "changes",
    title: "10. Changes to This Policy",
    color: "#5B3FE8",
    content: `We may update this Privacy Policy from time to time. Material changes will be notified to you via in-app notification or email. Continued use of the App after changes are posted constitutes acceptance of the updated Policy. We encourage you to review this page periodically.`,
  },
  {
    id: "contact",
    title: "11. Contact Us",
    color: "#2C5FD4",
    content: `If you have any questions, concerns, or requests relating to this Privacy Policy or your personal data, please contact us:

Company: ${COMPANY}
App: ${APP}
Email: ${EMAIL}
WhatsApp: +233 54 053 1370`,
  },
];

export default function PrivacyPolicy() {
  return (
    <div style={{ background: "#F0F4FF", minHeight: "100vh" }}>
      {/* ── Hero ──────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, #0D1B4B 0%, #2C5FD4 100%)",
        padding: "80px 24px 60px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-30px", left: "-30px", width: "140px", height: "140px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "20px", padding: "5px 14px", marginBottom: "20px" }}>
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "11px", fontWeight: 700, letterSpacing: "1.4px" }}>LEGAL DOCUMENT</span>
          </div>
          <h1 style={{ color: "#fff", fontSize: "clamp(26px, 5vw, 38px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "14px", lineHeight: 1.2 }}>
            Privacy Policy
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "15px", lineHeight: 1.7, marginBottom: "18px", maxWidth: "600px" }}>
            This policy describes how Help OO Help collects, uses, and protects your personal information. Please read it carefully.
          </p>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "12.5px" }}>
            Effective date: {EFFECTIVE} &nbsp;·&nbsp; Operated by {COMPANY}
          </p>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────── */}
      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Table of contents */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "22px 24px", marginBottom: "32px", border: "1px solid #DDE3F5", boxShadow: "0 4px 16px rgba(44,95,212,0.07)" }}>
          <p style={{ color: "#2C5FD4", fontSize: "11px", fontWeight: 700, letterSpacing: "1.4px", marginBottom: "14px" }}>TABLE OF CONTENTS</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`}
                style={{ color: "#0F1B3E", fontSize: "13.5px", textDecoration: "none", padding: "5px 0", display: "flex", alignItems: "center", gap: "8px", transition: "color 0.18s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#2C5FD4")}
                onMouseLeave={e => (e.currentTarget.style.color = "#0F1B3E")}
              >
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                {s.title}
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        {sections.map((s) => (
          <div key={s.id} id={s.id} style={{ background: "#fff", borderRadius: "20px", padding: "28px 28px", marginBottom: "16px", border: "1px solid #DDE3F5", boxShadow: "0 4px 16px rgba(44,95,212,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{ width: "4px", height: "22px", background: s.color, borderRadius: "2px" }} />
              <h2 style={{ color: "#0F1B3E", fontSize: "17px", fontWeight: 800, letterSpacing: "-0.01em" }}>{s.title}</h2>
            </div>

            {s.content && (
              <p style={{ color: "#374151", fontSize: "14px", lineHeight: 1.8, whiteSpace: "pre-line" }}>{s.content}</p>
            )}

            {s.subsections && s.subsections.map((sub, i) => (
              <div key={i} style={{ marginBottom: "14px" }}>
                <p style={{ color: "#0F1B3E", fontSize: "14.5px", fontWeight: 700, marginBottom: "6px" }}>{sub.subtitle}</p>
                <p style={{ color: "#374151", fontSize: "14px", lineHeight: 1.8 }}>{sub.body}</p>
              </div>
            ))}

            {s.items && (
              <>
                <ul style={{ paddingLeft: "4px", marginBottom: s.footer ? "14px" : 0 }}>
                  {s.items.map((item, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "10px" }}>
                      <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: s.color, flexShrink: 0, marginTop: "6px" }} />
                      <p style={{ color: "#374151", fontSize: "14px", lineHeight: 1.7 }}>{item}</p>
                    </li>
                  ))}
                </ul>
                {s.footer && <p style={{ color: "#374151", fontSize: "14px", lineHeight: 1.8 }}>{s.footer}</p>}
              </>
            )}
          </div>
        ))}

        <div style={{ textAlign: "center", paddingTop: "12px" }}>
          <Link href="/" style={{ color: "#2C5FD4", fontSize: "13.5px", fontWeight: 600, textDecoration: "none" }}>
            ← Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}