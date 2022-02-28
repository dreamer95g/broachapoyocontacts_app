import { ContactPhotoInput } from "./ContactPhotoInput";
import { GenericCategoriesSelect } from "../common/GenericCategoriesSelect";

import { Loading } from "../ui/Loading";
import { startLoadingAction, finishLoadingAction } from "../../actions/ui";
//graphql
import {
  CREATE_CONTACT,
  DISCONNECT_FOREIGN_KEYS,
  UPDATE_CONTACT,
} from "../../graphql/mutation/ContactsMutations";
import { DELETE_IMAGE } from "../../graphql/mutation/ImagesMutations";
import { STORE_IMAGE_B64 } from "../../graphql/mutation/ImagesMutations";
import { CONTACT_BY_ID } from "../../graphql/queries/ContactsQueries";

import React, { useState, useEffect } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { Button, notification, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Redirect } from "react-router-dom";

import validator from "validator";

import { Input, InputNumber } from "antd";
import { apollo_client } from "../../config/apollo";

const { TextArea } = Input;

export const ContactForm = ({ history }) => {
  const { id } = useParams();

  const [createContact] = useMutation(CREATE_CONTACT);
  const [disconnectForeignKeys] = useMutation(DISCONNECT_FOREIGN_KEYS);
  const [updateContact] = useMutation(UPDATE_CONTACT);
  const [deleteImage] = useMutation(DELETE_IMAGE);
  const [storeImage] = useMutation(STORE_IMAGE_B64);

  const [getContactById, { data: contact }] = useLazyQuery(CONTACT_BY_ID);

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.ui);

  //------------------------------ATRIBUTOS---------------------------------------------//
  const [action, setAction] = useState("");
  const [name, setName] = useState("");
  const [dni, setDni] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [family, setFamily] = useState("");
  const [place, setPlace] = useState("");
  const [ministerial_area, setMinisterialArea] = useState("");
  const [description, setDescription] = useState("");

  const [commitment, setCommitment] = useState("");
  const [profession, setProfession] = useState("");
  const [vocational_category, setVocationalCategory] = useState("");
  const [ministerial_passion, setMinisterialPassion] = useState("");
  const [interest_group, setInterestGroup] = useState("");

  const [additional_note, setAdditionalNote] = useState("");
  const [photo, setPhoto] = useState();
  const [photoId, setPhotoId] = useState("");
  const [categoriesList, setCategoriesList] = useState([]);
  const [categories, setCategories] = useState([]);

  //NECESARIO PARA MODIFICAR EL CONTACTO
  const [selectedImage, setSelectedImage] = useState();

  //IDS DE LAS LLAVES FORANEAS PARA A HORA DE ACTUALIZAR
  const [oldCategories, setOldCategories] = useState([]);
  const [oldImage, setOldImage] = useState("");

  //---------------------------------------HANDLE INPUT CHANGE -------------------------//
  const handleInputNameChange = ({ target }) => {
    setName(target.value);
  };

  const handleInputDniChange = ({ target }) => {
    setDni(target.value);
  };

  const handleInputPhoneChange = ({ target }) => {
    setPhone(target.value);
  };

  const handleInputEmailChange = ({ target }) => {
    setEmail(target.value);
  };

  const handleInputFamilyChange = ({ target }) => {
    setFamily(target.value);
  };

  const handleInputPlaceChange = ({ target }) => {
    setPlace(target.value);
  };

  const handleInputMinisterialAreaChange = ({ target }) => {
    setMinisterialArea(target.value);
  };
  const handleInputCommitmentChange = ({ target }) => {
    setCommitment(target.value);
  };
  const handleInputProfessionChange = ({ target }) => {
    setProfession(target.value);
  };
  const handleInputVocationalCategoryChange = ({ target }) => {
    setVocationalCategory(target.value);
  };
  const handleInputMinisterialPassionChange = ({ target }) => {
    setMinisterialPassion(target.value);
  };
  const handleInputInterestGroupChange = ({ target }) => {
    setInterestGroup(target.value);
  };

  const handleInputDescriptionChange = ({ target }) => {
    setDescription(target.value);
  };

  const handleInputAdditionalNoteChange = ({ target }) => {
    setAdditionalNote(target.value);
  };

  //-------------------------------------------FUNCIONES------------------------------//

  const refetch = async () => {
    await apollo_client.clearStore({
      include: [CONTACT_BY_ID],
    });
  };

  const controller = async () => {
    let isValid = validateForm();

    if (isValid) {
      dispatch(startLoadingAction());

      if (action === "save") {
        await saveContact();
      } else {
        await refetch();
        await modifyContact();
      }
    }
  };

  const validateForm = () => {
    let isValid = true;

    if (validator.isEmpty(name)) {
      openNotification("warning", "Atencion", "Llene el nombre!");
      isValid = false;
    }

    if (!validator.isEmpty(dni) && !validator.isNumeric(dni)) {
      openNotification("warning", "Atencion", "Revise el dni!");
      setDni("");
      isValid = false;
    }

    // if (!validator.isEmpty(phone) && !validator.isMobilePhone(phone)) {
    //   openNotification("warning", "Atencion", "Revise el telefono!");
    //   setPhone("");
    //   isValid = false;
    // }

    if (!validator.isEmpty(email) && !validator.isEmail(email)) {
      openNotification("warning", "Atencion", "Entre un correo valido!");
      setEmail("");
      isValid = false;
    }

    // if (categories.length === 0 && categoriesList.length === 0) {
    //   openNotification(
    //     "warning",
    //     "Atencion",
    //     "Seleccione al menos una categoria!"
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
    history.push("/dashboard/contacts");
    //history.goBack();
    // console.log(history);
  };

  const saveContact = async () => {
    let idImage = await uploadPhoto();

    const dni_str = String(dni);
    const phone_str = String(phone);

    if (idImage !== "") {
      try {
        await createContact({
          variables: {
            name: name,
            dni: dni_str,
            phone: phone_str,
            email: email,
            family: family,
            place: place,
            ministerial_area: ministerial_area,
            description: description,
            commitment: commitment,
            profession: profession,
            vocational_category: vocational_category,
            ministerial_passion: ministerial_passion,
            interest_group: interest_group,
            additional_note: additional_note,
            categories: categories,
            images: [idImage],
          },
        }).then((data) => {
          const { id, name } = data.data.createContact;
          openNotification(
            "success",
            "Contacto Guardado",
            `El contacto ${name} se guardo de forma satisfactoria!`
          );
          dispatch(finishLoadingAction());
          history.push("/dashboard/contacts");
        });
      } catch (error) {
        console.log(error.message);
        dispatch(finishLoadingAction());
        openNotification(
          "error",
          "Error",
          `Ocurrio algun error: ${error.message} !`
        );
      }
    } else {
      try {
        await createContact({
          variables: {
            name: name,
            dni: dni_str,
            phone: phone_str,
            email: email,
            family: family,
            place: place,
            ministerial_area: ministerial_area,
            description: description,
            commitment: commitment,
            profession: profession,
            vocational_category: vocational_category,
            ministerial_passion: ministerial_passion,
            interest_group: interest_group,
            additional_note: additional_note,
            categories: categories,
            images: [],
          },
        }).then((data) => {
          const { id, name } = data.data.createContact;
          openNotification(
            "success",
            "Contacto Guardado",
            `El contacto ${name} se guardo de forma satisfactoria!`
          );
          dispatch(finishLoadingAction());
          history.push("/dashboard/contacts");
        });
      } catch (error) {
        console.log(error.message);
        dispatch(finishLoadingAction());
        openNotification(
          "error",
          "Error",
          `Ocurrio algun error: ${error.message} !`
        );
      }
    }
  };

  const modifyContact = async () => {
    const idContact = id;
    const dni_str = String(dni);
    const phone_str = String(phone);

    try {
      if (photo === undefined) {
        // let a = JSON.stringify(categories);
        // let b = JSON.stringify(oldCategories);

        if (categories.length === 0) {
          await disconnectForeignKeys({
            variables: {
              id: idContact,
              categories: [],
              images: [],
            },
          }).then((data) => {
            //console.log(data)
          });
        } else {
          await disconnectForeignKeys({
            variables: {
              id: idContact,
              categories: oldCategories,
              images: [],
            },
          }).then((data) => {
            //console.log(data)
          });
        }

        await updateContact({
          variables: {
            id: idContact,
            name: name,
            dni: dni_str,
            phone: phone_str,
            email: email,
            family: family,
            place: place,
            ministerial_area: ministerial_area,
            description: description,
            commitment: commitment,
            profession: profession,
            vocational_category: vocational_category,
            ministerial_passion: ministerial_passion,
            interest_group: interest_group,
            additional_note: additional_note,
            images: [],
            categories: categories,
          },
        }).then((data) => {
          setOldCategories([]);
          setOldImage("");

          openNotification(
            "success",
            "Contacto Modificado",
            "El contacto se ha modificado de forma satisfactoria!"
          );
          dispatch(finishLoadingAction());
          history.push("/dashboard/contacts");
        });
      } else {
        if (categories.length === 0) {
          await disconnectForeignKeys({
            variables: {
              id: idContact,
              categories: [],
              images: [],
            },
          }).then((data) => {
            //console.log(data)
          });
        } else {
          await disconnectForeignKeys({
            variables: {
              id: idContact,
              categories: oldCategories,
              images: [],
            },
          }).then((data) => {
            //console.log(data)
          });
        }

        const oldIdImage = Number(oldImage);

        await deleteImage({
          variables: {
            id: oldIdImage,
          },
        }).then((data) => {
          //console.log(data)
        });

        let idImage = await uploadPhoto();

        await updateContact({
          variables: {
            id: idContact,
            name: name,
            dni: dni_str,
            phone: phone_str,
            email: email,
            family: family,
            place: place,
            ministerial_area: ministerial_area,
            description: description,
            commitment: commitment,
            profession: profession,
            vocational_category: vocational_category,
            ministerial_passion: ministerial_passion,
            interest_group: interest_group,
            additional_note: additional_note,
            images: [idImage],
            categories: categories,
          },
        }).then((data) => {
          setOldCategories([]);
          setOldImage("");

          //console.table(data.data);
          openNotification(
            "success",
            "Contacto Modificado",
            "El contacto se ha modificado de forma satisfactoria!"
          );
          dispatch(finishLoadingAction());
          history.push("/dashboard/contacts");
        });
      }
    } catch (error) {
      dispatch(finishLoadingAction());
      openNotification(
        "error",
        "Error",
        `Ocurrio algun error: ${error.message} !`
      );
    }
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const uploadPhoto = async () => {
    let imageId = "";

    try {
      if (photo !== undefined) {
        const file = photo;

        // console.log(`este es photo${photo}`);

        // const image = await fileUpload(file);

        const imageb64 = await getBase64(file);

        await storeImage({
          variables: {
            name: imageb64,
          },
        }).then((data) => {
          if (data.data.storeImage !== undefined) {
            const { id } = data.data.storeImage;

            setPhotoId(id);

            imageId = id;
          }
        });
      }
    } catch (error) {
      dispatch(finishLoadingAction());
      console.log(error.message);
    }

    return imageId;
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
    action === "update" && getContactById({ variables: { id: id } });
  }, [action]);

  useEffect(() => {
    if (contact !== undefined) {
      try {
        const {
          name,
          dni,
          phone,
          email,
          family,
          place,
          ministerial_area,
          description,
          commitment,
          profession,
          vocational_category,
          ministerial_passion,
          interest_group,
          additional_note,
          images,
          categories,
        } = contact.contact;

        setName(name);
        setDni(dni);
        setPhone(phone);
        setEmail(email);
        setFamily(family);
        setPlace(place);
        setMinisterialArea(ministerial_area);
        setDescription(description);
        setCommitment(commitment);
        setProfession(profession);
        setVocationalCategory(vocational_category);
        setMinisterialPassion(ministerial_passion);
        setInterestGroup(interest_group);

        setAdditionalNote(additional_note);

        setCategoriesList(categories);

        if (images.length !== 0) {
          const { id, name } = images[0];

          const selectedImg = {
            id: id,
            name: name,
          };

          setSelectedImage(selectedImg);

          setOldImage(id);
        }

        dispatch(finishLoadingAction());

        setOldCategories(
          categories.map((cat) => {
            return cat.id;
          })
        );
      } catch (error) {
        console.log(error.message);
      }
    }
  }, [contact]);

  return (
    <div className="border-2 border-gray-50 overflow-hidden animate__animated animate__fadeIn container px-8 py-4 mx-auto bg-white rounded-lg shadow-lg dark:bg-gray-800">
      {!loading ? (
        <div>
          <div className="text-center my-6 ">
            {action === "save" ? (
              <div className="content-center">
                <div className="inline-flex items-center">
                  <h1 className="text-2xl mx-3 ">Guardar Contacto</h1>
                  <h1 className="  text-2xl font-semibold text-blue-700 mx-1 ">{`${name}`}</h1>
                </div>
              </div>
            ) : (
              <div className="content-center">
                <div className="inline-flex items-center">
                  <h1 className="text-2xl mx-3 ">Modificar Contacto</h1>
                  <h1 className="  text-2xl font-semibold text-blue-700 mx-1 ">{`${name}`}</h1>
                </div>
              </div>
            )}
          </div>

          <hr />

          <div className="grid grid-flow-col grid-cols-3 gap-4 my-8 mx-4">
            {/* --------------------------------------------------------------------------- */}
            <div className="my-6">
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

            <div className="my-6">
              <label>Nota Adicional</label>
              <TextArea
                value={additional_note}
                onChange={handleInputAdditionalNoteChange}
                placeholder="Nota Adicional"
                style={{ width: "350px" }}
                autoSize
              />
            </div>

            <div className="my-6">
              <label>Carnet de Identidad</label>

              <Input
                value={dni}
                onChange={handleInputDniChange}
                placeholder="Dni"
                style={{ width: "350px" }}
              />
            </div>

            {/* --------------------------------------------------------------------------- */}
          </div>

          <div className="grid grid-flow-col grid-cols-3 gap-4 mx-4 my-3">
            <div className="my-auto">
              <label>Teléfono</label>

              <Input
                value={phone}
                style={{ width: "350px" }}
                onChange={handleInputPhoneChange}
                placeholder="Teléfono"
              />
            </div>

            <div className="my-auto">
              <label>Email</label>
              <Input
                placeholder="Email"
                onChange={handleInputEmailChange}
                value={email}
                style={{ width: "350px" }}
              />
            </div>

            <div className="my-auto">
              <label>Familia</label>
              <TextArea
                value={family}
                onChange={handleInputFamilyChange}
                placeholder="Familia"
                style={{ width: "350px" }}
                autoSize
              />
            </div>

            {/* --------------------------------------------------------------------------- */}
          </div>

          <div className="grid grid-flow-col grid-cols-3 gap-4 mx-4 my-auto">
            <div className="my-6">
              <label>Lugar</label>
              <Input
                value={place}
                onChange={handleInputPlaceChange}
                placeholder="Lugar"
                style={{ width: "350px" }}
              />
            </div>

            <div className="my-6">
              <label>Area Ministerial</label>
              <Input
                value={ministerial_area}
                onChange={handleInputMinisterialAreaChange}
                placeholder="Area Ministerial"
                style={{ width: "350px" }}
              />
            </div>
            <div className="my-6">
              <label>Descripción</label>
              <TextArea
                value={description}
                onChange={handleInputDescriptionChange}
                placeholder="Descripción"
                style={{ width: "350px" }}
                autoSize
              />
            </div>
          </div>

          <div className="grid grid-flow-col grid-cols-3 gap-4 mx-4 my-auto">
            <div className="my-6">
              <label>Compromiso con Apoyo</label>
              <TextArea
                value={commitment}
                onChange={handleInputCommitmentChange}
                placeholder="Compromiso con Apoyo"
                style={{ width: "350px" }}
                autoSize
              />
            </div>

            <div className="my-6">
              <label>Profesión</label>
              <Input
                value={profession}
                onChange={handleInputProfessionChange}
                placeholder="Profesión"
                style={{ width: "350px" }}
              />
            </div>
            <div className="my-6">
              <label>Categoría Vocacional</label>
              <TextArea
                value={vocational_category}
                onChange={handleInputVocationalCategoryChange}
                placeholder="Categoría Vocacional"
                style={{ width: "350px" }}
                autoSize
              />
            </div>
          </div>

          <div className="grid grid-flow-col grid-cols-3 gap-4 mx-4 my-auto">
            <div className="my-6">
              <label>Pasión Ministerial</label>
              <TextArea
                value={ministerial_passion}
                onChange={handleInputMinisterialPassionChange}
                placeholder="Pasión Ministerial"
                style={{ width: "350px" }}
                autoSize
              />
            </div>

            <div className="my-6">
              <label>Grupo de Interés</label>
              <Input
                value={interest_group}
                onChange={handleInputInterestGroupChange}
                placeholder="Grupo de Interés"
                style={{ width: "350px" }}
              />
            </div>

            <div className="my-6">
              <label>Categorias</label>
              <GenericCategoriesSelect
                selectedCategories={categoriesList}
                setCategories={setCategories}
              />
            </div>
          </div>

          <div className="my-8 items-center flex">
            <div className="flex mx-auto">
              <ContactPhotoInput
                setPhoto={setPhoto}
                action={action}
                selectedImage={selectedImage}
              />
            </div>

            {/* --------------------------------------------------------------------------- */}
          </div>

          <hr></hr>
          <div className="my-10 flex content-center w-full ">
            <div className="flex mx-auto">
              <button
                onClick={controller}
                className="flex w-48 mx-1 px-4 py-2 hover:bg-green-400 rounded-full border border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent bg-green-500 focus:outline-none text-white"
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
                className="flex  w-48 mx-1 px-4 py-2  rounded-full border border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent bg-blue-500 focus:outline-none hover:bg-blue-400 text-white"
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

          {/* <footer>
                 <Footer/>
             </footer>  */}
        </div>
      ) : (
        <div>
          <Loading />
        </div>
      )}
    </div>
  );
};
