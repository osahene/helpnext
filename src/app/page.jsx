import React from "react";
import Navbar from "@/components/Navbars/IndexNavbar";
import Footer from "@/components/Footers/FooterAdmin";
import MainPage from "@/components/Cards/pageCards";

const Main = () => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col h-[75vh]">
        <section className="flex-grow">
          <MainPage />
        </section>
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
};

export default Main;
