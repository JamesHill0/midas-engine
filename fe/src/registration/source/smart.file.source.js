import React, { useState } from "react";

import { Form, Modal, Select, Button, notification } from "antd";

import {
  AUTH_TYPE_BASIC
} from "../shared/auth.type";

import api from "../../data";

import AuthTypeBasicForm from "./forms/auth.type.basic.form";

const { Option } = Select;

function SmartFileSource({ handleCancel, modalTitle, isModalVisible, availableAuthTypes, setSelectedMenuItem, registrationInformation, setRegistrationInformation, setIsLoading }) {
  const [selectedAuthType, setSelectedAuthType] = useState(AUTH_TYPE_BASIC);

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

    let config = {
      headers: {
        "x-api-key": registrationInformation["information"]["apiKey"]
      }
    }

    setIsLoading(true);
    api
      .Integration("smartfiles/test-connection", config)
      .Post(data, response => {
        setIsLoading(false);
        if (response.Error == null) {
          notification["success"]({
            placement: "bottomRight",
            message: "Success",
            description: "Connection to source is established"
          })
          registrationInformation["source"] = {
            "type": selectedAuthType,
            "application": "smartfile",
            "username": values["username"],
            "password": values["password"]
          }
          setRegistrationInformation(registrationInformation);
          setSelectedMenuItem('3');
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
    <Modal title={modalTitle} visible={isModalVisible} footer={null} onCancel={handleCancel}>
      <Form
        onFinish={handleSubmit}
      >
        <Form.Item name="authType">
          Auth Type
          <Select defaultValue={AUTH_TYPE_BASIC} onChange={(value) => setSelectedAuthType(value)}>
            {availableAuthTypes.map((authType) => {
              return <Option value={authType}>{authType}</Option>
            })}
          </Select>
        </Form.Item>

        {selectedAuthType == AUTH_TYPE_BASIC && <div>
          <AuthTypeBasicForm />
        </div>}

        <br />
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Establish Connection
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default SmartFileSource;
