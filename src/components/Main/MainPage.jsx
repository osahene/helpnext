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
      <div className="bg-cust">
        <Navbar />
        <div className="">
          <div className="flex flex-col ">
            <section className="min-h-screen">
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
