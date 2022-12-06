import React from "react";
import { Descriptions } from "antd";

function UserDescription({ registrationInformation }) {
    const users = registrationInformation["users"];
    return (
        <Descriptions title="User">
            <Descriptions.Item label="Username">{users["username"]}</Descriptions.Item>
            <Descriptions.Item label="Status">{users["status"]}</Descriptions.Item>
        </Descriptions>
    );
}

export default UserDescription;
