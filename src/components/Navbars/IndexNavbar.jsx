"use client";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, logout } from "@/redux/authSlice";
import { resetAllSlices } from "@/redux/rootActions";
import { setGlobalLoading } from "@/redux/globalSlice";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import userImg from "../../../public/img/user.svg";
import mainLogo from "../../../public/svg/Help Logo.svg";
import toast from "react-hot-toast";

export default function HeaderBar() {
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
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const result = await dispatch(logoutUser());
    try {
      if (result.meta.requestStatus === "fulfilled") {
        dispatch(resetAllSlices());
        dispatch(setGlobalLoading(false));
        dispatch(logout());
        toast.success("Logout successful. Redirecting...", { duration: 5000 });
        router.push("/");
      }
    } catch (error) {
      toast.error("Logout failed. Please try again.", { duration: 5000 });
    }
  };

  const initials = `${first_name?.[0] ?? ""}${last_name?.[0] ?? ""}`.toUpperCase();

  return (
    <nav
      style={{
        background: "linear-gradient(135deg, #1A0A0A 0%, #6B0F0F 100%)",
        boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.4)" : "none",
        transition: "box-shadow 0.3s ease",
      }}
      className="top-0 fixed z-50 w-full flex items-center justify-between px-5 py-3"
    >
      {/* ── Logo ─────────────────────────────────────────── */}
      <Link href="/" className="flex items-center gap-3">
        {/* Live dot */}
        <span className="relative flex h-2.5 w-2.5">
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ backgroundColor: "#FF3B3B" }}
          />
          <span
            className="relative inline-flex rounded-full h-2.5 w-2.5"
            style={{ backgroundColor: "#FF3B3B" }}
          />
        </span>
        <Image src={mainLogo} width={36} height={36} alt="Help oo Help Logo" />
        <span
          className="font-bold text-white text-lg tracking-tight"
          style={{ letterSpacing: "-0.02em" }}
        >
          Help OO Help
        </span>
      </Link>

      {/* ── Right controls ────────────────────────────────── */}
      <div className="flex items-center gap-3 relative">
        {isAuthenticated ? (
          <>
            {/* Avatar button */}
            <button
              ref={buttonRef}
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{
                  background: "linear-gradient(135deg, #2C5FD4, #5B3FE8)",
                  color: "#fff",
                }}
              >
                {initials || "?"}
              </div>
              <span className="text-white text-sm font-medium hidden sm:block">
                {first_name}
              </span>
              <svg
                className={`w-4 h-4 text-white/60 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown */}
            <div
              ref={dropdownRef}
              className={`absolute top-12 right-0 w-56 rounded-2xl overflow-hidden transition-all duration-200 ${
                isDropdownOpen
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-3 pointer-events-none"
              }`}
              style={{
                background: "#fff",
                boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                border: "1px solid #DDE3F5",
              }}
            >
              {/* User info header */}
              <div
                className="px-4 py-4"
                style={{
                  background: "linear-gradient(135deg, #2C5FD4, #5B3FE8)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white mb-2"
                  style={{ background: "rgba(255,255,255,0.2)" }}
                >
                  {initials || "?"}
                </div>
                <p className="text-white font-bold text-sm">
                  {first_name} {last_name}
                </p>
                <p className="text-white/60 text-xs mt-0.5">Active Member</p>
              </div>

              <div className="p-2">
                <Link href="/subscribe">
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-colors hover:bg-blue-50 group"
                    style={{ color: "#0F1B3E" }}>
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
                      style={{ background: "#F0F4FF", color: "#2C5FD4" }}
                    >
                      ✦
                    </span>
                    Subscription Plan
                    <span
                      className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "#EEF2FF", color: "#2C5FD4" }}
                    >
                      FREE
                    </span>
                  </button>
                </Link>

                <div className="my-1.5 h-px" style={{ background: "#F0F4FF" }} />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-red-50"
                  style={{ color: "#CC2222" }}
                >
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: "#FFF0F0" }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </span>
                  Sign Out
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/auth/register">
              <button
                className="px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#fff",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
              >
                Register
              </button>
            </Link>
            <Link href="/auth/login">
              <button
                className="px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200"
                style={{
                  background: "#fff",
                  color: "#6B0F0F",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
              >
                Login
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
