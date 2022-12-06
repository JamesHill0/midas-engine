import React from "react";
import { useState } from "react";

import { Space, Table, Tag } from "antd";

function TransformTable({ transformList }) {
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
            title: 'Value',
            dataIndex: 'value',
            key: 'value'
        },
        {
            title: 'Integration',
            dataIndex: 'integration',
            key: 'integration',
        },
    ]

    return (
        <Table columns={columns} dataSource={transformList} />
    )
}

export default TransformTable;
