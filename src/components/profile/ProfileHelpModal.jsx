import React, { useState, useEffect } from "react";
import { Modal, Button, Input, notification } from "antd";
import { url_base } from "../../config/app";

export const ProfileHelpModal = ({ show, setShowHelpModal }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [name, setName] = useState("");
  const [title, setTitle] = useState(
    `Broach Apoyo Contacts ${new Date().getFullYear()}`
  );

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setShowHelpModal(false);
  };

  // METODO QUE LANZA LAS NOTIFICACIONES
  const openNotification = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setShowHelpModal(false);
  };

  const handleInputNameChange = ({ target }) => {
    setName(target.value);
    setCategoryName(name);
  };

  useEffect(() => {
    if (show) {
      showModal();
    }
  }, [show]);

  return (
    <>
      <Modal
        title={title}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <div>
            <h1 className="text-md text-center">
              Cualquier duda contactar con el{" "}
              <a className="text-blue-700 hover:no-underline hover:text-blue-500">
                @admin
              </a>
            </h1>
            <h1 className="text-md text-center">
              Email:{" "}
              <a className="text-blue-700 hover:underline hover:text-blue-500">
                gabry95g@gmail.com
              </a>
            </h1>
          </div>,
        ]}
        style={{ textAlign: "center" }}
      >
        <div>
          <img
            className="w-32 h-32 mx-auto content-center my-auto rounded-full cursor-pointer"
            src={`${url_base}assets/images/apoyo_cuba.5fbeaca6.jpg`}
            alt="brand"
          />
          {/* <hr className="my-4 "></hr> */}
        </div>
        {/* <Input
          placeholder="Categoria"
          value={name}
          onChange={handleInputNameChange}
          onPressEnter={handleOk}
        /> */}
      </Modal>
    </>
  );
};
