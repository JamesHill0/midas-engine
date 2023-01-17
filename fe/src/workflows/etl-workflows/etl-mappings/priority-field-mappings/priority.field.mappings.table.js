import React from "react";
import { Table, Space } from "antd";

function PriorityFieldMappingsTable({ setIsLoading, priorityFieldMappingsList, fieldsList }) {
  const columns = [
    {
      title: 'Outgoing Field',
      dataIndex: 'fromField',
      key: 'fromField'
    },
    {
      title: 'Action',
      key: 'action',
      render: item => (
        <Space size="middle">
          <a>Setup</a>
        </Space>
      )
    }
  ]

  return (
    <Table columns={columns} dataSource={priorityFieldMappingsList} />
  )
}

export default PriorityFieldMappingsTable;
