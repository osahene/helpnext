"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faHome } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
export default function SuccessConfirm() {
  const router = useRouter();
  const handleSubmit = async (event) => {
    event.preventDefault();
    router.push("/");
  };

  return (
    <div className="App-header bg-cust-dark">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 sm:p-8">
            <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"></h1>
            <form className="space-y-10" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="phone"
                  className="text-center block mb-2 text-lg font-medium text-gray-900 dark:text-white"
                >
                  Password Reset Success
                </label>
              </div>
              <div>
                <p className="text-center block mb-2 text-lg font-medium text-gray-900 dark:text-white">
                  We have sent you a password reset link to your email.
                </p>
              </div>
              {/* Resend OTP logic */}

              <button
                type="submit"
                className="w-full mt-8 flex items-center justify-center gap-2 font-medium rounded-lg text-lg px-5 py-2.5 bg-blue-600 text-white hover:bg-blue-700"
              >
                <FontAwesomeIcon icon={faHome} className="w-5 h-5" />
                Go to homepage
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
