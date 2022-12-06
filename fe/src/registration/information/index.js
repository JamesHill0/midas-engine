import React from "react";

import { Layout, Form, Input, Button } from "antd";
import api from "../../data";

const { Content } = Layout;
const { TextArea } = Input;

function Information({ setSelectedMenuItem, registrationInformation, setRegistrationInformation, setIsLoading }) {
    function handleSubmit(values) {
        let create = {
            name: values["companyName"],
            type: "Customer",
            status: "new",
            detail: {
                name: values["companyName"],
                address: values["companyAddress"],
            },
            contacts: [
                {
                    name: values["contactName"],
                    email: values["contactEmail"],
                    number: values["contactNumber"],
                }
            ],
            secret: {
                type: "postgres",
                key: process.env.DB_SECRET
            }
        }

        setIsLoading(true);
        api
            .Account("accounts")
            .Post(create, response => {
                setIsLoading(false);
                if (response.Error == null) {
                    registrationInformation["information"] = response.Data;
                    setRegistrationInformation(registrationInformation);
                    setSelectedMenuItem('2');
                    return
                }

                notification["error"]({
                    placement: "bottomRight",
                    message: "500",
                    description: "Failed to register account"
                })
            })
    }

    return <Content className="information-content">
        <Form
            onFinish={handleSubmit}
        >
            <h3>Company Details</h3>
            Company Name*
            <Form.Item name="companyName" rules={[
                { required: true, message: "Please input your company name" }
            ]}>
                <Input placeholder="Company Name" />
            </Form.Item>
            Company Address*
            <Form.Item name="companyAddress" rules={[
                { required: true, message: "Please input your company address" }
            ]}>
                <TextArea rows={3} placeholder="Company Address" />
            </Form.Item>

            <h3>Contact Information</h3>
            Name*
            <Form.Item name="contactName" rules={[
                { required: true, message: "Please input your name" }
            ]}>
                <Input placeholder="Name" />
            </Form.Item>
            E-mail*
            <Form.Item name="contactEmail" rules={[
                { required: true, message: "Please input your email" }
            ]}>
                <Input placeholder="E-mail" />
            </Form.Item>
            Contact Number*
            <Form.Item name="contactNumber" rules={[
                { required: true, message: "Please input your contact number" }
            ]}>
                <Input placeholder="Contact Number" />
            </Form.Item>
            <br />
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Next
                </Button>
                <Button className="back-button" type="default" disabled htmlType="submit">
                    Back
                </Button>
            </Form.Item>
        </Form>
    </Content>;
}

export default Information;
