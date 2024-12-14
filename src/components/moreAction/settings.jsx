import React from "react";
import Image from "next/image";
import police from "../../../public/emerg/police.png";
import fire from "../../../public/emerg/GNFS.jpg";
import nadmo from "../../../public/emerg/nadmo.jpg";
import amb from "../../../public/emerg/ambulance.jpg";
import elec from "../../../public/emerg/ecg.jpg";
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
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                    <span>{service.name}</span>
                  </th>
                  {service.contacts.map((contact, index) => (
                    <td key={index} className="px-6 py-4">
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
      </div>
    </>
  );
}
