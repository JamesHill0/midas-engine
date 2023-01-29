import React, { useState, useEffect } from "react";
import { Col, Row, Card, Statistic } from "antd";
import { Loader } from "../utils/ui_helper";
import api from "../data";

import { capitalize, toLocal } from "../utils/common";

import DashboardControlPanel from "./dashboard.control.panel";
import DashboardWorkflowsTable from "./dashboard.workflows.table";


export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      intervals: [],
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
        },
      },
      workflowsList: [],
    }
  }

  componentDidMount() {
    try {
      let { intervals } = this.state;
      this.loadData();
      let interval = setInterval(() => {
        this.loadData();
      }, 15000);
      intervals.push(interval)
      this.setState({ intervals: intervals, isLoading: false });
    } catch (e) {
      console.log(e);
    }
  }

  componentWillUnmount() {
    let { intervals } = this.state;
    intervals.map((interval) => {
      clearInterval(interval);
    });
  }

  loadData() {
    this.loadWorkflows();
    this.loadExtractLogs();
    this.loadTransformLogs();
    this.loadLoadLogs();
  }

  loadExtractLogs() {
    api.Logger(`apps?q_name=extract&limit=50`).Get({}, response => {
      if (response.Error == null) {
        let data = response.Data;
        let messages = this.state.messages;
        messages.extract.logs = [];
        if (data.length > 0) {
          data.map((d) => {
            messages.extract.logs += `[ ${d.type.toUpperCase()} ][ ${toLocal(d.created)}] ${d.message}\n`;
          });
          this.setState({ messages: messages })
        }
      }
    })
  }

  loadTransformLogs() {
    api.Logger(`apps?q_name=transform&limit=50`).Get({}, response => {
      if (response.Error == null) {
        let data = response.Data;
        let messages = this.state.messages;
        messages.transform.logs = [];
        if (data.length > 0) {
          data.map((d) => {
            messages.transform.logs += `[ ${d.type.toUpperCase()} ][ ${toLocal(d.created)}] ${d.message}\n`;
          });
          this.setState({ messages: messages })
        }
      }
    })
  }

  loadLoadLogs() {
    api.Logger(`apps?q_name=load&limit=50`).Get({}, response => {
      if (response.Error == null) {
        let data = response.Data;
        let messages = this.state.messages;
        messages.load.logs = [];
        if (data.length > 0) {
          data.map((d) => {
            messages.load.logs += `[ ${d.type.toUpperCase()} ][ ${toLocal(d.created)}] ${d.message}\n`;
          });
          this.setState({ messages: messages })
        }
      }
    })
  }

  loadWorkflows() {
    this.setState({ isLoading: true })
    api.Mapping("workflows").Get({}, response => {
      if (response.Error == null) {
        const data = response.Data;
        this.setState({ workflowsList: data, isLoading: false })
        return;
      }

      notification["error"]({
        placement: "bottomRight",
        message: "500",
        description: "Internal Server Error"
      })
      this.setState({ isLoading: false })
    })
  }

  render() {
    return (
      <div className="dashboard" >
        {this.state.isLoading && <Loader />}
        <Row gutter={10}>
          <Col span={12}>
            <DashboardWorkflowsTable workflowsList={this.state.workflowsList} />
          </Col>
          <Col span={12}>
            <DashboardControlPanel title={"ETL - Extract"} message={this.state.messages.extract} />
          </Col>
          <Col span={12}>
            <DashboardControlPanel title={"ETL - Transform"} message={this.state.messages.transform} />
          </Col>
          <Col span={12}>
            <DashboardControlPanel title={"ETL - Load"} message={this.state.messages.load} />
          </Col>
        </Row>
      </div >
    )
  }
}
