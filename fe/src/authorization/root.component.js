import React from "react";
import { navigateToUrl } from "single-spa";
import { Layout, Card, Form, Input, Button, notification } from "antd";
import api from "../data";
import Logo from "./logo";
import Icon from "@ant-design/icons";

function Authorization() {
    function handleSubmit(values) {
        api
            .Authorization("users/login")
            .Post(values, response => {
                if (response.Error == null) {
                    let token = response.Data.access_token;
                    if (token != undefined) {
                        localStorage.setItem("access_token", token);
                        navigateToUrl("/dashboard");
                        window.location.reload();
                        notification["success"]({
                            placement: "bottomRight",
                            message: "Success",
                            description: "Successfully logged-in"
                        });

                        return
                    }
                }

                notification["error"]({
                    placement: "bottomRight",
                    message: "500",
                    description: "Internal Server Error"
                });
            });
    }

    return (
        <Layout
            className="layout"
        >
            <center>
                <Card
                    className="login-card"
                >
                    <Logo />
                    <h1 className="app-title">Blitz App</h1>
                    <Form
                        onFinish={handleSubmit}
                        className="login-form"
                    >
                        <Form.Item name="username" rules={[{
                            required: true,
                            message: "Please input your username!"
                        }]}>
                            <Input
                                prefix={
                                    <Icon
                                        type="user"
                                        className="user-icon"
                                    />
                                }
                                placeholder="Username"
                            />
                        </Form.Item>
                        <Form.Item name="password" rules={[{
                            required: true,
                            message: "Please input your password!"
                        }]}>
                            <Input
                                className="input-password"
                                prefix={
                                    <Icon
                                        type="lock"
                                        className="password-icon"
                                    />
                                }
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="login-form-button"
                            >
                                Log in
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </center>
        </Layout>
    );
}

export default Authorization;
