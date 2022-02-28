import { TRACKING_BY_ID } from "../../graphql/queries/TrackingsQueries";
import { url_base } from "../../config/app";

import React, { useMemo, useEffect, useState } from "react";
import { useParams, Redirect } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { notification } from "antd";
import { startLoadingAction, finishLoadingAction } from "../../actions/ui";
import { Loading } from "../ui/Loading";
import { useDispatch, useSelector } from "react-redux";

export const TrackingScreen = ({ history }) => {
  const { id } = useParams();

  const [getTrackingById, { data: trackingFromServer }] =
    useLazyQuery(TRACKING_BY_ID);

  const [date, setDate] = useState("");
  const [tracking_type, setTrackingType] = useState("");
  const [observation, setObservation] = useState("");
  const [pending_task, setPendingTask] = useState("");
  const [ministerial_activity, setMinisterialActivity] = useState("");
  const [contact, setContact] = useState([]);

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.ui);

  useEffect(() => {
    getTrackingById({
      variables: {
        id: id,
      },
    });

    dispatch(startLoadingAction());
  }, []);

  useEffect(() => {
    if (!trackingFromServer) {
      return <Redirect to="/dashboard/trackings" />;
    }

    const recipe = trackingFromServer.tracking;

    if (recipe !== null) {
      const {
        date,
        tracking_type,
        observation,
        pending_task,
        ministerial_activity,
        contact,
      } = recipe;

      setDate(date);
      setTrackingType(tracking_type);
      setObservation(observation);
      setPendingTask(pending_task);
      setMinisterialActivity(ministerial_activity);

      const cont = contact !== null ? contact.name : "";

      setContact(cont);

      dispatch(finishLoadingAction());
    }
  }, [trackingFromServer]);

  const goBack = () => {
    history.push("/dashboard/trackings");
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
                <h1 className="text-2xl mx-3 ">Seguimiento al Contacto </h1>
                <h1 className="  text-2xl font-semibold text-blue-700 mx-1 ">{`${contact}`}</h1>
              </div>
            </div>
            <hr></hr>

            <div className="grid grid-flow-col grid-cols-3 gap-4 my-4 mx-4">
              <div className="">
                <blockquote className="my-3 mx-5 px-5 py-5 ">
                  <div className="content-center ">
                    <h1 className="mx-auto text-xl text-center">Fecha</h1>
                    <p className="text-lg font-semibold text-blue-700 text-center">
                      {date}
                    </p>
                  </div>
                </blockquote>
              </div>

              <div className="">
                <blockquote className="my-3 mx-5 px-5 py-5">
                  <div className="content-center  ">
                    <h1 className="text-xl text-center">Contacto </h1>
                    <div className="text-md font-semibold text-center">
                      <p className="text-blue-700 inline-block mx-2">{`${contact}`}</p>
                    </div>
                  </div>
                </blockquote>
              </div>
              <div className="">
                <blockquote className="my-3 mx-5 px-5 py-5">
                  <div className="content-center  ">
                    <h1 className="text-xl text-center">Tipo de Seguimiento</h1>
                    <p className="text-md font-semibold  text-center">
                      {tracking_type}
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
                    <h1 className="text-xl text-center">Observación</h1>
                    <p className="text-md text-center font-semibold ">
                      {observation}
                    </p>
                  </div>
                </blockquote>
              </div>

              <div className="">
                <blockquote className="my-3 mx-5 px-5 py-5 ">
                  <div className="content-center ">
                    <h1 className="mx-auto text-xl text-center">
                      Tarea Pendiente
                    </h1>
                    <p className="text-md font-semibold text-center">
                      {pending_task}
                    </p>
                  </div>
                </blockquote>
              </div>
              <div className="">
                <blockquote className="my-3 mx-5 px-5 py-5 ">
                  <div className="content-center ">
                    <h1 className="mx-auto text-xl text-center">
                      Actividad Ministerial
                    </h1>
                    <p className="text-md font-semibold text-center">
                      {ministerial_activity}
                    </p>
                  </div>
                </blockquote>
              </div>
            </div>

            {/* ----------------------------------------------------------------- */}

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
