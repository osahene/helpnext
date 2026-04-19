import Image from "next/image";
import { useState } from "react";

const Cards = ({ cardName, cardName2, cardLogo, logoAlt, accentColor }) => {
  const [pressed, setPressed] = useState(false);

  // Derive a darker shade for gradient bottom
  const darken = (hex, amount = 30) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.max(0, (num >> 16) - amount);
    const g = Math.max(0, ((num >> 8) & 0xff) - amount);
    const b = Math.max(0, (num & 0xff) - amount);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  };

  const darkColor = darken(accentColor, 40);

  return (
    <div
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        background: `linear-gradient(135deg, ${accentColor}, ${darkColor})`,
        boxShadow: pressed
          ? "none"
          : `0 8px 24px ${accentColor}55, 0 2px 10px ${accentColor}33`,
        transform: pressed ? "scale(0.96)" : "scale(1)",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        borderRadius: "20px",
        cursor: "pointer",
        overflow: "hidden",
        position: "relative",
        minHeight: "160px",
      }}
      className="flex flex-col items-center justify-center p-5 w-full select-none"
    >
      {/* Decorative highlight circle top-left */}
      <div
        style={{
          position: "absolute",
          top: "-20px",
          left: "-20px",
          width: "90px",
          height: "90px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.12)",
          pointerEvents: "none",
        }}
      />
      {/* Decorative dark circle bottom-right */}
      <div
        style={{
          position: "absolute",
          bottom: "-24px",
          right: "-24px",
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background: "rgba(0,0,0,0.12)",
          pointerEvents: "none",
        }}
      />

      {/* Icon in frosted circle */}
      <div
        style={{
          background: "rgba(255,255,255,0.2)",
          border: "1.5px solid rgba(255,255,255,0.35)",
          borderRadius: "50%",
          width: "64px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "12px",
          flexShrink: 0,
        }}
      >
        <Image
          src={cardLogo}
          alt={logoAlt}
          width={36}
          height={36}
          style={{ filter: "brightness(0) invert(1)" }}
        />
      </div>

      {/* Title */}
      <p className="text-white font-extrabold text-center leading-tight"
        style={{ fontSize: "clamp(14px, 3.5vw, 20px)", letterSpacing: "-0.02em" }}>
        {cardName}
      </p>
      <p className="text-white font-extrabold text-center leading-tight"
        style={{ fontSize: "clamp(14px, 3.5vw, 20px)", letterSpacing: "-0.02em" }}>
        {cardName2}
      </p>

      {/* Tap to alert badge */}
      <div
        style={{
          marginTop: "10px",
          // background: "rgba(0,0,0,0.2)",
          borderRadius: "20px",
          padding: "3px 10px",
        }}
      >
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "9px", fontWeight: 600, letterSpacing: "1px" }}>
          {/* TAP TO ALERT */}
        </p>
      </div>
    </div>
  );
};

export default Cards;
