import React from "react";
import { Table } from "antd";

function DataMappingsTable({ dataMappingsList }) {
  const columns = [
    {
      title: 'Outgoing Field',
      dataIndex: 'toField',
      key: 'toField'
    },
    {
      title: 'Data Format Type',
      dataIndex: 'formatType',
      key: 'formatType'
    }
  ]

  return (
    <Table columns={columns} dataSource={dataMappingsList} />
  )
}

export default DataMappingsTable;
