"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Cards from "./card";
import TriggerCard from "./cardTrigger";
import health from "../../../public/img/health.svg";
import handcuffs from "../../../public/img/handcuffs.svg";
import flood from "../../../public/img/flood.svg";
import fire from "../../../public/img/fire.svg";
import callss from "../../../public/img/callss.svg";
import nonviolence from "../../../public/img/nonviolence.svg";
import IntroModal from "./introMod";

const cardsData = [
  {
    cardName: "Health",
    cardName2: "Crisis",
    cardLogo: health,
    logoAlt: "health crisis",
    accentColor: "#1A9E5C",
  },
  {
    cardName: "Robbery",
    cardName2: "Attack",
    cardLogo: handcuffs,
    logoAlt: "robbery attack",
    accentColor: "#CC2222",
  },
  {
    cardName: "Fire",
    cardName2: "Outbreak",
    cardLogo: fire,
    logoAlt: "fire outbreak",
    accentColor: "#E8500A",
  },
  {
    cardName: "Flood",
    cardName2: "Alert",
    cardLogo: flood,
    logoAlt: "flood alert",
    accentColor: "#0A72C4",
  },
  {
    cardName: "Call",
    cardName2: "Emergency",
    cardLogo: callss,
    logoAlt: "call emergency",
    accentColor: "#7B22CE",
  },
  {
    cardName: "Violence",
    cardName2: "Alert",
    cardLogo: nonviolence,
    logoAlt: "violence alert",
    accentColor: "#8B5C00",
  },
];

export default function MainPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) setShowIntro(true);
  }, [isAuthenticated]);

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setIsOpen(true);
  };

  return (
    <div
      style={{ minHeight: "100vh", background: "#0D0D0D" }}
      className="pt-20"
    >
      {/* ── Header Banner ─────────────────────────────────────── */}
      <div className="px-5 pt-6 pb-2">
        <div
          style={{
            background: "linear-gradient(135deg, #3D0000, #6B0F0F)",
            borderRadius: "22px",
            padding: "20px",
            boxShadow: "0 8px 32px rgba(204,34,34,0.25)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Bubble decoration */}
          <div style={{
            position: "absolute", top: "-20px", right: "-20px",
            width: "100px", height: "100px", borderRadius: "50%",
            background: "rgba(255,255,255,0.05)", pointerEvents: "none"
          }} />
          <div style={{
            position: "absolute", bottom: "-15px", left: "-15px",
            width: "70px", height: "70px", borderRadius: "50%",
            background: "rgba(255,255,255,0.04)", pointerEvents: "none"
          }} />
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: "#fff", fontWeight: 800, fontSize: "18px", letterSpacing: "-0.02em", marginBottom: "4px" }}>
                What's your emergency?
              </p>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", lineHeight: 1.5 }}>
                Tap a situation below to instantly<br />alert your emergency contacts.
              </p>
            </div>
            <div
              style={{
                width: "52px", height: "52px", borderRadius: "50%",
                background: "rgba(255,255,255,0.12)",
                border: "1.5px solid rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg style={{ color: "#fff", width: "26px", height: "26px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section label ─────────────────────────────────────── */}
      <div className="px-5 pt-6 pb-3 flex items-center gap-2">
        <div style={{ width: "4px", height: "18px", background: "#CC2222", borderRadius: "2px" }} />
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: 700, letterSpacing: "1.6px" }}>
          SELECT EMERGENCY TYPE
        </p>
      </div>

      {/* ── Grid ──────────────────────────────────────────────── */}
      <div className="px-5 pb-24 grid grid-cols-2 gap-4 md:grid-cols-3">
        {cardsData.map((card, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(card)}
            style={{
              animation: `fadeSlideUp 0.4s ease both`,
              animationDelay: `${index * 0.07}s`,
            }}
          >
            <Cards
              cardName={card.cardName}
              cardName2={card.cardName2}
              cardLogo={card.cardLogo}
              logoAlt={card.logoAlt}
              accentColor={card.accentColor}
            />
          </div>
        ))}
      </div>

      {/* ── Footer note ───────────────────────────────────────── */}
      <div className="px-5 pb-8 flex items-center justify-center gap-2">
        <svg style={{ color: "rgba(255,255,255,0.2)", width: "14px", height: "14px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "12px" }}>
          Alerts include your live location.
        </p>
      </div>

      {isOpen && (
        <TriggerCard {...selectedCard} onClose={() => setIsOpen(false)} />
      )}
      {showIntro && <IntroModal onClose={() => setShowIntro(false)} />}

      {/* Stagger animation keyframes */}
      <style jsx global>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
