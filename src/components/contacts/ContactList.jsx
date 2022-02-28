import { CONTACTS } from "../../graphql/queries/ContactsQueries";
import { DELETE_CONTACT } from "../../graphql/mutation/ContactsMutations";
import { DELETE_CONTACTS } from "../../graphql/mutation/ContactsMutations";
import { CATEGORIES } from "../../graphql/queries/CategoriesQueries";

import { ContactTable } from "./ContactTable";
import { apollo_client } from "../../config/apollo";

import { Loading } from "../ui/Loading";
import { startLoadingAction, finishLoadingAction } from "../../actions/ui";

import React, { useState, useEffect } from "react";
import { useMutation, useLazyQuery, useQuery } from "@apollo/client";
import { notification, Button } from "antd";

import { useDispatch, useSelector } from "react-redux";

export const ContactList = ({ history }) => {
  // ---------------------------DECLARACIONES------------------------------------------//

  const { data: contactsFromServer } = useQuery(CONTACTS);

  const [deleteContact] = useMutation(DELETE_CONTACT);
  const [deleteContacts] = useMutation(DELETE_CONTACTS);

  const [getCategories, { data: categoriesFromServer }] =
    useLazyQuery(CATEGORIES);

  const [contactList, setContactList] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  //FILTROS DE LA TABLA DE CONTACTOS
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [placeFilter, setPlaceFilter] = useState([]);

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.ui);

  // ----------------------------FUNCIONES----------------------------------//
  const fillContactsData = (contacts) => {
    setContactList([]);

    contacts.forEach((contact) => {
      const { categories } = contact;

      const record = {
        key: contact.id,
        name: contact.name,
        dni: contact.dni,
        phone: contact.phone,
        email: contact.email,
        place: contact.place,
        categories:
          categories.length !== 0
            ? categories.map((category) => {
                return category.name;
              })
            : "",
      };

      // console.log(record)

      setContactList((contactList) => [...contactList, record]);
    });

    //  console.log("Este es contact List")
    // console.log(contactList)
  };

  const deleteContactById = async () => {
    dispatch(startLoadingAction());

    notification.destroy();

    if (selectedIds.length === 1) {
      try {
        await deleteContact({
          variables: { id: selectedIds[0] },
        }).then((data) => {
          // console.log(data);
          openNotification(
            "success",
            "Informacion",
            "Contacto eliminado satisfactoriamente!"
          );
          clean();
          // dispatch(finishLoadingAction());
        });
      } catch (error) {
        console.log(error.name);
        openNotification("error", "Error!", `Ocurrio un error: ${error.name}`);
        // dispatch(finishLoadingAction());
      }
    } else if (selectedIds.length > 1) {
      try {
        await deleteContacts({
          variables: { ids: selectedIds },
        }).then((data) => {
          // console.log(data);
          openNotification(
            "success",
            "Informacion",
            "Contactos eliminados satisfactoriamente!"
          );
          clean();
          // dispatch(finishLoadingAction());
        });
      } catch (error) {
        console.log(error);
        // openNotification("error", "Error!", `Ocurrio un error: ${error.name}`);
        // dispatch(finishLoadingAction());
      }
    } else {
      openNotification(
        "warning",
        "Atencion!",
        "Debe seleccionar al menos un contacto!"
      );
    }
  };

  const clean = () => {
    setSelectedIds([]);
    setContactList([]);
    setContacts([]);
    refetchContacts();
  };

  const openNotificationDelete = () => {
    if (selectedIds.length !== 0) {
      const key = `open${Date.now()}`;

      const btn = (
        <Button
          type="danger"
          onClick={deleteContactById}
          style={{ borderRadius: "100px" }}
        >
          Confirmar
        </Button>
      );
      notification.open({
        message: "Atencion!",
        description: "Esta seguro que desea eliminar el contacto?",
        btn,
        key,
      });
    } else {
      openNotification(
        "warning",
        "Atencion!",
        "Debe seleccionar al menos un contacto!"
      );
    }
  };

  const goToCreateContact = () => {
    history.push("/dashboard/contacts/form");
  };

  const refetchContacts = async () => {
    await apollo_client.refetchQueries({
      include: [CONTACTS],
    });
    dispatch(finishLoadingAction());
  };

  const goToViewContact = () => {
    if (selectedIds.length !== 0) {
      const id = selectedIds[0];

      if (id !== undefined && id !== "") {
        history.replace(`/dashboard/contacts/view/${id}`);
      }
    } else {
      openNotification(
        "warning",
        "Atencion!",
        "Debe seleccionar al menos un contacto!"
      );
    }
  };

  const goToUpdateContact = () => {
    if (selectedIds.length !== 0) {
      const id = selectedIds[0];

      if (id !== undefined && id !== "") {
        history.replace(`/dashboard/contacts/form/${id}`);
      }
    } else {
      openNotification(
        "warning",
        "Atencion!",
        "Debe seleccionar al menos un contacto!"
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
    if (contactsFromServer !== undefined) {
      const { contacts } = contactsFromServer;

      if (contacts !== null && contacts !== undefined) {
        fillContactsData(contacts);

        //LLENAR EL FILTRO DE LUGARES
        const places = contacts.map((elem) => {
          return elem.place;
        });

        //ELIMINAR DUPLICADOS
        const placesFilterUnique = places.filter((item, index) => {
          return places.indexOf(item) === index;
        });

        let placeFilter = [];

        placesFilterUnique.forEach((element) => {
          const elem = {
            text: element,
            value: element,
          };

          if (elem.text !== "") {
            placeFilter.push(elem);
          }
        });

        setPlaceFilter(placeFilter);
      }
    }
  }, [contactsFromServer]);

  useEffect(() => {
    if (categoriesFromServer !== undefined) {
      const { categories } = categoriesFromServer;

      let categoryFilt = [];

      categories.forEach((cat) => {
        const elem = {
          text: cat.name,
          value: cat.name,
        };

        categoryFilt.push(elem);
      });

      setCategoryFilter(categoryFilt);
    }
  }, [categoriesFromServer]);

  useEffect(() => {
    if (contactList.length !== 0) {
      setContacts(contactList);
    }
  }, [contactList]);

  //RECARGAR LAS QUERIES
  useEffect(() => {
    dispatch(startLoadingAction());
    getCategories();
    refetchContacts();
  }, []);

  return (
    <div className="border-2 border-gray-50 overflow-hidden animate__animated animate__fadeIn container px-8 py-4 mx-auto bg-white rounded-lg shadow-lg dark:bg-gray-800">
      {loading === false ? (
        <div className="overflow-hidden ">
          <div>
            <h1 className="flex text-2xl my-1">
              <p className="mx-2 ">Lista de contactos</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 my-1"
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
            </h1>
            <hr className="w-1/4"></hr>
          </div>

          <div className="flex mx-auto my-8">
            <button
              onClick={goToCreateContact}
              className="flex mx-1 px-4 py-2 hover:bg-green-400 rounded-full border border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent bg-green-500 focus:outline-none text-white"
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
              onClick={goToUpdateContact}
              className="flex mx-1 px-4 py-2 hover:bg-blue-400 rounded-full border border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent bg-blue-500 focus:outline-none outline-none text-white"
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
              onClick={goToViewContact}
              className="flex mx-1 px-4 py-2 hover:bg-indigo-400 rounded-full border border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent bg-indigo-500 focus:outline-none text-white"
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
              className="flex mx-1 px-4 py-2 hover:bg-red-400 rounded-full border border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent bg-red-500 focus:outline-none text-white"
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
            {contacts.length !== 0 ? (
              <ContactTable
                contactList={contacts}
                setSelectedIds={setSelectedIds}
                categoryFilter={categoryFilter}
                placeFilter={placeFilter}
                className="my-6"
              />
            ) : (
              <div className="mx-auto my-6 content-center text-center animate__animated animate__fadeIn">
                <h1 className=" text-xl text-center my-4">
                  No hay contactos en la base de datos aun.
                </h1>
                <p
                  onClick={goToCreateContact}
                  className="animate-pulse font-semibold text-2xl cursor-pointer text-md text-blue-700 text-center content-center my-4  hover:underline"
                >
                  Agregar Contacto +
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Loading className="my-10" />
      )}

      {/* <footer>
                 <Footer/>
             </footer>  */}
    </div>
  );
};
