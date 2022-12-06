import React from "react";
import { FormOutlined, DatabaseOutlined, UserOutlined, CheckSquareOutlined } from "@ant-design/icons";
import { Steps } from "antd";

import {
    INFORMATION_KEY, INFORMATION_LABEL,
    SOURCE_KEY, SOURCE_LABEL,
    DESTINATION_KEY, DESTINATION_LABEL,
    CONFIRMATION_KEY, CONFIRMATION_LABEL, USER_LABEL, USER_KEY,
} from "./shared/selected.menu.item";

const { Step } = Steps;

function RegistrationStepper({ selectedMenuItem }) {
    function status() {
        switch (selectedMenuItem) {
            case INFORMATION_KEY:
                return 0;
            case SOURCE_KEY:
                return 1;
            case DESTINATION_KEY:
                return 2;
            case USER_KEY:
                return 3;
            default:
                return 4;
        }
    }

    return (
        <Steps className="steps" current={status()}>
            <Step title={INFORMATION_LABEL} icon={<FormOutlined />} />
            <Step title={SOURCE_LABEL} icon={<DatabaseOutlined />} />
            <Step title={DESTINATION_LABEL} icon={<DatabaseOutlined />} />
            <Step title={USER_LABEL} icon={<UserOutlined />} />
            <Step title={CONFIRMATION_LABEL} icon={<CheckSquareOutlined />} />
        </Steps>
    )
}

export default RegistrationStepper;
