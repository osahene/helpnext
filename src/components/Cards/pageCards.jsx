"use client";
import { useState, useEffect } from "react";
// import { useAuth } from "../AuthContext";
import Cards from "./card";
import TriggerCard from "./cardTrigger";
import health from "../../../public/img/health.svg";
import handcuffs from "../../../public/img/handcuffs.svg";
import flood from "../../../public/img/flood.svg";
import fire from "../../../public/img/fire.svg";
import callss from "../../../public/img/callss.svg";
import nonviolence from "../../../public/img/nonviolence.svg";
import IntroMod from "./introMod";

function IntroModal({ onClose }) {
  return <IntroMod onClick={onClose} />;
}

export default function MainPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  //   const { isAuthenticated, loading } = useAuth();
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
  //   useEffect(() => {
  //     if (!loading && !isAuthenticated) {
  //       setShowIntro(true);
  //     }
  //   }, [isAuthenticated, loading]);

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setIsOpen(true);
  };

  return (
    <div className="m-5 h-full top-0 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
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
