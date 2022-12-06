import React from "react";
import { useState } from "react";
import { Layout } from "antd";

import { Loader } from "../../utils/ui_helper";
import ExtractTable from "./extract.table";

const { Content } = Layout;

function Extract() {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div>
            { isLoading && <Loader/> }
            <Layout>
                <ExtractTable extractList={[]} />
            </Layout>
        </div>
    )
}

export default Extract;
