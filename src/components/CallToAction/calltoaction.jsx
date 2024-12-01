"use client";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faContactBook,
  // faReceipt,
  // faBell,
  // faGasPump,
  // faGear,
  faExclamationCircle,
  faUserCog,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const ActionButton = ({ pendingCount }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const actionButtonRef = useRef(null);

  // Toggle menu open/close
  const toggleMenu = () => {
    setMenuOpen((prevState) => !prevState);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        actionButtonRef.current &&
        !actionButtonRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={actionButtonRef}
      className="fixed bottom-0 right-0 p-10 flex items-end justify-end w-10"
    >
      <div
        onClick={toggleMenu}
        className="w-15 h-[4rem] text-white shadow-xl flex items-center justify-center p-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 z-50 cursor-pointer"
      >
        <FontAwesomeIcon
          className={`w-10 h-10 transition-all duration-[0.6s] ${
            menuOpen ? "rotate-90" : ""
          }`}
          icon={faAdd}
        />
        {pendingCount > 0 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
            <FontAwesomeIcon icon={faExclamationCircle} />
          </div>
        )}
      </div>

      {/* Menu items */}
      <div
        className={`absolute mb-[4rem] transition-all duration-[0.3s] ease-out flex flex-col items-center space-y-4 ${
          menuOpen ? "scale-110 opacity-100" : "scale-0 opacity-0"
        }`}
        style={{ bottom: "4rem" }} // Adjust position slightly above the button
      >
        <Link href={`contact`}>
          <div className="rounded-full p-2 bg-green-300 hover:bg-green-400 text-white">
            <FontAwesomeIcon className="w-8 h-8" icon={faContactBook} />
          </div>
          {pendingCount > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
              {pendingCount}
            </div>
          )}
        </Link>
        <Link href={`settings`}>
          <div className="rounded-full p-2 bg-blue-300 hover:bg-blue-400 text-white">
            <FontAwesomeIcon className="w-8 h-8" icon={faUserCog} />
          </div>
        </Link>
        {/* <div className="rounded-full p-2 bg-yellow-300 hover:bg-yellow-400 text-white">
          <FontAwesomeIcon className="w-8 h-8" icon={faBell} />
        </div>
        <div className="rounded-full p-2 mb-5 p bg-yellow-300 hover:bg-yellow-400 text-white">
          <FontAwesomeIcon className="w-8 h-8" icon={faGasPump} />
        </div> */}
      </div>
    </div>
  );
};

export default ActionButton;
