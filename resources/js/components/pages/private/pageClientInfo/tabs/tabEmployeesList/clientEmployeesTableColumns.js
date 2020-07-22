import React from "react";

import { Space, Popconfirm, Input, notification } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { fetchData } from "../../../../../../axios";
import Text from "antd/lib/typography/Text";

export const clientEmployeesTableColumns = (
    getClientEmployees,
    toggleShowAddEditClientEmployeesModal
) => {
    const deleteEmployee = record => {
        fetchData("DELETE", "api/employee/" + record.id).then(res => {
            console.log(res);
            notification.success({ message: "Employee Successfully Deleted!" });
            getClientEmployees();
        });
    };

    return [
        {
            title: "#",
            dataIndex: "id",
            key: "id"
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name"
        },
        {
            title: "Email",
            dataIndex: "email_address",
            key: "email_address"
        },
        {
            title: "Phone",
            dataIndex: "contact_number",
            key: "contact_number"
        },
        {
            title: "Other Info",
            dataIndex: "other_infos",
            key: "other_infos",
            render: (text, record) => {
                let other_infos = [];
                record.other_infos.map((rec, key) => {
                    other_infos.push(
                        <Text className="d-block" key={key}>
                            {rec.title}: {rec.description}
                        </Text>
                    );
                });

                return other_infos;
            }
        },
        {
            title: "Action",
            key: "action",
            width: "20%",
            render: (text, record) => {
                return (
                    <Space size="middle" key={record.id}>
                        <a
                            onClick={e =>
                                toggleShowAddEditClientEmployeesModal(record)
                            }
                        >
                            Edit
                        </a>
                        <Popconfirm
                            title="Are you sure to delete this employee?"
                            okText="Yes"
                            cancelText="No"
                            onConfirm={e => {
                                deleteEmployee(record);
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
