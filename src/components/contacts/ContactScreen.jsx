import { CONTACT_BY_ID } from "../../graphql/queries/ContactsQueries";
import { url_base } from "../../config/app";

import React, { useMemo, useEffect, useState } from "react";
import { useParams, Redirect } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { notification } from "antd";
import { startLoadingAction, finishLoadingAction } from "../../actions/ui";
import { Loading } from "../ui/Loading";
import { useDispatch, useSelector } from "react-redux";

export const ContactScreen = ({ history }) => {
  const { id } = useParams();

  const [getContactById, { data: contact }] = useLazyQuery(CONTACT_BY_ID);

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
  const [photo, setPhoto] = useState("");
  const [categories, setCategories] = useState([]);

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.ui);

  useEffect(() => {
    getContactById({
      variables: {
        id: id,
      },
    });

    dispatch(startLoadingAction());
  }, []);

  useEffect(() => {
    if (!contact) {
      return <Redirect to="/dashboard/contacts" />;
    }

    const recipe = contact.contact;

    if (recipe !== null) {
      // console.table(recipe);

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
      } = recipe;

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

      const img = images.length !== 0 ? images[0].name : "";

      setPhoto(img);

      const catgrs =
        categories.length !== 0
          ? categories.map((category) => {
              return category.name;
            })
          : [];

      setCategories(catgrs);

      dispatch(finishLoadingAction());
    }
  }, [contact]);

  const goBack = () => {
    history.push("/dashboard/contacts");
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
                <h1 className="text-2xl mx-3 ">Tarjeta de Contacto</h1>
                <h1 className="  text-2xl font-semibold text-blue-700 mx-1 ">{`${name}`}</h1>
              </div>
            </div>
            <hr></hr>
            <div>
              {photo !== "" && (
                <div className="">
                  <img
                    className="animate__animated animate__fadeIn w-40 h-40 rounded-full my-6  mx-auto content-center"
                    alt="Avatar"
                    src={photo}
                  />
                  <hr></hr>
                </div>
              )}
            </div>

            <div className="grid grid-flow-col grid-cols-3 gap-4 my-8 mx-4">
              <div className="">
                <blockquote className="my-5 mx-5 px-5 py-5 ">
                  <div className="content-center flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mx-auto my-1 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                      />
                    </svg>
                    {/* <h1 className="mx-auto text-xl text-center">Dni </h1> */}
                  </div>

                  <p className="text-xl font-semibold text-blue-700 text-center">
                    {dni}
                  </p>
                </blockquote>
              </div>
              <div className="">
                <blockquote className="my-5 mx-5 px-5 py-5">
                  <div className="content-center flex ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mx-auto h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>

                  {/* <h1 className="text-xl text-center">Teléfono </h1> */}
                  <p className="text-xl font-semibold text-blue-700 text-center">
                    {phone}
                  </p>
                </blockquote>
              </div>
              <div className="">
                <blockquote className="my-5 mx-5 px-5 py-5">
                  <div className="content-center flex ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mx-auto h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  {/* <h1 className="text-xl text-center">Correo </h1> */}
                  <p className="text-xl text-center font-semibold text-blue-700">
                    {email}
                  </p>
                </blockquote>
              </div>
            </div>

            {/* ----------------------------------------------------------------- */}
            <hr></hr>
            <div className="grid grid-flow-col grid-cols-3 gap-4 my-auto mx-4">
              <div className=" my-auto">
                <blockquote className="my-5 mx-5 px-5 py-5">
                  <h1 className="text-2xl text-center">Familia </h1>
                  <p className="text-sm text-center font-semibold">{family}</p>
                </blockquote>
              </div>
              <div className=" my-auto">
                <blockquote className="my-5 mx-5 px-5 py-5">
                  <h1 className="text-2xl text-center">Lugar </h1>
                  <p className="text-sm text-center font-semibold">{place}</p>
                </blockquote>
              </div>
              <div className=" my-auto">
                <blockquote className="my-5 mx-5 px-5 py-5">
                  <h1 className="text-2xl text-center">Area Ministerial </h1>
                  <p className="text-sm text-center font-semibold">
                    {ministerial_area}
                  </p>
                </blockquote>
              </div>
            </div>

            <hr></hr>
            {/* ----------------------------------------------------------------- */}

            <div className="grid grid-flow-col grid-cols-3 gap-4 my-8 mx-4">
              <div className=" my-auto">
                <blockquote className="my-5 mx-5 px-5 py-5">
                  <h1 className="text-2xl text-center">Descripción</h1>
                  <p className="text-sm text-center font-semibold">
                    {description}
                  </p>
                </blockquote>
              </div>

              <div className=" my-auto">
                <blockquote className="my-5 mx-5 px-5 py-5">
                  <h1 className="text-2xl text-center">Compromiso con Apoyo</h1>
                  <p className="text-sm text-center font-semibold">
                    {commitment}
                  </p>
                </blockquote>
              </div>

              <div className=" my-auto">
                <blockquote className="my-5 mx-5 px-5 py-5">
                  <h1 className="text-2xl text-center">Profesión</h1>
                  <p className="text-sm text-center font-semibold">
                    {profession}
                  </p>
                </blockquote>
              </div>
            </div>
            <hr></hr>
            {/* ----------------------------------------------------------------- */}
            <div className="grid grid-flow-col grid-cols-3 gap-4 my-auto mx-4">
              <div className=" my-auto">
                <blockquote className="my-5 mx-5 px-5 py-5">
                  <h1 className="text-2xl text-center">Categoría Vocacional</h1>
                  <p className="text-sm text-center font-semibold">
                    {vocational_category}
                  </p>
                </blockquote>
              </div>

              <div className=" my-auto">
                <blockquote className="my-5 mx-5 px-5 py-5">
                  <h1 className="text-2xl text-center">Pasión Ministerial</h1>
                  <p className="text-sm text-center font-semibold">
                    {ministerial_passion}
                  </p>
                </blockquote>
              </div>

              <div className=" my-auto">
                <blockquote className="my-5 mx-5 px-5 py-5">
                  <h1 className="text-2xl text-center">
                    Grupo o Etnia de Interés
                  </h1>
                  <p className="text-sm text-center font-semibold">
                    {interest_group}
                  </p>
                </blockquote>
              </div>
            </div>
            <hr></hr>
            {/* ----------------------------------------------------------------- */}
            <div className="grid grid-flow-col grid-cols-3 gap-4 my-8 mx-4">
              <div className="">
                <blockquote className="my-5 mx-5 px-5 py-5">
                  <h1 className="text-2xl text-center">Nota Adicional</h1>
                  <p className="text-sm text-center font-semibold">
                    {additional_note}
                  </p>
                </blockquote>
              </div>

              <div className="">
                <blockquote className="my-5 mx-5 px-5 py-5">
                  <h1 className="text-2xl text-center">Categorías</h1>
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
                  className="flex w-48 h-11 mx-1 px-4 py-2 rounded-full border text-white border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent bg-indigo-500 hover:bg-indigo-400  focus:outline-none "
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
                <button
                  onClick={() => {
                    history.push("/dashboard/search");
                  }}
                  className="flex w-48 h-11 mx-1 px-4 py-2 rounded-full border text-white border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent bg-blue-500 hover:bg-blue-400  focus:outline-none "
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
                      d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="mx-1">Buscar</span>
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
