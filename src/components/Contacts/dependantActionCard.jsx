"use client";
import {
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function DependantAction({
  contact,
  onAction,
  onCancel,
  actionType,
}) {
  const isApprove = actionType === "approve";
  const icon = isApprove ? faCircleCheck : faCircleXmark;
  const iconColor = isApprove ? "text-green-500" : "text-red-400";
  const actionMessage = isApprove ? (
    <>
      Do you want to approve{" "}
      <strong>
        {contact.first_name} {contact.last_name}
      </strong>{" "}
      as your dependant?
    </>
  ) : (
    <>
      Do you want to reject{" "}
      <strong>
        {contact.first_name} {contact.last_name}
      </strong>{" "}
      as your dependant?
    </>
  );
  return (
    <div className="modal-content ">
      <div className="w-full  max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-col items-center pb-10">
          <div className="py-5 text-center uppercase">
            <h5 className="text-xl font-bold text-gray-900 dark:text-white">
              Heads Up !
            </h5>
          </div>
          <FontAwesomeIcon className={`w-20 h-20 ${iconColor}`} icon={icon} />
          <div className="p-5">
            <p className="text-lg dark:text-white">{actionMessage}</p>
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={onAction}
              className="bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Yes, Proceed
            </button>
            <button
              onClick={onCancel}
              className="bg-gray-300 px-4 py-2 rounded-lg ml-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
