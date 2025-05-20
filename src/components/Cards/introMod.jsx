"use client";
import Image from "next/image";
import React from "react";
import emergency from "../../../public/img/emergency.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import {
  faApple,
  faAppStore,
  faAppStoreIos,
  faGooglePlay,
} from "@fortawesome/free-brands-svg-icons";

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
            <div className="mt-8 flex justify-center space-x-4">
              <button
                className="bg-white-600 text-black px-2 py-3 border-[2px] border-blue-600 rounded-lg  text-sm md:text-base font-medium shadow-xl hover:bg-blue-700 hover:text-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
                onClick={onClose}
              >
                <div className="flex flex-row items-center  space-x-2">
                  <div className="flex ">
                    <span>
                      <FontAwesomeIcon icon={faGlobe} size="2xl" />
                    </span>
                  </div>
                  <div className="flex flex-col items-baseline  space-x-2">
                    <span>Proceed</span>
                    {/* <span>Continue Web</span> */}
                  </div>
                </div>
              </button>
              {/* android */}
              {/* <button
                className="bg-gray-200 text-white px-1 py-1 border-[2px] border-blue-600 rounded-lg md:text-base font-medium shadow-lg hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
                onClick={onClose}
              >
                <div className="flex flex-row items-center text-black space-x-2">
                  <div className="flex ">
                    <span>
                      <FontAwesomeIcon
                        icon={faGooglePlay}
                        size="2xl"
                        className="text-black"
                      />
                    </span>
                  </div>
                  <div className="flex flex-col items-baseline  space-x-2">
                    <span>GET IT ON</span>
                    <span className="text-2xl ">Google Play</span>
                  </div>
                </div>
              </button> */}
              {/* ios */}
              {/* <button
                className="bg-white text-white px-2 py-1 border-[2px] border-gray-900 rounded-lg text-sm md:text-base font-medium shadow-lg hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
                onClick={onClose}
              >
                <div className="flex flex-row items-center  space-x-2">
                  <div className="flex ">
                    <span>
                      <FontAwesomeIcon
                        icon={faApple}
                        size="2xl"
                        className="text-black"
                      />
                    </span>
                  </div>
                  <div className="flex flex-col items-baseline text-black space-x-2">
                    <span>Download on the</span>
                    <span className="text-2xl ">App Store</span>
                  </div>
                </div>
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
