"use client";
import { useSelector } from "react-redux";
import React from "react";
import Navbar from "@/components/Navbars/IndexNavbar";
import Footer from "@/components/Footers/FooterAdmin";
import MainPage from "@/components/Cards/pageCards";
import ActionButton from "@/components/CallToAction/calltoaction";

export default function Homepage() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return (
    <>
      <div>
        <Navbar />
        <div className="relative top-20">
          <div className="flex flex-col h-[83vh]">
            <section className="flex-grow">
              <MainPage />
            </section>
          </div>
        </div>
        {isAuthenticated ? <ActionButton /> : <></>}
        {/* <div className="sticky">
        <Footer />
      </div> */}
      </div>
    </>
  );
}
