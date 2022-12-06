import React from "react";
import { Descriptions } from "antd";

function CompanyInformationDescription({ registrationInformation }) {
    const information = registrationInformation["information"];
    const informationDetail = information["detail"] != null ? information["detail"] : {};
    const informationContactDetail = information["contacts"] != null ? information["contacts"][0] : {};
    return (
        <Descriptions title="Company Information">
            <Descriptions.Item label="Company Name">{information["name"]}</Descriptions.Item>
            <Descriptions.Item label="Company Address">{informationDetail["address"]}</Descriptions.Item>
            <Descriptions.Item label="Contact Name">{informationContactDetail["name"]}</Descriptions.Item>
            <Descriptions.Item label="Contact Email">{informationContactDetail["email"]}</Descriptions.Item>
            <Descriptions.Item label="Contact Number">{informationContactDetail["number"]}</Descriptions.Item>
            <Descriptions.Item label="Account Number">{information["number"]}</Descriptions.Item>
        </Descriptions>
    );
}

export default CompanyInformationDescription;
