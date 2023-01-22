import React, { useState } from "react";
import { Table, Space, notification, Drawer } from "antd";

import DataMappingOptionsTable from "./data.mapping.options.table";
import DataMappingForm from "./data.mapping.form";

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
    label: "DIRECT CONVERSION"
  }
]

function DataMappingsTable({ dataMappingsList }) {
  const [setupDrawer, setSetupDrawer] = useState(false);
  const [drawerTitle, setupDrawerTitle] = useState('');

  function showSetupDrawer(item) {
    setupDrawerTitle(`Setup Data Mapping for ${item.toField}`);
    setSetupDrawer(true);
  }

  function closeSetupDrawer() {
    setupDrawerTitle('');
    setSetupDrawer(false);
  }

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
      key: 'formatting',
      render: item => {
        if (item.formatType == 'conversion') {
          return 'NOT APPLICABLE';
        } else {
          return item;
        }
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: item => (
        <Space size="middle">
          {<a onClick={() => showSetupDrawer(item)}>Setup</a>}
          {item.formatType != '' && <a>Remove Mapping</a>}
          {item.formatType == 'conversion' && <a>Add Option</a>}
        </Space>
      )
    }
  ]

  return (
    <div>
      <Table
        rowKey={'id'}
        columns={columns}
        dataSource={dataMappingsList}
        expandable={{
          expandedRowRender: (record) => {
            <DataMappingOptionsTable dataMapping={record} />
          },
          rowExpandable: (record) => {
            if (record.formatType == 'conversion') {
              return true;
            }
            return false;
          }
        }}
      />
      <Drawer
        title={drawerTitle}
        placement="right"
        onClose={closeSetupDrawer}
        getContainer={false}
        visible={setupDrawer}
      >
        <DataMappingForm closeSetupDrawer={closeSetupDrawer} formatTypeOptions={FORMAT_TYPE_OPTIONS} />
      </Drawer>
    </div>
  )
}

export default DataMappingsTable;
