"use client";

import Link from "next/link";

const COMPANY = "TeenByte Tech Lab";
const APP = "Help OO Help";
const EMAIL = "legal@helpoohelp.com";
const EFFECTIVE = "1 July 2025";

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    color: "#2C5FD4",
    content: `By downloading, installing, registering for, or using ${APP} ("the App", "the Service"), you agree to be bound by these Terms of Service ("Terms") and our Privacy Policy. If you do not agree to these Terms, you must not use the App.

These Terms constitute a legally binding agreement between you and ${COMPANY} ("we", "us", "our"). We reserve the right to update these Terms at any time with notice provided in-app or via email. Continued use after changes constitutes acceptance.`,
  },
  {
    id: "description",
    title: "2. Service Description",
    color: "#E8500A",
    content: `${APP} is an emergency response platform that enables registered users to trigger rapid alert notifications to their pre-approved emergency contacts during six categories of crisis:

• Robbery Attack
• Fire Outbreak
• Flood Alert
• Accident Alert
• Health Crisis
• General Call Emergency

When a user triggers an alert, the Service sends SMS messages, WhatsApp messages (via the WhatsApp Business API), and automated voice calls to the user's approved emergency contacts. Each alert includes the user's live GPS location and a one-time verification link.`,
  },
  {
    id: "eligibility",
    title: "3. Eligibility",
    color: "#1A9E5C",
    content: `To use ${APP}, you must be at least 13 years of age. By using the Service, you represent and warrant that you meet this age requirement and that all information you provide is accurate, current, and complete. Users under 18 should have parental or guardian consent before using the Service.`,
  },
  {
    id: "registration",
    title: "4. Account Registration & Security",
    color: "#7B22CE",
    items: [
      "You must provide a valid phone number to register. An OTP will be sent to that number to verify your identity.",
      "You are responsible for maintaining the confidentiality of your account and for all activities that occur under it.",
      "You must notify us immediately at legal@helpoohelp.com if you suspect unauthorised access to your account.",
      "You may not create multiple accounts or impersonate another person.",
      "We reserve the right to suspend or terminate accounts that violate these Terms.",
    ],
  },
  {
    id: "contacts",
    title: "5. Emergency Contacts & Consent",
    color: "#0A72C4",
    content: `The emergency alert system in ${APP} is built on explicit mutual consent:

Condition 1 — Registration: You must register at least one emergency contact by providing their name, phone number, and email address.

Condition 2 — Approval: The registered contact must receive and explicitly approve your nomination request before they can receive any alert. A contact who has not approved cannot receive alerts.

Condition 3 — Active Trigger: Even when both conditions above are met, alerts are only sent when you actively tap an emergency type on the home screen.

By adding a person as your emergency contact, you confirm that you have their prior verbal or written consent to be added to your emergency list and to receive alerts (including their phone number being used for WhatsApp and SMS communications) on your behalf.`,
  },
  {
    id: "whatsapp-use",
    title: "6. WhatsApp Communication",
    color: "#25D366",
    content: `${APP} uses the WhatsApp Business API to send emergency alert messages to your approved contacts. By using this feature, you acknowledge that:

• WhatsApp messages are delivered via Meta's infrastructure and subject to Meta's Terms of Service.
• Messages will include your name, emergency type, GPS coordinates, and a verification link.
• We do not send promotional, marketing, or unsolicited messages through WhatsApp — only emergency alerts triggered by you.
• Message delivery is not guaranteed by ${APP} and may be subject to WhatsApp network availability.
• Contacts who do not have WhatsApp will still receive the SMS version of the alert.`,
  },
  {
    id: "location",
    title: "7. Location Services",
    color: "#CC2222",
    content: `The App requires access to your device's GPS location services to function correctly. Location data is captured only at the moment you trigger an emergency alert and is transmitted to your approved contacts within that alert message. We do not track or store your location at any other time.

You are responsible for ensuring your location services are enabled on your device. Failure to enable location services will prevent the App from including your coordinates in the alert, which may significantly reduce its effectiveness.`,
  },
  {
    id: "prohibited",
    title: "8. Prohibited Use",
    color: "#E07A1A",
    items: [
      "Triggering false, misleading, or non-genuine emergency alerts",
      "Harassing, intimidating, or alarming any individual using the alert system",
      "Adding emergency contacts without their prior knowledge and consent",
      "Using the App for any commercial or promotional purpose",
      "Attempting to reverse-engineer, hack, or tamper with the App or its servers",
      "Impersonating another person or providing false registration information",
      "Using the Service in violation of any applicable law or regulation",
      "Interfering with the Service's availability or other users' access",
    ],
    footer: "Violation of any prohibition above may result in immediate account suspension and, where applicable, reporting to law enforcement authorities.",
  },
  {
    id: "disclaimer",
    title: "9. Disclaimer of Warranties",
    color: "#8B5C00",
    content: `${APP} is provided "as is" and "as available" without warranties of any kind, express or implied. To the fullest extent permitted by law, we disclaim all warranties, including merchantability, fitness for a particular purpose, and non-infringement.

We do not warrant that the Service will be uninterrupted, error-free, or that alerts will reach their recipients within any particular time frame. Emergency situations are time-sensitive and we strongly encourage you to also contact official emergency services (police, ambulance, fire service) directly when facing any emergency.`,
  },
  {
    id: "liability",
    title: "10. Limitation of Liability",
    color: "#5B3FE8",
    content: `To the maximum extent permitted by applicable law, ${COMPANY} shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:

• Failure to deliver an emergency alert due to network, device, or location service issues
• Delay in contact response or contact unavailability
• Harm resulting from a contact's inability to receive a WhatsApp or SMS message
• Any actions or omissions of your emergency contacts

Our total aggregate liability to you in respect of any claim shall not exceed the amount paid by you for the Service in the 12 months preceding the claim (or £50, whichever is greater).`,
  },
  {
    id: "termination",
    title: "11. Termination",
    color: "#CC2222",
    content: `You may delete your account at any time via your Profile settings. We may suspend or terminate your account at our discretion if you breach these Terms, use the Service fraudulently, or for any reason we deem necessary to protect the Service or other users.

Upon termination, your right to use the Service ceases immediately. Sections 9, 10, 12, and 13 of these Terms shall survive termination.`,
  },
  {
    id: "governing-law",
    title: "12. Governing Law",
    color: "#2C5FD4",
    content: `These Terms are governed by and construed in accordance with the laws of the Republic of Ghana. Any dispute arising from these Terms shall first be attempted to be resolved through good-faith negotiation. If unresolved, disputes shall be submitted to the courts of competent jurisdiction in Ghana.`,
  },
  {
    id: "contact",
    title: "13. Contact",
    color: "#1A9E5C",
    content: `For questions about these Terms of Service, contact us at:

Company: ${COMPANY}
App: ${APP}
Email: ${EMAIL}
WhatsApp: +233 54 053 1370`,
  },
];

