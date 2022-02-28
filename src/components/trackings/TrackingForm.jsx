import { Loading } from "../ui/Loading";
import { startLoadingAction, finishLoadingAction } from "../../actions/ui";
import { apollo_client } from "../../config/apollo";
import moment from "moment";
//graphql
import {
  CREATE_TRACKING,
  DISCONNECT_FOREIGN_KEYS,
  UPDATE_TRACKING,
} from "../../graphql/mutation/TrackingsMutations";

import { TRACKING_BY_ID } from "../../graphql/queries/TrackingsQueries";

import React, { useState, useEffect } from "react";
import { useMutation, useLazyQuery, useQuery } from "@apollo/client";
import { Button, notification } from "antd";
import { DatePicker } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Redirect } from "react-router-dom";

import validator from "validator";

import { Input, InputNumber } from "antd";
import { GenericContactsSelect } from "../common/GenericContactsSelect";

const { TextArea } = Input;

export const TrackingForm = ({ history }) => {
  const { id } = useParams();

  const [createTracking] = useMutation(CREATE_TRACKING);
  const [disconnectForeignKeys] = useMutation(DISCONNECT_FOREIGN_KEYS);
  const [updateTracking] = useMutation(UPDATE_TRACKING);

  const [getTrackingById, { data: trackingById }] =
    useLazyQuery(TRACKING_BY_ID);

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.ui);

  //------------------------------ATRIBUTOS---------------------------------------------//
  const [action, setAction] = useState("");

  const [date, setDate] = useState("");
  const [tracking_type, setTrackingType] = useState("");
  const [observation, setObservation] = useState("");
  const [pending_task, setPendingTask] = useState("");
  const [ministerial_activity, setMinisterialActivity] = useState("");

  const [contactsList, setContactsList] = useState([]);
  const [contacts, setContacts] = useState([]);

  //IDS DE LAS LLAVES FORANEAS PARA A HORA DE ACTUALIZAR
  const [oldContacts, setOldContacts] = useState([]);

  //---------------------------------------HANDLE INPUT CHANGE -------------------------//
  const handleInputDateChange = (date, dateString) => {
    console.log(date, dateString);
    setDate(dateString);
  };

  const handleInputTrackingTypeChange = ({ target }) => {
    setTrackingType(target.value);
  };

  const handleInputObservationChange = ({ target }) => {
    setObservation(target.value);
  };

  const handleInputPendingTaskChange = ({ target }) => {
    setPendingTask(target.value);
  };

  const handleInputMinisterialActivityChange = ({ target }) => {
    setMinisterialActivity(target.value);
  };

  //-------------------------------------------FUNCIONES------------------------------//

  const controller = async () => {
    const isValid = validateForm();
    if (isValid) {
      dispatch(startLoadingAction());

      if (action === "save") {
        await saveTracking();
      } else {
        await refetch();
        await modifyTracking();
      }
    } else {
      // openNotification("warning", "Atencion", "Revise los campos!");
    }
  };

  const refetch = async () => {
    await apollo_client.clearStore({
      include: [TRACKING_BY_ID],
    });
  };

  const validateForm = () => {
    let isValid = true;

    if (validator.isEmpty(date)) {
      openNotification("warning", "Atencion", "Llene la fecha!");
      isValid = false;
    }

    if (contacts.length === 0 && contactsList.length === 0) {
      openNotification("warning", "Atencion", "Llene el contacto!");
      isValid = false;
    }

    return isValid;
  };

  // METODO QUE LANZA LAS NOTIFICACIONES
  const openNotification = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
    });
  };

  const goBack = () => {
    history.push("/dashboard/trackings");
  };

  const saveTracking = async () => {
    try {
      await createTracking({
        variables: {
          date: date,
          tracking_type: tracking_type,
          observation: observation,
          pending_task: pending_task,
          ministerial_activity: ministerial_activity,
          contact: contacts.length !== 0 ? contacts[0] : "",
        },
      }).then((data) => {
        openNotification(
          "success",
          "Seguimiento Guardado",
          `El seguimiento se guardo de forma satisfactoria!`
        );
        dispatch(finishLoadingAction());
        history.push("/dashboard/trackings");
      });
    } catch (error) {
      dispatch(finishLoadingAction());
      console.log(error.message);

      openNotification(
        "error",
        "Error",
        `Ocurrio algun error: ${error.message} !`
      );
    }
  };

  const modifyTracking = async () => {
    const idTracking = id;

    const contactToUpdate = contacts;

    console.log(contactToUpdate);

    if (idTracking !== undefined) {
      try {
        //si no se toca el contacto
        if (contactToUpdate.length === 0) {
          await updateTracking({
            variables: {
              id: idTracking,
              date: date,
              tracking_type: tracking_type,
              observation: observation,
              pending_task: pending_task,
              ministerial_activity: ministerial_activity,
            },
          }).then((data) => {
            setOldContacts([]);

            //console.table(data.data);
            openNotification(
              "success",
              "Seguimiento Modificado",
              "El seguimiento se ha modificado de forma satisfactoria!"
            );
            dispatch(finishLoadingAction());
            history.push("/dashboard/trackings");
          });
        } else {
          const realId = contactToUpdate[0];

          await updateTracking({
            variables: {
              id: idTracking,
              date: date,
              tracking_type: tracking_type,
              observation: observation,
              pending_task: pending_task,
              ministerial_activity: ministerial_activity,
              contact: realId,
            },
          }).then((data) => {
            setOldContacts([]);

            //console.table(data.data);
            openNotification(
              "success",
              "Seguimiento Modificado",
              "El seguimiento se ha modificado de forma satisfactoria!"
            );
            dispatch(finishLoadingAction());
            history.push("/dashboard/trackings");
          });
        }
      } catch (error) {
        console.table(error);
        dispatch(finishLoadingAction());
        openNotification(
          "error",
          "Error",
          `Ocurrio algun error: ${error.message} !`
        );
      }
    }
  };

  // -------------------------------EFFECTS----------------------------------------------//
  useEffect(() => {
    if (id !== undefined) {
      dispatch(startLoadingAction());
      setAction("update");
    } else {
      setAction("save");
    }
  }, []);

  useEffect(async () => {
    action === "update" && getTrackingById({ variables: { id: id } });
  }, [action]);

  // COJER EL SEFUIMIENTO PARA ACTUALIZARLO
  useEffect(() => {
    if (trackingById !== undefined) {
      console.log("trackingBy id");
      console.log(trackingById.tracking);

      try {
        const {
          date,
          tracking_type,
          observation,
          pending_task,
          ministerial_activity,
          contact,
        } = trackingById.tracking;

        setDate(date);
        setTrackingType(tracking_type);
        setObservation(observation);
        setPendingTask(pending_task);
        setMinisterialActivity(ministerial_activity);

        if (contact !== undefined && contact !== null) {
          setContactsList((contactsList) => [...contactsList, contact]);

          setOldContacts((oldContacts) => [...oldContacts, contact.id]);
        }

        dispatch(finishLoadingAction());
      } catch (error) {
        dispatch(finishLoadingAction());
        console.log(error.message);
      }
    }
  }, [trackingById]);

  return (
    <div className="border-2 border-gray-50 overflow-hidden animate__animated animate__fadeIn container px-8 py-4 mx-auto bg-white rounded-lg shadow-lg dark:bg-gray-800">
      {!loading ? (
        <div>
          <div className="text-center my-6 ">
            {action === "save" ? (
              <div className="content-center">
                <div className="inline-flex items-center">
                  <h1 className="text-2xl mx-3 ">Guardar Seguimiento </h1>
                </div>
              </div>
            ) : (
              <div className="content-center">
                <div className="inline-flex items-center">
                  <h1 className="text-2xl mx-3 ">Modificar Seguimiento</h1>
                </div>
              </div>
            )}
          </div>

          <hr />

          <div className="grid grid-flow-col grid-cols-3 gap-4 my-4 mx-4 ">
            {/* --------------------------------------------------------------------------- */}
            <div className="my-5">
              <div className="flex ">
                <label>
                  Fecha <span className="text-red-600 text-md mx-1">*</span>
                </label>
              </div>
              <DatePicker
                value={date !== "" && moment(date)}
                onChange={handleInputDateChange}
              />
            </div>

            <div className="my-5">
              <label>
                Contacto<span className="text-red-600 text-md mx-1">*</span>
              </label>
              <GenericContactsSelect
                selectedContacts={contactsList}
                setContacts={setContacts}
              />
            </div>

            <div className="my-5">
              <div className="flex ">
                <label>Tipo de Seguimiento</label>
              </div>

              <Input
                value={tracking_type}
                onChange={handleInputTrackingTypeChange}
                placeholder="Tipo de Seguimiento"
                style={{ width: "350px" }}
              />
            </div>
          </div>
          {/* ---------------------------------------------------------------------------- */}
          <div className="grid grid-flow-col grid-cols-3 gap-4 my-auto mx-4 ">
            <div className="my-2">
              <div className="flex s">
                <label>Observación</label>
              </div>

              <TextArea
                value={observation}
                onChange={handleInputObservationChange}
                placeholder="Observación"
                style={{ width: "350px" }}
                autoSize
              />
            </div>

            <div className="my-2">
              <div className="flex">
                <label>Tarea Pendiente</label>
              </div>
              <TextArea
                value={pending_task}
                onChange={handleInputPendingTaskChange}
                placeholder="Tarea Pendiente"
                style={{ width: "350px" }}
                autoSize
              />
              <div style={{ margin: "24px 0" }} />
            </div>

            <div className="my-2">
              <div className="flex">
                <label>Actividad Ministerial</label>
              </div>
              <TextArea
                value={ministerial_activity}
                onChange={handleInputMinisterialActivityChange}
                placeholder="Actividad Ministerial"
                style={{ width: "350px" }}
                autoSize
              />
              <div style={{ margin: "24px 0" }} />
            </div>

            {/* <div className="my-2">
              <label>
                Contacto<span className="text-red-600 text-md mx-1">*</span>
              </label>
              <GenericContactsSelect
                selectedContacts={contactsList}
                setContacts={setContacts}
              />
            </div> */}
          </div>
          {/* ---------------------------------------------------------------------------- */}
          <hr></hr>
          <div className="my-10 flex content-center w-full ">
            <div className="flex mx-auto">
              <button
                onClick={controller}
                className="flex w-48 mx-1 px-4 py-2  rounded-full border border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent hover:bg-green-400 bg-green-500 focus:outline-none text-white"
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
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
                <span className="mx-1">
                  {action === "save" ? `Guardar` : `Modificar`}
                </span>
              </button>
              <button
                onClick={goBack}
                className="flex  w-48 mx-1 px-4 py-2  rounded-full border border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent hover:bg-blue-400 bg-blue-500 text-white focus:outline-none"
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
        <div>
          <Loading />
        </div>
      )}
    </div>
  );
};
