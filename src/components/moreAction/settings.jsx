import React from "react";
import Image from "next/image";
import police from "../../../public/emerg/police.png";
import fire from "../../../public/emerg/GNFS.jpg";
import nadmo from "../../../public/emerg/nadmo.jpg";
import amb from "../../../public/emerg/ambulance.jpg";
import elec from "../../../public/emerg/ecg.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { faPhone, faPhoneFlip } from "@fortawesome/free-solid-svg-icons";
export default function MoreAction() {
  const emergencyServices = [
    {
      id: 1,
      name: "Ghana Police Service",
      image: police,
      contacts: ["191", "18555", "+233302773906"],
    },
    {
      id: 2,
      name: "Ghana Fire Service",
      image: fire,
      contacts: ["192", "+233302772446 ", "+233299340383"],
    },
    {
      id: 3,
      name: "National Ambulance Service",
      image: amb,
      contacts: ["+2330501614877", "+2330505982870", ""],
    },
    {
      id: 4,
      name: "NADMO",
      image: nadmo,
      contacts: ["112", "+233299350030", "+233302964884"],
    },
    {
      id: 5,
      name: "Electricity Company of Ghana",
      image: elec,
      contacts: ["+233302676727", "+233302611611", "+233302676728"],
    },
  ];
  const contactUs = [
    {
      id: 1,
      name: "WhatsApp",
      iconName: faWhatsapp,
      actions: ["+233506053020"],
      link: "https://wa.me/233506053020",
    },
    {
      id: 2,
      name: "Facebook",
      iconName: faFacebookF,
      actions: "Visit Facebook",
      link: "https://facebook.com/home",
    },
    {
      id: 3,
      name: "Twitter",
      iconName: faTwitter,
      actions: "Visit Twitter",
      link: "https://twitter.com/home",
    },
    {
      id: 4,
      name: "Call",
      iconName: faPhone,
      actions: ["+233546045726"], // Will generate `tel:` links
    },
  ];

  return (
    <>
      <div className="relative top-20 m-3 px-1">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <div className="bg-gray-500">
            <h2 className="text-xl p-4 font-semibold leading-7 text-white">
              Call Emergency Service
            </h2>
            <p className="text-lg p-2  leading-6 text-gray-400">
              Call any of the emergency helplines. Tap on the desired service
              number to place a direct call to them.
            </p>
          </div>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-md text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Service
                </th>
                <th scope="col" className="px-6 py-3">
                  Contact 1
                </th>
                <th scope="col" className="px-6 py-3">
                  Contact 2
                </th>
                <th scope="col" className="px-6 py-3">
                  Contact 3
                </th>
              </tr>
            </thead>
            <tbody>
              {emergencyServices.map((service) => (
                <tr
                  key={service.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <th
                    scope="row"
                    className="px-6 flex items-center space-x-3 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <span>
                      <Image
                        src={service.image}
                        alt={service.name}
                        width={40}
                        height={40}
                      />
                    </span>
                    <span className="text-lg">{service.name}</span>
                  </th>
                  {service.contacts.map((contact, index) => (
                    <td key={index} className="px-6 text-lg py-4">
                      <a
                        href={`tel:${contact}`}
                        className="text-blue-500 hover:underline"
                      >
                        {contact}
                      </a>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Contact us */}
        <div className="relative mt-5 overflow-x-auto shadow-md sm:rounded-lg">
          <div className="bg-gray-500">
            <h2 className="text-xl p-4 font-semibold leading-7 text-white">
              Contact TeenByte Tech Lab
            </h2>
            <p className="text-lg p-2  leading-6 text-gray-400">
              Get in touch through all the available mediums.
            </p>
          </div>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-md text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Service
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {contactUs.map((contact) => (
                <tr
                  key={contact.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <th
                    scope="row"
                    className="px-6 flex items-center space-x-3 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <span>
                      <FontAwesomeIcon icon={contact.iconName} size="lg" />
                    </span>
                    <span className="text-lg">{contact.name}</span>
                  </th>
                  <td className="px-6 text-lg py-4">
                    {Array.isArray(contact.actions) ? (
                      contact.actions.map((action, index) => (
                        <a
                          key={index}
                          href={`tel:${action}`}
                          className="text-blue-500 hover:underline block"
                        >
                          {action}
                        </a>
                      ))
                    ) : (
                      <a
                        href={contact.link || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {contact.actions}
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
