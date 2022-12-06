import React from "react";
import { useState } from "react";
import { Layout } from "antd";

import { Loader } from "../../utils/ui_helper";
import LoadTable from "./load.table";

const { Content } = Layout;

function Load() {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div>
            { isLoading && <Loader/> }
            <Layout>
                <LoadTable loadList={[]} />
            </Layout>
        </div>
    )
}

export default Load;
