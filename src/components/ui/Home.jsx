import { Slider } from "./Slider";
import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { CONTACTS } from "../../graphql/queries/ContactsQueries";
import { ORGANIZATIONS } from "../../graphql/queries/OrganizationsQueries";
import { FOREIGN_MISSIONS } from "../../graphql/queries/ForeignMissionsQueries";

import { apollo_client } from "../../config/apollo";

export const Home = ({ history }) => {
  const [contacts, setContacts] = useState("0");
  const [organizations, setOrganizations] = useState("0");
  const [foreignMissions, setTrackings] = useState("0");

  const { data: contactsFromServer } = useQuery(CONTACTS);
  const { data: organizationsFromServer } = useQuery(ORGANIZATIONS);
  const { data: foreignMissionsFromServer } = useQuery(FOREIGN_MISSIONS);

  const refetch = async () => {
    await apollo_client.refetchQueries({
      include: [CONTACTS, ORGANIZATIONS, FOREIGN_MISSIONS],
    });
  };

  useEffect(() => {
    if (contactsFromServer !== undefined && contactsFromServer !== null) {
      const { contacts } = contactsFromServer;
      if (contacts !== null && contacts !== undefined)
        setContacts(contacts.length);
    }

    if (
      organizationsFromServer !== undefined &&
      organizationsFromServer !== null
    ) {
      const { organizations } = organizationsFromServer;
      if (organizations !== null && organizations.length !== 0)
        setOrganizations(organizations.length);
    }

    if (
      foreignMissionsFromServer !== undefined &&
      foreignMissionsFromServer !== null
    ) {
      const { foreignMissions } = foreignMissionsFromServer;
      if (foreignMissions !== null && foreignMissions !== undefined)
        setTrackings(foreignMissions.length);
    }
  }, [contactsFromServer, organizationsFromServer, foreignMissionsFromServer]);

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div>
      <div className="mt-0">
        {/* <div className="flex flex-col mt-0"> */}
        {/* <div className="my-1 align-middle inline-block min-w-full shadow overflow-hidden rounded-lg sm:rounded-lg "> */}
        {/* <Slider /> */}
        {/* </div> */}
        {/* </div> */}

        <div className="flex flex-wrap -mx-6 ">
          <div className="w-full px-6 sm:w-1/2 xl:w-1/3">
            <div
              className="border-2 cursor-pointer border-gray-50 flex items-center px-5 py-6 shadow-lg rounded-lg bg-white"
              onClick={() => {
                history.push(`/dashboard/contacts`);
              }}
            >
              <div
                className="p-3 rounded-full bg-blue-700 bg-opacity-75"
                onClick={() => {
                  history.push(`/dashboard/contacts`);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>

              <div className="mx-5">
                <h4 className="text-2xl font-semibold ">{contacts}</h4>
                <p
                  className="font-semibold cursor-pointer hover:text-blue-700"
                  onClick={() => {
                    history.push(`/dashboard/contacts`);
                  }}
                >
                  Contactos
                </p>
              </div>
            </div>
          </div>

          <div className="w-full mt-6 px-6 sm:w-1/2 xl:w-1/3 xl:mt-0">
            <div
              className="border-2 cursor-pointer border-gray-50 flex items-center px-5 py-6 shadow-lg rounded-lg bg-white"
              onClick={() => {
                history.push(`/dashboard/organizations`);
              }}
            >
              <div
                className="p-3 rounded-full bg-green-700 bg-opacity-75"
                onClick={() => {
                  history.push(`/dashboard/organizations`);
                }}
              >
                <svg
                  className="h-8 w-8 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 23 23"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>

              <div className="mx-5">
                <h4 className="text-2xl font-semibold ">{organizations}</h4>
                <p
                  className="font-semibold cursor-pointer hover:text-blue-700"
                  onClick={() => {
                    history.push(`/dashboard/organizations`);
                  }}
                >
                  Organizaciones{" "}
                </p>
              </div>
            </div>
          </div>

          <div className="w-full mt-6 px-6 sm:w-1/2 xl:w-1/3 xl:mt-0 ">
            <div
              className="border-2 cursor-pointer border-gray-50 flex items-center px-5 py-6 shadow-lg rounded-lg bg-white"
              onClick={() => {
                history.push(`/dashboard/missions`);
              }}
            >
              <div
                className="p-3 rounded-full bg-indigo-700 bg-opacity-75 "
                onClick={() => {
                  history.push(`/dashboard/missions`);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <div className="mx-5 ">
                <h4 className="text-2xl font-semibold ">{foreignMissions}</h4>
                <p
                  className="font-semibold cursor-pointer hover:text-blue-700"
                  onClick={() => {
                    history.push(`/dashboard/missions`);
                  }}
                >
                  Misiones Transculturales{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
        <br />
        {/* <div>
          <h1 className="text-center text-3xl my-10">
            Aun en desarrollo
            <p className="text-blue-600 animate-pulse text-6xl font-semibold">
              {text}
            </p>
          </h1>
        </div> */}
        <br />
      </div>
    </div>
  );
};
