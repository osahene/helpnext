import FooterAdmin from "@/components/Footers/FooterAdmin";
import Navbar from "@/components/Navbars/IndexNavbar";
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
