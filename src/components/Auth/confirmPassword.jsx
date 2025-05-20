"use client";
import React, { useState } from "react";
import { confirmPasswordRequest, setConfirmPassword } from "@/redux/authSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  faBan,
  faCheckDouble,
  faKey,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ConfirmPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPasswordInput] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError("");
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPasswordInput(e.target.value);
    if (error) setError("");
  };

  const isFormValid = () => {
    return password && confirmPassword && password === confirmPassword;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const result = await dispatch(
        confirmPasswordRequest({ password: password })
      );
      if (result.meta.requestStatus === "fulfilled") {
        dispatch(setConfirmPassword(password));
        toast.success("Password confirmed successfully. Redirecting...", {
          duration: 5000,
        });
        router.push("/auth/confirmPasswrod");
      }
    } catch (error) {
      toast.error("Request failed", { duration: 5000 });
      console.error("An error occurred:", error);
    }
  };
  return (
    <div className="App-header bg-cust-dark">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-gray-300 rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
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
                    onChange={handlePasswordChange}
                    placeholder="********"
                    className="border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                    value={confirmPassword || ""}
                    onChange={handleConfirmPasswordChange}
                    placeholder="********"
                    className="bg-gray-50 border border-gray-300 dark:text-white rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              </div>

              {/* Resend OTP logic */}

              <button
                type="submit"
                disabled={!isFormValid()}
                className={`w-full mt-8 text-white font-medium rounded-lg text-lg px-5 py-2.5 flex items-center justify-center gap-2 ${
                  isFormValid()
                    ? "bg-blue-600 hover:bg-blue-700 focus:ring-4"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                <FontAwesomeIcon
                  icon={!isFormValid() ? faBan : faPaperPlane}
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
