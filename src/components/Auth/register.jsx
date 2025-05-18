"use client";
import { useState } from "react";
import {
  useDispatch,
  // useSelector
} from "react-redux";
import Image from "next/image";
import { setEmail, registerUser, googleLogin } from "@/redux/authSlice";
import { GetContact, GetDependants } from "@/redux/userSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faFileSignature,
  faKey,
  faUserAlt,
} from "@fortawesome/free-solid-svg-icons";
import mainLogo from "../../../public/svg/Help Logo.svg";
import React from "react";

export default function Register() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const dispatch = useDispatch();
  // const { loading, error } = useSelector((state) => state.user);
  const router = useRouter();

  function togglePasswordVisibility() {
    setIsPasswordVisible((prevState) => !prevState);
  }

  const formChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await dispatch(registerUser(formData));
      if (result.meta.requestStatus === "fulfilled") {
        dispatch(setEmail(formData.email));
        router.push("/auth/verifyEmail");
      } else {
        console.error("Registration failed:", result);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    const result = await dispatch(googleLogin(credentialResponse.credential));

    try {
      if (
        result.meta.requestStatus === "fulfilled" &&
        result.payload.status === "redirect"
      ) {
        router.push(result.payload.redirectUrl);
      } else if (result.meta.requestStatus === "fulfilled") {
        dispatch(GetContact());
        dispatch(GetDependants());
        router.push("/");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleGoogleLoginFailure = () => {
    console.log("Google Login Failed");
  };

  return (
    <>
      <div className="App-header-1 bg-cust-dark">
        <div className="w-auto">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <a
              href="#as"
              className="flex items-center mb-6 text-2xl font-semibold text-white"
            >
              <Image
                width={60}
                height={60}
                className="mr-2"
                src={mainLogo}
                alt="logo"
              />
              Help OO Help
            </a>
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <div className="flex items-center justify-center w-full">
                  <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={handleGoogleLoginFailure}
                    useOneTap
                    theme="filled_blue"
                    size="large"
                    text="signin_with"
                    shape="rectangular"
                    logo_alignment="left"
                  />
                </div>
                <div className="flex items-center justify-center">
                  <div className="flex-grow h-px bg-indigo-600"></div>
                  <h4 className="px-4 text-black dark:text-white">Or</h4>
                  <div className="flex-grow h-px bg-indigo-600"></div>
                </div>
                <form
                  className="space-y-4 md:space-y-6"
                  onSubmit={handleSubmit}
                >
                  <div className="flex flex-col space-y-4 md:space-y-6">
                    <div className="pr-5">
                      <label
                        htmlFor="first_name"
                        className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
                      >
                        First Name
                      </label>
                      <div className="flex items-center">
                        <FontAwesomeIcon
                          icon={faUserAlt}
                          className="w-10 h-5 pr-2"
                          size="xl"
                        />
                        <input
                          type="text"
                          name="first_name"
                          id="first_name"
                          value={formData.first_name}
                          onChange={formChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Akua"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="last_name"
                        className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
                      >
                        Last Name
                      </label>
                      <div className="flex items-center">
                        <FontAwesomeIcon
                          icon={faUserAlt}
                          className="w-10 h-5 pr-2"
                          size="xl"
                        />
                        <input
                          type="text"
                          name="last_name"
                          id="last_name"
                          value={formData.last_name}
                          onChange={formChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Asumah"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <div className="pr-5">
                      <label
                        htmlFor="email_address"
                        className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
                      >
                        Your email
                      </label>
                      <div className="flex items-center">
                        <FontAwesomeIcon
                          icon={faEnvelope}
                          className="w-10 h-5 pr-2"
                          size="xl"
                        />
                        <input
                          type="email"
                          name="email"
                          id="email_address"
                          value={formData.email}
                          onChange={formChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="amahenewaa@example.com"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </label>

                    <div className="relative">
                      <div className="flex flex-center items-baseline">
                        <FontAwesomeIcon
                          icon={faKey}
                          className="w-10 h-5 pr-2"
                          size="xl"
                        />
                        <input
                          type={isPasswordVisible ? "text" : "password"}
                          placeholder="Password"
                          value={formData.password}
                          onChange={formChange}
                          name="password"
                          className="border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          required
                        />
                      </div>
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600"
                        onClick={togglePasswordVisibility}
                      >
                        {isPasswordVisible ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full mt-8 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    <FontAwesomeIcon
                      icon={faFileSignature}
                      className="w-10 h-5"
                      size="lg"
                    />
                    {/* {loading ? "Registering..." : "Register"} */} Sign Up
                  </button>

                  <p className="text-lg font-light text-gray-500 dark:text-gray-400">
                    Already have an account?{" "}
                    <Link
                      href={"/auth/login"}
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      Sign In
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
