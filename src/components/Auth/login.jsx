"use client";
import React, { useState } from "react";
import {
  useDispatch,
  // useSelector
} from "react-redux";
import Image from "next/image";
import { googleLogin, loginUser } from "@/redux/authSlice";
import { GetContact, GetDependants } from "@/redux/userSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import mainLogo from "../../../public/svg/Help Logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faKey,
  faArrowRightToBracket,
  faBan,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    const result = await dispatch(googleLogin(credentialResponse.credential));
    try {
      if (
        result.meta.requestStatus === "fulfilled" &&
        result.payload.status === "redirect"
      ) {
        toast.success(result.payload.message || "Verify phone number", {
          duration: 5000,
        });
        router.push(result.payload.redirectUrl);
      } else if (result.meta.requestStatus === "fulfilled") {
        dispatch(GetContact());
        dispatch(GetDependants());
        toast.success(result.payload.message || "Google Login Successful", {
          duration: 5000,
        });
        router.push("/");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
    }
  };

  const handleGoogleLoginFailure = () => {
    toast.error("Google Login Failed");
  };

  function togglePasswordVisibility() {
    setIsPasswordVisible((prevState) => !prevState);
  }

  const formChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser(formData));
      if (result.meta.requestStatus === "fulfilled") {
        dispatch(GetContact());
        dispatch(GetDependants());
        toast.success(result.payload.message || "Login Successful", {
          duration: 5000,
        });
        router.push("/");
      } else {
        toast.error(result.payload.message || "Login Failed", {
          duration: 5000,
        });
        if (result.payload.status === 401) {
          toast.error("Invalid credentials", {
            duration: 5000,
          });
        } else if (result.payload.status === 403) {
          toast.error("Account not verified", {
            duration: 5000,
          });
        } else if (result.payload.status === 404) {
          toast.error("User not found", {
            duration: 5000,
          });
        } else if (result.payload.status === 500) {
          toast.error("Server error", {
            duration: 5000,
          });
        }
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
    }
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
            <div className="w-full bg-gray-300 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
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
                <form className="space-y-4 md:space-y-3" onSubmit={handleLogin}>
                  <div className="my-5">
                    <label
                      htmlFor="password"
                      className="block p-2 text-lg font-medium text-gray-900 dark:text-white"
                    >
                      Email Address
                    </label>
                    <div className="flex items-center">
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="w-10 h-5 pr-2"
                        size="xl"
                      />

                      <input
                        type="text"
                        name="email"
                        id="phone_number"
                        value={formData.email}
                        onChange={formChange}
                        placeholder="amahenewaa@example.com"
                        className="border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  {formData.email && !validateEmail(formData.email) && (
                    <p className="mt-1 text-sm text-red-600">
                      Please enter a valid email address
                    </p>
                  )}

                  <div className="my-5">
                    <label
                      htmlFor="password"
                      className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </label>

                    <div className="relative">
                      <div className="flex items-center">
                        <FontAwesomeIcon
                          icon={faKey}
                          className="w-10 h-5 pr-2"
                          size="xl"
                        />
                        <input
                          type={isPasswordVisible ? "text" : "password"}
                          placeholder="Password"
                          name="password"
                          value={formData.password}
                          onChange={formChange}
                          className="border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                      </div>
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-300"
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
                  {formData.password && formData.password.length <= 5 && (
                    <p className="mt-1 text-sm text-red-600">
                      Password must be at least 6 characters
                    </p>
                  )}
                  <div className="flex items-baseline justify-between ">
                    <div className="flex  items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                        required=""
                      />
                      <div className="ml-3 text-lg">
                        <label
                          htmlFor="remember"
                          className="text-gray-500 dark:text-gray-300"
                        >
                          Remember me
                        </label>
                      </div>
                    </div>
                    <div className=" flex justify-center pt-4">
                      <div className="ml-3 rounded rounded-lg hover:bg-blue-400  text-lg">
                        <button
                          type="button"
                          className="text-blue-500 p-1 dark:text-blue-300 hover:text-white"
                        >
                          <Link href={"/auth/forgottenPassword"}>
                            <span className="text-lg">Forgotten Password</span>
                          </Link>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col -mt-10">
                    <div>
                      <button
                        type="submit"
                        disabled={
                          !validateEmail(formData.email) ||
                          formData.password.length <= 5
                        }
                        className={`w-full mt-5 font-medium rounded-lg text-lg px-5 py-2.5 text-center ${
                          !validateEmail(formData.email) ||
                          formData.password.length <= 5
                            ? "bg-gray-400 text-gray-500 cursor-not-allowed" // Disabled state
                            : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" // Enabled state
                        }`}
                      >
                        <FontAwesomeIcon
                          icon={
                            !validateEmail(formData.email) ||
                            formData.password.length <= 5
                              ? faBan
                              : faArrowRightToBracket
                          }
                          className="w-10 h-5"
                          size="lg"
                        />
                        Sign In
                      </button>
                    </div>
                  </div>
                  <p className="text-lg m-0 font-light text-gray-500 dark:text-gray-400">
                    Don’t have an account yet?{" "}
                    <Link
                      href={"/auth/register"}
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      Sign up
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
