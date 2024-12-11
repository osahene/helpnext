"use client";
import React, { useState } from "react";
import {
  useDispatch,
  // useSelector
} from "react-redux";
import Image from "next/image";
import { loginUser, refreshToken, userState } from "@/redux/authSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  function togglePasswordVisibility() {
    setIsPasswordVisible((prevState) => !prevState);
  }

  const formChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser(formData));
      if (result.meta.requestStatus === "fulfilled") {
        const { first_name, last_name } = result.payload;
        const { access, refresh } = result.payload.tokens;
        dispatch(refreshToken({ accessToken: access, refreshToken: refresh }));
        dispatch(userState({ first_name: first_name, last_name: last_name }));
        router.push("/");
      } else {
        console.error("Login Failed:", result);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  return (
    <>
      <div className="">
        <div className="">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <a
              href="#as"
              className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
            >
              <Image
                width={10}
                height={10}
                className="w-8 h-8 mr-2"
                src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
                alt="logo"
              />
              Help OO Help
            </a>
            <div className="w-auto bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Sign in to your account
                </h1>
                <div>
                  <h1 className="text-white text-lg text-center">
                    Sign in with
                  </h1>
                  <button
                    type="submit"
                    className="w-full mt-3 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Google
                  </button>
                </div>
                <div className="flex items-center justify-center">
                  <div className="flex-grow h-px bg-indigo-600"></div>
                  <h4 className="px-4 text-white">Or</h4>
                  <div className="flex-grow h-px bg-indigo-600"></div>
                </div>
                <form className="space-y-4 md:space-y-3" onSubmit={handleLogin}>
                  <div className="my-5">
                    <label
                      htmlFor="password"
                      className="block p-2 text-lg font-medium text-gray-900 dark:text-white"
                    >
                      Phone Number or Email Address
                    </label>
                    <input
                      type="text"
                      name="email"
                      id="phone_number"
                      value={formData.email}
                      onChange={formChange}
                      placeholder="+233123456789 or abc@efg.com"
                      className="border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="my-5">
                    <label
                      htmlFor="password"
                      className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </label>

                    <div className="relative">
                      <input
                        type={isPasswordVisible ? "text" : "password"}
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={formChange}
                        className="border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
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
                  <div className="flex items-center justify-between ">
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
                  </div>
                  <div className="flex flex-col -mt-10">
                    <div>
                      <button
                        type="submit"
                        className="w-full mt-5 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        {/* {loading ? "Signing in..." : "Sign in"} */} Sign In
                      </button>
                    </div>
                    <div className=" flex justify-center pt-4">
                      <div className="ml-3 rounded rounded-lg hover:bg-blue-400  text-lg">
                        <button
                          type="button"
                          className="text-blue-500 p-1 dark:text-blue-300 hover:text-white"
                        >
                          Forgotten Password ?
                        </button>
                      </div>
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
