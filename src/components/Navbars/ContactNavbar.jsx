/* ─── contactNavbar.jsx ─────────────────────────────────────────────────────
   Same as IndexNavbar but with a back arrow on the left
──────────────────────────────────────────────────────────────────────────── */
"use client";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, logout } from "@/redux/authSlice";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import mainLogo from "../../../public/svg/Help Logo.svg";

export function ContactNavbar() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const first_name = useSelector((state) => state.auth.first_name);
  const last_name = useSelector((state) => state.auth.last_name);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) && !buttonRef.current?.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const result = await dispatch(logoutUser());
    if (result.meta.requestStatus === "fulfilled") {
      dispatch(logout());
      router.push("/");
    }
  };

  const initials = `${first_name?.[0] ?? ""}${last_name?.[0] ?? ""}`.toUpperCase();

  return (
    <nav
      style={{
        background: "linear-gradient(135deg, #1A0A0A 0%, #6B0F0F 100%)",
        boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.4)" : "none",
        transition: "box-shadow 0.3s ease",
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 20px",
      }}
    >
      {/* Back button */}
      <button
        onClick={() => router.back()}
        style={{
          width: "38px", height: "38px", borderRadius: "11px",
          background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
        }}
      >
        <svg style={{ width: "18px", height: "18px", color: "#fff" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      {/* Logo */}
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Image src={mainLogo} width={34} height={34} alt="Help oo Help Logo" />
        <span style={{ color: "#fff", fontWeight: 800, fontSize: "17px", letterSpacing: "-0.02em" }}>
          Help OO Help
        </span>
      </Link>

      {/* User menu */}
      <div style={{ position: "relative" }}>
        {isAuthenticated ? (
          <>
            <button
              ref={buttonRef}
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "6px 10px", borderRadius: "10px",
                background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                cursor: "pointer",
              }}
            >
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, #2C5FD4, #5B3FE8)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "11px", fontWeight: 800 }}>
                {initials || "?"}
              </div>
              <svg style={{ width: "14px", height: "14px", color: "rgba(255,255,255,0.6)", transition: "transform 0.2s", transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              ref={dropdownRef}
              style={{
                position: "absolute", top: "44px", right: 0, width: "200px",
                background: "#fff", borderRadius: "18px", overflow: "hidden",
                boxShadow: "0 20px 60px rgba(0,0,0,0.2)", border: "1px solid #DDE3F5",
                transition: "all 0.2s ease",
                opacity: isDropdownOpen ? 1 : 0,
                transform: isDropdownOpen ? "translateY(0)" : "translateY(-8px)",
                pointerEvents: isDropdownOpen ? "auto" : "none",
              }}
            >
              <div style={{ background: "linear-gradient(135deg, #2C5FD4, #5B3FE8)", padding: "14px" }}>
                <p style={{ color: "#fff", fontWeight: 700, fontSize: "13.5px" }}>{first_name} {last_name}</p>
              </div>
              <div style={{ padding: "8px" }}>
                <button onClick={handleLogout} style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", background: "transparent", color: "#CC2222", fontWeight: 600, fontSize: "13.5px", border: "none", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "28px", height: "28px", borderRadius: "8px", background: "#FFF0F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg style={{ width: "13px", height: "13px", color: "#CC2222" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </span>
                  Sign Out
                </button>
              </div>
            </div>
          </>
        ) : (
          <div style={{ display: "flex", gap: "8px" }}>
            <Link href="/auth/login">
              <button style={{ padding: "8px 14px", borderRadius: "10px", background: "#fff", color: "#6B0F0F", fontWeight: 700, fontSize: "13px", border: "none", cursor: "pointer" }}>Login</button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default ContactNavbar;
