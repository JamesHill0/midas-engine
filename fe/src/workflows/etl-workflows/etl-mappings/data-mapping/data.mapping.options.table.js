import React from "react";
import { Table, Space, notification } from "antd";

import api from "../../../../data";

function DataMappingOptionsTable({ dataMapping }) {
  function handleDeleteDataMappingOption(id) {
    api.Mapping(`data-mapping-options/${id}`).Delete({}, response => {
      console.log(response);
      if (response.Error == null) {
        notification["success"]({
          placement: "bottomRight",
          message: "200",
          description: `data mapping option has been deleted successfully!`
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
      title: 'From Data',
      dataIndex: 'fromData',
      key: 'fromData'
    },
    {
      title: 'To Data',
      dataIndex: 'toData',
      key: 'toData'
    },
    {
      title: 'Action',
      key: 'action',
      render: item => (
        <Space size="middle">
          {<a onClick={() => handleDeleteDataMappingOption(item.id)}>Delete</a>}
        </Space>
      )
    }
  ]

  return (
    <Table
      rowKey={'id'}
      columns={columns}
      dataSource={dataMapping.options}
    />
  )
}

export default DataMappingOptionsTable;
