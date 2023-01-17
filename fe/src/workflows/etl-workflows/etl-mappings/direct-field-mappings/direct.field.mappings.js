import React, { useEffect, useState } from "react";
import { notification } from "antd";
import api from "../../../../data";

import { Loader } from "../../../../utils/ui_helper";
import DirectFieldMappingsTable from "./direct.field.mappings.table";

function DirectFieldMappings({ workflowId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [directFieldMappingsList, setDirectFieldMappingsList] = useState([])
  const [fieldsList, setFieldsList] = useState([])

  useEffect(() => {
    loadDirectFieldMappings();
    loadFieldsList();
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

  function loadFieldsList() {
    setIsLoading(true);
    api.Mapping(`accounts?q_workflowId=${workflowId}`).Get({}, response => {
      if (response.Error == null) {
        const datas = response.Data;

        let mappings = [];
        datas.map((account) => {
          account.mappings.map((mapping) => {
            mappings.push(mapping['fromField']);
          })
        })

        setFieldsList(mappings);
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
      <DirectFieldMappingsTable
        setIsLoading={setIsLoading}
        directFieldMappingsList={directFieldMappingsList}
        fieldsList={fieldsList}
      />
    </div>
  )
}

export default DirectFieldMappings;
