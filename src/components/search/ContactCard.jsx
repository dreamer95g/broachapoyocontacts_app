import React, { useEffect } from "react";

export const ContactCard = ({ history, contact }) => {
  useEffect(() => {
    //console.log(contact);
  }, []);
  return (
    <div className="animate__animated animate__fadeIn inline-block mx-3 border-2 border-gray-50 max-w-sm p-6 m-auto my-5 bg-white rounded-md shadow-lg dark:bg-gray-800">
      <h1
        className="text-2xl text-center cursor-pointer hover:text-blue-700"
        onClick={() => {
          if (contact.id !== undefined) {
            const { id } = contact;
            history.push(`/dashboard/contacts/view/${id}`);
          }
        }}
      >
        {contact !== undefined && contact.name}
      </h1>
      <div className="text-md font-semibold text-center">
        {(contact !== undefined && contact.categories.length) !== 0 &&
          contact.categories.map((category, i) => {
            return (
              <p
                key={i}
                className="text-blue-700 inline-block mx-2"
              >{`${category}`}</p>
            );
          })}
      </div>
    </div>
  );
};
