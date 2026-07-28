"use client";
import React from "react";
import Link from "next/link";

export default function FooterAdmin() {
  const year = new Date().getFullYear();

  const links = [
    // { href: "/contact/more", label: "Contact Us" },
    // { href: "/auth/register", label: "Register" },
    // { href: "/auth/login", label: "Login" },
    { href: "/legal/terms", label: "Terms" },
    { href: "/legal/privacy", label: "Privacy" },
    { href: "/legal/delete", label: "Data Deletion" },
  ];

  const socialLinks = [
    {
      href: "https://wa.me/233506053020",
      label: "WhatsApp",
      color: "#25D366",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.139.566 4.147 1.55 5.88L.057 23.25a.75.75 0 00.916.916l5.37-1.493A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.944 9.944 0 01-5.073-1.384l-.363-.217-3.762 1.046 1.046-3.762-.217-.363A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
        </svg>
      ),
    },
    {
      href: "https://facebook.com",
      label: "Facebook",
      color: "#1877F2",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      href: "https://twitter.com",
      label: "Twitter / X",
      color: "#1DA1F2",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="relative w-full bg-[#0A0A0F] border-t border-white/10 z-10 text-sm">
      {/* Accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#CC2222] to-transparent opacity-80" />

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-4">
        {/* Top Row: Brand & Quick Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-white font-bold text-lg tracking-tight">Help OO Help</span>
            <p className="text-slate-400 max-w-md text-sm leading-relaxed">
              Swift emergency response connecting you to trusted contacts in seconds.
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-2">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                title={s.label}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: `${s.color}15`,
                  borderColor: `${s.color}30`,
                  color: s.color,
                  borderWidth: "1px",
                }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Middle Row: Inline Links */}
        <div className=" border-t border-white/5 flex flex-wrap items-center justify-between gap-y-2 gap-x-6">
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-slate-400 hover:text-[#FF4D4D] transition-colors duration-150 font-medium"
              >
                {l.label}
              </Link>
            ))}
            <a
              href="https://teenbytetechlab.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-blue-400 transition-colors duration-150 font-medium"
            >
              TeenByte Tech Lab ↗
            </a>
          </nav>

          {/* Bottom Copyright */}
          <p className="text-slate-500">
            © {year} <span className="text-slate-400 font-medium">TeenByte Tech Lab</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}