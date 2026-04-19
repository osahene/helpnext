"use client";
import { useSelector } from "react-redux";
import React from "react";
import Navbar from "@/components/Navbars/IndexNavbar";
import MainPage from "@/components/Cards/pageCards";
import ActionButton from "@/components/CallToAction/calltoaction";

export default function Homepage() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <div style={{ background: "#0D0D0D", minHeight: "100vh" }}>
      <Navbar />
      <MainPage />
      <ActionButton />
      {/* {isAuthenticated && <ActionButton />} */}
    </div>
  );
}
