import React, { useState } from "react";

import { IntegrationsImage } from "../../assets/image";

import { Card, Form, Modal, Select, Button, Input } from "antd";

import api from "../../data";
import AuthTypeBasicForm from "./forms/auth.type.basic.form";

const { Meta } = Card;
const { Option } = Select;

function SourceTitle() {
    return (
        <div>
            <h2>Select source:</h2>
            This is where we do the data <b>extraction</b> in ETL
            <br/><br/>
        </div>
    );
}

function Source() {
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

    const availableSources = () => {
        let sources = [
            {
                imageSource: IntegrationsImage,
                title: "SmartFile",
                description: "https://www.smartfile.com",
                availableAuthTypes: [AUTH_TYPE_BASIC]
            }
        ]

        return sources;
    }

    const showModal = (availableSource) => {
        setAvailableAuthTypes(availableSource.availableAuthTypes);
        setModalTitle(`Setup connection to ${availableSource.title}`);
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
                    "username": values["username"],
                    "password": values["password"]
                }
            }
        }

        api
            .Integration("smartfiles")
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
            <SourceTitle />
            {availableSources().map((availableSource) => {
                return (
                    <Card
                        onClick={() => showModal(availableSource)}
                        hoverable
                        className="app-picker-card"
                        cover={<img alt={availableSource.title} src={availableSource.imageSource} />}
                    >
                        <Meta title={availableSource.title} description={availableSource.description} />
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
                        <AuthTypeBasicForm />
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

export default Source;
