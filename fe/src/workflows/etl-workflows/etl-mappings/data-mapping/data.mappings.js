import React, { useEffect, useState } from "react";
import { notification } from "antd";
import api from "../../../../data";

import { Loader } from "../../../../utils/ui_helper";
import DataMappingsTable from "./data.mappings.table";

function DataMappings({ workflowId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [dataMappingsList, setDataMappingsList] = useState([{ 'toField': 'Test', 'formatType': '', 'formatting': '' }]);

  useEffect(() => {
    // loadDataMappings();
  }, []);

  function loadDataMappings() {
    setIsLoading(true);
    api.Mapping(`data-mappings?q_workflowId=${workflowId}`).Get({}, response => {
      if (response.Error == null) {
        const data = response.Data;
        setDataMappingsList(data);
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
    <div className="data-mappings">
      {isLoading && <Loader />}
      <DataMappingsTable dataMappingsList={dataMappingsList} />
    </div>
  )
}

export default DataMappings;
