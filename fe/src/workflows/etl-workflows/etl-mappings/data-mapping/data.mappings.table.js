import React, { useState } from "react";
import { Table, Space, notification } from "antd";

const FORMAT_TYPE_OPTIONS = [
  {
    value: "date",
    label: "DATE"
  },
  {
    value: "number",
    label: "NUMBER"
  },
  {
    value: "ssn",
    label: "SSN"
  },
  {
    value: "to_upper",
    label: "TO UPPERCASE"
  },
  {
    value: "to_lower",
    label: "TO LOWERCASE"
  },
  {
    value: "capitalize",
    label: "CAPITALIZE"
  },
  {
    value: "conversion",
    value: "DIRECT CONVERSION"
  }
]

function DataMappingsTable({ dataMappingsList }) {
  const columns = [
    {
      title: 'Outgoing Field',
      dataIndex: 'toField',
      key: 'toField'
    },
    {
      title: 'Format Type',
      dataIndex: 'formatType',
      key: 'formatType'
    },
    {
      title: 'Formatting',
      dataIndex: 'formatting',
      key: 'formatting',
      render: item => {
        if (item.formatType == 'conversion') {
          return 'NOT APPLICABLE';
        } else {
          return item.formatType;
        }
      }
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
    <div>
      <Table columns={columns} dataSource={dataMappingsList} />
    </div>
  )
}

export default DataMappingsTable;
