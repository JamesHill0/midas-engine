import React, { useEffect, useState } from "react";
import { Collapse, notification } from "antd";
import api from "../../data";

import { Loader } from "../../utils/ui_helper";

const { Panel } = Collapse;

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
      <Collapse defaultActiveKey={['1']}>
        <Panel header="This is panel header 1" key="1">
        </Panel>
        <Panel header="This is panel header 2" key="2">
        </Panel>
        <Panel header="This is panel header 3" key="3">
        </Panel>
      </Collapse>
    </div>
  )
}

export default EtlWorkflows;
