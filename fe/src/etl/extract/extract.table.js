import React from "react";
import { useState } from "react";

import { Space, Table, Tag } from "antd";

function ExtractTable({ extractList }) {
    const columns = [
        {
            title: 'Label',
            dataIndex: 'label',
            key: 'label'
        },
        {
            title: 'Key',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Integration',
            dataIndex: 'integration',
            key: 'integration',
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
        }
    ]

    return (
        <Table columns={columns} dataSource={extractList} />
    )
}

export default ExtractTable;
