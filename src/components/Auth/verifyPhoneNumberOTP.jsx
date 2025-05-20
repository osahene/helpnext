"use client";
import React, { useState, useEffect } from "react";
import { verifyPhoneNumberOTP, requestOTP } from "@/redux/authSlice";
import {
  faBan,
  faPassport,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function VerifyPhoneNumberOTP() {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState({ minutes: 1, seconds: 10 });
  const dispatch = useDispatch();
  const phone_number = useSelector((state) => state.auth.phone_number);
  const router = useRouter();
  useEffect(() => {
    if (timer.minutes > 0 || timer.seconds > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev.seconds > 0) {
            return { ...prev, seconds: prev.seconds - 1 };
          } else if (prev.minutes > 0) {
            return { minutes: prev.minutes - 1, seconds: 59 };
          } else {
            clearInterval(interval);
            return prev;
          }
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const formChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value);
    }
  };

  const resendOTP = async (event) => {
    // const phoneNumber = localStorage.getItem("phone_number");
    setTimer({ minutes: 1, seconds: 10 }); // Reset timer
    event.preventDefault();
    try {
      await dispatch(requestOTP({ email: phone_number }));
      toast.success("OTP sent to your phone number", { duration: 5000 });
    } catch (error) {
      toast.error("Failed to resend OTP");
      console.error("An error occurred:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await dispatch(
        verifyPhoneNumberOTP({ otp: otp, phone_number: phone_number })
      );
      if (result.meta.requestStatus === "fulfilled") {
        toast.success(
          result.payload.message ||
            "Phone number verified successfully. Redirecting...",
          { duration: 5000 }
        );
        router.push("/");
      } else {
        toast.error("Phone number verification failed. Please try again.", {
          duration: 5000,
        });
        console.error("Email verification failed:", result);
      }
    } catch (error) {
      toast.error(
        error.response?.error ||
          "An error occurred during phone number verification.",
        { duration: 5000 }
      );
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="App-header-1 bg-cust-dark">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full rounded-lg shadow dark:border sm:max-w-md xl:p-0 bg-gray-300 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 sm:p-8">
            <h1 className="text-xl font-bold text-center leading-tight tracking-tight  text-gray-900 md:text-2xl dark:text-white">
              Verify your phone number
            </h1>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="otp"
                  className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
                >
                  OTP
                </label>
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faPassport}
                    size="xl"
                    className="pr-2"
                  />
                  <input
                    type="text"
                    name="otp"
                    id="otp"
                    placeholder="Enter OTP"
                    className="bg-gray-50 border border-gray-300 dark:text-white rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                    required
                    value={otp}
                    onChange={formChange}
                  />
                </div>
              </div>
              {/* Resend OTP logic */}
              <div className="countdown-text ">
                {timer.minutes > 0 || timer.seconds > 0 ? (
                  <p className="dark:text-white ">
                    Time Remaining:{" "}
                    <span style={{ fontWeight: 600 }}>
                      {timer.minutes < 10 ? `0${timer.minutes}` : timer.minutes}
                      :
                      {timer.seconds < 10 ? `0${timer.seconds}` : timer.seconds}
                    </span>
                  </p>
                ) : (
                  <p className="dark:text-white text-md">
                    {"Didn't receive code?"}
                  </p>
                )}
                <button
                  type="button"
                  disabled={timer.minutes > 0 || timer.seconds > 0}
                  onClick={resendOTP}
                  className={`${
                    timer.minutes > 0 || timer.seconds > 0
                      ? "text-gray-400"
                      : "text-red-500"
                  }`}
                >
                  Resend OTP
                </button>
              </div>
              <button
                type="submit"
                disabled={otp.length <= 5}
                className={`w-full mt-8  font-medium rounded-lg text-lg px-5 py-2.5 ${
                  otp.length <= 5
                    ? "bg-gray-400 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-4"
                }`}
              >
                <FontAwesomeIcon
                  icon={otp.length <= 5 ? faBan : faPaperPlane}
                  className="pr-2"
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
