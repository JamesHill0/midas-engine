import React, { useEffect, useState } from "react";
import { Breadcrumb, notification } from "antd";
import api from "../../../data";

import { Loader } from "../../../utils/ui_helper";
import { navigateToUrl } from "single-spa";
import EtlViewDataTable from "./etl.view.data.table";

function EtlViewData() {
  const [isLoading, setIsLoading] = useState(false);
  const [workflowName, setWorkflowName] = useState("");
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    getWorkflowName();
    loadDataList();
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

  function loadDataList() {
    setIsLoading(true);
    api.Mapping(`accounts?q_workflowId=${getWorkflowId()}`).Get({}, response => {
      if (response.Error == null) {
        const data = response.Data;
        setDataList(data);
        setIsLoading(false);
        return;
      }

      notification["error"]({
        placement: "bottomRight",
        message: "500",
        description: "Internal Server Error"
      })
      setIsLoading(false);
    });
  }

  return (
    <div className="etl-view-data">
      {isLoading && <Loader />}
      <Breadcrumb separator=">">
        <Breadcrumb.Item><a onClick={() => navigateToUrl(`/workflows/etl-workflows`)}>ETL Workflows</a></Breadcrumb.Item>
        <Breadcrumb.Item>{workflowName}</Breadcrumb.Item>
        <Breadcrumb.Item>View Data</Breadcrumb.Item>
      </Breadcrumb>
      <br />
      <EtlViewDataTable dataList={dataList} />
    </div>
  )
}

export default EtlViewData;