export default function TermsOfService() {
  return (
    <div style={{ background: "#F0F4FF", minHeight: "100vh" }}>
      {/* Hero */}
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
            Terms of Service
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "15px", lineHeight: 1.7, marginBottom: "18px", maxWidth: "600px" }}>
            Please read these Terms carefully before using Help OO Help. By using the Service, you agree to be bound by these Terms.
          </p>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "12.5px" }}>
            Effective date: {EFFECTIVE} &nbsp;·&nbsp; Operated by {COMPANY}
          </p>
        </div>
      </div>

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
          <div key={s.id} id={s.id} style={{ background: "#fff", borderRadius: "20px", padding: "28px", marginBottom: "16px", border: "1px solid #DDE3F5", boxShadow: "0 4px 16px rgba(44,95,212,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{ width: "4px", height: "22px", background: s.color, borderRadius: "2px" }} />
              <h2 style={{ color: "#0F1B3E", fontSize: "17px", fontWeight: 800, letterSpacing: "-0.01em" }}>{s.title}</h2>
            </div>

            {s.content && (
              <p style={{ color: "#374151", fontSize: "14px", lineHeight: 1.8, whiteSpace: "pre-line" }}>{s.content}</p>
            )}

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
                {s.footer && <p style={{ color: "#374151", fontSize: "14px", lineHeight: 1.8, fontStyle: "italic", borderTop: "1px solid #F0F4FF", paddingTop: "12px" }}>{s.footer}</p>}
              </>
            )}
          </div>
        ))}

        <div style={{ textAlign: "center", paddingTop: "12px" }}>
          <Link href="/privacy" style={{ color: "#2C5FD4", fontSize: "13.5px", fontWeight: 600, textDecoration: "none", marginRight: "24px" }}>
            View Privacy Policy
          </Link>
          <Link href="/delete" style={{ color: "#CC2222", fontSize: "13.5px", fontWeight: 600, textDecoration: "none", marginRight: "24px" }}>
            Data Deletion Instructions
          </Link>
          <Link href="/" style={{ color: "#8B94B2", fontSize: "13.5px", fontWeight: 600, textDecoration: "none" }}>
            ← Home
          </Link>
        </div>
      </div>
    </div>
  );
}