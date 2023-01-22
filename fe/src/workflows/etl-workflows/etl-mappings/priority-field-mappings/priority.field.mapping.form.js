import React from "react";
import { Form, InputNumber, Button, Select, notification } from "antd";
import api from "../../../../data";

const { Option } = Select;

function PriorityFieldMappingForm({ closeSetupDrawer, fieldsList, priorityFieldMapping }) {
  function handleSubmit(value) {
    api.Mapping('priority-field-mapping-values').Post({
      'priorityId': priorityFieldMapping.id,
      'toField': value.toField,
      'level': value.level
    }, response => {
      if (response.Error == null) {
        notification["success"]({
          placement: "bottomRight",
          message: "200",
          description: `Priority Field mapping value set for ${value.toField} to level ${value.level}!`
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
      Incoming field to be mapped into:<br/>
      <Form.Item name="toField" rules={[{
        required: true,
        message: "Please input field to be mapped to"
      }]}>
        <Select
          style={{ marginTop: 10, width: 300 }}
          showSearch
          placeholder="Select field to be mapped into"
          optionFilterProp="children"
          filterOptions={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {fieldsList.map((option, index) => {
            return <Option key={`value_${index}`} value={option}>{option}</Option>
          })}
        </Select>
      </Form.Item>

      Level:<br />
      <Form.Item name="level" rules={[{
        required: true,
        message: "Please input priority value level"
      }]}>
        <InputNumber
          style={{ marginTop: 10 }}
          min={1}
          type="level"
          placeholder="level"
        ></InputNumber>
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

export default PriorityFieldMappingForm;
