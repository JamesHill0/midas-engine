import React, { useEffect, useState } from "react";
import { Breadcrumb, notification } from "antd";
import api from "../../data";

import { Loader } from "../../utils/ui_helper";
import EtlWorkflowsTable from "./etl.workflows.table";

function EtlWorkflows() {
  const [isLoading, setIsLoading] = useState(false);
  const [workflowsList, setWorkflowsList] = useState([]);

  useEffect(() => {
    loadWorkflows();
  }, []);

  function loadWorkflows() {
    setIsLoading(true);
    api.Mapping("workflows").Get({}, response => {
      if (response.Error == null) {
        const data = response.Data;
        setWorkflowsList(data);
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
    <div className="etl-workflows">
      {isLoading && <Loader />}
      <Breadcrumb separator=">">
        <Breadcrumb.Item>ETL Workflows</Breadcrumb.Item>
      </Breadcrumb>
      <br/>
      <EtlWorkflowsTable workflowsList={workflowsList} />
    </div>
  )
}

export default EtlWorkflows;
