"use client";
import React from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { faThumbsUp, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Invite() {
  const contactData = useSelector((state) => state.contact.contactDetail || []);

  return (
    <>
      <main className="App-header">
        <div className="w-auto p-10">
          {/* <div className="absolute  top-[30px]">
            <h1 className="text-center">Create your</h1>
            <h1 className="text-center">In Case of Emergency List</h1>
          </div> */}
          <div className="border border-gray-200  w-auto shadow shadow-lg rounded rounded-xl">
            <div className="p-5 bg-black rounded rounded-xl">
              <h3 className="text-center">
                Hello, {""}
                <span className="font-bold">
                  {contactData.contact_first_name} {""}{" "}
                  {contactData.contact_last_name}{" "}
                </span>
              </h3>
              <p>
                <br /> Help OO Help provides you with a swift mechanism to
                easily get in touch with your loved ones during cases of
                emergency. With your{" "}
                <span className="font-bold">location turned on</span> and a
                gentle tap on an emergency situation that you find yourself in,
                an automated message and voice call would be broadcasted to your
                registered contacts on the app. <br /> <br /> You can create
                your <span className="font-bold">In Case of Emergency </span>
                list by clicking on the{" "}
                <span className="italic font-semibold">Ok</span> button.
              </p>
              <div className="flex m-6 justify-center gap gap-5">
                <Link href={"/auth/register"}>
                  <button
                    type="button"
                    className="text-white flex justify-center w-[150px] bg-[#1da1f2] hover:bg-[#89CFF0]/90 focus:ring-4 focus:outline-none focus:ring-[#1da1f2]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55 me-2 mb-2"
                  >
                    <FontAwesomeIcon
                      icon={faThumbsUp}
                      flip="horizontal"
                      className="w-10 h-5"
                    />
                    <span className="font-bold text-lg">Ok</span>
                  </button>
                </Link>
                <Link href={"/"}>
                  <button
                    type="button"
                    className="text-white bg-[#DC143C] w-[150px] justify-center hover:bg-[#FF6347]/90 focus:ring-4 focus:outline-none focus:ring-[#1da1f2]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55 me-2 mb-2"
                  >
                    <FontAwesomeIcon
                      icon={faXmark}
                      flip="horizontal"
                      className=" w-10 h-5"
                    />
                    <span className="font-bold text-lg">Cancel</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
