import FooterAdmin from "@/components/Footers/FooterAdmin";
import Navbar from "@/components/Navbars/ContactNavbar";
import RouteGuard from "@/components/Auth/RouteGuard";
import React from "react";

const layout = ({ children }) => {
  return (
    <RouteGuard>
      <Navbar />
      <div>{children}</div>
      <FooterAdmin />
    </RouteGuard>
  );
};

export default layout;
