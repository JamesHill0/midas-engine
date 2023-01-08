import React, { useEffect, useState } from "react";
import { Breadcrumb, Tabs } from "antd";
import api from "../../../data";

import { Loader } from "../../../utils/ui_helper";
import { navigateToUrl } from "single-spa";

function EtlMappings() {
  const [isLoading, setIsLoading] = useState(false);
  const [workflowName, setWorkflowName] = useState("");

  useEffect(() => {
    getWorkflowName();
  }, []);

  function getWorkflowName() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    setWorkflowName(urlParams.get("name"));
  }


  return (
    <div className="etl-mappings">
      {isLoading && <Loader />}
      <Breadcrumb separator=">">
        <Breadcrumb.Item><a onClick={() => navigateToUrl(`/workflows/etl-workflows`)}>ETL Workflows</a></Breadcrumb.Item>
        <Breadcrumb.Item>{workflowName}</Breadcrumb.Item>
        <Breadcrumb.Item>Mappings</Breadcrumb.Item>
      </Breadcrumb>
      <br />
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: `Tab 1`,
            key: '1',
            children: `Content of Tab Pane 1`,
          },
          {
            label: `Tab 2`,
            key: '2',
            children: `Content of Tab Pane 2`,
          },
          {
            label: `Tab 3`,
            key: '3',
            children: `Content of Tab Pane 3`,
          },
        ]}
      />
    </div>
  )
}

export default EtlMappings;
