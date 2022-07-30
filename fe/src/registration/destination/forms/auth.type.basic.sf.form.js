import React from "react";

import { Form, Input } from "antd";

function AuthTypeBasicSfForm() {
    return (
        <div>
            <Form.Item label="Domain" name="domain" rules={[
                { required: true, message: "Please input your domain" }
            ]}>
                <Input placeholder="Domain" />
            </Form.Item>

            <Form.Item label="Username" name="username" rules={[
                { required: true, message: "Please input your username" }
            ]}>
                <Input placeholder="Username" />
            </Form.Item>

            <Form.Item label="Password" name="password" rules={[
                { required: true, message: "Please input your password" }
            ]}>
                <Input placeholder="Password" />
            </Form.Item>
        </div>
    )
}

export default AuthTypeBasicSfForm;
