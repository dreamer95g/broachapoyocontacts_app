import { CATEGORIES } from "../../graphql/queries/CategoriesQueries";
import { CONTACT_BY_CATEGORY } from "../../graphql/queries/ContactsQueries";

import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useLazyQuery, useQuery } from "@apollo/client";
import { ContactCard } from "./ContactCard";
import { Loading } from "../ui/Loading";
import { startLoadingAction, finishLoadingAction } from "../../actions/ui";
import { useDispatch, useSelector } from "react-redux";
import { apollo_client } from "../../config/apollo";
export const MainSearch = ({ history }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.ui);

  const { data: categoriesFromServer } = useQuery(CATEGORIES);

  const [getContactsByCategory, { data: contacts }] =
    useLazyQuery(CONTACT_BY_CATEGORY);

  let OPTIONS =
    categoriesFromServer !== undefined ? categoriesFromServer.categories : [];

  const [selectedItems, setSelectedItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [contactsFounded, setContactsFounded] = useState([]);
  const [showEmptyMessage, setShowEmptyMessage] = useState(false);

  const handleChange = (selectedItems) => {
    // console.log(selectedItems);
    setSelectedItems(selectedItems);
  };

  const filteredOptions = OPTIONS.filter(
    (search) => !selectedItems.includes(search)
  );

  const getCategoryIdsFromSelectedItems = (selectedItems) => {
    let categoriesId = [];

    selectedItems.forEach((name) => {
      OPTIONS.forEach((element) => {
        if (element.name === name) {
          categoriesId.push(element.id);
        }
      });
    });

    return categoriesId;
  };

  const search = () => {
    dispatch(startLoadingAction());
    setContactsFounded([]);
    getContactsByCategory({
      variables: {
        categories: categories,
      },
    });
  };

  const refetch = async () => {
    await apollo_client.refetchQueries({
      include: [CATEGORIES],
    });
    dispatch(finishLoadingAction());
  };

  useEffect(() => {
    if (contacts !== undefined) {
      // console.log(contacts);

      const contactsFound = contacts.contactByCategory;

      const cts = contactsFound.length !== 0 ? contactsFound : [];

      // console.log(cts);

      if (cts.length !== 0) {
        cts.forEach((cont) => {
          const { id, name, categories } = cont;

          let cats = [];

          if (categories.length !== 0) {
            categories.forEach((c) => {
              cats.push(`#${c.name}`);
            });
          }

          const elem = {
            id: id,
            name: name,
            categories: cats,
          };
          setContactsFounded((contactsFounded) => [...contactsFounded, elem]);
        });
      } else {
        setShowEmptyMessage(true);
      }

      dispatch(finishLoadingAction());
    }
    dispatch(finishLoadingAction());
  }, [contacts]);

  useEffect(() => {
    const cats = getCategoryIdsFromSelectedItems(selectedItems);
    setCategories(cats);
    // console.log(categories);
    setContactsFounded([]);
    setShowEmptyMessage(false);
  }, [selectedItems]);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (categoriesFromServer !== undefined) {
      OPTIONS = categoriesFromServer.categories;
    }
  }, [categoriesFromServer]);

  return (
    <div className=" border-2 border-gray-50 overflow-hidden animate__animated animate__fadeIn container px-8 py-4 mx-auto bg-white rounded-lg shadow-lg dark:bg-gray-800">
      <div className="text-center font-semibold text-2xl my-4">
        Búsquedas de Contactos por Categorías
      </div>
      <div className=" flex content-center my-8">
        <div className="flex mx-auto">
          <Select
            mode="multiple"
            placeholder="Seleccione las Categorias"
            value={selectedItems}
            onChange={handleChange}
            style={{ width: "350px", borderRadius: "10px" }}
            dropdownStyle={{ borderRadius: "5px" }}
          >
            {filteredOptions.map((item) => (
              <Select.Option key={item.id} value={item.name}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
          <button
            onClick={search}
            className="flex w-16 mx-auto h-8 px-1 py-1 text-center hover:bg-blue-400 rounded-md border border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent bg-blue-500 focus:outline-none text-white"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 content-center mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>
      <br />

      {!loading ? (
        <div className="card-columns">
          {contactsFounded.length !== 0 &&
            contactsFounded.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                history={history}
              />
            ))}
          {showEmptyMessage === true ? (
            <h1 className="text-center text-2xl">
              No se encontraron resultados
            </h1>
          ) : (
            contactsFounded.length !== 0 && (
              <div className="flex content-center ">
                <div className="flex mx-auto cursor-default">
                  <h1 className=" text-lg my-7 mx-1 text-center">
                    Se encontraron
                  </h1>
                  <h1 className="text-blue-700 text-lg my-7 mx-1 text-center">{`${contactsFounded.length}`}</h1>
                  <h1 className="text-lg my-7 mx-1 text-center">contactos</h1>
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <Loading className="my-5" />
      )}
      <br />
      <br />
    </div>
  );
};
