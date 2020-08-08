import React, { useState, useEffect } from "react";
import { Card, Row, Col, DatePicker, Table } from "antd";
import Title from "antd/lib/typography/Title";
import moment from "moment";
import { fetchData } from "../../../../axios";
import { Print } from "react-easy-print";

const TabReportsDebitCredit = () => {
    const [totalAmount, setTotalAmount] = useState(0);
    const [payrollDate, setPayrollDate] = useState();
    const [employeeAccountingReports, setEmployeeAccountingReports] = useState(
        []
    );
    const [tableFilters, setTableFilters] = useState({
        employees: [],
        clients: [],
        entries: []
    });

    useEffect(() => {
        if (payrollDate) {
            fetchData(
                "GET",
                "api/employee_accounting?payroll_date=" + payrollDate
            ).then(res => {
                if (res.success) {
                    let _data = [];
                    Object.values(res.data).map((entry, key) => {
                        _data.push(entry);
                    });

                    setEmployeeAccountingReports(_data);
                    let employee_filter = [];
                    let client_filter = [];
                    let entry_filter = [];
                    let _totalAmount = 0;
                    _data.map((accounting, key) => {
                        let emp_temp = employee_filter.find(
                            p => p.text == accounting.client_employee.name
                        );
                        if (!emp_temp) {
                            employee_filter.push({
                                text: accounting.client_employee.name,
                                value: accounting.client_employee.name
                            });
                        }

                        let client_temp = client_filter.find(
                            p =>
                                p.text ==
                                accounting.client_accounting_entry.client.name
                        );
                        if (!client_temp) {
                            client_filter.push({
                                text:
                                    accounting.client_accounting_entry.client
                                        .name,
                                value:
                                    accounting.client_accounting_entry.client
                                        .name
                            });
                        }

                        let entry_temp = entry_filter.find(
                            p =>
                                p.text ==
                                accounting.client_accounting_entry.title
                        );
                        if (!entry_temp) {
                            entry_filter.push({
                                text: accounting.client_accounting_entry.title,
                                value: accounting.client_accounting_entry.title
                            });
                        }

                        if (
                            accounting.client_accounting_entry.type == "debit"
                        ) {
                            _totalAmount += parseFloat(accounting.amount);
                        } else {
                            _totalAmount -= parseFloat(accounting.amount);
                        }
                    });
                    setTotalAmount(_totalAmount);
                    setTableFilters({
                        ...tableFilters,
                        employees: employee_filter,
                        clients: client_filter,
                        entries: entry_filter
                    });
                }
            });
        }
        return () => {};
    }, [payrollDate]);

    const capitalize = s => {
        if (typeof s !== "string") return "";
        return s.charAt(0).toUpperCase() + s.slice(1);
    };

    let columns = [
        {
            title: "Client",
            dataIndex: "client",
            key: "client",
            render: (text, record) => {
                return record.client_accounting_entry.client.name;
            },
            onFilter: (value, record) =>
                record.client_accounting_entry.client.name.indexOf(value) === 0,
            // sorter: (a, b) => a.client.name.length - b.client.name.length,
            // sortDirections: ["descend", "ascend"],
            filters: [...tableFilters.clients]
        },

        {
            title: "Employee",
            dataIndex: "client_employee",
            key: "client_employee",
            render: (text, record) => {
                return record.client_employee.name;
            },
            onFilter: (value, record) =>
                record.client_employee.name.indexOf(value) === 0,
            filters: [...tableFilters.employees]
        },

        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (text, record) => {
                return capitalize(record.client_accounting_entry.type);
            },
            onFilter: (value, record) =>
                record.client_accounting_entry.type.indexOf(value) === 0,
            filters: [
                {
                    text: "Debit",
                    value: "debit"
                },
                {
                    text: "Credit",
                    value: "credit"
                }
            ]
        },
        {
            title: "Entry",
            dataIndex: "entry",
            key: "entry",
            render: (text, record) => {
                return record.client_accounting_entry.title;
            },
            onFilter: (value, record) =>
                record.client_accounting_entry.title.indexOf(value) === 0,
            filters: [...tableFilters.entries]
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (text, record) => {
                return currencyFormat(record.amount);
            }
        },
        {
            title: "Payroll Date",
            dataIndex: "client_employee_payroll",
            key: "client_employee_payroll",
            render: (text, record) => {
                return (
                    moment(
                        record.client_employee_payroll.client_payroll.date_start
                    ).format("YYYY-MM-DD") +
                    " to " +
                    moment(
                        record.client_employee_payroll.client_payroll.date_end
                    ).format("YYYY-MM-DD")
                );
            }
        }
    ];

    function onChange(pagination, filters, sorter, extra) {
        let _totalAmount = 0;
        extra.currentDataSource.map((record, key) => {
            if (record.client_accounting_entry.type == "debit") {
                _totalAmount += parseFloat(record.amount);
            } else {
                _totalAmount -= parseFloat(record.amount);
            }
            // console.log(
            //     "_totalAmount",
            //     record.client_accounting_entry.type,
            //     record.amount,
            //     _totalAmount
            // );
        });
        setTotalAmount(_totalAmount);
    }

    function currencyFormat(num) {
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    }
    return (
        <Card>
            <Title level={4}>Debit/Credit</Title>
            <Row className="mb-10">
                <Col xs={0} md={19}></Col>
                <Col xs={24} md={5}>
                    <DatePicker
                        style={{ width: "100%" }}
                        placeholder="Pick a Payroll Date"
                        onChange={e => setPayrollDate(e.format("YYYY-MM-DD"))}
                        className="text-center"
                    />
                </Col>
            </Row>
            <Print>
                <Table
                    columns={columns}
                    dataSource={employeeAccountingReports}
                    onChange={onChange}
                    pagination={false}
                    size="small"
                />
                <div className="text-right mt-10">
                    <Title level={4}>
                        Total: {currencyFormat(totalAmount)}
                    </Title>
                </div>
            </Print>
        </Card>
    );
};

export default TabReportsDebitCredit;
