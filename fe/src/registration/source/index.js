import React, { useState, useEffect } from "react";

import { IntegrationsImage } from "../../assets/image";

import { Card, Col, Row } from "antd";

import {
  AUTH_TYPE_BASIC
} from "../shared/auth.type";

import SmartFileSource from "./smart.file.source";

const { Meta } = Card;

function SourceTitle() {
  return (
    <div>
      <h2>Select source:</h2>
      This is where we retrieve the data as part of the <b>extraction</b> logic in ETL
      <br /><br />
    </div>
  );
}

function Source({ setSelectedMenuItem, registrationInformation, setRegistrationInformation, setIsLoading }) {
  const [sourceSelected, setSourceSelected] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [availableAuthTypes, setAvailableAuthTypes] = useState([]);

  const availableSources = () => {
    let sources = [
      {
        key: "smartfile",
        imageSource: IntegrationsImage,
        title: "SmartFile",
        description: "https://www.smartfile.com",
        availableAuthTypes: [AUTH_TYPE_BASIC]
      },
      {
        key: "webhook",
        imageSource: IntegrationsImage,
        title: "Webhook",
        description: "webhook",
        availableAuthTypes: []
      },
      {
        key: "database",
        imageSource: IntegrationsImage,
        title: "Database",
        description: "database",
        availableAuthTypes: []
      }
    ]

    return sources;
  }

  const handleCancel = () => {
    setSourceSelected("");
  }

  const showModal = (availableSource) => {
    setAvailableAuthTypes(availableSource.availableAuthTypes);
    setModalTitle(`Setup connection to ${availableSource.title}`);
    setSourceSelected(availableSource.key);
  }

  return (
    <div>
      <SourceTitle />
      <Row>
        {availableSources().map((availableSource) => {
          return (
            <Col span={5}>
              <Card
                onClick={() => showModal(availableSource)}
                hoverable
                className="app-picker-card"
                cover={<img alt={availableSource.title} src={availableSource.imageSource} />}
              >
                <Meta title={availableSource.title} description={availableSource.description} />
              </Card>
            </Col>
          )
        })}
      </Row>
      <SmartFileSource
        handleCancel={handleCancel}
        modalTitle={modalTitle}
        isModalVisible={sourceSelected == "smartfile"}
        availableAuthTypes={availableAuthTypes}
        setSelectedMenuItem={setSelectedMenuItem}
        registrationInformation={registrationInformation}
        setRegistrationInformation={setRegistrationInformation}
        setIsLoading={setIsLoading}
      />
    </div>
  );
}

export default Source;
