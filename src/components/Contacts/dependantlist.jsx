"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  GetDependants,
  approveContact,
  rejectContact,
} from "@/redux/userSlice";

import ActionButton from "./../CallToAction/calltoaction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faFile } from "@fortawesome/free-solid-svg-icons";
import DependantAction from "./dependantActionCard";

export default function Dependents() {
  // const dependants =
  //   JSON.parse(
  //     JSON.stringify(useSelector((state) => state.contact.dependants)) || "{}"
  //   ).results || [];
  const dependants = useSelector((state) => state.contact.dependants) || [];
  console.log("working here");
  const loadData = useSelector((state) => state.contact.loadData);
  const dispatch = useDispatch();
  const [actionModal, setActionModal] = useState({
    open: false,
    dependant: null,
    type: "",
  });
  console.log("dependants", dependants);
  const [approval, setApproval] = useState(false);
  const [reject, setReject] = useState(false);
  const [currentDependant, setCurrentDependant] = useState(null);

  const pendingCount = dependants.filter((d) => d.status === "pending").length;

  const handleApprovalClick = (dependant) => {
    setCurrentDependant(dependant);
    setApproval(true);
  };

  const handleRejectClick = (dependant) => {
    setCurrentDependant(dependant);
    setReject(true);
  };

  const handleActionClick = (dependant, type) => {
    setActionModal({ open: true, dependant, type });
  };

  useEffect(() => {
    async function fetchDependants() {
      try {
        await dispatch(GetDependants());
      } catch (error) {
        console.log("Error fetching contacts", error);
      }
    }
    fetchDependants();
  }, [dispatch]);

  const handleActionConfirm = async () => {
    const { dependant, type } = actionModal;

    try {
      const action = type === "approve" ? approveContact : rejectContact;
      const res = await dispatch(action(dependant.id)).unwrap();

      if (res.status === 200) {
        console.log(`${type}d dependant successfully`);
        setActionModal({ open: false, dependant: null, type: "" });
      }
    } catch (error) {
      console.error(`Error during ${type} operation`, error);
    }
  };

  const closeModal = () => {
    setActionModal({ open: false, dependant: null, type: "" });
  };

  // if (loading) return <p>Loading...</p>;

  return (
    <div className=" overflow-x-auto shadow-md rounded rounded-lg">
      <table className="w-full text-lg text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <caption className="p-5 text-xl font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
          My Dependents
          <p className="mt-1 text-lg font-normal text-gray-500 dark:text-gray-400">
            List of relations who count on you during emergency situations. The
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
                  key={dependant.id}
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
                    {isPending ? (
                      <>
                        <span
                          className="text-blue-400 cursor-pointer"
                          onClick={() =>
                            handleActionClick(dependant, "approve")
                          }
                        >
                          Approve
                        </span>
                        <span className="mx-5">|</span>
                        <span
                          className="text-red-400 cursor-pointer"
                          onClick={() => handleActionClick(dependant, "reject")}
                        >
                          Reject
                        </span>
                      </>
                    ) : (
                      <span
                        className={`cursor-pointer ${
                          dependant.status === "approved"
                            ? "text-red-400"
                            : "text-blue-400"
                        }`}
                        onClick={() =>
                          handleActionClick(
                            dependant,
                            dependant.status === "approved"
                              ? "reject"
                              : "approve"
                          )
                        }
                      >
                        {dependant.status === "approved" ? "Reject" : "Approve"}
                      </span>
                    )}
                    {dependant.status === "pending" && (
                      <>
                        <span
                          className="text-blue-400 cursor-pointer"
                          onClick={() =>
                            handleActionClick(dependant, "approve")
                          }
                        >
                          Approve
                        </span>
                        <span className="mx-5">|</span>
                        <span
                          className="text-red-400 cursor-pointer"
                          onClick={() => handleActionClick(dependant, "reject")}
                        >
                          Reject
                        </span>
                      </>
                    )}
                    {dependant.status === "approved" && (
                      <span
                        className="text-red-400 cursor-pointer"
                        onClick={() => handleRejectClick(dependant)}
                      >
                        Reject
                      </span>
                    )}
                    {dependant.status === "rejected" && (
                      <span
                        className="text-blue-400 cursor-pointer"
                        onClick={() => handleApprovalClick(dependant)}
                      >
                        Approve
                      </span>
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
      {actionModal.open && (
        <div className="modal-backdrop">
          <DependantAction
            contact={actionModal.dependant}
            onAction={handleActionConfirm}
            onCancel={closeModal}
            actionType={actionModal.type}
          />
        </div>
      )}
      {approval && (
        <div className="modal-backdrop">
          <DependantAction
            contact={currentDependant}
            onAction={handleApprovalConfirm}
            onCancel={() => setApproval(false)}
            actionType="approve"
          />
        </div>
      )}
      {reject && (
        <div className="modal-backdrop">
          <DependantAction
            contact={currentDependant}
            onAction={handleRejectConfirm}
            onCancel={() => setReject(false)}
            actionType="reject"
          />
        </div>
      )}
      <div className="hidden">
        <ActionButton pendingCount={pendingCount} />
      </div>
    </div>
  );
}
