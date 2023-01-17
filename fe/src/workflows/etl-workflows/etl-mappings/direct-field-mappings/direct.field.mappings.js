import React, { useEffect, useState } from "react";
import { notification } from "antd";
import api from "../../../../data";

import { Loader } from "../../../../utils/ui_helper";

function DirectFieldMappings({ workflowId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [directFieldMappingsList, setDirectFieldMappingsList] = useState({})

  useEffect(() => {
    loadDirectFieldMappings();
  }, []);

  function loadDirectFieldMappings() {
    setIsLoading(true);
    api.Mapping(`direct-field-mappings?q_workflowId=${workflowId}`).Get({}, response => {
      if (response.Error == null) {
        const data = response.Data;
        setDirectFieldMappingsList(data);
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
    <div className="direct-field-mappings">
      {isLoading && <Loader />}
    </div>
  )
}

export default DirectFieldMappings;
