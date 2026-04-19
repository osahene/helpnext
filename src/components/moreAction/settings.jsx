"use client";
import React from "react";
import Image from "next/image";
import police from "../../../public/emerg/police.png";
import fire from "../../../public/emerg/GNFS.jpg";
import nadmo from "../../../public/emerg/nadmo.jpg";
import amb from "../../../public/emerg/ambulance.jpg";
import elec from "../../../public/emerg/ecg.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faTwitter, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faPhone } from "@fortawesome/free-solid-svg-icons";

const SectionHeader = ({ icon, label, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
    <div style={{ width: "4px", height: "18px", background: color, borderRadius: "2px" }} />
    <span style={{ fontSize: "14px", color, marginRight: "2px" }}>{icon}</span>
    <p style={{ color, fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px" }}>
      {label.toUpperCase()}
    </p>
  </div>
);

const serviceAccentColors = {
  "Ghana Police Service":          "#0A72C4",
  "Ghana Fire Service":            "#E8500A",
  "National Ambulance Service":    "#1A9E5C",
  "NADMO":                         "#CC2222",
  "Electricity Company of Ghana":  "#E07A1A",
};

const serviceIcons = {
  "Ghana Police Service":          "🚔",
  "Ghana Fire Service":            "🚒",
  "National Ambulance Service":    "🚑",
  "NADMO":                         "⚠️",
  "Electricity Company of Ghana":  "⚡",
};

const contactColors = {
  WhatsApp: "#25D366",
  Facebook: "#1877F2",
  Twitter:  "#1DA1F2",
  Call:     "#1A9E5C",
};

export default function MoreAction() {
  const emergencyServices = [
    { name: "Ghana Police Service",         image: police, contacts: ["191", "18555", "+233302773906"] },
    { name: "Ghana Fire Service",           image: fire,   contacts: ["192", "+233302772446", "+233299340383"] },
    { name: "National Ambulance Service",   image: amb,    contacts: ["+2330501614877", "+2330505982870"] },
    { name: "NADMO",                        image: nadmo,  contacts: ["112", "+233299350030", "+233302964884"] },
    { name: "Electricity Company of Ghana", image: elec,   contacts: ["+233302676727", "+233302611611", "+233302676728"] },
  ];

  const contactUs = [
    { name: "WhatsApp", icon: faWhatsapp, actions: ["+233506053020"], link: "https://wa.me/233506053020" },
    { name: "Facebook", icon: faFacebookF, actions: "Visit Facebook", link: "https://facebook.com/home" },
    { name: "Twitter",  icon: faTwitter,   actions: "Visit Twitter",  link: "https://twitter.com/home" },
    { name: "Call",     icon: faPhone,     actions: ["+233546045726"] },
  ];

  return (
    <div style={{ background: "#F0F4FF", minHeight: "100vh" }} className="pt-20 pb-10">

      {/* ── Page Header ──────────────────────────────────── */}
      <div className="px-5 pt-6 pb-4">
        <div style={{
          background: "linear-gradient(135deg, #0D1B4B, #2C5FD4)",
          borderRadius: "22px", padding: "20px",
          boxShadow: "0 8px 32px rgba(44,95,212,0.25)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "50px", height: "50px", borderRadius: "14px", background: "rgba(255,255,255,0.14)", border: "1.5px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg style={{ width: "24px", height: "24px", color: "#fff" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <p style={{ color: "#fff", fontWeight: 800, fontSize: "19px", letterSpacing: "-0.02em", marginBottom: "3px" }}>Emergency Contacts</p>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>Call for help instantly</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5">
        {/* ── National Emergencies ──────────────────────── */}
        <SectionHeader icon="🚨" label="National Emergencies" color="#CC2222" />

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
          {emergencyServices.map((svc) => {
            const accent = serviceAccentColors[svc.name] || "#2C5FD4";
            return (
              <div key={svc.name} style={{
                background: "#fff", borderRadius: "20px", padding: "16px",
                border: "1px solid #DDE3F5", boxShadow: "0 4px 16px rgba(44,95,212,0.06)",
              }}>
                {/* Service header */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                  <div style={{ width: "46px", height: "46px", borderRadius: "13px", background: `${accent}12`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                    <Image src={svc.image} alt={svc.name} width={46} height={46} style={{ objectFit: "cover", borderRadius: "13px" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: "#0F1B3E", fontWeight: 700, fontSize: "14.5px", marginBottom: "2px" }}>{svc.name}</p>
                    <span style={{ background: `${accent}15`, color: accent, fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "20px" }}>
                      {svc.contacts.length} line{svc.contacts.length > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {/* Phone rows */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {svc.contacts.filter(Boolean).map((phone, i) => (
                    <a
                      key={i}
                      href={`tel:${phone}`}
                      style={{
                        display: "flex", alignItems: "center", gap: "12px",
                        padding: "10px 12px", borderRadius: "13px",
                        background: `${accent}08`, textDecoration: "none",
                        transition: "background 0.15s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = `${accent}16`)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = `${accent}08`)}
                    >
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: `${accent}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg style={{ width: "15px", height: "15px", color: accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <span style={{ color: "#0F1B3E", fontSize: "14.5px", fontWeight: 600, letterSpacing: "0.3px", flex: 1 }}>{phone}</span>
                      <div style={{ padding: "6px 12px", borderRadius: "20px", background: accent, boxShadow: `0 4px 10px ${accent}44` }}>
                        <span style={{ color: "#fff", fontSize: "12px", fontWeight: 700 }}>Call</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Divider ───────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <div style={{ flex: 1, height: "1px", background: "#DDE3F5" }} />
          <div style={{ background: "#fff", border: "1px solid #DDE3F5", borderRadius: "20px", padding: "4px 12px" }}>
            <p style={{ color: "#8B94B2", fontSize: "10px", fontWeight: 700, letterSpacing: "1.2px" }}>ORGANISATION</p>
          </div>
          <div style={{ flex: 1, height: "1px", background: "#DDE3F5" }} />
        </div>

        {/* ── Help OO Help contacts ─────────────────────── */}
        <SectionHeader icon="🤝" label="Help OO Help" color="#0A72C4" />

        <div className="grid grid-cols-2 gap-3 pb-8">
          {contactUs.map((c) => {
            const color = contactColors[c.name] || "#2C5FD4";
            const isCall = Array.isArray(c.actions);
            const href = isCall ? `tel:${c.actions[0]}` : c.link;

            return (
              <a
                key={c.name} href={href} target={isCall ? undefined : "_blank"} rel={isCall ? undefined : "noopener noreferrer"}
                style={{
                  background: "#fff", borderRadius: "20px", padding: "18px",
                  border: `1.5px solid ${color}22`,
                  boxShadow: `0 6px 20px ${color}18, 0 2px 8px rgba(0,0,0,0.04)`,
                  display: "flex", flexDirection: "column", alignItems: "center",
                  textDecoration: "none", gap: "10px",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = `0 10px 28px ${color}28`; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = `0 6px 20px ${color}18`; }}
              >
                <div style={{
                  width: "52px", height: "52px", borderRadius: "15px",
                  background: `linear-gradient(135deg, ${color}cc, ${color})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: `0 4px 14px ${color}44`,
                }}>
                  <FontAwesomeIcon icon={c.icon} style={{ color: "#fff", width: "22px", height: "22px" }} />
                </div>
                <p style={{ color: "#0F1B3E", fontWeight: 700, fontSize: "14px" }}>{c.name}</p>
                <p style={{ color: "#8B94B2", fontSize: "11.5px", textAlign: "center", lineHeight: 1.4 }}>
                  {isCall ? c.actions[0] : c.actions}
                </p>
                <div style={{ padding: "5px 12px", borderRadius: "20px", background: `${color}12` }}>
                  <p style={{ color, fontSize: "11.5px", fontWeight: 600 }}>
                    {isCall ? "Tap to call" : "Open link"}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
