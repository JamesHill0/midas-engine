import React from "react";
import { navigateToUrl } from "single-spa";
import { Space, Table, Tag } from "antd";

function EtlSubworkflowsTable({ subworkflowsList }) {
  const columns = [
    {
      title: 'Job Type',
      dataIndex: 'jobType',
      key: 'jobType'
    },
    {
      title: 'Integration Type',
      dataIndex: 'integrationType',
      key: 'integrationType'
    },
    {
      title: 'Related Table Name',
      dataIndex: 'tableName',
      key: 'tableName'
    },
  ]

  return (
    <Table columns={columns} dataSource={subworkflowsList} />
  )
}

export default EtlSubworkflowsTable;
