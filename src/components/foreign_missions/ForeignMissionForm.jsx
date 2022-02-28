import { Loading } from "../ui/Loading";
import { startLoadingAction, finishLoadingAction } from "../../actions/ui";
import { apollo_client } from "../../config/apollo";
//graphql
import {
  CREATE_FOREIGN_MISSION,
  DISCONNECT_FOREIGN_KEYS,
  UPDATE_FOREIGN_MISSION,
} from "../../graphql/mutation/ForeignMissionsMutations";

import { FOREIGN_MISSION_BY_ID } from "../../graphql/queries/ForeignMissionsQueries";

import React, { useState, useEffect } from "react";
import { useMutation, useLazyQuery, useQuery } from "@apollo/client";
import { Button, notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Redirect } from "react-router-dom";

import validator from "validator";

import { Input, InputNumber } from "antd";
import { GenericCategoriesSelect } from "../common/GenericCategoriesSelect";
import { GenericContactsSelect } from "../common/GenericContactsSelect";

const { TextArea } = Input;

export const ForeignMissionForm = ({ history }) => {
  const { id } = useParams();

  const [createForeignMission] = useMutation(CREATE_FOREIGN_MISSION);
  const [disconnectForeignKeys] = useMutation(DISCONNECT_FOREIGN_KEYS);
  const [updateForeignMission] = useMutation(UPDATE_FOREIGN_MISSION);

  const [getForeignMissionById, { data: foreignMissionById }] = useLazyQuery(
    FOREIGN_MISSION_BY_ID
  );

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.ui);

  //------------------------------ATRIBUTOS---------------------------------------------//
  const [action, setAction] = useState("");

  const [name, setName] = useState("");
  const [place, setPlace] = useState("");
  const [additional_note, setAdditionalNote] = useState("");
  const [purpose, setPurpose] = useState("");
  const [ministerial_focus, setMinisterialFocus] = useState("");
  const [capacitation_resources, setCapacitationResources] = useState("");
  const [resources, setResources] = useState("");
  const [global_opportunities, setGlobalOpportunities] = useState("");

  const [representatives, setRepresentatives] = useState([]);
  const [representativesList, setRepresentativesList] = useState([]);

  const [categoriesList, setCategoriesList] = useState([]);
  const [categories, setCategories] = useState([]);

  const [missionariesList, setMissionariesList] = useState([]);
  const [missionaries, setMissionaries] = useState([]);

  //IDS DE LAS LLAVES FORANEAS PARA A HORA DE ACTUALIZAR
  const [oldRepresentatives, setOldRepresentatives] = useState("");
  const [oldCategories, setOldCategories] = useState([]);
  const [oldMissionaries, setOldMissionaries] = useState([]);

  //---------------------------------------HANDLE INPUT CHANGE -------------------------//
  const handleInputNameChange = ({ target }) => {
    setName(target.value);
  };

  const handleInputPlaceChange = ({ target }) => {
    setPlace(target.value);
  };

  const handleInputAdditionalNoteChange = ({ target }) => {
    setAdditionalNote(target.value);
  };

  const handleInputPurposeChange = ({ target }) => {
    setPurpose(target.value);
  };

  const handleInputMinisterialFocusChange = ({ target }) => {
    setMinisterialFocus(target.value);
  };

  const handleInputCapacitationResourceChange = ({ target }) => {
    setCapacitationResources(target.value);
  };

  const handleInputResourceChange = ({ target }) => {
    setResources(target.value);
  };

  const handleInputGlobalOpportunitiesChange = ({ target }) => {
    setGlobalOpportunities(target.value);
  };

  //-------------------------------------------FUNCIONES------------------------------//

  const controller = async () => {
    const isValid = validateForm();
    if (isValid) {
      dispatch(startLoadingAction());

      if (action === "save") {
        await saveForeignMission();
      } else {
        await refetch();
        await modifyForeignMission();
      }
    } else {
      // openNotification("warning", "Atencion", "Revise los campos!");
    }
  };

  const refetch = async () => {
    await apollo_client.clearStore({
      include: [FOREIGN_MISSION_BY_ID],
    });
  };

  const validateForm = () => {
    let isValid = true;

    if (validator.isEmpty(name)) {
      openNotification(
        "warning",
        "Atencion",
        "Llene el nombre de la misión transcultural!"
      );
      isValid = false;
    }

    // if (contact.length === 0 && oldRepresentatives === "") {
    //   openNotification("warning", "Atencion", "Llene el representante!");
    //   isValid = false;
    // }

    // if (categories.length === 0 && categoriesList.length === 0) {
    //   openNotification("warning", "Atencion", "Llene al menos una categoria!");
    //   isValid = false;
    // }

    // if (missionaries.length === 0 && missionariesList.length === 0) {
    //   openNotification(
    //     "warning",
    //     "Atencion",
    //     "Llene al menos un candidato misionero!"
    //   );
    //   isValid = false;
    // }

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
    history.push("/dashboard/missions");
  };

  const saveForeignMission = async () => {
    try {
      await createForeignMission({
        variables: {
          name: name,
          place: place,
          additional_note: additional_note,
          purpose: purpose,
          ministerial_focus: ministerial_focus,
          capacitation_resources: capacitation_resources,
          resources: resources,
          global_opportunities: global_opportunities,
          representatives: representatives,
          categories: categories,
          missionaries: missionaries,
        },
      }).then((data) => {
        if (
          data.data.createForeignMission !== undefined &&
          data.data.createForeignMission !== null
        ) {
          openNotification(
            "success",
            "Misión Transcultural Guardada",
            `La misión transcultural se guardo correctamente!`
          );
          dispatch(finishLoadingAction());
          history.push("/dashboard/missions");
        }
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

  const modifyForeignMission = async () => {
    const idForeignMission = id;

    const categoriesToUpdate = categories;
    const missionariesToUpdate = missionaries;
    const representativesToUpdate = representatives;

    if (idForeignMission !== undefined) {
      try {
        //si no se ha modificado nada
        if (
          categoriesToUpdate.length === 0 &&
          missionariesToUpdate.length === 0 &&
          representativesToUpdate.length === 0
        ) {
          await disconnectForeignKeys({
            variables: {
              id: idForeignMission,
              categories: [],
              missionaries: [],
              representatives: [],
            },
          }).then((data) => {
            // console.log(data);
          });
          //si se modifico la categoria solamente
        } else if (
          categoriesToUpdate.length !== 0 &&
          missionariesToUpdate.length === 0 &&
          representativesToUpdate.length === 0
        ) {
          await disconnectForeignKeys({
            variables: {
              id: idForeignMission,
              categories: oldCategories,
              missionaries: [],
              representatives: [],
            },
          }).then((data) => {
            // console.log(data);
          });

          //si se modificaron solo los misioneros
        } else if (
          categoriesToUpdate.length === 0 &&
          missionariesToUpdate.length !== 0 &&
          representativesToUpdate.length === 0
        ) {
          await disconnectForeignKeys({
            variables: {
              id: idForeignMission,
              categories: [],
              missionaries: oldMissionaries,
              representatives: [],
            },
          }).then((data) => {
            // console.log(data);
          });
        } else if (
          categoriesToUpdate.length === 0 &&
          missionariesToUpdate.length === 0 &&
          representativesToUpdate.length !== 0
        ) {
          await disconnectForeignKeys({
            variables: {
              id: idForeignMission,
              categories: [],
              missionaries: [],
              representatives: oldRepresentatives,
            },
          }).then((data) => {
            // console.log(data);
          });
        } else {
          await disconnectForeignKeys({
            variables: {
              id: idForeignMission,
              categories: oldCategories,
              missionaries: oldMissionaries,
              representatives: oldRepresentatives,
            },
          }).then((data) => {
            // console.log(data);
          });
        }

        await updateForeignMission({
          variables: {
            id: idForeignMission,
            name: name,
            place: place,
            additional_note: additional_note,
            purpose: purpose,
            ministerial_focus: ministerial_focus,
            capacitation_resources: capacitation_resources,
            resources: resources,
            global_opportunities: global_opportunities,

            representatives: representativesToUpdate,
            categories: categoriesToUpdate,
            missionaries: missionariesToUpdate,
          },
        }).then((data) => {
          setOldCategories([]);
          setOldMissionaries([]);
          setOldRepresentatives([]);
          //console.table(data.data);
          openNotification(
            "success",
            "Misión Transcultural Modificada",
            "La misión transcultural se ha modificado correctamente!"
          );
          dispatch(finishLoadingAction());
          history.push("/dashboard/missions");
        });
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
    action === "update" && getForeignMissionById({ variables: { id: id } });
  }, [action]);

  // COJER EL ORGANIZACION PARA ACTUALIZARLO
  useEffect(() => {
    if (foreignMissionById !== undefined) {
      try {
        const {
          name,
          place,
          additional_note,
          purpose,
          ministerial_focus,
          capacitation_resources,
          resources,
          global_opportunities,
          categories,
          representatives,
          missionaries,
        } = foreignMissionById.foreignMission;

        setName(name);
        setPlace(place);
        setAdditionalNote(additional_note);
        setPurpose(purpose);
        setMinisterialFocus(ministerial_focus);
        setCapacitationResources(capacitation_resources);
        setResources(resources);
        setGlobalOpportunities(global_opportunities);

        setCategoriesList(categories);
        setMissionariesList(missionaries);
        setRepresentativesList(representatives);

        setOldRepresentatives(
          representatives.map((rep) => {
            return rep.id;
          })
        );

        setOldCategories(
          categories.map((cat) => {
            return cat.id;
          })
        );

        setOldMissionaries(
          missionaries.map((mis) => {
            return mis.id;
          })
        );

        dispatch(finishLoadingAction());
      } catch (error) {
        dispatch(finishLoadingAction());
        console.log(error.message);
      }
    }
  }, [foreignMissionById]);

  return (
    <div className="border-2 border-gray-50 overflow-hidden animate__animated animate__fadeIn container px-8 py-4 mx-auto bg-white rounded-lg shadow-lg dark:bg-gray-800">
      {!loading ? (
        <div>
          <div className="text-center my-6 ">
            {action === "save" ? (
              <div className="content-center">
                <div className="inline-flex items-center">
                  <h1 className="text-xl mx-3 ">
                    Guardar Misión Transcultural
                  </h1>
                  <h1 className="  text-2xl font-semibold text-blue-700 mx-1 ">{`${name}`}</h1>
                </div>
              </div>
            ) : (
              <div className="content-center">
                <div className="inline-flex items-center">
                  <h1 className="text-xl mx-3 ">
                    Modificar Misión Transcultural
                  </h1>
                  <h1 className="  text-2xl font-semibold text-blue-700 mx-1 ">{`${name}`}</h1>
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
                  Nombre <span className="text-red-600 text-md mx-1">*</span>
                </label>
              </div>

              <Input
                placeholder="Nombre"
                value={name}
                onChange={handleInputNameChange}
                style={{ width: "350px" }}
              />
            </div>

            <div className="my-5">
              <label>Representantes</label>
              <GenericContactsSelect
                selectedContacts={representativesList}
                setContacts={setRepresentatives}
              />
            </div>

            <div className="my-5">
              <div className="flex ">
                <label>Nota Adicional</label>
              </div>

              <TextArea
                value={additional_note}
                onChange={handleInputAdditionalNoteChange}
                placeholder="Nota Adicional"
                style={{ width: "350px" }}
                autoSize
              />
            </div>
          </div>

          {/* ---------------------------------------------------------------------------- */}
          <div className="grid grid-flow-col grid-cols-3 gap-4 my-4 mx-4 ">
            <div className="my-5">
              <div className="flex ">
                <label>Propósito</label>
              </div>

              <Input
                placeholder="Propósito"
                value={purpose}
                onChange={handleInputPurposeChange}
                style={{ width: "350px" }}
              />
            </div>

            <div className="my-5">
              <div className="flex ">
                <label>Enfoque Ministerial</label>
              </div>

              <Input
                placeholder="Enfoque Ministerial"
                value={ministerial_focus}
                onChange={handleInputMinisterialFocusChange}
                style={{ width: "350px" }}
              />
            </div>

            <div className="my-5">
              <div className="flex s">
                <label>Oportunidades Globales </label>
              </div>

              <Input
                placeholder="Oportunidades Globales"
                value={global_opportunities}
                onChange={handleInputGlobalOpportunitiesChange}
                style={{ width: "350px" }}
              />
            </div>
          </div>
          {/* ---------------------------------------------------------------------------- */}
          <div className="grid grid-flow-col grid-cols-3 gap-4 my-4 mx-4 ">
            <div className="my-5">
              <div className="flex ">
                <label>Lugar</label>
              </div>

              <Input
                placeholder="Lugar"
                value={place}
                onChange={handleInputPlaceChange}
                style={{ width: "350px" }}
              />
            </div>

            <div className="my-5">
              <div className="flex ">
                <label>Recursos</label>
              </div>

              <Input
                placeholder="Recursos"
                value={resources}
                onChange={handleInputResourceChange}
                style={{ width: "350px" }}
              />
            </div>

            <div className="my-5">
              <div className="flex s">
                <label>Recursos de Capacitación </label>
              </div>

              <Input
                placeholder="Recursos de Capacitación"
                value={capacitation_resources}
                onChange={handleInputCapacitationResourceChange}
                style={{ width: "350px" }}
              />
            </div>
          </div>
          {/* ---------------------------------------------------------------------------- */}
          <div className="grid grid-flow-col grid-cols-3 gap-4 my-auto mx-4 ">
            <div className="my-2">
              <label>Candidatos Misioneros</label>
              <GenericContactsSelect
                selectedContacts={missionariesList}
                setContacts={setMissionaries}
              />
            </div>
            <div className="my-2">
              <div className="flex">
                <label>Categorías</label>
              </div>
              <GenericCategoriesSelect
                selectedCategories={categoriesList}
                setCategories={setCategories}
              />
            </div>
          </div>
          {/* ---------------------------------------------------------------------------- */}
          <hr className="my-8"></hr>
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
