"use client";

import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function RemoveInfo({ contact, onDelete, onCancel }) {
  return (
    <div className="modal-content ">
      <div className="w-full  max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-col items-center pb-10">
          <div className="py-5 uppercase">
            <h5 className="text-xl font-bold text-gray-900 dark:text-white">
              Heads Up !
            </h5>
          </div>
          <FontAwesomeIcon
            className="w-20 h-20 text-red-400"
            icon={faTrashCan}
          />
          <div className="p-5">
            <p className="text-lg dark:text-white">
              Do you want to delete{" "}
              <span className="font-bold">{contact.first_name}</span>{" "}
              <span className="font-bold">{contact.last_name}</span> from your
              emergency list?
            </p>
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={onDelete}
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
