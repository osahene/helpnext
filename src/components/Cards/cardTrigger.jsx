"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trigger } from "@/redux/userSlice";
import { motion, AnimatePresence } from "motion/react";
import userImg from "../../../public/img/user.svg";

import Link from "next/link";
import Image from "next/image";
// import { Store } from "react-notifications-component";

export default function TriggerCard({
  cardName,
  cardName2,
  cardLogo,
  logoAlt,
  onClose,
}) {
  const [showModal, setShowModal] = useState(true);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const contact = useSelector((state) => state.contact.contacts);

  const getGeolocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation is not supported by your browser");
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                reject("User denied the request for Geolocation.");
                break;
              case error.POSITION_UNAVAILABLE:
                reject("Location information is unavailable.");
                break;
              case error.TIMEOUT:
                reject("The request to get user location timed out.");
                break;
              default:
                reject("An unknown error occurred while retrieving location.");
            }
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
        );
      }
    });
  };

  const handleTriggerAlert = async () => {
    try {
      const geolocation = await getGeolocation();

      const res = await dispatch(
        Trigger({
          alertType: `${cardName}`,
          location: geolocation,
        })
      );
      if (res.meta.requestStatus === "fulfilled") {
        setShowModal(false);
        setTimeout(onClose, 300);
      }
    } catch (error) {
      if (error === "User denied the request for Geolocation.") {
        Store.addNotification({
          title: "Location Required",
          message: "Turn on location to complete the action.",
          type: "warning",
          insert: "top",
          container: "top-right",
          dismiss: {
            duration: 5000,
            onScreen: true,
          },
        });
      } else if (error === "Location information is unavailable.") {
        Store.addNotification({
          title: "PERMISSION DENIED",
          message: "Location information is unavailable.",
          type: "danger",
          insert: "top",
          container: "top-right",
          dismiss: {
            duration: 5000,
            onScreen: true,
          },
        });
      } else if (error === "Location information is unavailable.") {
        Store.addNotification({
          title: "POSITION UNAVAILABLE",
          message: "Location information is unavailable.",
          type: "danger",
          insert: "top",
          container: "top-right",
          dismiss: {
            duration: 5000,
            onScreen: true,
          },
        });
      } else if (error === "The request to get user location timed out.") {
        Store.addNotification({
          title: "TIMEOUT",
          message: "The request to get user location timed out.",
          type: "danger",
          insert: "top",
          container: "top-right",
          dismiss: {
            duration: 5000,
            onScreen: true,
          },
        });
      } else {
        Store.addNotification({
          title: "LOCATION PROBLEMS",
          message: error.message,
          type: "danger",
          insert: "top",
          container: "top-right",
          dismiss: {
            duration: 5000,
            onScreen: true,
          },
        });
      }
      setShowModal(false);
      setTimeout(onClose, 300);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setTimeout(onClose, 300); // Delay to match animation duration
  };

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          className="modal-backdrop fixed inset-0 z-50 flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative bg-white p-4 w-full max-w-sm max-h-full rounded-lg shadow"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <button
              type="button"
              className="absolute hover:bg-red-500 hover:text-white top-3 right-2.5 text-gray-400"
              onClick={handleClose}
            >
              <span className="sr-only">Close modal</span>
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {isAuthenticated ? (
              <>
                <h1 className="text-red-400">Heads Up</h1>
                <div className="p-4 text-center">
                  <h3 className="mb-5 text-lg font-normal text-gray-500">
                    You have triggered <span>{cardName}</span>{" "}
                    <span>{cardName2}</span>
                  </h3>
                  <Image
                    src={cardLogo}
                    alt={logoAlt}
                    width={30}
                    height={30}
                    className="mx-auto mb-4 w-10 h-10"
                  />
                  <button
                    onClick={handleTriggerAlert}
                    className="text-white bg-red-600 hover:bg-red-800 px-5 py-2 rounded"
                  >
                    Trigger Alert
                  </button>
                  <button
                    onClick={handleClose}
                    className="py-2 px-5 ms-3 text-gray-900 bg-white border border-gray-200 rounded-lg"
                  >
                    No, cancel
                  </button>
                </div>

                {contact.length === 0 && (
                  <div className="text-center mt-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-12 h-12 mx-auto text-gray-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 13h6m2 10H7a2 2 0 01-2-2V7c0-1.1.9-2 2-2h10a2 2 0 012 2v14a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-gray-500 mt-2">
                      You have no contact in your emergency list.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center pb-10 mx-5">
                <Image
                  className="w-24 h-24 mb-3 rounded-full shadow-lg"
                  src={userImg}
                  alt="Auth"
                />
                <h5 className="mb-1 text-2xl font-medium text-gray-900">
                  Authentication Required
                </h5>
                <p className="text-lg text-gray-500">
                  This service is only available to authenticated users.
                </p>
                <div className="flex mt-4">
                  <Link href={"/register"}>
                    <button className="px-4 py-2 text-lg text-white bg-blue-700 rounded-lg hover:bg-blue-800">
                      Register
                    </button>
                  </Link>
                  <Link href={"/login"}>
                    <button className="py-2 px-4 ms-2 text-lg bg-white text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700">
                      Login
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
