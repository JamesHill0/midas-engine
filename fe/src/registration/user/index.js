import React from "react";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Layout, Form, Input, Button, notification } from "antd";

import api from "../../data";

const { Content } = Layout;

function User({ setSelectedMenuItem, registrationInformation, setRegistrationInformation, setIsLoading }) {
    function handleSubmit(values) {
        let create = {
            username: values["username"],
            password: values["password"],
            status: "active"
        }

        let config = {
            headers: {
                "x-api-key": registrationInformation["information"]["apiKey"]
            }
        }

        setIsLoading(true);
        api.Authorization("users", config)
        .Post(create, response => {
            setIsLoading(false);
            if (response.Error == null) {
                registrationInformation["users"] = response.Data;
                setRegistrationInformation(registrationInformation);
                setSelectedMenuItem('5');
                return;
            }

            notification["error"]({
                placement: "bottomRight",
                message: "500",
                description: "Failed to create user account"
            })
        })
    }

    return (
        <Content className="user-content">
            <Form onFinish={handleSubmit}>
                <h3>Primary User</h3>
                Username*
                <Form.Item name="username" rules={[
                    { required: true, message: "Please input your username" }
                ]}>
                    <Input placeholder="Username" />
                </Form.Item>
                Password*
                <Form.Item name="password" rules={[
                    { required: true, message: "Please input your password" }
                ]}>
                    <Input.Password placeholder="Password" iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
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
        </Content>
    );
}

export default User;
