import React from "react";
import { useState } from "react";
import { Layout } from "antd";

import { Loader } from "../../utils/ui_helper";
import TransformTable from "./transform.table";

const { Content } = Layout;

function Transform() {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div>
            { isLoading && <Loader/> }
            <Layout>
                <TransformTable transformList={[]} />
            </Layout>
        </div>
    )
}

export default Transform;
