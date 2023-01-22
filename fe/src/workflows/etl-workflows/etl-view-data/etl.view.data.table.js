import React from "react";
import { navigateToUrl } from "single-spa";
import { Space, Table, Tag } from "antd";

function EtlViewDataTable({ dataList }) {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Current Job',
      dataIndex: 'currentJob',
      key: 'currentJob'
    },
    {
      title: 'Protected',
      dataIndex: 'protected',
      key: 'protected'
    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={dataList}
      // expandable={{
      //   expandedRowRender: (record) => {

      //   },
      //   rowExpandable: true
      // }}
    />
  )
}

export default EtlViewDataTable;
