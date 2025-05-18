"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createContact, GetContact } from "@/redux/userSlice";
import toast from "react-hot-toast";

export default function AddContacts() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email_address: "",
    phone_number: "",
    relation: "",
  });
  const dispatch = useDispatch();

  const formChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateContact = async (event) => {
    event.preventDefault();

    try {
      const result = await dispatch(createContact(formData));
      if (result.meta.requestStatus === "fulfilled") {
        setFormData({
          first_name: "",
          last_name: "",
          email_address: "",
          phone_number: "",
          relation: "",
        });
      }
      toast.success(result.payload.message || "Contact created successfully.", {
        duration: 5000,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again.",
        { duration: 5000 }
      );
    }
  };

  return (
    <form
      onSubmit={handleCreateContact}
      className="bg-gray-800 dark:text-white relative overflow-x-auto shadow-md rounded-lg"
    >
      <div className="m-10 space-y-12 ">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-xl font-semibold leading-7 text-white">
            Add a relation
          </h2>
          <p className="mt-1 text-lg leading-6 text-gray-400">
            Provide the details of a relative that should be contacted in cases
            of emergency. You can add a maximum of 10 people.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="first-name"
                className="block text-lg font-medium leading-6 text-white"
              >
                First name
              </label>
              <div className="mt-2">
                <input
                  id="first-name"
                  name="first_name"
                  placeholder="John"
                  type="text"
                  value={formData.first_name}
                  onChange={formChange}
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="last-name"
                className="block text-lg font-medium leading-6 text-white"
              >
                Last name
              </label>
              <div className="mt-2">
                <input
                  id="last-name"
                  name="last_name"
                  type="text"
                  placeholder="Musah"
                  value={formData.last_name}
                  onChange={formChange}
                  autoComplete="family-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="email"
                className="block text-lg font-medium leading-6 text-white"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email_address"
                  type="email"
                  placeholder="johnmusah@example.com"
                  value={formData.email_address}
                  onChange={formChange}
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
                  required
                />
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="phonenumber"
                className="block text-lg font-medium leading-6 text-white"
              >
                Phone Number
              </label>
              <div className="mt-2">
                <input
                  id="phonenumber"
                  name="phone_number"
                  type="tel"
                  placeholder="+233241123456"
                  value={formData.phone_number}
                  onChange={formChange}
                  autoComplete="phone_number"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
                  required
                />
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="text"
                className="block text-lg font-medium leading-6 text-white"
              >
                Relationship {"(Who are you to them?)"}
              </label>
              <div className="mt-2">
                <input
                  id="relation"
                  name="relation"
                  type="text"
                  placeholder="Father"
                  value={formData.relation}
                  onChange={formChange}
                  autoComplete="relation"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="m-7 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-lg font-semibold leading-6 text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </form>
  );
}
