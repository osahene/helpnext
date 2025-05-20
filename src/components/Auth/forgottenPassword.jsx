"use client";
import React, { useState, useEffect } from "react";
import {
  forgottenPasswordRequest,
  setforgottenPasswordRequest,
} from "@/redux/authSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPaperPlane,
  faBan,
} from "@fortawesome/free-solid-svg-icons";
export default function ForgottenPassword() {
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(email));
  }, [email]);

  const formChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isValidEmail) return;
    try {
      const result = await dispatch(forgottenPasswordRequest({ email: email }));
      if (result.meta.requestStatus === "fulfilled") {
        dispatch(setforgottenPasswordRequest(email));
        toast.success(
          "Email sent successfully. Redirecting to confirmation page...",
          { duration: 5000 }
        );
        router.push("/auth/successConfirm");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="App-header bg-cust-dark">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-gray-300 rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 sm:p-8">
            <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Email
            </h1>
            <form className="space-y-10" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="phone"
                  className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
                >
                  Enter you Email
                </label>
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="w-10 h-5 pr-2"
                    size="2xl"
                  />
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email || ""}
                    onChange={formChange}
                    placeholder="amahenewaa@example.com"
                    className="border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                {email && !isValidEmail && (
                  <p className="mt-1 text-sm text-red-600">
                    Please enter a valid email address
                  </p>
                )}
              </div>
              {/* Resend OTP logic */}

              <button
                type="submit"
                disabled={!isValidEmail}
                className={`w-full mt-8 flex items-center justify-center gap-2 font-medium rounded-lg text-lg px-5 py-2.5 
                  ${
                    isValidEmail
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-400 text-gray-500 cursor-not-allowed"
                  }`}
              >
                <FontAwesomeIcon
                  icon={isValidEmail ? faPaperPlane : faBan}
                  className="w-5 h-5"
                />
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
