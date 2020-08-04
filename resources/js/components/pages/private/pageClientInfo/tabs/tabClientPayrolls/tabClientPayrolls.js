import React, { useState, useEffect } from "react";
import { Table, notification, Popconfirm, Button } from "antd";
import { fetchData } from "../../../../../../axios";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import ModalPayrollViewInfo from "../../../pagePayrolls/modalPayrollViewInfo";

const TabClientPayrolls = ({ client_id }) => {
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
        </>
    );
};

export default TabClientPayrolls;
