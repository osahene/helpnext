"use client";
import React, { useState } from "react";
import { confirmPasswordRequest, setConfirmPassword } from "@/redux/authSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  faCheckDouble,
  faKey,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function confirmPassword() {
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const formChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await dispatch(
        confirmPasswordRequest({ password: password })
      );
      if (result.meta.requestStatus === "fulfilled") {
        dispatch(setConfirmPassword(password));
        router.push("/auth/confirmPasswrod");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="App-header bg-cust-dark">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 sm:p-8">
            <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Confirm Password
            </h1>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="phone"
                  className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
                >
                  New Password
                </label>
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faKey}
                    className="w-10 h-5 pr-2"
                    size="2xl"
                  />

                  <input
                    type="password"
                    name="new_password"
                    id="new_password"
                    value={password || ""}
                    onChange={formChange}
                    placeholder="********"
                    className="w-full bg-gray-50 border rounded rounded-lg border-gray-30 text-black"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
                >
                  Confirm Password
                </label>
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faCheckDouble}
                    className="w-10 h-5 pr-2"
                    size="2xl"
                    style={{ color: "green" }}
                  />

                  <input
                    type="password"
                    name="new_password"
                    id="new_password"
                    value={password || ""}
                    onChange={formChange}
                    placeholder="********"
                    className="w-full bg-gray-50 border rounded rounded-lg border-gray-30 text-black"
                  />
                </div>
              </div>

              {/* Resend OTP logic */}

              <button
                type="submit"
                className="w-full mt-8 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 font-medium rounded-lg text-lg px-5 py-2.5"
              >
                <FontAwesomeIcon
                  icon={faPaperPlane}
                  className="w-10 h-5"
                  size="lg"
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
