import React, { useState, useEffect } from "react";
import { Table, notification, Popconfirm, Button } from "antd";
import { fetchData } from "../../../../../../axios";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import ModalPayrollViewInfo from "../../../pagePayrolls/modalPayrollViewInfo";
import ModalPayslip from "../../../pagePayrolls/modalPayslip";

const TabClientPayrolls = ({ client_id }) => {
    const [showModalPayrollViewInfo, setShowModalPayrollViewInfo] = useState(
        false
    );
    const [selectedPayroll, setSelectedPayroll] = useState();
    const [showModalPayslip, setShowModalPayslip] = useState(false);
    const [payrollList, setPayrollList] = useState([]);
    const [accountingEntries, setAccountingEntries] = useState({
        debit: [],
        credit: []
    });

    useEffect(() => {
        getPayrollList();
        return () => {};
    }, []);
    const getPayrollList = () => {
        fetchData("GET", "api/payroll/" + client_id).then(res => {
            if (res.success) {
                // console.log(res);
                setPayrollList([...res.data]);
            }
        });
    };
    const columns = [
        {
            title: "Date start",
            dataIndex: "date_start",
            key: "date_start",
            render: (text, record) => {
                return moment(record.date_start).format("YYYY-MM-DD");
            }
        },
        {
            title: "Date End",
            dataIndex: "date_end",
            key: "date_end",
            render: (text, record) => {
                return moment(record.date_end).format("YYYY-MM-DD");
            }
        },

        {
            title: "Payslip",
            key: "payslip",
            width: "1%",
            render: (text, record) => {
                return (
                    <Button
                        type="primary"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={e => handleViewPayslip(record)}
                    >
                        View Payslip
                    </Button>
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
                if (userdata.role != "Staff") {
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
        }
    ];
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
    const toggleShowModalPayrollViewInfo = () => {
        setShowModalPayrollViewInfo(!showModalPayrollViewInfo);
    };

    let userdata = JSON.parse(localStorage.userdata);


    const toggleShowModalPayslip = () => {
        setShowModalPayslip(!showModalPayslip);
    };

    const handleViewPayslip = record => {
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
        toggleShowModalPayslip();
    };
    return (
        <>
            <Table
                columns={columns}
                size="small"
                pagination={false}
                dataSource={payrollList}
            />
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

             {selectedPayroll && showModalPayslip && (
                <ModalPayslip
                    selectedPayroll={selectedPayroll}
                    showModalPayslip={showModalPayslip}
                    toggleShowModalPayslip={toggleShowModalPayslip}
                    accountingEntries={accountingEntries}
                />
            )}
        </>
    );
};

export default TabClientPayrolls;
