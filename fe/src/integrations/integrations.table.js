import React from "react";
import { useState } from "react";

import { Space, Table, Tag } from "antd";

function IntegrationsTable({ integrationsList }) {
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
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
                    case "new":
                        color = "new"
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
            title: 'Direction',
            dataIndex: 'direction',
            key: 'direction',
            render: item => {
                let color = "green";
                switch(item) {
                    case "outgoing":
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
                    { item.status == "inactive" && <a>Create</a>}
                    { item.status == "active" && <a>Remove</a>}
                </Space>
            )
        }
    ]

    return (
        <Table columns={columns} dataSource={integrationsList} />
    )
}

export default IntegrationsTable;
