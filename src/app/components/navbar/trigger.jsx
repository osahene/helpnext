import { useState } from "react";
import apiService from "../../api/axios";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../../AuthContext";
import { Store } from "react-notifications-component";
import userImg from "../../assets/img/user.svg";

export default function TriggerCard({
  cardName,
  cardName2,
  cardLogo,
  logoAlt,
  onClose,
}) {
  const [showModal, setShowModal] = useState(true);
  const { isAuthenticated, user, loading } = useAuth();

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

      const res = await apiService.triggerAlert({
        alertType: `${cardName}`,
        location: geolocation,
      });

      if (res.status === 201) {
        setShowModal(false);
        setTimeout(onClose, 300);
      }
    } catch (error) {
      const notificationType =
        error === "User denied the request for Geolocation."
          ? "warning"
          : "danger";
      Store.addNotification({
        title: error,
        message: error,
        type: notificationType,
        insert: "top",
        container: "top-right",
        dismiss: {
          duration: 5000,
          onScreen: true,
        },
      });

      setShowModal(false);
      setTimeout(onClose, 300);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setTimeout(onClose, 300);
  };
  if (loading) {
    // Render a placeholder or null while loading
    return null; // Or return a spinner/loader if preferred
  }

  return showModal ? (
    <div
      className={`fixed inset-0 z-50 flex justify-center items-center transition-opacity duration-300 ${
        showModal ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="relative bg-white p-4 w-full max-w-sm max-h-full rounded-lg shadow">
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
          </>
        ) : (
          <>
            <div className="flex flex-col items-center pb-10 mx-5">
              <Image
                className="w-24 h-24 mb-3 rounded-full shadow-lg"
                src={userImg}
                alt="Auth"
              />
              <h5 className="mb-1 text-2xl font-medium text-gray-900 dark:text-white">
                Authentication
              </h5>
              <span className="text-lg text-gray-500 dark:text-gray-400">
                This service is for only authenticated users.
              </span>
              <div className="flex mt-4 md:mt-6">
                <Link href="/register">
                  <a className="inline-flex items-center px-4 py-2 text-lg font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Register
                  </a>
                </Link>
                <Link href="/login">
                  <a className="py-2 px-4 ms-2 text-lg font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                    Login
                  </a>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  ) : null;
}
