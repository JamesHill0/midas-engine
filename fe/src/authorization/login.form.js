import React from "react";
import { Form, Input, Button } from "antd";
import Logo from "./logo";

function LoginForm({ handleSubmit }) {
    return (
        <div class="login-child login-form">
            <center>
                <div class="login-content">
                    <Logo />
                    <br/><br/>
                    <h1 className="app-title">Midas</h1>
                    <Form
                        onFinish={handleSubmit}
                        className="login-form"
                    >
                        <Form.Item name="accountNumber" rules={[{
                            required: true,
                            message: "Please input your account number!"
                        }]}>
                            <Input placeholder="Account Number" />
                        </Form.Item>
                        <Form.Item name="username" rules={[{
                            required: true,
                            message: "Please input your username!"
                        }]}>
                            <Input placeholder="Username" />
                        </Form.Item>
                        <Form.Item name="password" rules={[{
                            required: true,
                            message: "Please input your password!"
                        }]}>
                            <Input
                                className="input-password"
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
                </div>
            </center>
        </div>
    )
}

export default LoginForm;
