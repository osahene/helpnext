import React from "react";
import Navbar from "@/components/Navbars/IndexNavbar";
import Footer from "@/components/Footers/FooterAdmin";
import MainPage from "@/components/Cards/pageCards";

const Main = () => {
  return (
    <>
      <div className="">
        <Navbar />
        <div className="flex flex-col">
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
