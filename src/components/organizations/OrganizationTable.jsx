import React, { useState, useEffect } from "react";
import { Table, Input, Space, Button, Tag } from "antd";
// import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
export const OrganizationTable = ({
  organizationList,
  setSelectedIds,
  categoryFilter,
  contactFilter,
  placeFilter,
}) => {
  let searchInput = "";

  const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder={`Busqueda`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            // onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            size="small"
            style={{ width: 90 }}
          >
            Limpiar
          </Button>
        </Space>
      </div>
    ),

    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),

    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",

    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },

    render: (text) => {
      return text;
    },
    // state.searchedColumn === dataIndex ? (
    //   <Highlighter
    //     highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
    //     searchWords={[state.searchText]}
    //     autoEscape
    //     textToHighlight={text ? text.toString() : ""}
    //   />
    // ) : (
    //   text
    // ),
  });

  const columns = [
    {
      title: "Nombre",
      dataIndex: "name",
      ...getColumnSearchProps("name"),
      defaultSortOrder: "descend",
      sorter: (a, b) => a.name.length - b.name.length,
    },

    {
      title: "Representantes",
      dataIndex: "contacts",
      filters: contactFilter,

      onFilter: (value, record) => record.contacts.includes(value),
      width: "25%",
      filterSearch: true,

      render: (tags) => (
        <>
          {tags !== undefined &&
            tags.length !== 0 &&
            tags.map((tag) => {
              let color = "green";

              return (
                <Tag color={color} key={tag}>
                  {tag.toUpperCase()}
                </Tag>
              );
            })}
        </>
      ),
    },
    {
      title: "Lugar",
      dataIndex: "place",
      filters: placeFilter,

      onFilter: (value, record) => record.place.includes(value),
      width: "25%",
      filterSearch: true,
    },

    {
      title: "Categorías",
      dataIndex: "categories",
      filters: categoryFilter,

      onFilter: (value, record) => record.categories.includes(value),
      width: "25%",
      filterSearch: true,

      render: (tags) => (
        <>
          {tags !== undefined &&
            tags.length !== 0 &&
            tags.map((tag) => {
              let color = "geekblue";
              return (
                <Tag color={color} key={tag}>
                  {tag.toUpperCase()}
                </Tag>
              );
            })}
        </>
      ),
    },
  ];

  const [data, setData] = useState([]);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);

      if (selectedRows.length !== 0) {
        let selecteds = [];
        selectedRows.forEach((element) => {
          const { key } = element;
          // console.log(key);

          selecteds.push(parseInt(key));
        });

        setSelectedIds(selecteds);
      }
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  const selectionType = "checkbox";

  const initialState = {
    searchText: "",
    searchedColumn: "",
  };

  const [state, setState] = useState(initialState);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();

    setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setState({ searchText: "" });
  };

  function onChange(pagination, filters, sorter, extra) {
    //console.log("params", pagination, filters, sorter, extra);
  }

  useEffect(() => {
    if (organizationList !== undefined) {
      setData(organizationList);
      // console.table(data);
    }

    return () => {
      setData([]);
    };
  }, [organizationList]);

  return (
    <div className="overflow-hidden">
      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
        onChange={onChange}
      />
    </div>
  );
};
