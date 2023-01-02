import React, { useState } from "react";
import api from "../data";

import { Loader } from "../utils/ui_helper";

function Mappings() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="mapping">
      {isLoading && <Loader />}
      <br />
    </div>
  )
}

export default Mappings;
