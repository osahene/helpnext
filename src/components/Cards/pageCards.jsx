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

export default function MainPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  // const loadData = useSelector((state) => state.contact.loadData);
  const [showIntro, setShowIntro] = useState(false);
  const cardsData = [
    {
      cardName: "Health",
      cardName2: "Crisis",
      cardLogo: health,
      logoAlt: "health crisis",
      bgColor: "bg-card1",
      textColor: "text-white",
    },
    {
      cardName: "Robbery",
      cardName2: "Attack",
      cardLogo: handcuffs,
      logoAlt: "robbery attack",
      bgColor: "bg-card4",
      textColor: "text-white",
    },
    {
      cardName: "Fire",
      cardName2: "Outbreak",
      cardLogo: fire,
      logoAlt: "fire outbreak",
      bgColor: "bg-card2",
      textColor: "text-black",
    },
    {
      cardName: "Flood",
      cardName2: "Alert",
      cardLogo: flood,
      logoAlt: "flood alert",
      bgColor: "bg-card4",
      textColor: "text-white",
    },
    {
      cardName: "Call",
      cardName2: "Emergency",
      cardLogo: callss,
      logoAlt: "call emergency",
      bgColor: "bg-card2",
      textColor: "text-black",
    },
    {
      cardName: "Violence",
      cardName2: "Alert",
      cardLogo: nonviolence,
      logoAlt: "violence alert",
      bgColor: "bg-card4",
      textColor: "text-white",
    },
  ];
  useEffect(() => {
    if (!isAuthenticated) {
      setShowIntro(true);
    }
  }, [isAuthenticated]);

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setIsOpen(true);
  };

  return (
    <div className="relative top-20">
      <div className="m-5 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
        {cardsData.map((card, index) => (
          <div key={index} onClick={() => handleCardClick(card)}>
            <Cards
              cardName={card.cardName}
              cardName2={card.cardName2}
              cardLogo={card.cardLogo}
              logoAlt={card.logoAlt}
              bgColor={card.bgColor}
              textColor={card.textColor}
            />
          </div>
        ))}
        {isOpen && (
          <TriggerCard {...selectedCard} onClose={() => setIsOpen(false)} />
        )}
        {showIntro && <IntroModal onClose={() => setShowIntro(false)} />}
      </div>
    </div>
  );
}
