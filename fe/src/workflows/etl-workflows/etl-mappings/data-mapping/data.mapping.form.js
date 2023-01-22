import React, { useState } from "react";
import { Form, Input, Button, notification } from "antd";
import api from "../../../../data";

function DataMappingForm({ closeSetupDrawer, dataMapping }) {
  function handleSubmit(value) {
    api.Mapping(`data-mapping-options`).Post({
      'dataMappingId': dataMapping.id,
      'fromData': value.fromData,
      'toData': value.toData
    }, response => {
      if (response.Error == null) {
        notification["success"]({
          placement: "bottomRight",
          message: "200",
          description: `Data mapping option created for ${dataMapping.toField}!`
        })
        window.location.reload();
        return;
      }

      notification["error"]({
        placement: "bottomRight",
        message: "500",
        description: "Internal Server Error"
      })
    })
    closeSetupDrawer();
  }

  return (
    <Form
      onFinish={handleSubmit}
      style={{
        textAlign: "left"
      }}
    >
      From Data:<br />
      <Form.Item name="fromData" rules={[{
        required: true,
        message: "Please input the possible original data"
      }]}>
        <Input />

      </Form.Item>
      To Data:<br />
      <Form.Item name="toData" rules={[{
        required: true,
        message: "Please input the data translation"
      }]}>
        <Input />

      </Form.Item>

      <Form.Item>
        <Button
          style={{
            marginTop: 20,
            width: "100%"
          }}
          type="primary"
          htmlType="submit"
          className="form-button"
        >
          Add
        </Button>
      </Form.Item>
    </Form>
  )
}

export default DataMappingForm;
