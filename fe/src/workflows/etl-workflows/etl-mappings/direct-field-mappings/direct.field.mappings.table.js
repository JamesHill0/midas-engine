import React from "react";
import { Table } from "antd";

function DirectFieldMappingsTable({ dataMappingsList }) {
  const columns = [
    {
      title: 'Outgoing Field',
      dataIndex: 'fromField',
      key: 'fromField'
    },
    {
      title: 'Incoming Field',
      dataIndex: 'toField',
      key: 'toField'
    }
  ]

  return (
    <Table columns={columns} dataSource={dataMappingsList} />
  )
}

export default DirectFieldMappingsTable;
