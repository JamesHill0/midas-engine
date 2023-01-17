import React from "react";
import { Table, Select, notification } from "antd";
import api from "../../../../data";
function DirectFieldMappingsTable({ setIsLoading, directFieldMappingsList, fieldsList }) {
  function handleChange(id, value) {
    setIsLoading(true);
    api.Mapping(`direct-field-mappings/${id}`).Patch({ 'toField': value }, response => {
      if (response.Error == null) {
        notification["success"]({
          placement: "bottomRight",
          message: "200",
          description: "Direct Field Mapping updated successfully!"
        })
        setIsLoading(false);
        return;
      }

      notification["error"]({
        placement: "bottomRight",
        message: "500",
        description: "Internal Server Error"
      })
      setIsLoading(false);
    })
  }

  const columns = [
    {
      title: 'Outgoing Field',
      dataIndex: 'fromField',
      key: 'fromField'
    },
    {
      title: 'Map to Field',
      dataIndex: 'toField',
      key: 'toField',
      render: item => {
        <Select
          defaultValue={item.toField}
          onChange={(value) => handleChange(item.id, value)}
          options={fieldsList}
        ></Select>
      }
    },
  ]

  return (
    <Table columns={columns} dataSource={directFieldMappingsList} />
  )
}

export default DirectFieldMappingsTable;
