import React, { useState } from "react";
import { Form, Input, Button, Select } from "antd";

const { Option } = Select;

function DataMappingForm({ closeSetupDrawer, formatTypeOptions }) {
  const [formatType, setFormatType] = useState('');

  function handleSubmit(value) {
    console.log(value);
    closeSetupDrawer();
  }

  return (
    <Form
      onFinish={handleSubmit}
      style={{
        textAlign: "left"
      }}
    >
      Format Type:<br />
      <Form.Item name="formatType" rules={[{
        required: true,
        message: "Please input the format type"
      }]}>
        <Select
          style={{ marginTop: 10, width: 300 }}
          showSearch
          placeholder="Select format type"
          optionFilterProp="children"
          filterOptions={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          onChange={(value) => setFormatType(value)}
          options={formatTypeOptions}
        >
        </Select>

      </Form.Item>
      {(formatType !== '' && ['date', 'number'].includes(formatType)) && <div>
        Formatting:<br />
        <Form.Item name="formatting" rules={[{
          required: () => {
            if (formatType !== 'DIRECT CONVERSION') return true;
            return false;
          },
          message: "Please input the formatting"
        }]}>
          <Input
            style={{ marginTop: 10 }}
          ></Input>
        </Form.Item>
      </div>}

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
