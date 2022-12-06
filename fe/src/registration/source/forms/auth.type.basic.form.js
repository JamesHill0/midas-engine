import React from "react";

import { Form, Input } from "antd";

function AuthTypeBasicForm() {
    return (
        <div>
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
        </div>
    )
}

export default AuthTypeBasicForm;
