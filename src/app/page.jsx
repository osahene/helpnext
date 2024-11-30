import React from "react";
import Navbar from "@/components/Navbars/IndexNavbar";
import FooterAdmin from "@/components/Footers/FooterAdmin";
import MainPage from "@/components/Cards/pageCards";

const Main = () => {
  return (
    <>
      <Navbar />
      <section>
        <MainPage />
      </section>
      <FooterAdmin />
    </>
  );
};

export default Main;
