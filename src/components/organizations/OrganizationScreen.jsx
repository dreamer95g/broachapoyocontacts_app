import { ORGANIZATION_BY_ID } from "../../graphql/queries/OrganizationsQueries";
import { url_base } from "../../config/app";

import React, { useMemo, useEffect, useState } from "react";
import { useParams, Redirect } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { notification } from "antd";
import { startLoadingAction, finishLoadingAction } from "../../actions/ui";
import { Loading } from "../ui/Loading";
import { useDispatch, useSelector } from "react-redux";

export const OrganizationScreen = ({ history }) => {
  const { id } = useParams();

  const [getOrganizationById, { data: organizationFromServer }] =
    useLazyQuery(ORGANIZATION_BY_ID);

  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [additional_note, setAdditionalNote] = useState("");
  const [resources, setResources] = useState("");
  const [relationship, setRelationship] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [place, setPlace] = useState("");

  const [categories, setCategories] = useState([]);
  const [contacts, setContacts] = useState([]);

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.ui);

  useEffect(() => {
    getOrganizationById({
      variables: {
        id: id,
      },
    });

    dispatch(startLoadingAction());
  }, []);

  useEffect(() => {
    if (!organizationFromServer) {
      return <Redirect to="/dashboard/organizations" />;
    }

    const recipe = organizationFromServer.organization;
    // console.log("contacts from server");
    // console.log(organizationFromServer.organization);

    if (recipe !== null) {
      // console.table(recipe);

      const {
        name,
        purpose,
        additional_note,
        phone,
        email,
        place,
        relationship,
        resources,
        categories,
        contacts,
      } = recipe;

      setName(name);
      setPurpose(purpose);
      setAdditionalNote(additional_note);
      setRelationship(relationship);
      setResources(resources);
      setPhone(phone);
      setPlace(place);
      setEmail(email);

      const catgrs =
        categories.length !== 0
          ? categories.map((category) => {
              return category.name;
            })
          : [];

      setCategories(catgrs);

      const conts =
        contacts.length !== 0
          ? contacts.map((cont) => {
              return cont.name;
            })
          : [];

      setContacts(conts);

      dispatch(finishLoadingAction());
    }
  }, [organizationFromServer]);

  const goBack = () => {
    history.push("/dashboard/organizations");
  };

  // METODO QUE LANZA LAS NOTIFICACIONES
  const openNotification = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
    });
  };

  return (
    <div>
      <div className="border-2 border-gray-50 container px-8 py-4 mx-auto bg-white rounded-xl shadow-lg dark:bg-gray-800">
        {!loading ? (
          <div className="animate__animated animate__fadeIn">
            <div className="content-center text-center my-6 ">
              <div className="inline-flex items-center ">
                <h1 className="text-2xl mx-3 ">Organización</h1>
                <h1 className="  text-2xl font-semibold text-blue-700 mx-1 ">{`${name}`}</h1>
              </div>
            </div>
            <hr></hr>

            <div className="grid grid-flow-col grid-cols-3 gap-4 my-4 mx-4">
              <div className="">
                <blockquote className="my-3 mx-5 px-5 py-5 ">
                  <div className="content-center ">
                    <h1 className="mx-auto text-xl text-center">Nombre</h1>
                    <p className="text-lg font-semibold text-blue-700 text-center">
                      {name}
                    </p>
                  </div>
                </blockquote>
              </div>
              <div className="">
                <blockquote className="my-3 mx-5 px-5 py-5">
                  <div className="content-center ">
                    <h1 className="text-xl text-center">Representantes</h1>
                    <div className="text-md font-semibold text-center">
                      {contacts.map((contact, i) => {
                        return (
                          <p
                            key={i}
                            className="text-blue-700 inline-block mx-2"
                          >{`${contact}`}</p>
                        );
                      })}
                    </div>
                  </div>
                </blockquote>
              </div>

              <div className="">
                <blockquote className="my-3 mx-5 px-5 py-5">
                  <div className="content-center  ">
                    <h1 className="text-xl text-center">Nota Adicional</h1>
                    <p className="text-md text-center font-semibold ">
                      {additional_note}
                    </p>
                  </div>
                </blockquote>
              </div>
            </div>
            <hr></hr>
            <div className="grid grid-flow-col grid-cols-3 gap-4 my-auto mx-4">
              <div className="">
                <blockquote className="my-3 mx-5 px-5 py-5">
                  <div className="content-center  ">
                    <h1 className="text-xl text-center">Propósito</h1>
                    <p className="text-md text-center font-semibold ">
                      {purpose}
                    </p>
                  </div>
                </blockquote>
              </div>

              <div className="">
                <blockquote className="my-3 mx-5 px-5 py-5 ">
                  <div className="content-center ">
                    <h1 className="mx-auto text-xl text-center">Teléfono</h1>
                    <p className="text-md font-semibold text-blue-700  text-center">
                      {phone}
                    </p>
                  </div>
                </blockquote>
              </div>

              <div className="">
                <blockquote className="my-3 mx-5 px-5 py-5 ">
                  <div className="content-center ">
                    <h1 className="mx-auto text-xl text-center">Correo</h1>
                    <p className="text-md font-semibold text-blue-700 text-center">
                      {email}
                    </p>
                  </div>
                </blockquote>
              </div>
            </div>

            {/* ----------------------------------------------------------------- */}
            <hr />
            <div className="grid grid-flow-col grid-cols-3 gap-4 my-4 mx-4">
              <div className="">
                <blockquote className="my-3 mx-5 px-5 py-5 ">
                  <div className="content-center ">
                    <h1 className="mx-auto text-xl text-center">Lugar</h1>
                    <p className="text-md font-semibold text-center">{place}</p>
                  </div>
                </blockquote>
              </div>

              <div className="">
                <blockquote className="my-3 mx-5 px-5 py-5 ">
                  <div className="content-center ">
                    <h1 className="mx-auto text-xl text-center">Recursos</h1>
                    <p className="text-md font-semibold text-center">
                      {resources}
                    </p>
                  </div>
                </blockquote>
              </div>

              <div className="">
                <blockquote className="my-3 mx-5 px-5 py-5 ">
                  <div className="content-center ">
                    <h1 className="mx-auto text-xl text-center">
                      Relación con Apoyo
                    </h1>
                    <p className="text-md font-semibold text-center">
                      {relationship}
                    </p>
                  </div>
                </blockquote>
              </div>
            </div>
            <hr></hr>
            <div className="grid grid-flow-col grid-cols-3 gap-4 my-4 mx-4">
              <div className="">
                <blockquote className="my-3 mx-5 px-5 py-5">
                  <div className="content-center  ">
                    <h1 className="text-xl text-center">Categorías </h1>
                    <div className="text-md font-semibold text-center">
                      {categories.map((category, i) => {
                        return (
                          <p
                            key={i}
                            className="text-blue-700 inline-block mx-2"
                          >{`#${category}`}</p>
                        );
                      })}
                    </div>
                  </div>
                </blockquote>
              </div>
            </div>

            <hr />
            <div className="my-10 flex content-center w-full ">
              <div className="flex mx-auto ">
                {/* <button
                  onClick={() => {
                    openNotification(
                      "success",
                      "Atencion",
                      "Esta funcionalidad esta aun en desarrollo!"
                    );
                  }}
                  className=" flex w-48 h-11 mx-1 px-4 py-2 rounded-full border border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent hover:bg-green-400 bg-green-500 focus:outline-none text-white"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mx-4 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  <p className="mx-1">Exportar</p>
                </button> */}
                <button
                  onClick={goBack}
                  className="flex w-48 h-11 mx-1 px-4 py-2 rounded-full border border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent hover:bg-blue-400 bg-blue-500 text-white focus:outline-none "
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mx-4 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
                    />
                  </svg>
                  <span className="mx-1">Regresar</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex content-center">
            <Loading className="my-8" />
          </div>
        )}
      </div>
    </div>
  );
};
