import React, { useEffect, useState } from "react";
import { notification } from "antd";
import api from "../../../../data";

import { Loader } from "../../../../utils/ui_helper";
import PriorityFieldMappingsTable from "./priority.field.mappings.table";

function PriorityFieldMappings({ workflowId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [priorityFieldMappingsList, setPriorityFieldMappingsList] = useState([]);
  const [fieldsList, setFieldsList] = useState([]);

  useEffect(() => {
    loadPriorityFieldMappings();
    loadFieldsList();
  }, []);

  function loadPriorityFieldMappings() {
    setIsLoading(true);
    api.Mapping(`priority-field-mappings?q_workflowId=${workflowId}`).Get({}, response => {
      if (response.Error == null) {
        const data = response.Data;
        setPriorityFieldMappingsList(data);
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

  function loadFieldsList() {
    setIsLoading(true);
    api.Mapping(`accounts/getFields?q_workflowId=${workflowId}`).Post({}, response => {
      if (response.Error == null) {
        const datas = response.Data;
        setFieldsList(datas);
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
    <div className="priority-field-mappings">
      {isLoading && <Loader />}
      <PriorityFieldMappingsTable
        setIsLoading={setIsLoading}
        priorityFieldMappingsList={priorityFieldMappingsList}
        fieldsList={fieldsList}
      />
    </div>
  )
}

export default PriorityFieldMappings;
