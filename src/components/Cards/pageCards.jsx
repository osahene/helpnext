"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { faStreetView, faUserNinja } from "@fortawesome/free-solid-svg-icons";
import Cards from "./card";
import TriggerCard from "./cardTrigger";
import IntroModal from "./introMod";
import StatusBanner from "./statusBanner";
import { GetContact } from "@/redux/userSlice";

// Icons match helpflutter's home tiles (home_screen.dart). `faIcon` is for
// the ones Material Symbols has no good match for: a masked robber, and a
// person on a map pin for Safety Companion (being watched over on the way).
const cardsData = [
  {
    cardName: "Robbery",
    cardName2: "Attack",
    cardLogo: "robbery",
    faIcon: faUserNinja,
    iconVariant: "material-symbols-outlined",
    logoAlt: "robbery attack",
    accentColor: "#CC2222",
  },
  {
    cardName: "Health",
    cardName2: "Crisis",
    cardLogo: "monitor_heart",
    iconVariant: "material-symbols-rounded",
    logoAlt: "health crisis",
    accentColor: "#1A9E5C",
  },
  {
    cardName: "Fire",
    cardName2: "Outbreak",
    cardLogo: "fire_truck",
    iconVariant: "material-symbols-rounded",
    logoAlt: "fire outbreak",
    accentColor: "#E8500A",
  },
  {
    cardName: "Flood",
    cardName2: "Alert",
    cardLogo: "flood",
    iconVariant: "material-symbols-rounded",
    logoAlt: "flood alert",
    accentColor: "#0A72C4",
  },
  {
    cardName: "Accident",
    cardName2: "Alert",
    cardLogo: "car_crash",
    iconVariant: "material-symbols-rounded",
    logoAlt: "accident alert",
    accentColor: "#8B5C00",
  },
  {
    // Not an alert: opens Safety Companion (trips, daily check-in) instead.
    cardName: "Safety",
    cardName2: "Companion",
    cardLogo: "safety_companion",
    faIcon: faStreetView,
    iconVariant: "material-symbols-rounded",
    logoAlt: "safety companion",
    accentColor: "#7B22CE",
    href: "/safety",
  },
];

export default function MainPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) setShowIntro(true);
  }, [isAuthenticated]);

  // The banner is only as truthful as the data behind it. Persisted contacts
  // can be stale (someone may have accepted since the last visit), so refresh
  // on mount rather than trusting whatever redux-persist rehydrated.
  useEffect(() => {
    if (isAuthenticated) dispatch(GetContact());
  }, [isAuthenticated, dispatch]);

  const handleCardClick = (card) => {
    if (card.href) {
      router.push(card.href);
      return;
    }
    setSelectedCard(card);
    setIsOpen(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--hoh-bg-fcf0f0)" }} className="pt-20">
      <StatusBanner />

      {/* ── Grid ──────────────────────────────────────────────── */}
      <div className="px-5 pt-4 pb-24 grid grid-cols-2 gap-4 md:grid-cols-3">
        {cardsData.map((card, index) => (
          <div
            key={card.cardLogo}
            onClick={() => handleCardClick(card)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleCardClick(card);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={
              card.href
                ? `Open ${card.cardName} ${card.cardName2}`
                : `Send a ${card.cardName} ${card.cardName2} alert`
            }
            className="hoh-card-slot"
            style={{ animationDelay: `${index * 0.07}s` }}
          >
            <Cards
              cardName={card.cardName}
              cardName2={card.cardName2}
              cardLogo={card.cardLogo}
              faIcon={card.faIcon}
              iconVariant={card.iconVariant}
              accentColor={card.accentColor}
            />
          </div>
        ))}
      </div>

      {/* ── Footer note ───────────────────────────────────────── */}
      <div className="px-5 pb-8 flex items-center justify-center gap-2">
        <span
          className="material-symbols-rounded"
          style={{ color: "var(--hoh-text-rgba77704)", fontSize: "18px" }}
          aria-hidden="true"
        >
          my_location
        </span>
        <p style={{ color: "var(--hoh-text-rgba777064)", fontSize: "15px" }}>
          Every alert includes your live location.
        </p>
      </div>

      {isOpen && (
        <TriggerCard {...selectedCard} onClose={() => setIsOpen(false)} />
      )}
      {showIntro && <IntroModal onClose={() => setShowIntro(false)} />}

      <style jsx global>{`
        .hoh-card-slot:focus-visible {
          outline: 2px solid #6b0f0f;
          outline-offset: 4px;
          border-radius: 18px;
        }
        @media (prefers-reduced-motion: no-preference) {
          .hoh-card-slot {
            animation: fadeSlideUp 0.4s ease both;
          }
        }
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}