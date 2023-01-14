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
      title: 'Direction',
      dataIndex: 'direction',
      key: 'direction',
      render: item => {
        let color = "green";
        switch (item) {
          case "outgoing":
            color = "red"
            break;
          default:
            color = "green"
            break;
        }

        return (
          <Tag color={color} key={item}>
            {item}
          </Tag>
        )
      }
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
