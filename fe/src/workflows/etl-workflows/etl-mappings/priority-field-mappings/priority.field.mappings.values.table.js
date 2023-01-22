import React from "react";
import { Space, Table } from "antd";

function PriorityFieldMappingValuesTable({ priorityFieldMapping }) {
  const columns = [
    {
      title: 'Incoming Field',
      key: 'toField'
    },
    {
      title: 'Level',
      key: 'level'
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
      dataSource={priorityFieldMapping.values}
    />
  )
}

export default PriorityFieldMappingValuesTable;
