"use client";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faContactBook,
  faExclamationCircle,
  faUserCog,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const menuItems = [
  {
    href: "/contact",
    icon: faContactBook,
    label: "Contacts",
    gradient: "linear-gradient(135deg, #1A9E5C, #0D7A45)",
    shadow: "rgba(26,158,92,0.4)",
  },
  {
    href: "/contact/more",
    icon: faUserCog,
    label: "Settings",
    gradient: "linear-gradient(135deg, #2C5FD4, #5B3FE8)",
    shadow: "rgba(44,95,212,0.4)",
  },
];

const ActionButton = ({ pendingCount }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const actionButtonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionButtonRef.current && !actionButtonRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={actionButtonRef}
      style={{ position: "fixed", bottom: "28px", right: "24px", zIndex: 50 }}
    >
      {/* Menu items */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: "12px", marginBottom: "16px",
        transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        transform: menuOpen ? "scale(1) translateY(0)" : "scale(0.8) translateY(20px)",
        opacity: menuOpen ? 1 : 0,
        pointerEvents: menuOpen ? "auto" : "none",
      }}>
        {menuItems.map((item, i) => (
          <Link key={i} href={item.href}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {/* Label pill */}
              <div style={{
                background: "#fff",
                borderRadius: "20px",
                padding: "5px 12px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                border: "1px solid #DDE3F5",
                transition: "all 0.2s ease",
                transitionDelay: `${i * 0.05}s`,
              }}>
                <span style={{ color: "#0F1B3E", fontSize: "12.5px", fontWeight: 700 }}>
                  {item.label}
                </span>
              </div>
              {/* Icon button */}
              <button
                style={{
                  width: "48px", height: "48px", borderRadius: "50%",
                  background: item.gradient,
                  boxShadow: `0 6px 20px ${item.shadow}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", cursor: "pointer",
                  border: "none",
                  position: "relative",
                }}
              >
                <FontAwesomeIcon icon={item.icon} style={{ width: "18px", height: "18px" }} />
                {item.href === "/contact" && pendingCount > 0 && (
                  <div style={{
                    position: "absolute", top: "-3px", right: "-3px",
                    width: "18px", height: "18px", borderRadius: "50%",
                    background: "#CC2222",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "9px", fontWeight: 700, color: "#fff",
                    border: "2px solid #fff",
                  }}>
                    {pendingCount}
                  </div>
                )}
              </button>
            </div>
          </Link>
        ))}
      </div>

      {/* Main FAB */}
      <button
        onClick={() => setMenuOpen((v) => !v)}
        style={{
          width: "58px", height: "58px", borderRadius: "50%",
          background: menuOpen
            ? "linear-gradient(135deg, #CC2222, #6B0F0F)"
            : "linear-gradient(135deg, #1A0A0A, #6B0F0F)",
          boxShadow: menuOpen
            ? "0 8px 28px rgba(204,34,34,0.5)"
            : "0 8px 28px rgba(107,15,15,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", border: "none",
          transition: "all 0.3s ease",
          position: "relative",
        }}
      >
        <FontAwesomeIcon
          icon={faAdd}
          style={{
            width: "22px", height: "22px", color: "#fff",
            transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
            transform: menuOpen ? "rotate(45deg)" : "rotate(0deg)",
          }}
        />
        {/* Pending badge */}
        {pendingCount > 0 && !menuOpen && (
          <div style={{
            position: "absolute", top: "-2px", right: "-2px",
            width: "18px", height: "18px", borderRadius: "50%",
            background: "#E07A1A",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px solid #0D0D0D",
          }}>
            <FontAwesomeIcon icon={faExclamationCircle} style={{ width: "10px", color: "#fff" }} />
          </div>
        )}
      </button>
    </div>
  );
};

export default ActionButton;
