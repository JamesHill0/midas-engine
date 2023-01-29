import React, { useState } from "react";
import { Table, Space, Select, notification, Drawer, Input } from "antd";

import DataMappingOptionsTable from "./data.mapping.options.table";
import DataMappingForm from "./data.mapping.form";
import api from "../../../../data";

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
  const [selectedDataMapping, setSelectedDataMapping] = useState({});
  const [drawerTitle, setupDrawerTitle] = useState('');

  function showAddOptionDrawer(item) {
    setupDrawerTitle(`Setup Data Mapping for ${item.toField}`);
    setSelectedDataMapping(item);
    setSetupDrawer(true);
  }

  function closeAddOptionDrawer() {
    setupDrawerTitle('');
    setSetupDrawer(false);
  }

  function handleUpdateFormatType(item, value) {
    api.Mapping(`data-mappings/${item.id}`).Patch({ "formatType": value }, response => {
      if (response.Error == null) {
        notification["success"]({
          placement: "bottomRight",
          message: "200",
          description: `Data mapping for ${item.toField} format type has been updated!`
        })
        window.location.reload();
        return
      }

      notification["error"]({
        placement: "bottomRight",
        message: "500",
        description: "Internal Server Error"
      })
    })
  }

  function handleUpdateFormatting(item, value) {
    api.Mapping(`data-mappings/${item.id}`).Patch({ "formatting": value }, response => {
      if (response.Error == null) {
        notification["success"]({
          placement: "bottomRight",
          message: "200",
          description: `Data mapping for ${item.toField} formatting has been updated!`
        })
        window.location.reload();
        return
      }

      notification["error"]({
        placement: "bottomRight",
        message: "500",
        description: "Internal Server Error"
      })
    })
  }

  function handleRemoveMapping(item) {
    api.Mapping(`data-mappings/${item.id}`).Patch({ "formatType": "", "formatting": "" }, response => {
      if (response.Error == null) {
        notification["success"]({
          placement: "bottomRight",
          message: "200",
          description: `Data mapping for ${item.toField} has been removed!`
        })
        window.location.reload();
        return
      }

      notification["error"]({
        placement: "bottomRight",
        message: "500",
        description: "Internal Server Error"
      })
    })
  }

  const columns = [
    {
      title: 'Outgoing Field',
      dataIndex: 'toField',
      key: 'toField'
    },
    {
      title: 'Format Type',
      key: 'formatType',
      render: item => {
        return <Select
          defaultValue={item.formatType}
          style={{ width: 200 }}
          onChange={(value) => handleUpdateFormatType(item, value)}
          options={FORMAT_TYPE_OPTIONS}
        />
      }
    },
    {
      title: 'Formatting',
      key: 'formatting',
      render: item => {
        if (item.formatType == null || item.formatType == '') {
          return 'UNASSIGNED'
        }

        if (!['date', 'number'].includes(item.formatType)) {
          return 'NOT APPLICABLE';
        } else {
          return <Input defaultValue={item.formatting} onBlur={(event) => handleUpdateFormatting(item, event.target.value)} />;
        }
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: item => (
        <Space size="middle">
          {(item.formatType != null && item.formatType != '') && <a onClick={() => handleRemoveMapping(item)}>Remove Mapping</a>}
          {item.formatType == 'conversion' && <a onClick={() => showAddOptionDrawer(item)}>Add Option</a>}
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
            return <DataMappingOptionsTable dataMapping={record} />
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
        onClose={closeAddOptionDrawer}
        getContainer={false}
        visible={setupDrawer}
      >
        <DataMappingForm closeAddOptionDrawer={closeAddOptionDrawer} dataMapping={selectedDataMapping} />
      </Drawer>
    </div>
  )
}

export default DataMappingsTable;
