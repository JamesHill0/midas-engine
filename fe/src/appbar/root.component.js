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
                            A
                            {/* {decodeToken().display_name.charAt(0)} */}
                        </span>
                    </Avatar>
                    Administrator
                    {/* {decodeToken().display_name} */}
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
                    {ProfileInformation()}
                </Menu>
            </Header>
        </Layout>
    );
}

export default Appbar;
