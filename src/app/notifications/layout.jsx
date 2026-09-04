import Navbar from "@/components/Navbars/IndexNavbar";
import Footer from "@/components/Footers/FooterAdmin";
import RouteGuard from "@/components/Auth/RouteGuard";
import React from "react";

const layout = ({ children }) => {
  return (
    <RouteGuard>
      <Navbar />
      <div>{children}</div>
      <Footer />
    </RouteGuard>
  );
};

export default layout;
