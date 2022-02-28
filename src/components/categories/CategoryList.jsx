import { Loading } from "../ui/Loading";
import { startLoadingAction, finishLoadingAction } from "../../actions/ui";
import { CATEGORIES } from "../../graphql/queries/CategoriesQueries";
import {
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
  DELETE_CATEGORIES,
  CREATE_CATEGORY,
} from "../../graphql/mutation/NomenclatorsMutations";

import { CategoryTable } from "./CategoryTable";

import { apollo_client } from "../../config/apollo";

import React, { useState, useEffect } from "react";
import { useMutation, useLazyQuery, useQuery } from "@apollo/client";
import { notification, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { CategoryModal } from "./CategoryModal";
import { data } from "autoprefixer";

export const CategoryList = ({ history }) => {
  const [categories, setCategories] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  const [action, setAction] = useState("");
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.ui);

  const { data: categoriesFromServer } = useQuery(CATEGORIES);

  const [updateCategory] = useMutation(UPDATE_CATEGORY);
  const [deleteCategory] = useMutation(DELETE_CATEGORY);
  const [deleteCategories] = useMutation(DELETE_CATEGORIES);
  const [createCategory] = useMutation(CREATE_CATEGORY);

  const refetchCategories = async () => {
    await apollo_client.refetchQueries({
      include: [CATEGORIES],
    });
    dispatch(finishLoadingAction());
  };

  // METODO QUE LANZA LAS NOTIFICACIONES
  const openNotification = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
    });
  };

  const fillContactsData = (categoriesFromServer) => {
    setCategories([]);

    categoriesFromServer.forEach((category) => {
      //const { categories } = contact;

      // console.table(category);

      const record = {
        key: category.id,
        name: category.name,
      };

      setCategories((categories) => [...categories, record]);
    });

    //  console.log("Este es contact List")
    // console.log(contactList)
  };

  const saveCategory = async (name) => {
    if (name !== "") {
      try {
        await createCategory({
          variables: {
            name: name,
          },
        }).then((data) => {
          refetchCategories();
          openNotification(
            "success",
            "Categoría agregada",
            `La categoría ${name} fue agregada satisfactoriamente`
          );
        });
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  const modifyCategory = async (name) => {
    if (selectedIds.length !== 0) {
      if (name !== "") {
        try {
          await updateCategory({
            variables: {
              id: selectedIds[0],
              name: name,
            },
          }).then((data) => {
            refetchCategories();
            openNotification(
              "success",
              "Categoría modificada",
              `La categoría ${name} fue modificada satisfactoriamente`
            );
          });
        } catch (error) {
          console.log(error.message);
        }
      }
    } else {
      openNotification(`success`, `Atencion!`, `Selecione una Categoría!!!`);
    }
  };

  const removeCategory = async () => {
    notification.destroy();
    if (selectedIds.length === 1) {
      dispatch(startLoadingAction());
      await deleteCategory({
        variables: {
          id: selectedIds[0],
        },
      }).then((data) => {
        refetchCategories();
        openNotification(
          "success",
          "Categoría eliminada",
          `La categoría fue eliminada satisfactoriamente`
        );
        //dispatch(finishLoadingAction());
      });
    } else if (selectedIds.length > 1) {
      // console.log(selectedIds);
      dispatch(startLoadingAction());
      try {
        await deleteCategories({
          variables: {
            ids: selectedIds,
          },
        }).then((data) => {
          // console.log(data);
          openNotification(
            "success",
            "Categoría eliminada",
            `Las categorías fueron eliminadas satisfactoriamente`
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
      openNotification("warning", "Atencion!!", `Seleccione una categoría!!`);
    }
  };

  const clean = () => {
    setSelectedIds([]);
    setCategories([]);
    refetchCategories();
  };

  const openNotificationDelete = () => {
    if (selectedIds.length !== 0) {
      const key = `open${Date.now()}`;

      const btn = (
        <Button
          type="danger"
          onClick={removeCategory}
          style={{ borderRadius: "100px" }}
        >
          Confirmar
        </Button>
      );
      notification.open({
        message: "Atencion!",
        description: "Esta seguro que desea eliminar la categoría?",
        btn,
        key,
      });
    } else {
      openNotification(
        "warning",
        "Atencion!",
        "Debe seleccionar al menos una categoría!"
      );
    }
  };

  useEffect(() => {
    dispatch(startLoadingAction());
    refetchCategories();
  }, []);
  useEffect(() => {
    if (categoriesFromServer !== undefined) {
      const { categories } = categoriesFromServer;
      //console.table(categories);
      fillContactsData(categories);
    }
  }, [categoriesFromServer]);

  return (
    <div className="border-2 border-gray-50 overflow-hidden animate__animated animate__fadeIn container px-8 py-4 mx-auto bg-white rounded-lg shadow-xl dark:bg-gray-800">
      {loading === false ? (
        <div>
          <h1 className="flex text-2xl my-2">
            <p className="mx-2 ">Lista de categorías</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className=" my-2 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
          </h1>
          <hr className="w-1/4"></hr>

          <div className="flex mx-auto my-8">
            <button
              className="flex mx-1 px-4 py-2  rounded-full border border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent bg-green-500 hover:bg-green-400  focus:outline-none text-white"
              type="button"
              onClick={() => {
                setShowModal(true);
                setAction("save");
              }}
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
              onClick={() => {
                if (selectedIds.length !== 0) {
                  if (categories.length !== 0) {
                    const cat = categories.filter((cat) => {
                      return cat.key == selectedIds[0];
                    });

                    if (cat.length !== 0) {
                      const { name } = cat[0];

                      setCategoryName(name);
                      setAction("update");
                      setShowModal(true);
                    }
                  }
                } else {
                  openNotification(
                    "warning",
                    "Atencion!",
                    "Debe seleccionar una categoría!"
                  );
                }
              }}
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
              onClick={() => {
                openNotificationDelete();
              }}
              className="flex mx-1 px-4 py-2  rounded-full border border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent bg-red-500 hover:bg-red-400 focus:outline-none text-white"
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
            {categories.length !== 0 ? (
              <CategoryTable
                categoriesList={categories}
                setSelectedIds={setSelectedIds}
                className="my-6"
              />
            ) : (
              <div className="mx-auto my-6 content-center text-center animate__animated animate__fadeIn">
                <h1 className=" text-xl text-center my-4">
                  No hay categorías en la base de datos aun.
                </h1>
                <p
                  onClick={() => {
                    setShowModal(true);
                    setAction("save");
                  }}
                  className="animate-pulse font-semibold text-2xl cursor-pointer text-md text-blue-700 text-center content-center my-4  hover:underline"
                >
                  Agregar Categoría +
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Loading className="my-10" />
      )}
      <CategoryModal
        action={action}
        show={showModal}
        setCategoryName={setCategoryName}
        category={categoryName}
        setShowModal={setShowModal}
        saveCategory={saveCategory}
        modifyCategory={modifyCategory}
      />
    </div>
  );
};
