import React, { useState } from "react";

import { IntegrationsImage } from "../../../assets/image";

import { Card, Modal } from "antd";

import { SETUP_MAPPING_KEY } from "../../shared/selected.menu.item";

const { Meta } = Card;

function ManualMappingUICard({ setSelectedMenuItem, setMappingRegistrationInformation }) {
    const TITLE = "Manual Mapping through UI";
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
                <h3>What is manual mapping through UI?</h3>
                With manual mapping we extract the data fields from the source into the ETL system
                where we let you set through the built-in UI where you will set where the fields go into.
                <br /><br />
                <h3>Example:</h3>
                Let's assume that you decided to have first name as the data to transform from source to destination
                <br /><br />
                Then while checking the source, 3 fields came up where these fields are field1, field2 and field3
                <br /><br />
                If you have chosen that field1 will always be the value of the first name then it will be the single source of truth of the first name
            </Modal>
        </div>
    )
}

export default ManualMappingUICard;
