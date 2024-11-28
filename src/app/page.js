"use client";
import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import Cards from "../app/components/cards";
import TriggerCard from "../app/components/navbar/trigger";
import health from "../app/assets/img/health.svg";
import handcuffs from "../app/assets/img/handcuffs.svg";
import flood from "../app/assets/img/flood.svg";
import fire from "../app/assets/img/fire.svg";
import callss from "../app/assets/img/callss.svg";
import nonviolence from "../app/assets/img/nonviolence.svg";
import emergency from "../app/assets/img/emergency.svg";
import Image from "next/image";

function IntroModal({ onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {/* Modal Container */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg md:max-w-2xl mx-4 md:mx-auto">
        {/* Modal Content */}
        <div className="flex flex-col md:flex-row">
          {/* Left Section (Image) */}
          <div className="flex justify-center items-center bg-gradient-to-r from-blue-500 to-blue-700 rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
            <Image
              className="h-36 md:h-48 lg:h-56 p-6"
              src={emergency}
              alt="emergency icon"
            />
          </div>

          {/* Right Section (Content) */}
          <div className="p-6 md:p-8 text-gray-800">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
              Welcome to Help OO Help
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Help OO Help is your dedicated platform to swiftly reach out to
              your loved ones during emergencies. Let us guide you on how to
              make the most of it.
            </p>

            <h3 className="text-lg md:text-xl font-medium text-gray-800 mb-3">
              How to Use
            </h3>
            <ol className="text-sm md:text-base text-gray-700 space-y-3">
              <li>
                <span className="font-semibold text-blue-600">1.</span> Ensure
                your device location services are enabled.
              </li>
              <li>
                <span className="font-semibold text-blue-600">2.</span> Tap on
                the emergency situation you are facing.
              </li>
              <li>
                <span className="font-semibold text-blue-600">3.</span> Sit
                back! Approved contacts in your emergency list will be notified
                via messages and voice calls.
              </li>
            </ol>

            {/* Action Button */}
            <div className="mt-8 flex justify-center">
              <button
                className="bg-blue-600 text-white px-6 py-3 rounded-lg text-sm md:text-base font-medium shadow-md hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
                onClick={onClose}
              >
                Got It!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MainPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const { isAuthenticated, loading } = useAuth();
  const [showIntro, setShowIntro] = useState(false);
  const cardsData = [
    {
      cardName: "Health",
      cardName2: "Crisis",
      cardLogo: health,
      logoAlt: "health crisis",
    },
    {
      cardName: "Robbery",
      cardName2: "Attack",
      cardLogo: handcuffs,
      logoAlt: "robbery attack",
    },
    {
      cardName: "Fire",
      cardName2: "Outbreak",
      cardLogo: fire,
      logoAlt: "fire outbreak",
    },
    {
      cardName: "Flood",
      cardName2: "Alert",
      cardLogo: flood,
      logoAlt: "flood alert",
    },
    {
      cardName: "Call",
      cardName2: "Emergency",
      cardLogo: callss,
      logoAlt: "call emergency",
    },
    {
      cardName: "Violence",
      cardName2: "Alert",
      cardLogo: nonviolence,
      logoAlt: "violence alert",
    },
  ];
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setShowIntro(true);
    }
  }, [isAuthenticated, loading]);

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setIsOpen(true);
  };

  return (
    <div className="m-5 top-0 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
      {cardsData.map((card, index) => (
        <div key={index} className="p-0" onClick={() => handleCardClick(card)}>
          <Cards
            cardName={card.cardName}
            cardName2={card.cardName2}
            cardLogo={card.cardLogo}
            logoAlt={card.logoAlt}
          />
        </div>
      ))}
      {isOpen && (
        <TriggerCard {...selectedCard} onClose={() => setIsOpen(false)} />
      )}
      {showIntro && <IntroModal onClose={() => setShowIntro(false)} />}
    </div>
  );
}
