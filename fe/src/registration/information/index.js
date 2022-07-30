import React from "react";

import { Layout, Form, Row, Col, Input, Button } from "antd";

const { Content } = Layout;
const { TextArea } = Input;

function Information({ setSelectedMenuItem, registrationInformation }) {
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

    function handleSubmit(values) {
        setSelectedMenuItem('2')
    }

    return <Content className="information-content">
        <Form {...formItemLayout}
            onFinish={handleSubmit}
        >
            <h3>Company Details</h3>
            <Form.Item label="Company Name" name="companyName" rules={[
                { required: true, message: "Please input your company name" }
            ]}>
                <Input placeholder="Company Name" />
            </Form.Item>
            <Form.Item label="Company Address" name="companyAddress" rules={[
                { required: true, message: "Please input your company address" }
            ]}>
                <TextArea rows={3} placeholder="Company Address" />
            </Form.Item>

            <h3>Contact Information</h3>
            <Form.Item label="Name" name="contactName" rules={[
                { required: true, message: "Please input your name" }
            ]}>
                <Input placeholder="Name" />
            </Form.Item>
            <Form.Item label="E-mail" name="contactEmail" rules={[
                { required: true, message: "Please input your email" }
            ]}>
                <Input placeholder="E-mail" />
            </Form.Item>
            <Form.Item label="Contact Number" name="contactNumber" rules={[
                { required: true, message: "Please input your contact number" }
            ]}>
                <Input placeholder="Contact Number" />
            </Form.Item>
            <br/>
            <Form.Item {...tailFormItemLayout}>
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
