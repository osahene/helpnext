import { faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useParams } from "react-router-dom";
import apiService from "../../api/axios";
import React, { useEffect, useState } from "react";

export default function Accept() {
  const [contactData, setContactData] = useState(null);
  const navigate = useNavigate();
  const { contactId } = useParams();

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const res = await apiService.contactInfo(contactId);
        if (res.status === 200) {
          setContactData(res.data);
        }
      } catch (error) {
        alert("Failed to fetch contact information.");
      }
    };
    fetchContactData();
  }, [contactId]);

  const handleStatusChange = async (status) => {
    try {
      const res = await apiService.inviteStatus({
        contact_id: contactId,
        action: status,
      });
      if (res.status === 200) {
        navigate("/accept/invite", { state: { contactData } });
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

  if (!contactData) return <p>Loading...</p>;

  const { contact_first_name, contact_last_name, sender_name } = contactData;

  return (
    <>
      <main className="App-header">
        <div className="absolute top-[120px]">
          <h1>Nomination Consent</h1>
        </div>
        <div className="border border-gray-200 w-auto shadow shadow-lg rounded rounded-xl">
          <div className="p-4 bg-black rounded rounded-xl">
            <h3 className="text-center">
              Hello, {contact_first_name} {contact_last_name}
            </h3>
            <h4 className="">
              We are glad to inform you that <span>{sender_name}</span> has
              nominated you, <br /> that in case of emergency, you should be
              contacted.
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
      </main>
    </>
  );
}
