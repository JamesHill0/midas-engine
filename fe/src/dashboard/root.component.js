import React from "react";
import { useState } from "react";
import { Col, Row, Card, Statistic } from "antd";
import { Loader } from "../utils/ui_helper";

function Dashboard() {
    const [isLoading, setIsLoading] = useState(false);

    return (
        < div className="dashboard" >
            {isLoading && <Loader />}
            {/* <Row gutter={10}>
                    <Col span={6}>
                        <Card>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                        </Card>
                    </Col>
                </Row>
                <br />
                <Row gutter={10}>
                    <Col span={12}>
                    </Col>
                    <Col span={12}>
                    </Col>
                </Row> */}
        </div >
    )
}

export default Dashboard;
