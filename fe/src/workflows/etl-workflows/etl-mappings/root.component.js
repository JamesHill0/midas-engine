import React, { useEffect, useState } from "react";
import { Breadcrumb, Tabs } from "antd";
import api from "../../../data";

import { Loader } from "../../../utils/ui_helper";
import { navigateToUrl } from "single-spa";

import PriorityFieldMapping from "./priority-field-mappings/priority.field.mappings";

const TabPane = Tabs.TabPane;

function EtlMappings() {
  const [isLoading, setIsLoading] = useState(false);
  const [workflow, setWorkflow] = useState({});

  useEffect(() => {
    loadWorkflow();
  }, []);

  function getWorkflowId() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    return urlParams.get("id");
  }

  function loadWorkflow() {
    setIsLoading(true);
    api.Mapping(`workflows/${getWorkflowId()}`).Get({}, response => {
      if (response.Error == null) {
        const data = response.Data;
        setWorkflow(data);
        setIsLoading(false);
        return;
      }

      notification["error"]({
        placement: "bottomRight",
        message: "500",
        description: "Internal Server Error"
      })
      setIsLoading(false);
    })
  }

  return (
    <div className="etl-mappings">
      {isLoading && <Loader />}
      <Breadcrumb separator=">">
        <Breadcrumb.Item><a onClick={() => navigateToUrl(`/workflows/etl-workflows`)}>ETL Workflows</a></Breadcrumb.Item>
        <Breadcrumb.Item>{workflow.name}</Breadcrumb.Item>
        <Breadcrumb.Item>Mappings</Breadcrumb.Item>
      </Breadcrumb>
      <br />
      <Tabs type="card">
        { workflow.mappingType == "direct-mapping" && <TabPane tab="Direct Mapping" key="1">Content of Tab Pane 1</TabPane> }
        { workflow.mappingType == "priority-mapping" && <TabPane tab="Priority Mapping" key="2"><PriorityFieldMapping workflowId={workflow.id}/></TabPane> }
        { workflow.needDataMapping && <TabPane tab="Data Mapping" key="3">Content of Tab Pane 3</TabPane> }
      </Tabs>
    </div>
  )
}

export default EtlMappings;
