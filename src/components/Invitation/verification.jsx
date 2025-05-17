"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import apiService from "@/utils/axios";

export default function Verification() {
  const [names, setNames] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const router = useRouter();
  const search = useSearchParams();
  const token = search.get("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const decodeResponse = await apiService.decodeEmrgencyToken(token);

        // If already verified, show success message
        if (decodeResponse.data.verification_status) {
          setVerificationStatus("verified");
        }

        setNames(decodeResponse.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || "Invalid or expired token.");
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    } else {
      setError("No verification token provided");
      setLoading(false);
    }
  }, [token]);

  const handleVerification = async () => {
    try {
      const response = await apiService.verifyEmergency(token);
      if (response.status === 200) {
        setVerificationStatus("verified");
      }
    } catch (err) {
      alert(
        err.response?.data?.error || "Verification failed. Please try again."
      );
    }
  };

  if (loading)
    return (
      <div className="w-auto p-10 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl">Loading verification...</h1>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="w-auto p-10 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-red-500">{error}</h1>
          <button
            onClick={() => router.push("/")}
            className="mt-4 text-white bg-[#1da1f2] hover:bg-[#89CFF0]/90 px-5 py-2.5 rounded-lg"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );

  if (verificationStatus === "verified") {
    return (
      <div className="w-auto p-10 flex items-center justify-center">
        <div className="border border-gray-200 w-auto shadow-lg rounded-xl">
          <div className="p-4 text-lg bg-black rounded-xl">
            <div className="text-center">
              <h1 className="text-2xl text-green-500">
                Alert verified successfully!
              </h1>
              <p className="mt-2 text-white">
                Thank you for confirming this emergency.
              </p>
              <button
                onClick={() => router.push("/")}
                className="mt-4 text-white bg-[#1da1f2] hover:bg-[#89CFF0]/90 px-5 py-2.5 rounded-lg"
              >
                Return to Homepage
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <main className="w-auto p-10 flex items-center justify-center">
      <div className="flex flex-col max-w-2xl">
        <div className="pb-10 text-center">
          <h1 className="text-2xl text-black">Emergency Alert Verification</h1>
        </div>
        <div className="border border-gray-200 w-auto shadow-lg rounded-xl">
          <div className="p-4 text-lg bg-black rounded-xl">
            {names && (
              <>
                <h3 className="text-center text-white">
                  Hello, {names.contact_first_name} {names.contact_last_name}
                </h3>
                <h4 className="text-white mt-4">
                  This is an authentic emergency alert from{" "}
                  <span className="font-semibold">
                    {names.user_first_name} {names.user_last_name}
                  </span>
                  .
                </h4>
                <p className="text-white mt-2">
                  Please verify this alert to confirm you&apos;ve received it.
                </p>
              </>
            )}
            <div className="flex m-6 justify-center gap-5">
              <button
                onClick={handleVerification}
                type="button"
                className="text-white flex justify-center w-[150px] bg-[#1da1f2] hover:bg-[#89CFF0]/90 focus:ring-4 focus:outline-none focus:ring-[#1da1f2]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55 me-2 mb-2"
              >
                <FontAwesomeIcon
                  icon={faThumbsUp}
                  flip="horizontal"
                  className="w-10 h-5"
                />
                <span className="font-bold text-lg">Verify</span>
              </button>
              <button
                onClick={() => router.push("/")}
                type="button"
                className="text-white bg-[#DC143C] w-[150px] justify-center hover:bg-[#FF6347]/90 focus:ring-4 focus:outline-none focus:ring-[#1da1f2]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55 me-2 mb-2"
              >
                <FontAwesomeIcon
                  icon={faThumbsDown}
                  flip="horizontal"
                  className="w-10 h-5"
                />
                <span className="font-bold text-lg">Exit</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
