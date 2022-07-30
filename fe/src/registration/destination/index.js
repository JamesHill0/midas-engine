import React, { useState } from "react";

import { IntegrationsImage } from "../../assets/image";

import { Card, Form, Modal, Select, Button } from "antd";
import AuthTypeBasicSfForm from "./forms/auth.type.basic.sf.form";

const { Meta } = Card;
const { Option } = Select;

function DestinationTitle() {
    return (
        <div>
            <h2>Select destination:</h2>
            This is where we do the data <b>load</b> in ETL
            <br/><br/>
        </div>
    );
}

function Destination() {
    const AUTH_TYPE_BASIC = "Basic";

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [selectedAuthType, setSelectedAuthType] = useState(AUTH_TYPE_BASIC);
    const [availableAuthTypes, setAvailableAuthTypes] = useState([]);

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 4 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
        },
    }
    const tailFormItemLayout = {
        wrapperCol: {
            xs: {
                span: 24,
                offset: 0,
            },
            sm: {
                span: 16,
                offset: 4,
            },
        },
    }

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
                "basic": {
                    "domain": values["domain"],
                    "username": values["username"],
                    "password": values["password"]
                }
            }
        }

        api
            .Integration("salesforce")
            .Post(data, response => {
                if (response.Error == null) {
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
            <Modal title={modalTitle} visible={isModalVisible} okButtonProps={{ disabled: true }} onCancel={handleCancel}>
                <Form {...formItemLayout}
                    onFinish={handleSubmit}
                >
                    <Form.Item label="Auth Type" name="authType">
                        <Select defaultValue={AUTH_TYPE_BASIC} onChange={(value) => setSelectedAuthType(value)}>
                            {availableAuthTypes.map((authType) => {
                                return <Option value={authType}>{authType}</Option>
                            })}
                        </Select>
                    </Form.Item>

                    {selectedAuthType == AUTH_TYPE_BASIC && <div>
                        <AuthTypeBasicSfForm />
                    </div>}

                    <Form.Item {...tailFormItemLayout}>
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
