import React from "react";
import { useState } from "react";

import { Space, Table, Tag } from "antd";

function LoadTable({ loadList }) {
    const columns = [
        {
            title: 'Integration',
            dataIndex: 'integration',
            key: 'integration',
        },
        {
            title: 'Task',
            dataIndex: 'task',
            key: 'task'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status'
        },
        {
            title: 'Result',
            dataIndex: 'result',
            key: 'result'
        }
    ]

    return (
        <Table columns={columns} dataSource={loadList} />
    )
}

export default LoadTable;
