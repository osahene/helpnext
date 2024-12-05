"use client";
import React, { useState } from "react";
import { verifyPhoneNumber, setPhone_Number } from "@/redux/authSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

export default function VerifyPhoneNumber() {
  const [phone_number, setPhone_Number] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const formChange = (e) => {
    setPhone_Number(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await dispatch(verifyPhoneNumber({ phone_number }));
      if (result.meta.requestStatus === "fulfilled") {
        dispatch(setPhone_Number(phone_number));
        router.push("/auth/verifyPhoneNumberOTP");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="App-header">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Enter your phone number
            </h1>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="phone"
                  className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  id="phone_number"
                  value={phone_number || ""}
                  onChange={formChange}
                  placeholder="+2331234567890"
                  className="bg-gray-50 border rounded rounded-lg border-gray-30 text-black"
                />
              </div>
              {/* Resend OTP logic */}

              <button
                type="submit"
                className="w-full mt-8 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 font-medium rounded-lg text-lg px-5 py-2.5"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
