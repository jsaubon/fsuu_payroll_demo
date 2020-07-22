import React from "react";

import { Space, Popconfirm, Input, notification } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { fetchData } from "../../../../../../axios";
import Text from "antd/lib/typography/Text";

export const clientCreditSettingsTableColumns = getClientAccountingEntry => {
    const deleteAccountingEntry = record => {
        fetchData("DELETE", "api/accounting_entry/" + record.id).then(res => {
            console.log(res);
            notification.success({
                message: "Credit Entry Successfully Deleted!"
            });
            getClientAccountingEntry();
        });
    };

    return [
        {
            title: "Title",
            dataIndex: "title",
            key: "title"
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount"
        },
        {
            title: "Report Visibility",
            dataIndex: "report_visibility",
            key: "report_visibility"
        },
        {
            title: "Action",
            key: "action",
            width: "20%",
            render: (text, record) => {
                return (
                    <Space size="middle" key={record.id}>
                        <a>Report</a>
                        <Popconfirm
                            title="Are you sure to delete this Credit Entry?"
                            okText="Yes"
                            cancelText="No"
                            onConfirm={e => {
                                deleteAccountingEntry(record);
                            }}
                        >
                            <a>Delete</a>
                        </Popconfirm>
                    </Space>
                );
            }
        }
    ];
};
