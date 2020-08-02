import React, { useState, useEffect } from "react";
import {
    Card,
    Row,
    Col,
    Select,
    InputNumber,
    Divider,
    Table,
    Button,
    Popconfirm,
    notification
} from "antd";
import Text from "antd/lib/typography/Text";
import moment from "moment";
import { fetchData } from "../../../../axios";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import Title from "antd/lib/typography/Title";

const CardPayrollList = () => {
    const [pageFilters, setPageFilters] = useState({
        month: parseInt(moment().format("M")),
        year: parseInt(moment().format("YYYY"))
    });

    const [payrollList, setPayrollList] = useState([]);

    useEffect(() => {
        fetchData(
            "GET",
            "api/payroll?month=" +
                pageFilters.month +
                "&year=" +
                pageFilters.year
        ).then(res => {
            // console.log(res);
            if (res.success) {
                setPayrollList(res.data);
            }
        });
        return () => {};
    }, [pageFilters]);

    const deletePayroll = record => {
        fetchData("DELETE", "api/payroll/" + record.id).then(res => {
            if (res.success) {
                notification.success({
                    message: "Payroll Successfully Deleted!"
                });
            }
        });
    };

    const columns = [
        {
            title: "Client Name",
            dataIndex: "client",
            key: "client",
            render: (text, record) => {
                return record.client.name;
            }
        },
        {
            title: "Payroll Date",
            dataIndex: "date_start",
            key: "date_start",
            render: (text, record) => {
                return (
                    moment(record.date_start).format("YYYY-MM-DD") +
                    " to " +
                    moment(record.date_start).format("YYYY-MM-DD")
                );
            }
        },

        {
            title: "View",
            key: "view",
            width: "1%",
            render: (text, record) => {
                return (
                    <Button type="primary" size="small" icon={<EyeOutlined />}>
                        View
                    </Button>
                );
            }
        },
        {
            title: "Action",
            key: "action",
            width: "1%",
            render: (text, record) => {
                return (
                    <Popconfirm
                        title="Are you sure to delete this payroll?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={e => {
                            deletePayroll(record);
                        }}
                    >
                        <Button
                            danger
                            size="small"
                            type="primary"
                            icon={<DeleteOutlined />}
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                );
            }
        }
    ];
    return (
        <Card className="mt-10">
            <Row>
                <Col xs={24} md={18}>
                    <Title level={4}>Payroll List</Title>
                </Col>
                <Col xs={24} md={6}>
                    <div style={{ display: "flex" }}>
                        <Text style={{ lineHeight: "2.2", paddingRight: 10 }}>
                            Filters
                        </Text>
                        <Select
                            placeholder="Select Month"
                            style={{ width: "-webkit-fill-available" }}
                            value={pageFilters.month}
                            onChange={e =>
                                setPageFilters({
                                    ...pageFilters,
                                    month: parseInt(e)
                                })
                            }
                        >
                            <Select.Option value={1}>January</Select.Option>
                            <Select.Option value={2}>February</Select.Option>
                            <Select.Option value={3}>March</Select.Option>
                            <Select.Option value={4}>April</Select.Option>
                            <Select.Option value={5}>May</Select.Option>
                            <Select.Option value={6}>June</Select.Option>
                            <Select.Option value={7}>July</Select.Option>
                            <Select.Option value={8}>August</Select.Option>
                            <Select.Option value={9}>September</Select.Option>
                            <Select.Option value={10}>October</Select.Option>
                            <Select.Option value={11}>November</Select.Option>
                            <Select.Option value={12}>December</Select.Option>
                        </Select>
                        <InputNumber
                            style={{ width: 140 }}
                            value={pageFilters.year}
                            onChange={e =>
                                setPageFilters({
                                    ...pageFilters,
                                    year: parseInt(e)
                                })
                            }
                        />
                    </div>
                </Col>
            </Row>
            <Divider />
            <Table columns={columns} size="small" dataSource={payrollList} />
        </Card>
    );
};

export default CardPayrollList;
