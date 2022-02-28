import { ORGANIZATIONS } from "../../graphql/queries/OrganizationsQueries";
import { DELETE_ORGANIZATION } from "../../graphql/mutation/OrganizationsMutations";
import { DELETE_ORGANIZATIONS } from "../../graphql/mutation/OrganizationsMutations";
import { CATEGORIES } from "../../graphql/queries/CategoriesQueries";
import { CONTACTS } from "../../graphql/queries/ContactsQueries";

import { OrganizationTable } from "./OrganizationTable";
import { apollo_client } from "../../config/apollo";

import { Loading } from "../ui/Loading";
import { startLoadingAction, finishLoadingAction } from "../../actions/ui";

import React, { useState, useEffect } from "react";
import { useMutation, useLazyQuery, useQuery } from "@apollo/client";
import { notification, Button } from "antd";

import { useDispatch, useSelector } from "react-redux";

export const OrganizationList = ({ history }) => {
  const { data: organizationsFromServer } = useQuery(ORGANIZATIONS);

  const [deleteOrganization] = useMutation(DELETE_ORGANIZATION);
  const [deleteOrganizations] = useMutation(DELETE_ORGANIZATIONS);

  const [getCategories, { data: categoriesFromServer }] =
    useLazyQuery(CATEGORIES);

  const [getContacts, { data: contactsFromServer }] = useLazyQuery(CONTACTS);

  const [organizationsList, setOrganizationsList] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  //FILTROS
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [contactFilter, setContactFilter] = useState([]);
  const [placeFilter, setPlaceFilter] = useState([]);

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.ui);

  // ----------------------------FUNCIONES----------------------------------//

  const getOnlyOneFilterElems = (elems) => {
    let result = [];

    const placesFilterUnique = elems.filter((item, index) => {
      return elems.indexOf(item) === index;
    });

    placesFilterUnique.forEach((element) => {
      const elem = {
        text: element,
        value: element,
      };

      if (elem.text !== "") result.push(elem);
    });

    return result;
  };

  const fillOrganizationsData = (organizations) => {
    setOrganizationsList([]);

    if (organizations !== undefined && organizations.length !== 0) {
      const places = organizations.map((elem) => {
        return elem.place;
      });

      const placesFilt = getOnlyOneFilterElems(places);

      setPlaceFilter(placesFilt);

      organizations.forEach((organization) => {
        const { categories } = organization;
        const { contacts } = organization;

        //ELIMINAR DUPLICADOS

        const record = {
          key: organization.id,
          name: organization.name,
          place: organization.place,

          contacts:
            contacts.length !== 0
              ? contacts.map((contact) => {
                  return contact.name;
                })
              : "",
          categories:
            categories.length !== 0
              ? categories.map((category) => {
                  return category.name;
                })
              : "",
        };

        setOrganizationsList((organizationsList) => [
          ...organizationsList,
          record,
        ]);
      });
    }
  };

  const deleteOrganizationById = async () => {
    dispatch(startLoadingAction());

    notification.destroy();

    if (selectedIds.length === 1) {
      try {
        await deleteOrganization({
          variables: { id: selectedIds[0] },
        }).then((data) => {
          // console.log(data);
          openNotification(
            "success",
            "Informacion",
            "Organización eliminada satisfactoriamente!"
          );
          clean();
          // dispatch(finishLoadingAction());
        });
      } catch (error) {
        console.log(error.name);
        openNotification("error", "Error!", `Ocurrio una error: ${error}`);
        dispatch(finishLoadingAction());
      }
    } else if (selectedIds.length > 1) {
      try {
        await deleteOrganizations({
          variables: { ids: selectedIds },
        }).then((data) => {
          // console.log(data);
          openNotification(
            "success",
            "Informacion",
            "Organizaciones eliminadas satisfactoriamente!"
          );
          clean();
          // dispatch(finishLoadingAction());
        });
      } catch (error) {
        console.log(error.name);
        openNotification("error", "Error!", `Ocurrio un error: ${error.name}`);
        // dispatch(finishLoadingAction());
      }
    } else {
      openNotification(
        "warning",
        "Atencion!",
        "Debe seleccionar al menos una organizacion!"
      );
    }
  };

  const clean = () => {
    setSelectedIds("");
    setOrganizationsList([]);
    setOrganizations([]);
    refetchOrganizations();
  };

  const openNotificationDelete = () => {
    if (selectedIds.length !== 0) {
      const key = `open${Date.now()}`;

      const btn = (
        <Button
          type="danger"
          onClick={deleteOrganizationById}
          style={{ borderRadius: "100px" }}
        >
          Confirmar
        </Button>
      );
      notification.open({
        message: "Atencion!",
        description: "Esta seguro que desea eliminar la organizacion ?",
        btn,
        key,
      });
    } else {
      openNotification(
        "warning",
        "Atencion!",
        "Debe seleccionar al menos una organizacion!"
      );
    }
  };

  const goToCreateOrganization = () => {
    history.push("/dashboard/organizations/form");
  };

  const refetchOrganizations = async () => {
    await apollo_client.refetchQueries({
      include: [ORGANIZATIONS],
    });
    dispatch(finishLoadingAction());
  };

  const goToViewOrganization = () => {
    if (selectedIds.length !== 0) {
      const id = selectedIds[0];

      if (id !== undefined && id !== "") {
        history.replace(`/dashboard/organizations/view/${id}`);
      }
    } else {
      openNotification(
        "warning",
        "Atencion!",
        "Debe seleccionar al menos una organizacion!"
      );
    }
  };

  const goToUpdateOrganization = () => {
    if (selectedIds.length !== 0) {
      const id = selectedIds[0];

      if (id !== undefined && id !== "") {
        history.replace(`/dashboard/organizations/form/${id}`);
      }
    } else {
      openNotification(
        "warning",
        "Atencion!",
        "Debe seleccionar al menos una organizacion!"
      );
    }
  };

  // METODO QUE LANZA LAS NOTIFICACIONES
  const openNotification = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
    });
  };

  // -----------------------------EFFECTS------------------------------------//
  useEffect(() => {
    if (organizationsFromServer !== undefined) {
      const { organizations } = organizationsFromServer;

      // console.table(organizations);

      fillOrganizationsData(organizations);
    }
  }, [organizationsFromServer]);

  useEffect(() => {
    if (categoriesFromServer !== undefined) {
      const { categories } = categoriesFromServer;

      let categoryFilt = [];

      if (categories !== undefined && categories.length !== 0) {
        categories.forEach((cat) => {
          const elem = {
            text: cat.name,
            value: cat.name,
          };

          categoryFilt.push(elem);
        });

        setCategoryFilter(categoryFilt);
      }
    }
  }, [categoriesFromServer]);

  useEffect(() => {
    if (contactsFromServer !== undefined) {
      const { contacts } = contactsFromServer;

      if (contacts !== undefined && contacts.length !== 0) {
        const contactNames = contacts.map((contact) => {
          return contact.name;
        });

        const contactFilt = getOnlyOneFilterElems(contactNames);
        setContactFilter(contactFilt);
      }
    }
  }, [contactsFromServer]);

  useEffect(() => {
    if (organizationsList.length !== 0) {
      setOrganizations(organizationsList);
    }
  }, [organizationsList]);

  //RECARGAR LAS QUERIES
  useEffect(() => {
    dispatch(startLoadingAction());
    getCategories();
    getContacts();
    refetchOrganizations();
  }, []);

  return (
    <div className="border-2 border-gray-50 container px-8 py-4 mx-auto bg-white rounded-lg shadow-lg dark:bg-gray-800">
      {loading === false ? (
        <div>
          <h1 className="flex text-2xl my-1">
            <p className="mx-2 ">Lista de Organizaciones</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="my-1 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </h1>
          <hr className="w-1/3"></hr>

          <div className="flex mx-auto my-8">
            <button
              onClick={goToCreateOrganization}
              className="flex mx-1 px-4 py-2  rounded-full border border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent bg-green-500 hover:bg-green-400 focus:outline-none text-white"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-2 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="mx-1">Añadir</span>
            </button>
            <button
              onClick={goToUpdateOrganization}
              className="flex mx-1 px-4 py-2  rounded-full border border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent hover:bg-blue-400 bg-blue-500 focus:outline-none outline-none text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-2 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <span className="mx-1">Modificar</span>
            </button>
            <button
              onClick={goToViewOrganization}
              className="flex mx-1 px-4 py-2  rounded-full border border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent hover:bg-indigo-400 bg-indigo-500 focus:outline-none text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-2 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span className="mx-1">Visualizar</span>
            </button>
            <button
              onClick={openNotificationDelete}
              className="flex mx-1 px-4 py-2  rounded-full border border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent hover:bg-red-400 bg-red-500 focus:outline-none text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-2 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span className="mx-1">Eliminar</span>
            </button>
          </div>
          <hr className="my-8"></hr>
          <div>
            {organizations.length !== 0 ? (
              <OrganizationTable
                organizationList={organizations}
                setSelectedIds={setSelectedIds}
                categoryFilter={categoryFilter}
                contactFilter={contactFilter}
                placeFilter={placeFilter}
                className="my-6"
              />
            ) : (
              <div className="mx-auto my-6 content-center text-center animate__animated animate__fadeIn">
                <h1 className=" text-xl text-center my-4">
                  No hay organizacions en la base de datos aun.
                </h1>
                <p
                  onClick={goToCreateOrganization}
                  className="animate-pulse font-semibold text-2xl cursor-pointer text-md text-blue-700 text-center content-center my-4  hover:underline"
                >
                  Agregar Organización +
                </p>
              </div>

              // <Loading className="my-10" />
            )}
          </div>
        </div>
      ) : (
        <Loading className="my-10" />
      )}
    </div>
  );
};
