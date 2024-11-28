import React, { useEffect, useState } from "react";
import apiService from "../../api/axios";
import EditContact from "../contactbooks/editInfo";
import RemoveInfo from "../contactbooks/removeInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faCircle } from "@fortawesome/free-solid-svg-icons";

export default function Emergency() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await apiService.getMyContacts();
        setContacts(response.data.results);
      } catch (error) {
        console.log("Error fetching contacts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const handleEditClick = (contact) => {
    setCurrentContact(contact);
    setIsEditing(true);
  };

  const handleEditSubmit = async (updatedContact) => {
    try {
      const response = await apiService.updateContact(updatedContact);
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.pk === currentContact.pk ? response.data : contact
        )
      );
      setIsEditing(false);
    } catch (error) {
      console.log("Error updating contact", error);
    }
  };
  const handleDeleteClick = (contact) => {
    setCurrentContact(contact);
    setIsDeleting(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await apiService.deleteContact(currentContact);
      setContacts((prevContacts) =>
        prevContacts.filter((contact) => contact.pk !== currentContact.pk)
      );
      setIsDeleting(false);
    } catch (error) {
      console.log("Error deleting contact", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <caption className="p-5 text-xl font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
          My Emergency Contact
          <p className="mt-1 text-lg font-normal text-gray-500 dark:text-gray-400">
            List of relations you can count on during an emergency. The
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
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="text-center text-lg">
          {contacts.length > 0 ? (
            contacts.map((contact) => {
              const statusColor =
                contact.status === "approved"
                  ? "#63E6BE"
                  : contact.status === "rejected"
                  ? "#fe504b"
                  : "#ffd43b";
              const showBeatFade = contact.status === "pending";
              return (
                <tr
                  key={contact.pk}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <th
                    scope="row"
                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <div className="ps-3">
                      <div className="text-base font-semibold">
                        <span className="px-3">{contact.first_name}</span>
                        <span>{contact.last_name}</span>
                      </div>
                      <div className="font-normal text-gray-500">
                        {contact.email_address}
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">{contact.phone_number}</td>
                  <td className="px-6 py-4">{contact.relation}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FontAwesomeIcon
                        className="h-2.5 w-2.5 me-2"
                        icon={faCircle}
                        beatFade={showBeatFade}
                        style={{ color: statusColor }}
                      />{" "}
                      {contact.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {contact.status === "pending" && (
                      <>
                        <span
                          className="text-blue-400 cursor-pointer"
                          onClick={() => handleEditClick(contact)}
                        >
                          Edit
                        </span>
                        <span className="mx-5 ">|</span>
                        <span
                          className="text-red-400 cursor-pointer"
                          onClick={() => handleDeleteClick(contact)}
                        >
                          Remove
                        </span>
                      </>
                    )}
                    {contact.status === "approved" && (
                      <>
                        <span
                          className="text-blue-400 cursor-pointer"
                          onClick={() => handleEditClick(contact)}
                        >
                          Edit
                        </span>
                        <span className="mx-5 ">|</span>
                        <span
                          className="text-red-400 cursor-pointer"
                          onClick={() => handleDeleteClick(contact)}
                        >
                          Remove
                        </span>
                      </>
                    )}
                    {contact.status === "rejected" && (
                      <>
                        <span
                          className="text-red-400 cursor-pointer"
                          onClick={() => handleDeleteClick(contact)}
                        >
                          Remove
                        </span>
                      </>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5" className="px-6 py-4 bg-gray-300 text-center">
                <FontAwesomeIcon
                  className="w-20 h-20 text-gray-500"
                  icon={faFile}
                />
                <p className="mt-4 text-lg font-semibold text-gray-600">
                  No emergency contact available
                </p>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isEditing && (
        <div className="modal-backdrop">
          <EditContact
            contact={currentContact}
            onSave={handleEditSubmit}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      )}
      {isDeleting && (
        <div className="modal-backdrop">
          <RemoveInfo
            contact={currentContact}
            onDelete={handleDeleteConfirm}
            onCancel={() => setIsDeleting(false)}
          />
        </div>
      )}
    </div>
  );
}
