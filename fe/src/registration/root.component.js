import React from "react";
import { useState } from "react";
import { navigateToUrl } from "single-spa";
import { FormOutlined, DatabaseOutlined, BranchesOutlined, CheckSquareOutlined } from "@ant-design/icons";

import { Layout, Menu, Breadcrumb } from "antd";

import Information from "./information";
import Source from "./source";
import Destination from "./destination";
import Mapping from "./mapping";
import Confirmation from "./confirmation";

const { Content, Sider } = Layout;

function RegistrationBreadCrumb() {
  return (
    <Breadcrumb className="bread-crumb">
      <Breadcrumb.Item>Home</Breadcrumb.Item>
      <Breadcrumb.Item>New Account</Breadcrumb.Item>
    </Breadcrumb>
  )
}

function Registration() {
  const [selectedMenuItem, setSelectedMenuItem] = useState('1');

  const registrationInformation = {
    "information": {},
    "source": {},
    "destination": {},
    "mapping": {},
    "confirmation": {},
  }

  const items = [
    {
      key: '1',
      icon: <FormOutlined />,
      label: 'Information',
      onClick: () => setSelectedMenuItem('1')
    },
    {
      key: '2',
      icon: <DatabaseOutlined />,
      label: 'Source',
      onClick: () => setSelectedMenuItem('2')
    },
    {
      key: '3',
      icon: <DatabaseOutlined />,
      label: 'Destination',
      onClick: () => setSelectedMenuItem('3')
    },
    {
      key: '4',
      icon: <BranchesOutlined />,
      label: 'Mapping',
      onClick: () => setSelectedMenuItem('4')
    },
    {
      key: '5',
      icon: <CheckSquareOutlined />,
      label: 'Confirmation',
      onClick: () => setSelectedMenuItem('5')
    }
  ]

  return (
    <Content className="content">
      {RegistrationBreadCrumb()}
      <Layout className="site-layout-background">
        <Sider className="site-layout-background">
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[selectedMenuItem]}
            items={items}
          />
        </Sider>
        <Content className="inner-content">
          {selectedMenuItem == '1' && <Information
            setSelectedMenuItem={setSelectedMenuItem}
            registrationInformation={registrationInformation}
          />}

          {selectedMenuItem == '2' && <Source
            setSelectedMenuItem={setSelectedMenuItem}
            registrationInformation={registrationInformation}
          />}

          {selectedMenuItem == '3' && <Destination
            setSelectedMenuItem={setSelectedMenuItem}
            registrationInformation={registrationInformation}
          />}

          {selectedMenuItem == '4' && <Mapping
            setSelectedMenuItem={setSelectedMenuItem}
            registrationInformation={registrationInformation}
          />}

          {selectedMenuItem == '5' && <Confirmation
            setSelectedMenuItem={setSelectedMenuItem}
            registrationInformation={registrationInformation}
          />}
        </Content>
      </Layout>
    </Content>
  );
}

export default Registration;
