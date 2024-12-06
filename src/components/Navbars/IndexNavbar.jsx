"use client";
import { useDispatch, useSelector } from "react-redux";
// import { logout } from "@/redux/authSlice";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import userImg from "../../../public/img/user.svg";

export default function HeaderBar() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const first_name = useSelector((state) => state.auth.first_name);
  const last_name = useSelector((state) => state.auth.last_name);
  const logout = React.lazy(() =>
    import("@/redux/authSlice").then((module) => module.logout)
  );

  const dispatch = useDispatch();

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) && // Clicked outside the dropdown
        !buttonRef.current.contains(event.target) // Clicked outside the button
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // Add event listener

    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Cleanup on unmount
    };
  }, [dropdownRef]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <div>
        {/* Sticky navbar */}
        <nav className="top-0 fixed z-50 w-full flex flex-nowrap justify-between items-center px-4 py-3 navbar-expand-lg bg-white shadow">
          <div>
            <a
              href="https://flowbite.com/"
              className="flex items-center space-x-3 rtl:space-x-reverse"
            >
              <Image
                src="https://flowbite.com/docs/images/logo.svg"
                width={40}
                height={40}
                alt="Flowbite Logo"
              />
              <span className="self-center text-lg font-semibold whitespace-nowrap dark:text-white">
                Help oo Help
              </span>
            </a>
          </div>
          <div className="flex items-center gap-x-1 flex-nowrap">
            {/* Dropdown button */}
            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  ref={buttonRef}
                  className="flex text-sm bg-gray-100 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                  aria-expanded={isDropdownOpen}
                  onClick={toggleDropdown}
                >
                  <span className="sr-only">Open user menu</span>
                  <Image
                    className="w-8 h-8 rounded-full"
                    src={userImg}
                    alt="user"
                  />
                </button>

                <div
                  ref={dropdownRef}
                  className={`absolute top-[50px] right-[10px]  z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 transform transition-all duration-300 ease-in-out ${
                    isDropdownOpen
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-4 pointer-events-none"
                  }`}
                  id="user-dropdown"
                >
                  <div className="px-4 w-full flex flex-row py-3">
                    <span className="block text-sm text-gray-900 dark:text-white">
                      {first_name}
                    </span>
                    <span className="block px-2 text-sm text-gray-500 truncate dark:text-gray-400">
                      {last_name}
                    </span>
                  </div>
                  <ul className="py-2" aria-labelledby="user-menu-button">
                    <li>
                      <Link href={"/subscribe"}>
                        <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                          Subscription plan{" "}
                          <span className="text-blue-300">FREE</span>
                        </button>
                      </Link>
                    </li>
                  </ul>
                  <ul className="py-2" aria-labelledby="user-menu-button">
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block px-4 py-2 w-full text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <div className="mx-2">
                  <Link href={"/auth/register"}>
                    <button className="px-4 py-2 text-lg font-medium border border-2 rounded-md  text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:text-black">
                      Register
                    </button>
                  </Link>
                </div>
                <div className="mx-2">
                  <Link href={"/auth/login"}>
                    <button className="px-4 py-2 text-lg font-medium border border-2 rounded-md text-gray-700 hover:bg-gray-100  dark:text-gray-200 dark:hover:text-black">
                      Login
                    </button>
                  </Link>
                </div>
              </>
            )}
          </div>
          {/* <div className="items-center justify-between w-full md:flex md:w-auto md:mt-3 md:order-1">
              <p className="flex flex-col text-lg text-white">Welcome Akwasi</p>
            </div> */}
        </nav>
      </div>
    </>
  );
}