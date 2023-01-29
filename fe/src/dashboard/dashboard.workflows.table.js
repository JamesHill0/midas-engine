import React from "react";
import { Card, Table, Tag } from "antd";

function DashboardWorkflowsTable({ workflowsList }) {
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
      key: 'mappingType',
      render: item => {
        if (item == 'priority-mapping') {
          return 'Priority Mapping'
        } else if (item == 'direct-mapping') {
          return 'Direct Mapping'
        }
      }
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
  ]

  return (
    <Card style={{ margin: "5px" }}>
      <Table columns={columns} dataSource={workflowsList} />
    </Card>
  )
}

export default DashboardWorkflowsTable;
