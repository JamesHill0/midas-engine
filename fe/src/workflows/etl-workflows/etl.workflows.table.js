import React from "react";
import { navigateToUrl } from "single-spa";
import { Space, Table, Tag } from "antd";

function EtlWorkflowsTable({ workflowsList }) {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: item => {
        let color = "green";
        switch (item) {
          case "inactive":
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
      title: 'Field Mapping',
      dataIndex: 'mappingType',
      key: 'mappingType'
    },
    {
      title: 'Data Mapping',
      dataIndex: 'needDataMapping',
      key: 'needDataMapping',
      render: item => {
        switch (item) {
          case false:
            return (
              <Tag color={"red"} key={item}>
                Disabled
              </Tag>
            )
          default:
            return (
              <Tag color={"green"} key={item}>
                Enabled
              </Tag>
            )
        }
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: item => (
        <Space size="middle">
          {<a>Toggle Status</a>}
          {<a onClick={() => navigateToUrl(`/workflows/etl-mappings`)}>Mapping</a>}
          {<a onClick={() => navigateToUrl(`/workflows/etl-sub-workflows?id=${item.id}&name=${item.name}`)}>Subworkflows</a>}
          {<a onClick={() => navigateToUrl(`/workflows/etl-view-data`)}>View Data</a>}
        </Space>
      )
    }
  ]

  return (
    <Table columns={columns} dataSource={workflowsList} />
  )
}

export default EtlWorkflowsTable;
