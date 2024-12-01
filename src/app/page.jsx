import React from "react";
import Navbar from "@/components/Navbars/IndexNavbar";
import Footer from "@/components/Footers/FooterAdmin";
import MainPage from "@/components/Cards/pageCards";
import ActionButton from "@/components/CallToAction/calltoaction";

const Main = () => {
  return (
    <>
      {/* <div className=""> */}
      <Navbar />
      <div className="relative top-20">
        <div className="flex flex-col h-[74vh]">
          <section className="flex-grow">
            <MainPage />
          </section>
        </div>
      </div>
      <ActionButton />
      <div className="sticky">
        <Footer />
      </div>
      {/* </div> */}
    </>
  );
};

export default Main;
