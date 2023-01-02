import React, { useState } from "react";
import { Breadcrumb } from "antd";
import api from "../../../data";

import { Loader } from "../../../utils/ui_helper";
import { navigateToUrl } from "single-spa";

function EtlMappings() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="etl-mappings">
      {isLoading && <Loader />}
      <Breadcrumb separator=">">
        <Breadcrumb.Item><a onClick={() => navigateToUrl(`/workflows/etl-workflows`)}>ETL Workflows</a></Breadcrumb.Item>
      </Breadcrumb>
      <br />
    </div>
  )
}

export default EtlMappings;
