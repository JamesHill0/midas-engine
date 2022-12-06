import React, { useState } from "react";
import { navigateToUrl } from "single-spa";
import { Space, Button, Result, notification } from "antd";

import api from "../../data";
import CompanyInformationDescription from "./company.information.description";
import SourceDescription from "./source.description";
import DestinationDescription from "./destination.description";
import UserDescription from "./user.description";

function Confirmation({ registrationInformation, setIsLoading }) {
    const [isConfirmed, setIsConfirmed] = useState(false);

    function handleConfirmation() {
        let config = {
            headers: {
                "x-api-key": registrationInformation["information"]["apiKey"]
            }
        }

        setIsLoading(true);
        Promise.allSettled([createSource(config), createDestination(config)]).then(() => {
            setIsLoading(false);
            setIsConfirmed(true);
        }).catch(() => {
            notification["error"]({
                placement: "bottomRight",
                message: "500",
                description: "Failed to create integrations"
            });
        })
    }

    function createSource(config) {
        return new Promise((resolve, reject) => {
            let source = registrationInformation["source"];

            switch (source["application"]) {
                case "smartfile":
                    api.Integration("smartfiles", config)
                        .Post({
                            "status": "new",
                            "secret": {
                                "type": source["type"],
                                "basic": {
                                    "username": source["username"],
                                    "password": source["password"]
                                }
                            }
                        }, response => {
                            if (response.Error == null) {
                                resolve();
                                return
                            }

                            reject(new Error("reject"));
                            return;
                        })
                default:
                    reject(new Error("reject"));
                    return;
            }
        })
    }

    function createDestination(config) {
        return new Promise((resolve, reject) => {
            let destination = registrationInformation["destination"];

            switch (destination["application"]) {
                case "salesforce":
                    api.Integration("salesforces", config)
                        .Post({
                            "status": "new",
                            "secret": {
                                "username": destination["username"],
                                "password": destination["password"],
                                "url": destination["url"],
                                "securityToken": destination["securityToken"]
                            }
                        }, response => {
                            if (response.Error == null) {
                                resolve();
                                return;
                            }

                            reject(new Error("reject"));
                            return;
                        })
                default:
                    reject(new Error("reject"));
                    return;
            }
        })
    }

    return (
        <div>
            {!isConfirmed && <ConfirmationInfo registrationInformation={registrationInformation} handleConfirmation={handleConfirmation} />}
            {isConfirmed && <ConfirmationResult registrationInformation={registrationInformation} />}
        </div>
    );
}

function ConfirmationInfo({ registrationInformation, handleConfirmation }) {
    return <div>
        <CompanyInformationDescription registrationInformation={registrationInformation} />
        <SourceDescription registrationInformation={registrationInformation} />
        <DestinationDescription registrationInformation={registrationInformation} />
        <UserDescription registrationInformation={registrationInformation} />
        <br />
        <Space size="middle">
            <Button onClick={() => handleConfirmation()} type="primary" htmlType="submit">
                Confirm
            </Button>
        </Space>
    </div>
}

function ConfirmationResult({ registrationInformation }) {
    const information = registrationInformation["information"];

    return <Result
        status="success"
        title="Successfully created an account"
        subTitle={`Click the button below to return to login, You may use account number ${information["number"]} and the user you created to login`}
        extra={
            [
                <Button onClick={() => navigateToUrl("/")} type="primary">
                    Go to Login
                </Button>
            ]
        }
    />
}

export default Confirmation;
