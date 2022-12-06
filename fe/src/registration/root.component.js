import React from "react";
import { useState } from "react";

import { Loader } from "../utils/ui_helper";
import { Layout } from "antd";

import {
  INFORMATION_KEY,
  SOURCE_KEY,
  DESTINATION_KEY,
  USER_KEY,
  CONFIRMATION_KEY,
} from "./shared/selected.menu.item";

import Information from "./information";
import Source from "./source";
import Destination from "./destination";
import User from "./user";
import Confirmation from "./confirmation";
import RegistrationStepper from "./registration.steps";

const { Content } = Layout;

function RegistrationContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState('2');
  const [registrationInformation, setRegistrationInformation] = useState(
    {
      "information": {},
      "source": {},
      "destination": {},
      "users": {},
      "confirmation": {},
    }
  );

  return (
    <Content className="content">
      {isLoading && <Loader />}
      <Layout className="layout">
        <Content className="inner-content">
          <RegistrationStepper selectedMenuItem={selectedMenuItem} />
          {selectedMenuItem == INFORMATION_KEY && <Information
            setSelectedMenuItem={setSelectedMenuItem}
            registrationInformation={registrationInformation}
            setRegistrationInformation={setRegistrationInformation}
            setIsLoading={setIsLoading}
          />}

          {selectedMenuItem == SOURCE_KEY && <Source
            setSelectedMenuItem={setSelectedMenuItem}
            registrationInformation={registrationInformation}
            setRegistrationInformation={setRegistrationInformation}
            setIsLoading={setIsLoading}
          />}

          {selectedMenuItem == DESTINATION_KEY && <Destination
            setSelectedMenuItem={setSelectedMenuItem}
            registrationInformation={registrationInformation}
            setRegistrationInformation={setRegistrationInformation}
            setIsLoading={setIsLoading}
          />}

          {selectedMenuItem == USER_KEY && <User
            setSelectedMenuItem={setSelectedMenuItem}
            registrationInformation={registrationInformation}
            setRegistrationInformation={setRegistrationInformation}
            setIsLoading={setIsLoading}
          />}

          {selectedMenuItem == CONFIRMATION_KEY && <Confirmation
            setSelectedMenuItem={setSelectedMenuItem}
            registrationInformation={registrationInformation}
            setRegistrationInformation={setRegistrationInformation}
            setIsLoading={setIsLoading}
          />}
        </Content>
      </Layout>
    </Content>
  );
}

function RegistrationPage() {
  return (
    <RegistrationContent />
  )
}

export default RegistrationPage;
