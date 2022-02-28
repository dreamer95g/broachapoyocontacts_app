import { CATEGORIES } from "../../graphql/queries/CategoriesQueries";

import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useLazyQuery } from "@apollo/client";

export const GenericCategoriesSelect = ({
  setCategories,
  selectedCategories,
}) => {
  const [getCategories, { data: categoriesFromServer }] =
    useLazyQuery(CATEGORIES);

  let OPTIONS =
    categoriesFromServer !== undefined ? categoriesFromServer.categories : [];

  const [selectedItems, setSelectedItems] = useState([]);

  const handleChange = (selectedItems) => {
    // console.log(selectedItems)
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

  useEffect(() => {
    const categories = getCategoryIdsFromSelectedItems(selectedItems);

    setCategories(categories);
  }, [selectedItems]);

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    const selectedItms = selectedCategories.map((cat) => {
      return cat.name;
    });

    setSelectedItems(selectedItms);
  }, [selectedCategories]);

  useEffect(() => {
    if (categoriesFromServer !== undefined) {
      OPTIONS = categoriesFromServer.categories;
    }
  }, [categoriesFromServer]);

  return (
    <div>
      <Select
        mode="multiple"
        placeholder="Seleccione las Categorías"
        value={selectedItems}
        onChange={handleChange}
        style={{ width: "350px" }}
      >
        {filteredOptions.map((item) => (
          <Select.Option key={item.id} value={item.name}>
            {item.name}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};
