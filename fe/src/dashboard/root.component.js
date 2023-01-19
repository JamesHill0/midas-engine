import React, { useState, useEffect } from "react";
import { Col, Row, Card, Statistic } from "antd";
import { Loader } from "../utils/ui_helper";
import api from "../data";

import { toLocal } from "../utils/common";

import DashboardControlPanel from "./dashboard.control.panel";
import DashboardWorkflowsTable from "./dashboard.workflows.table";

function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [intervals, setIntervals] = useState([]);
  const [workflowsList, setWorkflowsList] = useState([]);
  const [config, setConfig] = useState({
    messages: {
      extract: {
        status: "stopped",
        logs: "Initializing script logs...\n",
        updated: ""
      },
      transform: {
        status: "stopped",
        logs: "Initializing script logs...\n",
        updated: ""
      },
      load: {
        status: "stopped",
        logs: "Initializing script logs...\n",
        updated: ""
      }
    }
  })

  useEffect(() => {
    loadData();
    loadWorkflows();
  }, []);

  function loadData() {
    let interval = setInterval(() => {
      loadLoggingData(`extract`);
      loadLoggingData(`transform`);
      loadLoggingData(`load`);
    }, 15000);

    intervals.push(interval);
    setIntervals(intervals);
  }

  function loadLoggingData(logger) {
    api.Logger(`apps?q_name=${logger}`).Get({}, response => {
      if (response.Error == null) {
        let data = response.Data;
        config.messages[logger].logs = [];
        if (data.length > 0) {
          data.map((d) => {
            config.messages[logger].logs += `[ ${d.type} ][ ${toLocal(d.Created)}] ${d.message}\n`;
          });
        }

        setConfig(config);
      }
    })
  }

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

  function toggleWorkflowStatus(workflowId, status) {
    setIsLoading(true);

    if (status == "inactive") {
      status = "active";
    } else if (status == "active") {
      status = "inactive";
    }

    api.Mapping(`workflows/${workflowId}`).Patch({ "status": status }, response => {
      if (response.Error == null) {
        loadWorkflows();
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
    < div className="dashboard" >
      {isLoading && <Loader />}
      <Row gutter={10}>
        <Col span={12}>
          <DashboardWorkflowsTable workflowsList={workflowsList} toggleWorkflowStatus={toggleWorkflowStatus} />
        </Col>
        <Col span={12}>
          <DashboardControlPanel title={"ETL - Extract"} message={config.messages.extract} />
        </Col>
        <Col span={12}>
          <DashboardControlPanel title={"ETL - Transform"} message={config.messages.transform} />
        </Col>
        <Col span={12}>
          <DashboardControlPanel title={"ETL - Load"} message={config.messages.load} />
        </Col>
      </Row>
    </div >
  )
}

export default Dashboard;
