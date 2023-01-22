import React from "react";
import { Table, Space } from "antd";

function DataMappingOptionsTable({ dataMapping }) {
  const columns = [
    {
      title: 'From Data',
      key: 'fromData'
    },
    {
      title: 'To Data',
      key: 'toData'
    },
    {
      title: 'Action',
      key: 'action',
      render: item => (
        <Space size="middle">
          {<a>Delete</a>}
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
