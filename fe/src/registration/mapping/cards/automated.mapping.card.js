import React, { useState } from "react";

import { IntegrationsImage } from "../../../assets/image";

import { Card, Modal } from "antd";

import { SETUP_MAPPING_KEY } from "../../shared/selected.menu.item";

const { Meta } = Card;

function AutomatedMappingCard({ setSelectedMenuItem, setMappingRegistrationInformation }) {
    const TITLE = "Automated Mapping";
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
                <h3>What is automated mapping?</h3>
                With automated mapping we extract the data fields from the source into the ETL system
                where we let you set through the built-in UI where you will set where the fields might possibly go into.
                <br /><br />
                <h3>Example:</h3>
                Let's assume that you decided to have first name as the data to transform from source to destination
                <br /><br />
                Then while checking the source, 3 fields came up where these fields are field1, field2 and field3
                <br /><br />
                In this case you can choose how many fields you like and as long as the value of your first selected field is empty we will take the next field and so on
            </Modal>
        </div>
    )
}

export default AutomatedMappingCard;
