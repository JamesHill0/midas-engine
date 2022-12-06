import React from "react";
import { useState } from "react";

import { Space, Table, Tag } from "antd";

function UsersTable({ usersList }) {
    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: item => {
                let color = "green";
                switch(item) {
                    case "inactive":
                        color = "red"
                        break;
                    default:
                        color = "green"
                        break;
                }

                return (
                    <Tag color={color} key={item}>
                        {item}
                    </Tag>
                )
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: item => (
                <Space size="middle">
                    { <a>Toggle Status</a> }
                    { <a>Delete</a>}
                </Space>
            )
        }
    ]

    return (
        <Table columns={columns} dataSource={usersList} />
    )
}

export default UsersTable;
