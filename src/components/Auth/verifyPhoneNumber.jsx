"use client";
import React, { useState } from "react";
import { verifyPhoneNumber, setPhoneNumbers } from "@/redux/authSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  faBan,
  faPaperPlane,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast from "react-hot-toast";
import allCountries from "../../app/countries.json";

const countryOptions = allCountries.map((c) => ({
  name: c.name,
  code: c.dial_code,
  flag: `https://flagcdn.com/w20/${c.code.toLowerCase()}.png`,
}));

export default function VerifyPhoneNumber() {
  const [selectedCountry, setSelectedCountry] = useState(countryOptions[79]);
  const [phone_number, setPhone_Number] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const formChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 15) {
      setPhone_Number(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const fullNumber = `${selectedCountry.code}${phone_number}`;

    try {
      const result = await dispatch(
        verifyPhoneNumber({ phone_number: fullNumber })
      );
      if (result.meta.requestStatus === "fulfilled") {
        dispatch(setPhoneNumbers(fullNumber));
        toast.success(
          result.payload.message ||
            "Phone number verified successfully. Redirecting..."
        );
        router.push("/auth/verifyPhoneNumberOTP");
      }
    } catch (error) {
      toast.error(error.response?.error || "Request failed");
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="App-header bg-cust-dark">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-gray-300 rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-6 sm:p-8">
            <h1 className="text-xl font-bold text-center leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
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
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="w-10 h-5 pr-2"
                    size="xl"
                  />
                  <div className="flex w-2 space-x-2">
                    <div className="relative flex items-center bg-gray-50 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600">
                      <button
                        type="button"
                        className="flex items-center w-32 px-2 py-2 space-x-2 text-sm text-gray-700 dark:text-gray-200"
                      >
                        <img
                          src={selectedCountry.flag}
                          alt={selectedCountry.name}
                          className="w-5 h-4 rounded-sm"
                        />
                        <span>{selectedCountry.code}</span>
                      </button>

                      <select
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        value={selectedCountry.code}
                        onChange={(e) => {
                          const selected = countryOptions.find(
                            (c) => c.code === e.target.value
                          );
                          setSelectedCountry(selected);
                        }}
                      >
                        {countryOptions.map((country) => (
                          <option
                            className="bg-white text-black"
                            key={country.code}
                            value={country.code}
                          >
                            <span>
                              <img
                                src={country.flag}
                                className="absolute w-5 h-4 rounded-sm"
                              />
                            </span>
                            {country.name} {country.code}
                          </option>
                        ))}
                      </select>
                    </div>
                    <input
                      type="tel"
                      name="phone_number"
                      id="phone_number"
                      value={phone_number || ""}
                      onChange={formChange}
                      placeholder="1234567890"
                      className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              {/* Resend OTP logic */}

              <button
                type="submit"
                disabled={phone_number.length <= 5}
                className={`w-full mt-8  font-medium rounded-lg text-lg px-5 py-2.5 ${
                  phone_number.length <= 5
                    ? "bg-gray-400 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-4"
                }`}
              >
                <FontAwesomeIcon
                  icon={phone_number.length <= 5 ? faBan : faPaperPlane}
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
