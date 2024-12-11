"use client";
import Image from "next/image";
import React from "react";
import emergency from "../../../public/img/emergency.svg";

export default function IntroModal({ onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {/* Modal Container */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg md:max-w-2xl mx-4 md:mx-auto">
        {/* Modal Content */}
        <div className="flex flex-col md:flex-row">
          {/* Left Section (Image) */}
          <div className="flex justify-center items-center bg-gradient-to-r from-blue-500 to-blue-700 rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
            <Image
              className="p-6"
              src={emergency}
              alt="emergency icon"
              width={50}
              height={50}
            />
          </div>

          {/* Right Section (Content) */}
          <div className="p-6 md:p-8 text-gray-800">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
              Welcome to Help OO Help
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Help OO Help is your dedicated platform to swiftly reach out to
              your loved ones during emergencies. Let us guide you on how to
              make the most of it.
            </p>

            <h3 className="text-lg md:text-xl font-medium text-gray-800 mb-3">
              How to Use
            </h3>
            <ol className="text-sm md:text-base text-gray-700 space-y-3">
              <li>
                <span className="font-semibold text-blue-600">1.</span> Ensure
                your devices location services are enabled.
              </li>
              <li>
                <span className="font-semibold text-blue-600">2.</span> Tap on
                the emergency situation you are facing.
              </li>
              <li>
                <span className="font-semibold text-blue-600">3.</span> Sit
                back! Approved contacts in your emergency list will be notified
                via messages and voice calls.
              </li>
            </ol>

            {/* Action Button */}
            <div className="mt-8 flex justify-center">
              <button
                className="bg-blue-600 text-white px-6 py-3 rounded-lg text-sm md:text-base font-medium shadow-md hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
                onClick={onClose}
              >
                Got It!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
