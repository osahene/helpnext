import React from "react";
import Navbar from "@/components/Navbars/IndexNavbar";
import Footer from "@/components/Footers/FooterAdmin";
import MainPage from "@/components/Cards/pageCards";

const Main = () => {
  return (
    <>
      {/* <div className=""> */}
      <Navbar />
      <div className="relative top-20">
        <div className="flex flex-col h-[73vh]">
          <section className="flex-grow">
            <MainPage />
          </section>
        </div>
      </div>
      <div className="sticky">
        <Footer />
      </div>
      {/* </div> */}
    </>
  );
};

export default Main;
