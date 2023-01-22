import React, { useState, useEffect } from "react";
import { Col, Row, Card, Statistic } from "antd";
import { Loader } from "../utils/ui_helper";
import api from "../data";

import { capitalize, toLocal } from "../utils/common";

import DashboardControlPanel from "./dashboard.control.panel";
import DashboardWorkflowsTable from "./dashboard.workflows.table";

let initialMessage = {
  status: "stopped",
  logs: "Initializing script logs...\n",
  updated: ""
}

function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [intervals, setIntervals] = useState([]);
  const [workflowsList, setWorkflowsList] = useState([]);
  const [extract, setExtract] = useState(initialMessage);
  const [transform, setTransform] = useState(initialMessage);
  const [load, setLoad] = useState(initialMessage);

  useEffect(() => {
    loadData();
    loadExtractLogs();
    loadTransformLogs();
    loadLoadLogs();
    loadWorkflows();
  }, []);

  function loadData() {
    let interval = setInterval(() => {
      loadExtractLogs();
      loadTransformLogs();
      loadLoadLogs();
    }, 15000);

    let newIntervals = intervals;
    newIntervals.push(interval);
    setIntervals(newIntervals);
  }

  function loadExtractLogs() {
    api.Logger(`apps?q_name=extract`).Get({}, response => {
      if (response.Error == null) {
        let data = response.Data;
        let newConfig = extract;
        newConfig.logs = [];
        if (data.length > 0) {
          data.map((d) => {
            newConfig.logs += `[ ${d.type.toUpperCase()} ][ ${toLocal(d.created)}] ${d.message}\n`;
          });

          setExtract(newConfig);
        }
      }
    })
  }

  function loadTransformLogs() {
    api.Logger(`apps?q_name=transform`).Get({}, response => {
      if (response.Error == null) {
        let data = response.Data;
        let newConfig = transform;
        newConfig.logs = [];
        if (data.length > 0) {
          data.map((d) => {
            newConfig.logs += `[ ${d.type.toUpperCase()} ][ ${toLocal(d.created)}] ${d.message}\n`;
          });

          setTransform(newConfig);
        }
      }
    })
  }

  function loadLoadLogs() {
    api.Logger(`apps?q_name=load`).Get({}, response => {
      if (response.Error == null) {
        let data = response.Data;
        let newConfig = load;
        newConfig.logs = [];
        if (data.length > 0) {
          data.map((d) => {
            newConfig.logs += `[ ${d.type.toUpperCase()} ][ ${toLocal(d.created)}] ${d.message}\n`;
          });

          setLoad(newConfig);
        }
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
          <DashboardControlPanel title={"ETL - Extract"} message={extract} />
        </Col>
        <Col span={12}>
          <DashboardControlPanel title={"ETL - Transform"} message={transform} />
        </Col>
        <Col span={12}>
          <DashboardControlPanel title={"ETL - Load"} message={load} />
        </Col>
      </Row>
    </div >
  )
}

export default Dashboard;
