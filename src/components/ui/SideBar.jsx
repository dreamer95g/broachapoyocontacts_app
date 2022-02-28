import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sideVarChangeStateAction } from "../../actions/ui";
import { Link } from "react-router-dom";
import { url_base } from "../../config/app";
export const SideBar = () => {
  const dispatch = useDispatch();
  const { sideBarSate } = useSelector((state) => state.ui);

  const { email } = useSelector((state) => state.auth);
  const { name } = useSelector((state) => state.auth);
  const { photo } = useSelector((state) => state.auth);
  const [image, setImage] = useState();

  // const [sideBarSate, setSideBarSate] = useState(false);

  const sideBarChangeStatus = () => {
    //e.preventDefault();
    dispatch(sideVarChangeStateAction(!sideBarSate));

    //setSideBarSate(!sideBarSate);
  };

  useEffect(() => {
    const url = url_base;
    // setImage(`${url}assets/${photo}`);
    setImage(photo);
    //console.log(image);
  }, []);

  const hiddeSideBar = () => {
    dispatch(sideVarChangeStateAction(false));
  };

  const showAndHideSideBar = (status) => {
    const sidebar = document.getElementById("sidebar");

    if (status) {
      sidebar.classList.remove("-translate-x-full");
      sidebar.classList.remove("ease-in");

      sidebar.classList.add("translate-x-0");
      sidebar.classList.add("ease-out");
      // sidebar.setAttribute("hidden", "");
    } else {
      sidebar.classList.remove("translate-x-0");
      sidebar.classList.remove("ease-out");

      sidebar.classList.add("-translate-x-full");
      sidebar.classList.add("ease-in");
      // sidebar.setAttribute("hidden", true);
    }
  };

  useEffect(() => {
    //alert(sideBarSate);
    showAndHideSideBar(sideBarSate);
  }, [sideBarSate]);

  return (
    <>
      {
        <div
          id="sidebar"
          className="fixed z-30 inset-y-0 left-0 w-64 transition duration-700 transform flex flex-col h-screen py-8 bg-white border-r dark:bg-gray-800 dark:border-gray-600 overflow-y-auto overflow-x-hidden border-gray-300 rounded-lg "
          onClick={sideBarChangeStatus}
          onMouseLeave={hiddeSideBar}
        >
          {/* <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">
            Apoyo Cuba
          </h2> */}

          <div className="flex flex-col items-center mt-6 -mx-2">
            {
              <div>
                <img
                  className="w-32 h-32 mx-auto content-center my-auto rounded-full "
                  src={`${url_base}assets/images/apoyo_cuba.5fbeaca6.jpg`}
                  alt="brand"
                />
                <hr className="my-4 "></hr>
              </div>
            }

            {/* <h4 className="mx-2 mt-2 font-medium text-gray-800 dark:text-gray-200 ">
              {name}
            </h4>
            <p className="mx-2 mt-1 text-sm font-medium text-gray-600 dark:text-gray-400  hover:text-blue-700">
              {email}
            </p> */}
          </div>

          <div className="flex flex-col justify-between flex-1 mt-6">
            <nav>
              <Link
                to="/dashboard"
                className="flex items-center px-4 border-l-4 border-transparent hover:border-blue-500 hover:bg-gray-100 py-2 mt-5 text-gray-600 transition-colors duration-200 transform dark:text-gray-400  dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-blue-600"
                href="#"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>

                <span className="mx-4 font-medium">Inicio</span>
              </Link>
              <Link
                to="/dashboard/search"
                className="flex items-center border-l-4 border-transparent hover:border-blue-500 px-4 py-2 mt-5 text-gray-600 transition-colors duration-200 transform dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-blue-600"
                href="#"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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

                <span className="mx-4 font-medium">Busquedas</span>
              </Link>
              <Link
                to="/dashboard/contacts"
                className="flex items-center border-l-4 border-transparent hover:border-blue-500 px-4 py-2 mt-5 text-gray-600 transition-colors duration-200 transform dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-blue-600"
                href="#"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>

                <span className="mx-4 font-medium">Contactos</span>
              </Link>

              <Link
                to="/dashboard/trackings"
                className="border-l-4 border-transparent hover:border-blue-500 flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-200 transform dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-blue-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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

                <span className="mx-4 font-medium">Seguimientos</span>
              </Link>

              <Link
                className="border-l-4 border-transparent hover:border-blue-500 flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-200 transform dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-blue-700"
                to="/dashboard/missions"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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

                <span className="mx-4 font-medium">
                  Misiones Transculturales
                </span>
              </Link>
              <Link
                to="/dashboard/organizations"
                className="flex items-center border-l-4 border-transparent hover:border-blue-500 px-4 py-2 mt-5 text-gray-600 transition-colors duration-200 transform dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-blue-700"
                href="#"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>

                <span className="mx-4 font-medium">Organizaciones</span>
              </Link>

              <Link
                to="/dashboard/categories"
                className="flex items-center border-l-4 border-transparent hover:border-blue-500 px-4 py-2 mt-5 text-gray-600 transition-colors duration-200 transform dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-blue-700"
                href="#"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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

                <span className="mx-4 font-medium">Categorías</span>
              </Link>
            </nav>
          </div>
        </div>
      }
    </>
  );
};
