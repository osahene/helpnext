"use client";
import React from "react";
import Link from "next/link";

export default function FooterAdmin() {
  const year = new Date().getFullYear();

  const quickLinks = [
    { href: "/contact/more", label: "Contact Us" },
    { href: "/auth/register", label: "Register" },
    { href: "/auth/login", label: "Login" },
  ];

  const legalLinks = [
    { href: "/legal/terms", label: "Terms of Service" },
    { href: "/legal/privacy", label: "Privacy Policy" },
    { href: "/legal/delete", label: "Data Deletion" },
  ];

  const socialLinks = [
    {
      href: "https://wa.me/233506053020", label: "WhatsApp", color: "#25D366",
      icon: <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "15px", height: "15px" }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.139.566 4.147 1.55 5.88L.057 23.25a.75.75 0 00.916.916l5.37-1.493A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.944 9.944 0 01-5.073-1.384l-.363-.217-3.762 1.046 1.046-3.762-.217-.363A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>,
    },
    {
      href: "https://facebook.com", label: "Facebook", color: "#1877F2",
      icon: <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "15px", height: "15px" }}><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
    },
    {
      href: "https://twitter.com", label: "Twitter / X", color: "#1DA1F2",
      icon: <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "15px", height: "15px" }}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
    },
  ];

  const tags = ["🔥 Fire", "🌊 Flood", "🚑 Health", "🔫 Robbery", "⚡ Accident", "📞 Emergency"];

  return (
    <footer style={{
      background: "linear-gradient(180deg, #0A0A0F 0%, #0F172A 100%)",
      borderTop: "1px solid rgba(255,255,255,0.06)",
      position: "relative", overflow: "hidden", width: "100%", zIndex: 10,
    }}>
      {/* Crimson accent line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent 0%, #6B0F0F 20%, #CC2222 50%, #6B0F0F 80%, transparent 100%)", opacity: 0.85 }} />
      {/* Decorative circles */}
      <div style={{ position: "absolute", bottom: "-60px", right: "-60px", width: "180px", height: "180px", borderRadius: "50%", background: "rgba(204,34,34,0.04)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "-40px", left: "-40px", width: "130px", height: "130px", borderRadius: "50%", background: "rgba(44,95,212,0.04)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "44px 24px 20px" }}>
        {/* ── Grid ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-10">

          {/* Brand column */}
          <div className="sm:col-span-2">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <span style={{ position: "relative", display: "inline-flex" }}>
                <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#FF3B3B", opacity: 0.6, animation: "footerPing 1.3s cubic-bezier(0,0,0.2,1) infinite" }} />
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#FF3B3B", display: "block", position: "relative" }} />
              </span>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: "18px", letterSpacing: "-0.02em" }}>Help OO Help</span>
            </div>

            <p style={{ color: "#64748B", fontSize: "13.5px", lineHeight: 1.75, marginBottom: "18px", maxWidth: "350px" }}>
              A swift emergency response platform that connects you to your trusted contacts in seconds.
              One tap — your location is shared and your contacts are alerted.
            </p>

            {/* Emergency tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
              {tags.map((tag) => (
                <span key={tag} style={{
                  background: "rgba(204,34,34,0.1)", border: "1px solid rgba(204,34,34,0.2)",
                  color: "#FF8080", fontSize: "11px", fontWeight: 600,
                  padding: "3px 10px", borderRadius: "20px",
                }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Social icons */}
            <div style={{ display: "flex", gap: "8px" }}>
              {socialLinks.map((s) => (
                <a
                  key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label}
                  style={{
                    width: "36px", height: "36px", borderRadius: "10px",
                    background: `${s.color}18`, border: `1px solid ${s.color}33`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: s.color, textDecoration: "none", transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = `${s.color}30`; e.currentTarget.style.transform = "scale(1.1)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = `${s.color}18`; e.currentTarget.style.transform = "scale(1)"; }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p style={{ color: "#E2E8F0", fontWeight: 700, fontSize: "12px", letterSpacing: "0.1em", marginBottom: "14px", textTransform: "uppercase" }}>Quick Links</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {quickLinks.map((l) => <FLink key={l.href} {...l} />)}
            </div>
          </div>

          {/* Legal */}
          <div>
            <p style={{ color: "#E2E8F0", fontWeight: 700, fontSize: "12px", letterSpacing: "0.1em", marginBottom: "14px", textTransform: "uppercase" }}>Legal</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {legalLinks.map((l) => <FLink key={l.href} {...l} />)}
              <a href="https://teenbytetechlab.com" target="_blank" rel="noopener noreferrer"
                style={{ color: "#475569", fontSize: "13px", fontWeight: 500, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px", transition: "color 0.18s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#4F8EF7")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
              >
                TeenByte Tech Lab ↗
              </a>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ───────────────────────────────── */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "18px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
          <p style={{ color: "#334155", fontSize: "12px" }}>© {year} <span style={{ color: "#475569" }}>TeenByte Tech Lab</span>. All rights reserved.</p>
          <p style={{ color: "#334155", fontSize: "12px" }}>Built with ❤️ for safety &amp; emergency response</p>
        </div>
      </div>

      <style jsx global>{`@keyframes footerPing { 75%, 100% { transform: scale(2.2); opacity: 0; } }`}</style>
    </footer>
  );
}

function FLink({ href, label }) {
  return (
    <Link href={href}
      style={{ color: "#475569", fontSize: "13px", fontWeight: 500, textDecoration: "none", transition: "color 0.18s", display: "inline-flex", alignItems: "center", gap: "5px" }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "#CC2222")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
    >
      {label}
    </Link>
  );
}