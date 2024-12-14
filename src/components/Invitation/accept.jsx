"use client";
import React, { useEffect, useState } from "react";
import { ContactInfo, Invite } from "@/redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useRouter } from "next/navigation";
import { faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Accept() {
  const contDetail = useSelector((state) => state.contact.contactDetails || []);
  const [contactData, setContactData] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const search = useSearchParams();
  const contactId = search.get("contact_id");
  const token = search.get("token");

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        await dispatch(ContactInfo(contactId)).unwrap();
      } catch (error) {
        alert("Failed to fetch contact information.");
      }
    };
    fetchContactData();
  }, [contactId, dispatch]);

  const handleStatusChange = async (status) => {
    try {
      const res = await dispatch(
        Invite({
          contact_id: contactId,
          action: status,
          token: token,
        })
      );
      if (res.meta.requestStatus === "fulfilled") {
        router.push("/guestInvite/invite");
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status code outside the range of 2xx
        alert(`Error: ${error.response.data.error || "An error occurred."}`);
      } else if (error.request) {
        // Request was made but no response received
        alert("Network error: Please check your internet connection.");
      } else {
        // Something else caused an error
        alert(`Unexpected error: ${error.message}`);
      }
    }
  };

  // if (!contDetail) return <p>Loading...</p>;

  return (
    <>
      <main className="w-auto p-10 flex items-center">
        <div className="flex flex-col">
          <div className="pb-10 text-center">
            <h1 className="text-2xl">Nomination Consent</h1>
          </div>
          <div className="border border-gray-200 w-auto shadow shadow-lg rounded rounded-xl">
            <div className="p-4 text-lg bg-black rounded rounded-xl">
              <h3 className="text-center">
                Hello, {contDetail.contact_first_name}{" "}
                {contDetail.contact_last_name}
              </h3>
              <h4 className="">
                We are glad to inform you that{" "}
                <span>{contDetail.sender_name}</span> has nominated you, <br />{" "}
                that in case of emergency, you should be contacted.
              </h4>
              <div className="flex m-6 justify-center gap gap-5">
                <button
                  onClick={() => handleStatusChange("approved")}
                  type="button"
                  className="text-white flex justify-center w-[150px] bg-[#1da1f2] hover:bg-[#89CFF0]/90 focus:ring-4 focus:outline-none focus:ring-[#1da1f2]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55 me-2 mb-2"
                >
                  <FontAwesomeIcon
                    icon={faThumbsUp}
                    flip="horizontal"
                    className="w-10 h-5"
                  />
                  <span className="font-bold text-lg">Accept</span>
                </button>
                <button
                  onClick={() => handleStatusChange("rejected")}
                  type="button"
                  className="text-white bg-[#DC143C] w-[150px] justify-center hover:bg-[#FF6347]/90 focus:ring-4 focus:outline-none focus:ring-[#1da1f2]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55 me-2 mb-2"
                >
                  <FontAwesomeIcon
                    icon={faThumbsDown}
                    flip="horizontal"
                    className="w-10 h-5"
                  />
                  <span className="font-bold text-lg">Reject</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
