import React from "react";
import { Descriptions } from "antd";

function DestinationDescription({ registrationInformation }) {
    const destination = registrationInformation["destination"];

    return (
        <Descriptions title="Destination">
            <Descriptions.Item label="Application">{destination["application"]}</Descriptions.Item>
            <Descriptions.Item label="Auth Type">{destination["type"]}</Descriptions.Item>
            <Descriptions.Item label="Url">{destination["url"]}</Descriptions.Item>
            <Descriptions.Item label="Username">{destination["username"]}</Descriptions.Item>
            <Descriptions.Item label="Password">{destination["password"] ? "*****" : ""}</Descriptions.Item>
            <Descriptions.Item label="Security Token">{destination["securityToken"] ? "*****" : ""}</Descriptions.Item>
        </Descriptions>
    )
}

export default DestinationDescription;
