import React from "react";

import { Row, Col, Card, Statistic } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';

function UsersStats({ usersList }) {
    return (
        <Row gutter={16}>
            <Col span={6}>
                <Card>
                    <Statistic
                        title="Active Users"
                        value={usersList.length}
                    />
                </Card>
            </Col>
            <Col span={6}>
            </Col>
            <Col span={6}>
            </Col>
            <Col span={6}>
            </Col>
        </Row>
    )
}

export default UsersStats;
