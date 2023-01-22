import React from "react";
import { navigateToUrl } from "single-spa";
import { Space, Table, Tag } from "antd";

function EtlViewDataTable({ dataList, toggleAccountMappingStatus }) {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Current Job',
      dataIndex: 'currentJob',
      key: 'currentJob',
      render: item => {
        let color = "gray";

        return (
          <Tag color={color} key={item}>
            {item}
          </Tag>
        )
      }
    },
    {
      title: 'Result',
      dataIndex: 'result',
      key: 'result',
      render: (data) => {
        const components = [];
        if (data != "") {
          const obj = JSON.parse(data);
          for (const key in obj) {
            let value = "N/A";
            if (obj[key]) {
              value = obj[key];
            }
            components.push(<Tag>{key} : {value}</Tag>);
          }
        }
        return components;
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: item => (
        <Space size="middle">
          {<a onClick={() => toggleAccountMappingStatus(item.id, 'extract')}>Extract</a>}
          {<a onClick={() => toggleAccountMappingStatus(item.id, 'transform')}>Transform</a>}
          {<a onClick={() => toggleAccountMappingStatus(item.id, 'load')}>Load</a>}
        </Space>
      )
    }
  ]

  return (
    <Table
      rowKey={'id'}
      columns={columns}
      dataSource={dataList}
      expandable={{
        expandedRowRender: (record) => {
          let mappings = [];
          record.mappings.map((mapping) => {
            if (mapping.toField == '') {
              mapping.toField = 'Not Mapped'
            }
            mappings.push(<p>
              <b>Attribute:</b> {mapping.fromField} = {mapping.toField}
              <br />
              <b>Value:</b> {mapping.fromData}
            </p>)
          })
          return <div>{mappings}</div>;
        }
      }}
    />
  )
}

export default EtlViewDataTable;
