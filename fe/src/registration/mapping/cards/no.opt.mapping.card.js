import React, { useState } from "react";

import { IntegrationsImage } from "../../../assets/image";

import { Card, Modal } from "antd";

import { CONFIRMATION_KEY } from "../../shared/selected.menu.item";

const { Meta } = Card;

function NoOptMappingCard({ setSelectedMenuItem, setMappingRegistrationInformation }) {
    const TITLE = "Do not implement yet";
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleOk = () => {
        setMappingRegistrationInformation(TITLE);
        setSelectedMenuItem(CONFIRMATION_KEY);
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
                <h3>Do not implement yet</h3>
                We won't implement a mapping logic yet when your account is created
                <br /><br />
                You can opt to set it later once you are decided on how you want to transform your data
            </Modal>
        </div>
    )
}

export default NoOptMappingCard;
