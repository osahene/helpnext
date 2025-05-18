"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  GetDependants,
  approveContact,
  rejectContact,
} from "@/redux/userSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faFile } from "@fortawesome/free-solid-svg-icons";
import DependantAction from "./dependantActionCard";
import ActionButton from "./../CallToAction/calltoaction";
import toast from "react-hot-toast";

export default function Dependents() {
  const dependants = useSelector((state) => state.contact.dependants) || [];
  const loadData = useSelector((state) => state.contact.loadData);
  const dispatch = useDispatch();
  const [actionModal, setActionModal] = useState({
    open: false,
    dependant: null,
    type: "",
  });

  const pendingCount = dependants.filter((d) => d.status === "pending").length;

  useEffect(() => {
    async function fetchDependants() {
      try {
        await dispatch(GetDependants());
        toast.success("Dependants fetched successfully!", {
          duration: 5000,
        });
      } catch (error) {
        toast.error("Failed to fetch dependants. Please try again.", {
          duration: 5000,
        });
        console.log("Error fetching contacts", error);
      }
    }
    fetchDependants();
  }, [dispatch]);

  const handleActionClick = (dependant, type) => {
    setActionModal({ open: true, dependant, type });
  };

  const handleActionConfirm = async () => {
    const { dependant, type } = actionModal;

    try {
      const action = type === "approve" ? approveContact : rejectContact;
      const response = await dispatch(action(dependant.pk)).unwrap();

      if (response.status === 200) {
        setActionModal({ open: false, dependant: null, type: "" });
        toast.success(`Contact ${type}d successfully!`, {
          duration: 5000,
        });
      }
    } catch (error) {
      toast.error(`Failed to ${type} contact. Please try again.`, {
        duration: 5000,
      });
      console.error(`Error during ${type} operation`, error);
    } finally {
      setActionModal({ open: false, dependant: null, type: "" });
    }
  };

  const closeModal = () => {
    setActionModal({ open: false, dependant: null, type: "" });
  };

  return (
    <div className="overflow-x-auto shadow-md rounded rounded-lg">
      <table className="w-full text-lg text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <caption className="p-5 text-xl font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
          My Dependents
          <p className="mt-1 text-lg font-normal text-gray-500 dark:text-gray-400">
            List of relations who rely on you during emergency situations. The
            information can be updated.
          </p>
        </caption>
        <thead className="text-lg text-center text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Phone Number
            </th>
            <th scope="col" className="px-6 py-3">
              Relation
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="text-lg text-center">
          {dependants.length > 0 ? (
            dependants.map((dependant) => {
              const statusColor =
                dependant.status === "approved"
                  ? "#63E6BE"
                  : dependant.status === "rejected"
                  ? "#fe504b"
                  : "#ffd43b";
              const showBeatFade = dependant.status === "pending";

              return (
                <tr
                  key={dependant.pk}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <th
                    scope="row"
                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <div className="ps-3">
                      <div className="text-base font-semibold">
                        <span className="px-2">{dependant.first_name}</span>
                        <span>{dependant.last_name}</span>
                      </div>
                      <div className="font-normal text-gray-500">
                        {dependant.email}
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">{dependant.phone_number}</td>
                  <td className="px-6 py-4">{dependant.relation}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FontAwesomeIcon
                        className="h-2.5 w-2.5 me-2"
                        icon={faCircle}
                        beatFade={showBeatFade}
                        style={{ color: statusColor }}
                      />{" "}
                      {dependant.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {dependant.status === "pending" && (
                      <>
                        <button
                          className="text-blue-400 hover:text-blue-600 mr-4"
                          onClick={() =>
                            handleActionClick(dependant, "approve")
                          }
                        >
                          Approve
                        </button>
                        <button
                          className="text-red-400 hover:text-red-600"
                          onClick={() => handleActionClick(dependant, "reject")}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {dependant.status === "approved" && (
                      <button
                        className="text-red-400 hover:text-red-600"
                        onClick={() => handleActionClick(dependant, "reject")}
                      >
                        Reject
                      </button>
                    )}
                    {dependant.status === "rejected" && (
                      <button
                        className="text-blue-400 hover:text-blue-600"
                        onClick={() => handleActionClick(dependant, "approve")}
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5" className="px-6 py-4 bg-gray-300 text-center">
                <FontAwesomeIcon
                  className="text-gray-500"
                  icon={faFile}
                  size="2xl"
                />
                <p className="mt-4 text-lg font-semibold text-gray-600">
                  No dependants contact available
                </p>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Action Confirmation Modal */}
      {actionModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <DependantAction
            contact={actionModal.dependant}
            onAction={handleActionConfirm}
            onCancel={closeModal}
            actionType={actionModal.type}
          />
        </div>
      )}

      <div className="hidden">
        <ActionButton pendingCount={pendingCount} />
      </div>
    </div>
  );
}
