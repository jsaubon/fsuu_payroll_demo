import React from "react";

import { Space, Popconfirm, Input, notification, Button } from "antd";
import {
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined
} from "@ant-design/icons";
import { fetchData } from "../../../../../../axios";
import Text from "antd/lib/typography/Text";
import ButtonGroup from "antd/lib/button/button-group";

export const clientEmployeesTableColumns = (
    getClientEmployees,
    toggleShowAddEditClientEmployeesModal,
    toggleShowModalDeductionsList,
    toggleShowModalAssignedPosts
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
            title: "Name",
            dataIndex: "name",
            key: "name",
            sorter: true,
            className: "w-nowrap"
        },
        {
            title: "Email",
            dataIndex: "email_address",
            key: "email_address",
            sorter: true
        },
        {
            title: "Phone",
            dataIndex: "contact_number",
            key: "contact_number",
            sorter: true
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
            title: "Assigned Posts",
            key: "assigned_posts",
            width: "10%",
            render: (text, record) => {
                return (
                    <Space size="middle" key={record.id}>
                        <Button
                            size="small"
                            type="primary"
                            icon={<EyeOutlined />}
                            onClick={e => toggleShowModalAssignedPosts(record)}
                        >
                            View
                        </Button>
                    </Space>
                );
            }
        },
        {
            title: "Deductions",
            key: "deductions",
            width: "10%",
            render: (text, record) => {
                return (
                    <Space size="middle" key={record.id}>
                        <Button
                            size="small"
                            type="primary"
                            icon={<EyeOutlined />}
                            onClick={e => toggleShowModalDeductionsList(record)}
                        >
                            View
                        </Button>
                    </Space>
                );
            }
        },
        {
            title: "Action",
            key: "action",
            width: "20%",
            render: (text, record) => {
                return (
                    <Space size="middle" key={record.id}>
                        <ButtonGroup>
                            <Button
                                size="small"
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={e =>
                                    toggleShowAddEditClientEmployeesModal(
                                        record
                                    )
                                }
                            >
                                Edit
                            </Button>
                            <Popconfirm
                                title="Are you sure to delete this employee?"
                                okText="Yes"
                                cancelText="No"
                                onConfirm={e => {
                                    deleteEmployee(record);
                                }}
                            >
                                <Button
                                    size="small"
                                    type="primary"
                                    danger
                                    icon={<DeleteOutlined />}
                                >
                                    Delete
                                </Button>
                            </Popconfirm>
                        </ButtonGroup>
                    </Space>
                );
            }
        }
    ];
};
