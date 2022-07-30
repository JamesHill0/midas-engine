import React from "react";
import { useState } from "react";
import { navigateToUrl } from "single-spa";
import { FormOutlined, DatabaseOutlined, BranchesOutlined, RadiusSettingOutlined, CheckSquareOutlined } from "@ant-design/icons";

import { Layout, Menu } from "antd";

import {
  INFORMATION_KEY, INFORMATION_LABEL,
  SOURCE_KEY, SOURCE_LABEL,
  DESTINATION_KEY, DESTINATION_LABEL,
  MAPPING_KEY, MAPPING_LABEL,
  SETUP_MAPPING_KEY, SETUP_MAPPING_LABEL,
  CONFIRMATION_KEY, CONFIRMATION_LABEL
} from "./shared/selected.menu.item";

import Information from "./information";
import Source from "./source";
import Destination from "./destination";
import Mapping from "./mapping";
import Confirmation from "./confirmation";

const { Content, Sider } = Layout;

function RegistrationContent() {
  const [selectedMenuItem, setSelectedMenuItem] = useState('1');
  const [registrationInformation, setRegistrationInformation] = useState(
    {
      "information": {},
      "source": {},
      "destination": {},
      "mapping": {},
      "setupMapping": {},
      "confirmation": {},
    }
  );

  const items = [
    {
      key: INFORMATION_KEY,
      icon: <FormOutlined />,
      label: INFORMATION_LABEL,
      onClick: () => setSelectedMenuItem(INFORMATION_KEY)
    },
    {
      key: SOURCE_KEY,
      icon: <DatabaseOutlined />,
      label: SOURCE_LABEL,
      onClick: () => setSelectedMenuItem(SOURCE_KEY)
    },
    {
      key: DESTINATION_KEY,
      icon: <DatabaseOutlined />,
      label: DESTINATION_LABEL,
      onClick: () => setSelectedMenuItem(DESTINATION_KEY)
    },
    {
      key: MAPPING_KEY,
      icon: <BranchesOutlined />,
      label: MAPPING_LABEL,
      onClick: () => setSelectedMenuItem(MAPPING_KEY)
    },
    {
      key: SETUP_MAPPING_KEY,
      icon: <RadiusSettingOutlined />,
      label: SETUP_MAPPING_LABEL,
      onClick: () => setSelectedMenuItem(SETUP_MAPPING_KEY)
    },
    {
      key: CONFIRMATION_KEY,
      icon: <CheckSquareOutlined />,
      label: CONFIRMATION_LABEL,
      onClick: () => setSelectedMenuItem(CONFIRMATION_KEY)
    }
  ]

  return (
    <Content className="content">
      <Layout className="layout">
        <Sider className="sider">
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[selectedMenuItem]}
            items={items}
          />
        </Sider>
        <Content className="inner-content">
          {selectedMenuItem == INFORMATION_KEY && <Information
            setSelectedMenuItem={setSelectedMenuItem}
            registrationInformation={registrationInformation}
            setRegistrationInformation={setRegistrationInformation}
          />}

          {selectedMenuItem == SOURCE_KEY && <Source
            setSelectedMenuItem={setSelectedMenuItem}
            registrationInformation={registrationInformation}
            setRegistrationInformation={setRegistrationInformation}
          />}

          {selectedMenuItem == DESTINATION_KEY && <Destination
            setSelectedMenuItem={setSelectedMenuItem}
            registrationInformation={registrationInformation}
            setRegistrationInformation={setRegistrationInformation}
          />}

          {selectedMenuItem == MAPPING_KEY && <Mapping
            setSelectedMenuItem={setSelectedMenuItem}
            registrationInformation={registrationInformation}
            setRegistrationInformation={setRegistrationInformation}
          />}

          {selectedMenuItem == SETUP_MAPPING_KEY && <Mapping
            setSelectedMenuItem={setSelectedMenuItem}
            registrationInformation={registrationInformation}
            setRegistrationInformation={setRegistrationInformation}
          />}

          {selectedMenuItem == CONFIRMATION_KEY && <Confirmation
            setSelectedMenuItem={setSelectedMenuItem}
            registrationInformation={registrationInformation}
            setRegistrationInformation={setRegistrationInformation}
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
