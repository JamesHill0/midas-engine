import React, { useState } from "react";

import { IntegrationsImage } from "../../assets/image";

import { Card, Form, Modal, Select, Button, notification } from "antd";

import api from "../../data";
import AuthTypeBasicSfForm from "./forms/auth.type.basic.sf.form";

const { Meta } = Card;
const { Option } = Select;

function DestinationTitle() {
    return (
        <div>
            <h2>Select destination:</h2>
            This is where we do the data <b>load</b> in ETL
            <br /><br />
        </div>
    );
}

function Destination({ setSelectedMenuItem, registrationInformation, setRegistrationInformation, setIsLoading }) {
    const AUTH_TYPE_BASIC = "Basic";

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [selectedAuthType, setSelectedAuthType] = useState(AUTH_TYPE_BASIC);
    const [availableAuthTypes, setAvailableAuthTypes] = useState([]);

    function availableDestinations() {
        let destinations = [
            {
                imageSource: IntegrationsImage,
                title: "Salesforce",
                description: "https://www.salesforce.com",
                availableAuthTypes: [AUTH_TYPE_BASIC]
            }
        ]

        return destinations;
    }

    const showModal = (availableDestination) => {
        setAvailableAuthTypes(availableDestination.availableAuthTypes);
        setModalTitle(`Setup connection to ${availableDestination.title}`);
        setIsModalVisible(true);
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    }

    const handleSubmit = (values) => {
        let data = {
            "secret": {
                "type": selectedAuthType,
                "url": values["url"],
                "username": values["username"],
                "password": values["password"],
                "securityToken": values["securityToken"]
            }
        }

        let config = {
            headers: {
                "x-api-key": registrationInformation["information"]["apiKey"]
            }
        }

        setIsLoading(true);
        api
            .Integration("salesforces/test-connection", config)
            .Post(data, response => {
                setIsLoading(false);
                if (response.Error == null) {
                    notification["success"]({
                        placement: "bottomRight",
                        message: "Success",
                        description: "Connection to destination is established"
                    })
                    registrationInformation["destination"] = {
                        "type": selectedAuthType,
                        "application": "salesforce",
                        "url": values["url"],
                        "username": values["username"],
                        "password": values["password"],
                        "securityToken": values["securityToken"]
                    }
                    setRegistrationInformation(registrationInformation);
                    setSelectedMenuItem('4');
                    return
                }

                notification["error"]({
                    placement: "bottomRight",
                    message: "500",
                    description: "Internal Server Error"
                });
            })
    }

    return (
        <div>
            <DestinationTitle />
            {availableDestinations().map((availableDestination) => {
                return (
                    <Card
                        onClick={() => showModal(availableDestination)}
                        hoverable
                        className="app-picker-card"
                        cover={<img alt={availableDestination.title} src={availableDestination.imageSource} />}
                    >
                        <Meta title={availableDestination.title} description={availableDestination.description} />
                    </Card>
                )
            })}
            <Modal title={modalTitle} visible={isModalVisible} footer={null} onCancel={handleCancel}>
                <Form
                    onFinish={handleSubmit}
                >
                    <Form.Item label="" name="authType">
                        Auth Type
                        <Select defaultValue={AUTH_TYPE_BASIC} onChange={(value) => setSelectedAuthType(value)}>
                            {availableAuthTypes.map((authType) => {
                                return <Option value={authType}>{authType}</Option>
                            })}
                        </Select>
                    </Form.Item>

                    {selectedAuthType == AUTH_TYPE_BASIC && <div>
                        <AuthTypeBasicSfForm />
                    </div>}

                    <br />
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Establish Connection
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default Destination;
