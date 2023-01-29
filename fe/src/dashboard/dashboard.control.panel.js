import React from "react";
import { Card, Input, Tag } from "antd";

const { TextArea } = Input;

export default class DashboardControlPanel extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Card style={{ margin: "5px" }}>
        <div className="ant-statistic-title">
          {this.props.title}
        </div>
        <br />
        <TextArea disabled style={{ resize: "none", backgroundColor: "#FFFFFF", color: "#000000" }} value={this.props.message.logs} rows={12} />
      </Card>
    )
  }
}
