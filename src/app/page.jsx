"use client";
import React from "react";
import Navbar from "@/components/Navbars/IndexNavbar";
import Footer from "@/components/Footers/FooterAdmin";
import MainPage from "@/components/Cards/pageCards";
import ActionButton from "@/components/CallToAction/calltoaction";
import { Provider } from "react-redux";
import store from "@/redux/store";

const Main = () => {
  return (
    <>
      <Provider store={store}>
        <Navbar />
        <div className="relative top-20">
          <div className="flex flex-col h-[83vh]">
            <section className="flex-grow">
              <MainPage />
            </section>
          </div>
        </div>
        <ActionButton />
        {/* <div className="sticky">
        <Footer />
      </div> */}
      </Provider>
    </>
  );
};

export default Main;
