import React, { useEffect, useState } from "react";
import { notification } from "antd";
import api from "../../../../data";

import { Loader } from "../../../../utils/ui_helper";

function PriorityFieldMapping({ workflowId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [priorityFieldMappingsList, setPriorityFieldMappingsList] = useState({})

  useEffect(() => {
    loadPriorityFieldMappings();
  }, []);

  function loadPriorityFieldMappings() {
    setIsLoading(true);
    api.Mapping(`priority-field-mappings?q_workflow_id=${workflowId}`).Get({}, response => {
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

  return (
    <div className="priority-field-mappings">
      {isLoading && <Loader />}
    </div>
  )
}

export default PriorityFieldMapping;
