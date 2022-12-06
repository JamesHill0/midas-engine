import React from "react";
import { Descriptions } from "antd";

function SourceDescription({ registrationInformation }) {
    const source = registrationInformation["source"];

    return (
        <Descriptions title="Source">
            <Descriptions.Item label="Application">{source["application"]}</Descriptions.Item>
            <Descriptions.Item label="Auth Type">{source["type"]}</Descriptions.Item>
            <Descriptions.Item label="Username">{source["username"]}</Descriptions.Item>
            <Descriptions.Item label="Password">*****</Descriptions.Item>
        </Descriptions>
    )
}

export default SourceDescription;
