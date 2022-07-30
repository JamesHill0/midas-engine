import React from "react";

import { Col, Row } from "antd";

import PriorityMappingCard from "./cards/priority.mapping.card";
import ManualMappingUICard from "./cards/manual.mapping.ui.card";
import AutomatedMappingCard from "./cards/automated.mapping.card";
import NoOptMappingCard from "./cards/no.opt.mapping.card";

function MappingTitle() {
    return (
        <div>
            <h2>Select your mapping logic:</h2>
            We provide logic to do the data <b>transform</b> in ETL, you can also opt to not to and assign the data manually
            <br /><br />
        </div>
    );
}

function Mapping({ setSelectedMenuItem, registrationInformation, setRegistrationInformation }) {

    const setMappingRegistrationInformation = (selectedMappingLogic) => {
        let newRegistrationInformation = registrationInformation;
        newRegistrationInformation["mapping"] = {
            selectedMappingLogic
        }
        setRegistrationInformation(newRegistrationInformation);
    }

    return (
        <div>
            <MappingTitle />
            <Row gutter={5}>
                <Col className="gutter-row" span={6}>
                    <PriorityMappingCard setSelectedMenuItem={setSelectedMenuItem}
                        setMappingRegistrationInformation={setMappingRegistrationInformation} />
                </Col>
                <Col className="gutter-row" span={6}>
                    <ManualMappingUICard setSelectedMenuItem={setSelectedMenuItem}
                        setMappingRegistrationInformation={setMappingRegistrationInformation} />
                </Col>
                <Col className="gutter-row" span={6}>
                    <AutomatedMappingCard setSelectedMenuItem={setSelectedMenuItem}
                        setMappingRegistrationInformation={setMappingRegistrationInformation} />
                </Col>
                <Col className="gutter-row" span={6}>
                    <NoOptMappingCard setSelectedMenuItem={setSelectedMenuItem}
                        setMappingRegistrationInformation={setMappingRegistrationInformation} />
                </Col>
            </Row>
        </div>
    );
}

export default Mapping;
