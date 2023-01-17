import React from "react";
import { Table } from "antd";

function PriorityFieldMappingsTable({ priorityFieldMappingsList }) {
  const columns = [
    {
      title: 'Outgoing Field',
      dataIndex: 'fromField',
      key: 'fromField'
    }
  ]

  return (
    <Table columns={columns} dataSource={priorityFieldMappingsList} />
  )
}

export default PriorityFieldMappingsTable;
