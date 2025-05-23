"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trigger } from "@/redux/userSlice";
import { motion, AnimatePresence } from "motion/react";
import userImg from "../../../public/img/user.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Link from "next/link";
import Image from "next/image";
import {
  faUserSlash,
  faUsersSlash,
  faTriangleExclamation,
  faMapLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

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

  const handleClose = () => {
    setShowModal(false);
    setTimeout(onClose, 300); // Delay to match animation duration
  };

  const getGeolocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation is not supported by your browser");
      } else {
        navigator.geolocation.getCurrentPosition(
          () => {
            // Once permission is granted, setup watchPosition
            const watchId = navigator.geolocation.watchPosition(
              (position) => {
                resolve({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  accuracy: position.coords.accuracy,
                });
                // Clear the watch immediately after getting position
                navigator.geolocation.clearWatch(watchId);
              },
              (error) => handleGeolocationError(error, reject),
              { enableHighAccuracy: true, timeout: 60000, maximumAge: 0 }
            );
          },
          (error) => handleGeolocationError(error, reject),
          { enableHighAccuracy: true, timeout: 60000 }
        );
      }
    });
  };

  const handleGeolocationError = (error, reject) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        toast.error(
          "User denied the request for Geolocation. Please allow location access.",
          { duration: 5000 }
        );
        break;
      case error.POSITION_UNAVAILABLE:
        toast.error(
          "Location information is unavailable. Please check your device settings.",
          { duration: 5000 }
        );
        break;
      case error.TIMEOUT:
        toast.error(
          "The request to get user location timed out. Please try again.",
          { duration: 5000 }
        );
        break;
      case error.UNKNOWN_ERROR:
        toast.error("An unknown error occurred. Please try again.", {
          duration: 5000,
        });
        break;
    }
    reject(error);
  };

  const handleTriggerAlert = async () => {
    try {
      const geolocation = await getGeolocation();
      if (!geolocation.latitude || !geolocation.longitude) {
        toast.error(
          "Geolocation data is not available. Please check your device settings.",
          { duration: 5000 }
        );
        return;
      }

      const response = await dispatch(
        Trigger({
          alertType: `${cardName}`,
          location: geolocation,
        })
      );
      if (response.meta.requestStatus === "fulfilled") {
        setShowModal(false);
        setTimeout(onClose, 300);
      }
      toast.success(
        response.payload?.message || "Alert triggered successfully.",
        { duration: 5000, icon: <FontAwesomeIcon icon={faMapLocationDot} /> }
      );
    } catch (error) {
      if (error === "User denied the request for Geolocation.") {
        toast.error(
          "User denied the request for Geolocation. Please allow location access.",
          { duration: 5000 }
        );
      }
      setShowModal(false);
      setTimeout(onClose, 300);
    } finally {
      setShowModal(false);
      setTimeout(onClose, 300);
    }
  };

  const renderCardContent = () => {
    if (!isAuthenticated) {
      return (
        <div className="flex flex-col items-center pb-10 mx-5">
          <Image
            className="mb-3 rounded-full shadow-xl"
            width={80}
            height={80}
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
            <Link href={"/auth/register"}>
              <button className="px-4 py-2 text-lg text-white bg-blue-700 rounded-lg hover:bg-blue-800">
                Register
              </button>
            </Link>
            <Link href={"/auth/login"}>
              <button className="py-2 px-4 ms-2 text-lg bg-white text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700">
                Login
              </button>
            </Link>
          </div>
        </div>
      );
    }

    if (contact.length < 1) {
      return (
        <div className="flex flex-col items-center pb-10 mx-5">
          <div className="mb-3 p-5 border border-2 border-black-400 rounded-full shadow-xl">
            <FontAwesomeIcon
              icon={faUserSlash}
              size="2xl"
              style={{ color: "#ff0000" }}
            />
          </div>
          <div className="">
            <h1 className="text-xl text-red-500">Sorry !</h1>
          </div>
          <p className="text-gray-500 mt-4">
            You do not have any contacts in your emergency list. To use this
            service, you ought to register at least one person to your emergency
            list, and they must approve of it before they can receive alerts
            from you.
          </p>
          <div className="mt-4 flex justify-center">
            <Link href="/contact">
              <button className="px-4 py-2 text-lg text-white bg-blue-700 rounded-lg hover:bg-blue-800">
                Register Contacts
              </button>
            </Link>
            <button
              onClick={handleClose}
              className="py-2 px-4 ms-2 text-lg bg-white text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-100"
            >
              Close
            </button>
          </div>
        </div>
      );
    }

    const approvedContacts = contact.filter((c) => c.status === "approved");
    if (approvedContacts.length < 1) {
      return (
        <div className="flex flex-col items-center pb-10 mx-5">
          <div className="mb-3 p-5 border border-2 border-black-400 rounded-full shadow-xl">
            <FontAwesomeIcon
              icon={faUsersSlash}
              size="2xl"
              style={{ color: "#ff0000" }}
            />
          </div>
          <div className=" ">
            <h1 className="text-xl text-red-500">Sorry !</h1>
          </div>
          <p className="text-gray-500 py-4">
            None of your contacts have approved your request. You have 2
            options:
          </p>
          <br />
          <div className="text-black">
            <ul>
              <li>
                <span>1.</span> Alert them to approve your request.
              </li>
              <li>
                <span>2.</span> If you have not registered a relation, quickly
                do so.
              </li>
            </ul>
          </div>
          <div className="mt-4  flex justify-center space-x-3">
            <Link href="/contact">
              <button className="px-4 py-2 text-lg text-white bg-blue-700 rounded-lg hover:bg-blue-800">
                Register Contacts
              </button>
            </Link>
            <button
              onClick={handleClose}
              className="py-2 px-4 ms-2 text-lg bg-white text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-100"
            >
              Close
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="p-4 text-center">
        <div className="p-2 ">
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            beatFade
            size="2xl"
            style={{ color: "#ff0000" }}
          />
        </div>
        <h3 className="mb-5 text-lg font-normal text-gray-500">
          You have triggered <span className="text-red-500">{cardName}</span>{" "}
          <span className="text-red-500">{cardName2}.</span>
        </h3>
        <h3 className="text-black">
          All approved contacts on your emergency list would receive this
          message.
        </h3>
        <Image
          src={cardLogo}
          alt={logoAlt}
          width={60}
          height={60}
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
    );
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
            {renderCardContent()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
