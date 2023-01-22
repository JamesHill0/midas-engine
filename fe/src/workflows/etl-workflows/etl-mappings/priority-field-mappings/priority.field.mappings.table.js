import React, { useState } from "react";
import { Table, Space, Drawer } from "antd";
import PriorityFieldMappingValuesTable from "./priority.field.mappings.values.table";
import PriorityFieldMappingForm from "./priority.field.mapping.form";

function PriorityFieldMappingsTable({ setIsLoading, priorityFieldMappingsList, fieldsList }) {
  const [setupDrawer, setSetupDrawer] = useState(false);
  const [selectedPriorityFieldMapping, setSelectedPriorityFieldMapping] = useState({});
  const [drawerTitle, setupDrawerTitle] = useState('');

  function showSetupDrawer(item) {
    setupDrawerTitle(`Setup Priority Mapping for ${item.fromField}`);
    setSelectedPriorityFieldMapping(item);
    setSetupDrawer(true);
  }

  function closeSetupDrawer() {
    setupDrawerTitle('');
    setSetupDrawer(false);
  }

  const columns = [
    {
      title: 'Outgoing Field',
      dataIndex: 'fromField',
      key: 'fromField'
    },
    {
      title: 'Action',
      key: 'action',
      render: item => (
        <Space size="middle">
          {<a onClick={() => showSetupDrawer(item)}>Setup</a>}
        </Space>
      )
    }
  ]

  return (
    <div>
      <Table
        rowKey={'id'}
        columns={columns}
        dataSource={priorityFieldMappingsList}
        expandable={{
          expandedRowRender: (record) => {
            return <PriorityFieldMappingValuesTable priorityFieldMapping={record} />
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
        <PriorityFieldMappingForm closeSetupDrawer={closeSetupDrawer} fieldsList={fieldsList} priorityFieldMapping={selectedPriorityFieldMapping} />
      </Drawer>
    </div>
  )
}

export default PriorityFieldMappingsTable;
