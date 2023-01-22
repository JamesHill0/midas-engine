import React from "react";
import { Space, Table, notification } from "antd";
import api from "../../../../data";

function PriorityFieldMappingValuesTable({ priorityFieldMapping }) {
  function handleDeletePriorityFieldMappingValue(id) {
    api.Mapping(`priority-field-mapping-values/${id}`).Delete({}, response => {
      console.log(response);
      if (response.Error == null) {
        notification["success"]({
          placement: "bottomRight",
          message: "200",
          description: `priority field mapping value has been deleted successfully!`
        })
        window.location.reload();
        return;
      }

      notification["error"]({
        placement: "bottomRight",
        message: "500",
        description: "Internal Server Error"
      })
    })
  }

  const columns = [
    {
      title: 'Incoming Field',
      dataIndex: 'toField',
      key: 'toField'
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level'
    },
    {
      title: 'Action',
      key: 'action',
      render: item => (
        <Space size="middle">
          {<a onClick={() => handleDeletePriorityFieldMappingValue(item.id)}>Delete</a>}
        </Space>
      )
    }
  ]

  return (
    <Table
      rowKey={'id'}
      columns={columns}
      dataSource={priorityFieldMapping.values}
    />
  )
}

export default PriorityFieldMappingValuesTable;
