"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { countryOptions } from "@/utils/phone";

const C = {
  accent: "#4F8EF7", accentLight: "#EAF1FE", surface: "#F7F9FC",
  border: "#E2E8F0", textPrimary: "#0F172A", textSecondary: "#64748B", white: "#FFFFFF",
};

export default function CountryDropdown({ selected, onChange, height = 54 }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  const filtered = countryOptions.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) || c.code.includes(search)
  );

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      <button
        type="button"
        onClick={() => { setOpen((o) => !o); setSearch(""); }}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          height, padding: "0 12px", background: C.surface,
          border: `1.5px solid ${open ? C.accent : C.border}`,
          borderRadius: 14, cursor: "pointer", whiteSpace: "nowrap",
          transition: "border-color 0.2s", fontFamily: "inherit",
        }}
      >
        <Image
          src={selected.flag} alt={selected.name} width={20} height={14}
          style={{ borderRadius: 3, objectFit: "cover", flexShrink: 0 }}
          onError={(e) => { e.target.style.display = "none"; }}
        />
        <span style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>
          {selected.code}
        </span>
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24"
          stroke={C.textSecondary} strokeWidth={2}
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", left: 0,
          width: 280, maxHeight: 320, background: C.white,
          border: `1.5px solid ${C.border}`, borderRadius: 14,
          boxShadow: "0 8px 32px rgba(15,23,42,0.12)", zIndex: 200,
          overflow: "hidden", display: "flex", flexDirection: "column",
        }}>
          <div style={{ padding: "10px 12px", borderBottom: `1px solid ${C.border}` }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8, background: C.surface,
              borderRadius: 10, padding: "8px 12px", border: `1px solid ${C.border}`,
            }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke={C.accent} strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                autoFocus type="text" value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country or code..."
                style={{
                  border: "none", outline: "none", background: "transparent",
                  fontSize: 13, color: C.textPrimary, width: "100%", fontFamily: "inherit",
                }}
              />
            </div>
          </div>

          <div style={{ overflowY: "auto", flex: 1 }}>
            {filtered.length === 0 ? (
              <p style={{ textAlign: "center", color: C.textSecondary, fontSize: 13, padding: 16 }}>
                No countries found
              </p>
            ) : filtered.map((country, idx) => {
              const isSelected =
                country.code === selected.code && country.name === selected.name;
              return (
                <button
                  key={`${country.iso}-${idx}`} type="button"
                  onClick={() => { onChange(country); setOpen(false); }}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 14px", border: "none", cursor: "pointer",
                    background: isSelected ? C.accentLight : "transparent",
                    textAlign: "left", fontFamily: "inherit",
                    borderBottom: `1px solid ${C.border}`, transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = C.surface; }}
                  onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                >
                  <Image src={country.flag} alt={country.name} width={20} height={14}
                    style={{ borderRadius: 3, objectFit: "cover", flexShrink: 0 }}
                    onError={(e) => { e.target.style.display = "none"; }} />
                  <span style={{
                    flex: 1, fontSize: 14, color: isSelected ? C.accent : C.textPrimary,
                    fontWeight: isSelected ? 700 : 500,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{country.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: isSelected ? C.accent : C.textSecondary, flexShrink: 0 }}>
                    {country.code}
                  </span>
                  {isSelected && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={C.accent}>
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}