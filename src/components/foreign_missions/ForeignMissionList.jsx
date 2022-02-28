import { FOREIGN_MISSIONS } from "../../graphql/queries/ForeignMissionsQueries";
import { DELETE_FOREIGN_MISSION } from "../../graphql/mutation/ForeignMissionsMutations";
import { DELETE_MISSIONS } from "../../graphql/mutation/ForeignMissionsMutations";
import { CATEGORIES } from "../../graphql/queries/CategoriesQueries";
import { CONTACTS } from "../../graphql/queries/ContactsQueries";

import { ForeignMissionTable } from "./ForeignMissionTable";
import { apollo_client } from "../../config/apollo";

import { Loading } from "../ui/Loading";
import { startLoadingAction, finishLoadingAction } from "../../actions/ui";

import React, { useState, useEffect } from "react";
import { useMutation, useLazyQuery, useQuery } from "@apollo/client";
import { notification, Button } from "antd";

import { useDispatch, useSelector } from "react-redux";

export const ForeignMissionList = ({ history }) => {
  const { data: foreignMissionsFromServer } = useQuery(FOREIGN_MISSIONS);

  const [deleteForeignMission] = useMutation(DELETE_FOREIGN_MISSION);
  const [deleteMissions] = useMutation(DELETE_MISSIONS);

  const [getCategories, { data: categoriesFromServer }] =
    useLazyQuery(CATEGORIES);

  const [getContacts, { data: contactsFromServer }] = useLazyQuery(CONTACTS);

  const [foreignMissionsList, setForeignMissionsList] = useState([]);
  const [foreignMissions, setForeignMissions] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  //FILTROS DE LA TABLA DE CONTACTOS
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

  const fillForeignMissionsData = (foreignMissions) => {
    setForeignMissionsList([]);

    if (foreignMissions !== undefined && foreignMissions.length !== 0) {
      const places = foreignMissions.map((elem) => {
        return elem.place;
      });

      const placesFilt = getOnlyOneFilterElems(places);

      setPlaceFilter(placesFilt);

      foreignMissions.forEach((foreignMission) => {
        const { categories } = foreignMission;
        const { missionaries } = foreignMission;
        const { representatives } = foreignMission;

        const record = {
          key: foreignMission.id,
          name: foreignMission.name,
          place: foreignMission.place,

          representatives:
            representatives.length !== 0
              ? representatives.map((rep) => {
                  return rep.name;
                })
              : "",

          missionaries:
            missionaries.length !== 0
              ? missionaries.map((missionary) => {
                  return missionary.name;
                })
              : "",
          categories:
            categories.length !== 0
              ? categories.map((category) => {
                  return category.name;
                })
              : "",
        };

        setForeignMissionsList((foreignMissionsList) => [
          ...foreignMissionsList,
          record,
        ]);
      });
    }
  };

  const deleteForeignMissionById = async () => {
    dispatch(startLoadingAction());

    notification.destroy();

    if (selectedIds.length === 1) {
      try {
        await deleteForeignMission({
          variables: { id: selectedIds[0] },
        }).then((data) => {
          // console.log(data);
          openNotification(
            "success",
            "Informacion",
            "Misión Transcultural eliminada satisfactoriamente!"
          );
          clean();
          // dispatch(finishLoadingAction());
        });
      } catch (error) {
        console.log(error.name);
        openNotification("error", "Error!", `Ocurrió una error: ${error}`);
        dispatch(finishLoadingAction());
      }
    } else if (selectedIds.length > 1) {
      try {
        await deleteMissions({
          variables: { ids: selectedIds },
        }).then((data) => {
          // console.log(data);
          openNotification(
            "success",
            "Informacion",
            "Misines Transculturales eliminadas satisfactoriamente!"
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
        "Debe seleccionar al menos una misión transcultural!"
      );
    }
  };

  const clean = () => {
    setSelectedIds("");
    setForeignMissionsList([]);
    setForeignMissions([]);
    refetchForeignMissions();
  };

  const openNotificationDelete = () => {
    if (selectedIds.length !== 0) {
      const key = `open${Date.now()}`;

      const btn = (
        <Button
          type="danger"
          onClick={deleteForeignMissionById}
          style={{ borderRadius: "100px" }}
        >
          Confirmar
        </Button>
      );
      notification.open({
        message: "Atencion!",
        description: "Esta seguro que desea eliminar la misión transcultural?",
        btn,
        key,
      });
    } else {
      openNotification(
        "warning",
        "Atencion!",
        "Debe seleccionar al menos una misión transcultural!"
      );
    }
  };

  const goToCreateForeignMission = () => {
    history.push("/dashboard/missions/form");
  };

  const refetchForeignMissions = async () => {
    await apollo_client.refetchQueries({
      include: [FOREIGN_MISSIONS],
    });
    dispatch(finishLoadingAction());
  };

  const goToViewForeignMission = () => {
    if (selectedIds.length !== 0) {
      const id = selectedIds[0];

      if (id !== undefined && id !== "") {
        history.replace(`/dashboard/missions/view/${id}`);
      }
    } else {
      openNotification(
        "warning",
        "Atencion!",
        "Debe seleccionar al menos una misión transcultural!"
      );
    }
  };

  const goToUpdateForeignMission = () => {
    if (selectedIds.length !== 0) {
      const id = selectedIds[0];

      if (id !== undefined && id !== "") {
        history.replace(`/dashboard/missions/form/${id}`);
      }
    } else {
      openNotification(
        "warning",
        "Atencion!",
        "Debe seleccionar al menos una misión transcultural!"
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
    if (foreignMissionsFromServer !== undefined) {
      const { foreignMissions } = foreignMissionsFromServer;

      // console.table(foreignMissions);

      fillForeignMissionsData(foreignMissions);
    }
  }, [foreignMissionsFromServer]);

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
    if (foreignMissionsList.length !== 0) {
      setForeignMissions(foreignMissionsList);
    }
  }, [foreignMissionsList]);

  //RECARGAR LAS QUERIES
  useEffect(() => {
    dispatch(startLoadingAction());
    getCategories();
    getContacts();
    refetchForeignMissions();
  }, []);

  return (
    <div className="border-2 border-gray-50 container px-8 py-4 mx-auto bg-white rounded-lg shadow-lg dark:bg-gray-800">
      {loading === false ? (
        <div>
          <h1 className="flex text-2xl my-1">
            <p className="mx-2 ">Lista de Misiones Transculturales </p>

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
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </h1>
          <hr className="w-1/3"></hr>

          <div className="flex mx-auto my-8">
            <button
              onClick={goToCreateForeignMission}
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
              onClick={goToUpdateForeignMission}
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
              onClick={goToViewForeignMission}
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
            {foreignMissions.length !== 0 ? (
              <ForeignMissionTable
                foreignMissionList={foreignMissions}
                setSelectedIds={setSelectedIds}
                categoryFilter={categoryFilter}
                contactFilter={contactFilter}
                placeFilter={placeFilter}
                className="my-6"
              />
            ) : (
              <div className="mx-auto my-6 content-center text-center animate__animated animate__fadeIn">
                <h1 className=" text-xl text-center my-4">
                  No hay misiones transculturales en la base de datos aún.
                </h1>
                <p
                  onClick={goToCreateForeignMission}
                  className="animate-pulse font-semibold text-2xl cursor-pointer text-md text-blue-700 text-center content-center my-4  hover:underline"
                >
                  Agregar Misión Transcultural +
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
