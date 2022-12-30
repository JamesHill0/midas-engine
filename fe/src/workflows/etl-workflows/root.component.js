import React, { useEffect, useState } from "react";
import { notification } from "antd";
import api from "../../data";

import { Loader } from "../../utils/ui_helper";

function EtlWorkflows() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {

  }, []);

  return (
    <div className="etl-workflows">
      {isLoading && <Loader />}
    </div>
  )
}

export default EtlWorkflows;
