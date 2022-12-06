import React from "react";

import { Form, Input } from "antd";

function AuthTypeBasicSfForm() {
    return (
        <div>
            Url
            <Form.Item name="url" rules={[
                { required: false, message: "Please input your login url" }
            ]}>
                <Input placeholder="Url" />
            </Form.Item>

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
                <Input placeholder="Password" />
            </Form.Item>

            Security Token*
            <Form.Item name="securityToken" rules={[
                { required: true, message: "Please input your security token" }
            ]}>
                <Input placeholder="Security Token" />
            </Form.Item>
        </div>
    )
}

export default AuthTypeBasicSfForm;
