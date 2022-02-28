import { Loading } from "../ui/Loading";
import { startLoadingAction, finishLoadingAction } from "../../actions/ui";
import { apollo_client } from "../../config/apollo";
//graphql
import {
  CREATE_ORGANIZATION,
  DISCONNECT_FOREIGN_KEYS,
  UPDATE_ORGANIZATION,
} from "../../graphql/mutation/OrganizationsMutations";

import { ORGANIZATION_BY_ID } from "../../graphql/queries/OrganizationsQueries";

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

export const OrganizationForm = ({ history }) => {
  const { id } = useParams();

  const [createOrganization] = useMutation(CREATE_ORGANIZATION);
  const [disconnectForeignKeys] = useMutation(DISCONNECT_FOREIGN_KEYS);
  const [updateOrganization] = useMutation(UPDATE_ORGANIZATION);

  const [getOrganizationById, { data: organizationById }] =
    useLazyQuery(ORGANIZATION_BY_ID);

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.ui);

  //------------------------------ATRIBUTOS---------------------------------------------//
  const [action, setAction] = useState("");

  const [name, setName] = useState("");
  const [additional_note, setAdditionalNote] = useState("");
  const [purpose, setPurpose] = useState("");
  const [relationship, setRelationship] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [place, setPlace] = useState("");
  const [resources, setResources] = useState("");

  const [categoriesList, setCategoriesList] = useState([]);
  const [categories, setCategories] = useState([]);

  const [contactsList, setContactsList] = useState([]);
  const [contacts, setContacts] = useState([]);

  //IDS DE LAS LLAVES FORANEAS PARA A HORA DE ACTUALIZAR
  const [oldCategories, setOldCategories] = useState([]);
  const [oldContacts, setOldContacts] = useState([]);

  //---------------------------------------HANDLE INPUT CHANGE -------------------------//
  const handleInputNameChange = ({ target }) => {
    setName(target.value);
  };

  const handleInputPurposeChange = ({ target }) => {
    setPurpose(target.value);
  };

  const handleInputRelationshipChange = ({ target }) => {
    setRelationship(target.value);
  };

  const handleInputResourcesChange = ({ target }) => {
    setResources(target.value);
  };

  const handleInputPhoneChange = ({ target }) => {
    setPhone(target.value);
  };

  const handleInputPlaceChange = ({ target }) => {
    setPlace(target.value);
  };

  const handleInputEmailChange = ({ target }) => {
    setEmail(target.value);
  };

  const handleInputAdditionalNoteChange = ({ target }) => {
    setAdditionalNote(target.value);
  };

  //-------------------------------------------FUNCIONES------------------------------//

  const controller = async () => {
    const isValid = validateForm();
    if (isValid) {
      dispatch(startLoadingAction());

      if (action === "save") {
        await saveOrganization();
      } else {
        await refetch();
        await modifyOrganization();
      }
    } else {
      // openNotification("warning", "Atencion", "Revise los campos!");
    }
  };

  const refetch = async () => {
    await apollo_client.clearStore({
      include: [ORGANIZATION_BY_ID],
    });
  };

  const validateForm = () => {
    let isValid = true;

    if (validator.isEmpty(name)) {
      openNotification(
        "warning",
        "Atencion",
        "Llene el nombre de la organizacion!"
      );
      isValid = false;
    }

    if (!validator.isEmpty(email) && !validator.isEmail(email)) {
      openNotification("warning", "Atencion", "Entre un correo valido!");
      setEmail("");
      isValid = false;
    }

    // if (categories.length === 0 && categoriesList.length === 0) {
    //   openNotification("warning", "Atencion", "Llene al menos una categoria!");
    //   isValid = false;
    // }

    // if (contacts.length === 0 && contactsList.length === 0) {
    //   openNotification("warning", "Atencion", "Llene al menos un contacto!");
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
    history.push("/dashboard/organizations");
  };

  const saveOrganization = async () => {
    try {
      await createOrganization({
        variables: {
          name: name,
          purpose: purpose,
          additional_note: additional_note,
          phone: phone,
          email: email,
          place: place,
          relationship: relationship,
          resources: resources,
          categories: categories,
          contacts: contacts,
        },
      }).then((data) => {
        if (
          data.data.createOrganization !== undefined &&
          data.data.createOrganization !== null
        ) {
          const { name } = data.data.createOrganization;

          openNotification(
            "success",
            "Organizacion Guardada",
            `La organizacion ${name} se guardo de forma satisfactoria!`
          );
          dispatch(finishLoadingAction());
          history.push("/dashboard/organizations");
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

  const modifyOrganization = async () => {
    const idOrganization = id;

    const categoriesToUpdate = categories;
    const contactsToUpdate = contacts;

    if (idOrganization !== undefined) {
      try {
        if (categoriesToUpdate.length === 0 && contactsToUpdate.length === 0) {
          await disconnectForeignKeys({
            variables: {
              id: idOrganization,
              categories: [],
              contacts: [],
            },
          }).then((data) => {
            // console.log(data);
          });
        } else if (
          categoriesToUpdate.length !== 0 &&
          contactsToUpdate.length === 0
        ) {
          await disconnectForeignKeys({
            variables: {
              id: idOrganization,
              categories: oldCategories,
              contacts: [],
            },
          }).then((data) => {
            // console.log(data);
          });
        } else if (
          categoriesToUpdate.length === 0 &&
          contactsToUpdate.length !== 0
        ) {
          await disconnectForeignKeys({
            variables: {
              id: idOrganization,
              categories: [],
              contacts: oldContacts,
            },
          }).then((data) => {
            // console.log(data);
          });
        } else {
          await disconnectForeignKeys({
            variables: {
              id: idOrganization,
              categories: oldCategories,
              contacts: oldContacts,
            },
          }).then((data) => {
            // console.log(data);
          });
        }

        await updateOrganization({
          variables: {
            id: idOrganization,
            name: name,
            purpose: purpose,
            additional_note: additional_note,
            phone: phone,
            email: email,
            place: place,
            relationship: relationship,
            resources: resources,
            categories: categoriesToUpdate,
            contacts: contactsToUpdate,
          },
        }).then((data) => {
          setOldCategories([]);
          setOldContacts([]);

          //console.table(data.data);
          openNotification(
            "success",
            "Organizacion Modificada",
            "La organizacion se ha modificado de forma satisfactoria!"
          );
          dispatch(finishLoadingAction());
          history.push("/dashboard/organizations");
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
    action === "update" && getOrganizationById({ variables: { id: id } });
  }, [action]);

  // COJER EL ORGANIZACION PARA ACTUALIZARLO
  useEffect(() => {
    if (organizationById !== undefined) {
      // console.log("organizationBy id");
      // console.log(organizationById.organization);

      try {
        const {
          name,
          purpose,
          additional_note,
          place,
          phone,
          email,
          relationship,
          resources,
          categories,
          contacts,
        } = organizationById.organization;

        setName(name);
        setPurpose(purpose);
        setAdditionalNote(additional_note);
        setRelationship(relationship);
        setResources(resources);
        setPhone(phone);
        setEmail(email);
        setPlace(place);
        setCategoriesList(categories);
        setContactsList(contacts);

        setOldCategories(
          categories.map((cat) => {
            return cat.id;
          })
        );

        setOldContacts(
          contacts.map((cont) => {
            return cont.id;
          })
        );

        dispatch(finishLoadingAction());
      } catch (error) {
        dispatch(finishLoadingAction());
        console.log(error.message);
      }
    }
  }, [organizationById]);

  return (
    <div className="border-2 border-gray-50 overflow-hidden animate__animated animate__fadeIn container px-8 py-4 mx-auto bg-white rounded-lg shadow-lg dark:bg-gray-800">
      {!loading ? (
        <div>
          <div className="text-center my-6 ">
            {action === "save" ? (
              <div className="content-center">
                <div className="inline-flex items-center">
                  <h1 className="text-2xl mx-3 ">Guardar Organizacion </h1>
                  <h1 className="  text-2xl font-semibold text-blue-700 mx-1 ">{`${name}`}</h1>
                </div>
              </div>
            ) : (
              <div className="content-center">
                <div className="inline-flex items-center">
                  <h1 className="text-2xl mx-3 ">Modificar Organizacion</h1>
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
                selectedContacts={contactsList}
                setContacts={setContacts}
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
          <div className="grid grid-flow-col grid-cols-3 gap-4 my-auto mx-4 ">
            <div className="my-2">
              <div className="flex ">
                <label>Propósito</label>
              </div>
              <TextArea
                value={purpose}
                onChange={handleInputPurposeChange}
                placeholder="Propósito"
                style={{ width: "350px" }}
                autoSize
              />
              <div style={{ margin: "24px 0" }} />
            </div>

            <div className="my-2">
              <div className="flex ">
                <label>Teléfono</label>
              </div>

              <Input
                placeholder="Teléfono"
                value={phone}
                onChange={handleInputPhoneChange}
                style={{ width: "350px" }}
              />
            </div>

            <div className="my-2">
              <div className="flex ">
                <label>Correo</label>
              </div>

              <Input
                placeholder="Correo"
                value={email}
                onChange={handleInputEmailChange}
                style={{ width: "350px" }}
              />
            </div>
          </div>
          {/* ---------------------------------------------------------------------------- */}

          <div className="grid grid-flow-col grid-cols-3 gap-4 my-auto mx-4 ">
            <div className="my-10">
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

            <div className="my-10">
              <div className="flex ">
                <label>Recursos</label>
              </div>
              <TextArea
                value={resources}
                onChange={handleInputResourcesChange}
                placeholder="Recursos"
                style={{ width: "350px" }}
                autoSize
              />
              <div style={{ margin: "24px 0" }} />
            </div>

            <div className="my-10">
              <div className="flex ">
                <label>Relación con Apoyo</label>
              </div>
              <TextArea
                value={relationship}
                onChange={handleInputRelationshipChange}
                placeholder="Relación con Apoyo"
                style={{ width: "350px" }}
                autoSize
              />
              <div style={{ margin: "24px 0" }} />
            </div>
          </div>

          <div className="grid grid-flow-col grid-cols-3 gap-4 my-auto mx-4 ">
            <div className="mt-auto mb-10">
              <div className="flex">
                <label>Categorias</label>
              </div>
              <GenericCategoriesSelect
                selectedCategories={categoriesList}
                setCategories={setCategories}
              />
            </div>
          </div>

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
