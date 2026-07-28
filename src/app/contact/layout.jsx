import FooterAdmin from "@/components/Footers/FooterAdmin";
import Navbar from "@/components/Navbars/ContactNavbar";
import React from "react";

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
