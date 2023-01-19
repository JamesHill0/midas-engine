import React from "react";
import { navigateToUrl } from "single-spa";

import { Layout, Menu, Avatar } from "antd";
import { DownOutlined } from "@ant-design/icons";

const { Header } = Layout;
const { SubMenu } = Menu;

import { decodeToken } from "../utils/token";

function ProfileInformation() {
  function logout() {
    localStorage.clear();
    navigateToUrl("/dashboard");
    window.location.reload();
  };

  return (
    <SubMenu
      key={"profile"}
      style={{ float: "right" }}
      title={
        <span className="submenu-title-wrapper">
          <Avatar size={32} className="avatar">
            <span style={{ padding: 5 }}>
              {decodeToken().display_name.charAt(0)}
            </span>
          </Avatar>
          {decodeToken().display_name}
          <DownOutlined className="down-outlined" />
        </span>
      }
    >
      <Menu.Item onClick={() => logout()}>Logout</Menu.Item>
    </SubMenu>
  )
}

function Appbar() {
  return (
    <Layout className="layout">
      <Header>
        <Menu theme="dark" mode="horizontal" style={{ display: "inherit" }} className="menu">
          <Menu.Item key={"dashboard"} onClick={() => navigateToUrl("/dashboard")}>
            Dashboard
          </Menu.Item>
          <Menu.Item key={"integration"} onClick={() => navigateToUrl("/integrations")}>
            Integrations
          </Menu.Item>
          <SubMenu
            key={"workflow"}
            title={
              <span className="submenu-title-wrapper">
                Workflows
                <DownOutlined style={{ fontSize: 10, marginLeft: 10 }} />
              </span>
            }
          >
            <Menu.Item key={"etl-workflows"} onClick={() => navigateToUrl("/workflows/etl-workflows")}>
              Extract Transform Load
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key={"settings"}
            title={
              <span className="submenu-title-wrapper">
                Settings
                <DownOutlined style={{ fontSize: 10, marginLeft: 10 }} />
              </span>
            }
          >
            <Menu.Item key={"settings-users"} onClick={() => navigateToUrl("/settings/users")}>
              Users
            </Menu.Item>
          </SubMenu>
          {ProfileInformation()}
        </Menu>
      </Header>
    </Layout>
  );
}

export default Appbar;
