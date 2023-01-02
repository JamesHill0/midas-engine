import React, { useEffect, useState } from "react";
import { Breadcrumb, notification } from "antd";
import api from "../../../data";

import { Loader } from "../../../utils/ui_helper";
import EtlSubworkflowsTable from "./etl.subworkflows.table";
import { navigateToUrl } from "single-spa";

function EtlSubworkflows() {
  const [isLoading, setIsLoading] = useState(false);
  const [workflowName, setWorkflowName] = useState("");
  const [subworkflowsList, setSubworkflowsList] = useState([]);

  useEffect(() => {
    getWorkflowName();
    loadSubworkflows();
  }, []);

  function getWorkflowId() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    return urlParams.get("id");
  }

  function getWorkflowName() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    setWorkflowName(urlParams.get("name"));
  }

  function loadSubworkflows() {
    setIsLoading(true);
    const workflowId = getWorkflowId();
    api.Mapping(`subworkflows?q_workflowId=${workflowId}`).Get({}, response => {
      if (response.Error == null) {
        const data = response.Data;
        setSubworkflowsList(data);
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
    <div className="etl-sub-workflows">
      {isLoading && <Loader />}
      <Breadcrumb separator=">">
        <Breadcrumb.Item><a onClick={() => navigateToUrl(`/workflows/etl-workflows`)}>ETL Workflows</a></Breadcrumb.Item>
        <Breadcrumb.Item>{workflowName}</Breadcrumb.Item>
        <Breadcrumb.Item>Subworkflows</Breadcrumb.Item>
      </Breadcrumb>
      <br/>
      <EtlSubworkflowsTable subworkflowsList={subworkflowsList} />
    </div>
  )
}

export default EtlSubworkflows;
