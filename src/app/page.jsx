import React from "react";
import Navbar from "@/components/Navbars/IndexNavbar";
import Footer from "@/components/Footers/FooterAdmin";
import MainPage from "@/components/Cards/pageCards";

const Main = () => {
  return (
    <>
      <div className="flex flex-col min-h-[120dvh] ">
        <Navbar />
        <div className="flex flex-col h-screen">
          <section className="flex-grow">
            <MainPage />
          </section>
        </div>
        <div className="">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Main;
