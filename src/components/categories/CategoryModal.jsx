import React, { useState, useEffect } from "react";
import { Modal, Button, Input, notification } from "antd";

export const CategoryModal = ({
  action,
  show,
  setShowModal,
  setCategoryName,
  category,
  saveCategory,
  modifyCategory,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setShowModal(false);

    if (action === "save") {
      if (name !== "") {
        saveCategory(name);
        setName("");
      } else {
        openNotification("warning", "Atencion", "Llene la categoría!!");
      }
    }

    if (action === "update") {
      if (name !== "") {
        modifyCategory(name);
        setName("");
      } else {
        openNotification("warning", "Atencion", "Llene la categoría!!");
      }
    }
  };

  // METODO QUE LANZA LAS NOTIFICACIONES
  const openNotification = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
    });
  };

  const handleCancel = () => {
    setName("");
    setCategoryName("");
    setIsModalVisible(false);
    setShowModal(false);
  };

  const handleInputNameChange = ({ target }) => {
    setName(target.value);
    setCategoryName(name);
  };

  useEffect(() => {
    if (action !== undefined) {
      if (action === "save") {
        setTitle("Agregar Categoría");
      } else {
        setTitle("Modificar Categoría");
        setName(category);
      }
    }
  }, [action]);

  useEffect(() => {
    if (show !== undefined) {
      if (show) {
        if (action === "update") {
          setTitle("Modificar Categoría");
          setName(category);
        }

        showModal();
      } else {
        setIsModalVisible(false);
      }
    }
  }, [show]);

  return (
    <>
      {/* <Button type="primary" onClick={showModal}>
        Open Modal
      </Button> */}
      <Modal
        title={title}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={handleOk}
            style={{ borderRadius: "100px" }}
          >
            {action === "save" ? `Agregar` : `Modificar`}
          </Button>,
          <Button
            key="back"
            type="danger"
            onClick={handleCancel}
            style={{ borderRadius: "100px" }}
          >
            Cancelar
          </Button>,
        ]}
      >
        <Input
          placeholder="Categoría"
          value={name}
          onChange={handleInputNameChange}
          onPressEnter={handleOk}
        />
      </Modal>
    </>
  );
};
