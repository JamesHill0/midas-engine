import React, { useState } from "react";

import { IntegrationsImage } from "../../../assets/image";

import { Card, Modal } from "antd";

import { SETUP_MAPPING_KEY } from "../../shared/selected.menu.item";

const { Meta } = Card;

function PriorityMappingCard({ setSelectedMenuItem, setMappingRegistrationInformation }) {
    const TITLE = "Priority Mapping";
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleOk = () => {
        setMappingRegistrationInformation(TITLE);
        setSelectedMenuItem(SETUP_MAPPING_KEY);
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    }

    return (
        <div>
            <Card
                onClick={() => { setIsModalVisible(true) }}
                hoverable
                className="app-picker-card"
                cover={<img src={IntegrationsImage} />}
            >
                <Meta title={TITLE} description={""} />
            </Card>
            <Modal title={TITLE} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <h3>What is priority mapping?</h3>
                With priority mapping we extract the data fields from the source into the ETL system
                where we let you set the priority in how the data is going to be filled up.
                <br /><br />
                <h3>Example:</h3>
                Let's assume that you decided to have first name as the data to transform from source to destination
                <br /><br />
                Then while checking the source, 3 fields came up where these fields are field1, field2 and field3
                and let's say field1 is set to be priority number 1, with field2 set as priority number 2 etc.
                <br /><br />
                field1 will be considered as the value of the first name but in the event that field1 is blank then field2 will be the value of the first name instead
            </Modal>
        </div>
    )
}

export default PriorityMappingCard;
