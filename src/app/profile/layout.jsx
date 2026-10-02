import FooterAdmin from "@/components/Footers/FooterAdmin";
import Navbar from "@/components/Navbars/ContactNavbar";
import React from "react";

// Auth is gated globally now — see src/app/AuthGate.jsx — not per-layout.
const layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div>{children}</div>
      <FooterAdmin />
    </>
  );
};

export default layout;
