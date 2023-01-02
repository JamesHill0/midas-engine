import React from "react";

import { Row, Col, Card, Statistic } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';

function IntegrationsStats({ integrationsList }) {
    return (
        <Row gutter={16}>
            <Col span={6}>
                <Card>
                    <Statistic
                        title="Active Integrations"
                        value={integrationsList.length}
                    />
                </Card>
            </Col>
        </Row>
    )
}

export default IntegrationsStats;
