import React, { useState } from "react";
import { Breadcrumb } from "antd";
import api from "../../../data";

import { Loader } from "../../../utils/ui_helper";
import { navigateToUrl } from "single-spa";

function EtlViewData() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="etl-view-data">
      {isLoading && <Loader />}
      <Breadcrumb separator=">">
        <Breadcrumb.Item><a onClick={() => navigateToUrl(`/workflows/etl-workflows`)}>ETL Workflows</a></Breadcrumb.Item>
      </Breadcrumb>
      <br />
    </div>
  )
}

export default EtlViewData;
