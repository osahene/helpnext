"use client";
import React from "react";
import Link from "next/link";

export default function FooterAdmin() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full z-10 bottom-0" style={styles.footer}>
      {/* Top accent line */}
      <div style={styles.accentLine} />

      <div style={styles.inner}>
        {/* Left — branding & copyright */}
        <div style={styles.left}>
          {/* Logo mark */}
          <div style={styles.logoMark}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="9" cy="9" r="8" stroke="#4F8EF7" strokeWidth="1.8" />
              <path
                d="M6 7.5C6 5.843 7.343 4.5 9 4.5s3 1.343 3 3c0 1.5-1.5 2.25-1.5 3.75"
                stroke="#4F8EF7"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <circle cx="9" cy="13.5" r="0.9" fill="#4F8EF7" />
            </svg>
          </div>

          <div style={styles.brandBlock}>
            <span style={styles.brandName}>Help OO Help</span>
            <span style={styles.copyright}>
              © {year} TeenByte Tech Lab. All rights reserved.
            </span>
          </div>
        </div>

        {/* Divider (desktop) */}
        <div style={styles.divider} />

        {/* Right — nav links */}
        <nav style={styles.nav}>
          <FooterLink href="/contact/more" label="Contact Us" />
          <FooterLink href="/auth/register" label="Sign Up" />
          <FooterLink href="/auth/login" label="Sign In" />
          <FooterLink
            href="https://teenbyte.dev"
            label="TeenByte Tech Lab"
            external
          />
        </nav>
      </div>
    </footer>
  );
}

function FooterLink({ href, label, external = false }) {
  const [hovered, setHovered] = React.useState(false);

  const linkStyle = {
    ...styles.link,
    color: hovered ? "#4F8EF7" : "#94a3b8",
  };

  const props = {
    style: linkStyle,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {label}
        <svg
          style={styles.externalIcon}
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 10L10 2M10 2H5M10 2V7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    );
  }

  return (
    <Link href={href} {...props}>
      {label}
    </Link>
  );
}

const styles = {
  footer: {
    background: "#0f172a",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    position: "relative",
    overflow: "hidden",
  },
  accentLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "2px",
    background: "linear-gradient(90deg, transparent 0%, #4F8EF7 40%, #7ab3fa 60%, transparent 100%)",
    opacity: 0.7,
  },
  inner: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "14px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    flexWrap: "wrap",
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoMark: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    background: "rgba(79, 142, 247, 0.10)",
    border: "1px solid rgba(79, 142, 247, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  brandBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "1px",
  },
  brandName: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#e2e8f0",
    letterSpacing: "0.01em",
    lineHeight: 1.2,
  },
  copyright: {
    fontSize: "11px",
    color: "#475569",
    letterSpacing: "0.01em",
    lineHeight: 1.4,
  },
  divider: {
    width: "1px",
    height: "28px",
    background: "rgba(255,255,255,0.08)",
    flexShrink: 0,
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  link: {
    fontSize: "12.5px",
    fontWeight: "500",
    padding: "5px 10px",
    borderRadius: "6px",
    textDecoration: "none",
    transition: "color 0.18s ease, background 0.18s ease",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    letterSpacing: "0.01em",
  },
  externalIcon: {
    width: "10px",
    height: "10px",
    opacity: 0.7,
  },
};
