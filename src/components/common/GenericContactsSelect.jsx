import { CONTACTS } from "../../graphql/queries/ContactsQueries";

import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useLazyQuery } from "@apollo/client";

export const GenericContactsSelect = ({ setContacts, selectedContacts }) => {
  const [getContacts, { data: contactsFromServer }] = useLazyQuery(CONTACTS);

  let OPTIONS =
    contactsFromServer !== undefined ? contactsFromServer.contacts : [];

  const [selectedItems, setSelectedItems] = useState([]);

  const handleChange = (selectedItems) => {
    // console.log(selectedItems)
    setSelectedItems(selectedItems);
  };

  const filteredOptions = OPTIONS.filter(
    (search) => !selectedItems.includes(search)
  );

  const getContactsIdsFromSelectedItems = (selectedItems) => {
    let contactsId = [];

    selectedItems.forEach((name) => {
      OPTIONS.forEach((element) => {
        if (element.name === name) {
          contactsId.push(element.id);
        }
      });
    });

    return contactsId;
  };

  useEffect(() => {
    const contacts = getContactsIdsFromSelectedItems(selectedItems);
    setContacts(contacts);
  }, [selectedItems]);

  useEffect(() => {
    getContacts();
  }, []);

  useEffect(() => {
    const selectedItms = selectedContacts.map((cont) => {
      return cont.name;
    });
    setSelectedItems(selectedItms);
  }, [selectedContacts]);

  useEffect(() => {
    if (contactsFromServer !== undefined) {
      OPTIONS = contactsFromServer.contacts;
    }
  }, [contactsFromServer]);

  return (
    <div>
      <Select
        mode="multiple"
        placeholder="Seleccione los contactos"
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
