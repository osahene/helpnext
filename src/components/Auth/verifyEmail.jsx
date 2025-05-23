"use client";
import { verifyEmail, requestOTP, refreshToken } from "@/redux/authSlice";
import {
  faBan,
  faPaperPlane,
  faPassport,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function VerifyEmail() {
  const [otp, setOtp] = useState({
    otp: "",
  });
  const [timer, setTimer] = useState({ minutes: 1, seconds: 10 });
  const email = useSelector((state) => state.auth.email);
  const dispatch = useDispatch();
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

  const resendOTP = async (event) => {
    setTimer({ minutes: 1, seconds: 10 }); // Reset timer
    event.preventDefault();
    try {
      await dispatch(requestOTP({ email: email }));
      toast.success("OTP sent to your email", { duration: 5000 });
    } catch (error) {
      toast.error("Failed to resend OTP", { duration: 5000 });
      console.error("An error occurred:", error);
    }
  };

  const formChange = (e) => {
    const value = e.target.value;
    // Only update state if the value is a number and has max 6 digits
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp({ ...otp, [e.target.name]: value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await dispatch(verifyEmail({ otp, email }));
      if (result.meta.requestStatus === "fulfilled") {
        toast.success(
          result.payload.message ||
            "Email verified successfully. Redirecting...",
          { duration: 5000 }
        );
        router.push("/auth/verifyPhoneNumber");
      } else {
        toast.error("Email verification failed. Please try again.", {
          duration: 5000,
        });
        console.error("Email verification failed:", result);
      }
    } catch (error) {
      toast.error(
        error.response?.error || "An error occurred during email verification.",
        { duration: 5000 }
      );
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="App-header bg-cust-dark">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-gray-300 rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 sm:p-8">
            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Email Verification
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
                    value={otp.otp}
                    onChange={formChange}
                  />
                </div>
              </div>
              {/* Resend OTP logic */}
              <div className="countdown-text">
                {timer.minutes > 0 || timer.seconds > 0 ? (
                  <p>
                    Resend in:{" "}
                    <span style={{ fontWeight: 600 }}>
                      {timer.minutes < 10 ? `0${timer.minutes}` : timer.minutes}
                      :
                      {timer.seconds < 10 ? `0${timer.seconds}` : timer.seconds}
                    </span>
                  </p>
                ) : (
                  <p className="dark:text-white text-black">
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
                disabled={otp.otp.length <= 5}
                className={`w-full mt-8  font-medium rounded-lg text-lg px-5 py-2.5 ${
                  otp.otp.length <= 5
                    ? "bg-gray-400 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-4"
                }`}
              >
                <FontAwesomeIcon
                  icon={otp.otp.length <= 5 ? faBan : faPaperPlane}
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
