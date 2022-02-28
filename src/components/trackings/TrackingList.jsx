import { TRACKINGS } from "../../graphql/queries/TrackingsQueries";
import { DELETE_TRACKING } from "../../graphql/mutation/TrackingsMutations";
import { DELETE_TRACKINGS } from "../../graphql/mutation/TrackingsMutations";
import { CONTACTS } from "../../graphql/queries/ContactsQueries";

import { TrackingTable } from "./TrackingTable";
import { apollo_client } from "../../config/apollo";

import { Loading } from "../ui/Loading";
import { startLoadingAction, finishLoadingAction } from "../../actions/ui";

import React, { useState, useEffect } from "react";
import { useMutation, useLazyQuery, useQuery } from "@apollo/client";
import { notification, Button } from "antd";

import { useDispatch, useSelector } from "react-redux";

export const TrackingList = ({ history }) => {
  const { data: trackingsFromServer } = useQuery(TRACKINGS);

  const [deleteTracking] = useMutation(DELETE_TRACKING);
  const [deleteTrackings] = useMutation(DELETE_TRACKINGS);

  const [getContacts, { data: contactsFromServer }] = useLazyQuery(CONTACTS);

  const [trackingsList, setTrackingsList] = useState([]);
  const [trackings, setTrackings] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  //FILTROS DE LA TABLA DE CONTACTOS
  const [contactFilter, setContactFilter] = useState([]);
  const [typeFilter, setTypeFilter] = useState([]);

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.ui);

  // ----------------------------FUNCIONES----------------------------------//
  const fillTrackingsData = (trackings) => {
    // console.table(trackings);
    setTrackingsList([]);

    if (trackings !== undefined && trackings.length !== 0) {
      trackings.forEach((tracking) => {
        const { contact } = tracking;

        const record = {
          key: tracking.id,
          date: tracking.date,
          tracking_type: tracking.tracking_type,
          contact: contact !== null ? contact.name : "",
        };

        setTrackingsList((trackingsList) => [...trackingsList, record]);
      });
    }
  };

  const deleteTrackingById = async () => {
    dispatch(startLoadingAction());

    notification.destroy();

    if (selectedIds.length === 1) {
      try {
        await deleteTracking({
          variables: { id: selectedIds[0] },
        }).then((data) => {
          // console.log(data);
          openNotification(
            "success",
            "Informacion",
            "Seguimiento eliminado satisfactoriamente!"
          );
          clean();
          // dispatch(finishLoadingAction());
        });
      } catch (error) {
        console.log(error.name);
        openNotification("error", "Error!", `Ocurrio un error: ${error}`);
        dispatch(finishLoadingAction());
      }
    } else if (selectedIds.length > 1) {
      try {
        await deleteTrackings({
          variables: { ids: selectedIds },
        }).then((data) => {
          // console.log(data);
          openNotification(
            "success",
            "Informacion",
            "Seguimientos eliminados satisfactoriamente!"
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
        "Debe seleccionar al menos un seguimiento!"
      );
    }
  };

  const clean = () => {
    setSelectedIds([]);
    setTrackingsList([]);
    setTrackings([]);
    refetchTrackings();
  };

  const openNotificationDelete = () => {
    if (selectedIds.length !== 0) {
      const key = `open${Date.now()}`;

      const btn = (
        <Button
          type="danger"
          onClick={deleteTrackingById}
          style={{ borderRadius: "100px" }}
        >
          Confirmar
        </Button>
      );
      notification.open({
        message: "Atencion!",
        description: "Esta seguro que desea eliminar la seguimiento ?",
        btn,
        key,
      });
    } else {
      openNotification(
        "warning",
        "Atencion!",
        "Debe seleccionar al menos un seguimiento!"
      );
    }
  };

  const goToCreateTracking = () => {
    history.push("/dashboard/trackings/form");
  };

  const refetchTrackings = async () => {
    await apollo_client.refetchQueries({
      include: [TRACKINGS],
    });
    dispatch(finishLoadingAction());
  };

  const goToViewTracking = () => {
    if (selectedIds.length !== 0) {
      const id = selectedIds[0];

      if (id !== undefined && id !== "") {
        history.replace(`/dashboard/trackings/view/${id}`);
      }
    } else {
      openNotification(
        "warning",
        "Atencion!",
        "Debe seleccionar al menos un seguimiento!"
      );
    }
  };

  const goToUpdateTracking = () => {
    if (selectedIds.length !== 0) {
      const id = selectedIds[0];

      if (id !== undefined && id !== "") {
        history.replace(`/dashboard/trackings/form/${id}`);
      }
    } else {
      openNotification(
        "warning",
        "Atencion!",
        "Debe seleccionar al menos un seguimiento!"
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
    if (trackingsFromServer !== undefined) {
      const { trackings } = trackingsFromServer;

      // console.table(trackings);

      fillTrackingsData(trackings);
    }
  }, [trackingsFromServer]);

  useEffect(() => {
    //llenar el filtro de los contactos
    //de la tabla
    if (contactsFromServer !== undefined) {
      const { contacts } = contactsFromServer;

      if (contacts !== undefined && contacts.length !== 0) {
        let contactFilt = [];

        contacts.forEach((contact) => {
          const elem = {
            text: contact.name,
            value: contact.name,
          };

          contactFilt.push(elem);
        });

        setContactFilter(contactFilt);
      }
    }
  }, [contactsFromServer]);

  useEffect(() => {
    if (trackingsList.length !== 0) {
      setTrackings(trackingsList);

      //LLENAR EL FILTRO DE LUGARES
      const types = trackingsList.map((elem) => {
        return elem.tracking_type;
      });

      //ELIMINAR DUPLICADOS
      const typesFilterUnique = types.filter((item, index) => {
        return types.indexOf(item) === index;
      });

      let typesFilter = [];

      typesFilterUnique.forEach((element) => {
        const elem = {
          text: element,
          value: element,
        };

        if (elem.text !== "") typesFilter.push(elem);
      });

      setTypeFilter(typesFilter);
    }
  }, [trackingsList]);

  //RECARGAR LAS QUERIES
  useEffect(() => {
    dispatch(startLoadingAction());
    getContacts();
    refetchTrackings();
  }, []);

  return (
    <div className="border-2 border-gray-50 container px-8 py-4 mx-auto bg-white rounded-lg shadow-lg dark:bg-gray-800">
      {loading === false ? (
        <div>
          <h1 className="flex text-2xl my-1 mt-5">
            <p className="mx-2 ">Lista de Seguimientos a los Contactos</p>
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </h1>
          <hr className="w-1/3"></hr>

          <div className="flex mx-auto my-8">
            <button
              onClick={goToCreateTracking}
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
              onClick={goToUpdateTracking}
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
              onClick={goToViewTracking}
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
            {trackings.length !== 0 ? (
              <TrackingTable
                trackingList={trackings}
                setSelectedIds={setSelectedIds}
                contactFilter={contactFilter}
                typeFilter={typeFilter}
                className="my-6"
              />
            ) : (
              <div className="mx-auto my-6 content-center text-center animate__animated animate__fadeIn">
                <h1 className=" text-xl text-center my-4">
                  No hay seguimientos en la base de datos aun.
                </h1>
                <p
                  onClick={goToCreateTracking}
                  className="animate-pulse font-semibold text-2xl cursor-pointer text-md text-blue-700 text-center content-center my-4  hover:underline"
                >
                  Agregar Seguimiento +
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
