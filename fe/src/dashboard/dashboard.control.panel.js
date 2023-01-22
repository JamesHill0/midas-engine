import React from "react";
import { Card, Input, Tag } from "antd";

const { TextArea } = Input;

function DashboardControlPanel({ title, message }) {
  return (
    <Card style={{margin: "5px"}}>
      <div className="ant-statistic-title">
        {title}
      </div>
      <br />
      <TextArea disabled style={{ resize: "none", backgroundColor: "#FFFFFF", color: "#000000" }} value={message.logs} rows={12} />
    </Card>
  )
}

export default DashboardControlPanel;
