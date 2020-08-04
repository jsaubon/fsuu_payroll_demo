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
    notification,
    Modal,
    Input,
    DatePicker
} from "antd";
import Text from "antd/lib/typography/Text";
import moment from "moment";
import { fetchData } from "../../../../axios";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import { Print } from "react-easy-print";
import ModalPayrollViewInfo from "./modalPayrollViewInfo";

const CardPayrollList = () => {
    const [pageFilters, setPageFilters] = useState({
        year: parseInt(moment().format("YYYY"))
    });
    const [showModalPayrollViewInfo, setShowModalPayrollViewInfo] = useState(
        false
    );
    const [selectedPayroll, setSelectedPayroll] = useState();
    const [payrollList, setPayrollList] = useState([]);
    const [accountingEntries, setAccountingEntries] = useState({
        debit: [],
        credit: []
    });

    useEffect(() => {
        getPayrollList();
        return () => {};
    }, [pageFilters]);

    const getPayrollList = () => {
        fetchData("GET", "api/payroll?year=" + pageFilters.year).then(res => {
            if (res.success) {
                setPayrollList([...res.data]);
            }
        });
    };

    const deletePayroll = record => {
        fetchData("DELETE", "api/payroll/" + record.id).then(res => {
            if (res.success) {
                getPayrollList();
                notification.success({
                    message: "Payroll Successfully Deleted!"
                });
            }
        });
    };

    const handleViewPayroll = record => {
        setSelectedPayroll(record);
        let debit = record.client.client_accounting_entries.filter(
            p => p.type == "debit"
        );
        let credit = record.client.client_accounting_entries.filter(
            p => p.type == "credit"
        );
        setAccountingEntries({
            ...accountingEntries,
            debit: debit,
            credit: credit
        });
        toggleShowModalPayrollViewInfo();
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
                    <Button
                        type="primary"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={e => handleViewPayroll(record)}
                    >
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

    const toggleShowModalPayrollViewInfo = () => {
        setShowModalPayrollViewInfo(!showModalPayrollViewInfo);
    };
    return (
        <>
            <Card className="mt-10">
                <Row>
                    <Col xs={24} md={21}>
                        <Title level={4}>Payroll List</Title>
                    </Col>
                    <Col xs={24} md={3}>
                        <div style={{ display: "flex" }}>
                            <Text
                                style={{ lineHeight: "2.2", paddingRight: 10 }}
                            >
                                Year
                            </Text>

                            <InputNumber
                                style={{ width: "100%" }}
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
                <Table
                    columns={columns}
                    size="small"
                    pagination={false}
                    dataSource={payrollList}
                />
            </Card>
            {selectedPayroll && (
                <ModalPayrollViewInfo
                    selectedPayroll={selectedPayroll}
                    showModalPayrollViewInfo={showModalPayrollViewInfo}
                    toggleShowModalPayrollViewInfo={
                        toggleShowModalPayrollViewInfo
                    }
                    accountingEntries={accountingEntries}
                />
            )}
        </>
    );
};

export default CardPayrollList;
