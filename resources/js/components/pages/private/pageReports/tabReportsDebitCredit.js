import React, { useState, useEffect, useRef } from "react";
import { Card, Row, Col, DatePicker, Table, Button, Select } from "antd";
import Title from "antd/lib/typography/Title";
import moment from "moment";
import { fetchData } from "../../../../axios";
import { Print } from "react-easy-print";
import { currencyFormat } from "../../../currencyFormat";
import { useReactToPrint } from "react-to-print";
import Text from "antd/lib/typography/Text";

const TabReportsDebitCredit = () => {
    const [totalAmount, setTotalAmount] = useState(0);
    const [payrollDate, setPayrollDate] = useState();
    const [payrollMonthFilter, setPayrollMonthFilter] = useState();
    const [employeeAccountingReports, setEmployeeAccountingReports] = useState(
        []
    );
    const [tableFilters, setTableFilters] = useState({
        employees: [],
        clients: [],
        entries: []
    });
    const [tableLoading, setTableLoading] = useState(false);

    useEffect(() => {
        if (payrollDate || payrollMonthFilter) {
            setTableLoading(true);

            let url = "api/employee_accounting";
            url += payrollDate
                ? "?payroll_date=" + payrollDate
                : "?payroll_month_start=" +
                  payrollMonthFilter.monthStart.format("YYYY-MM") +
                  "&payroll_month_end=" +
                  payrollMonthFilter.monthEnd.format("YYYY-MM");

            fetchData("GET", url).then(res => {
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

                        if (accounting.client_accounting_entry) {
                            let client_temp = client_filter.find(
                                p =>
                                    p.text ==
                                    accounting.client_accounting_entry.client
                                        .name
                            );
                            if (!client_temp) {
                                client_filter.push({
                                    text:
                                        accounting.client_accounting_entry
                                            .client.name,
                                    value:
                                        accounting.client_accounting_entry
                                            .client.name
                                });
                            }

                            let entry_temp = entry_filter.find(
                                p =>
                                    p.text ==
                                    accounting.client_accounting_entry.title
                            );
                            if (!entry_temp) {
                                entry_filter.push({
                                    text:
                                        accounting.client_accounting_entry
                                            .title,
                                    value:
                                        accounting.client_accounting_entry.title
                                });
                            }

                            if (
                                accounting.client_accounting_entry.type ==
                                "debit"
                            ) {
                                _totalAmount += parseFloat(accounting.amount);
                            } else {
                                _totalAmount -= parseFloat(accounting.amount);
                            }
                        }
                    });
                    setTotalAmount(_totalAmount);
                    setTableFilters({
                        ...tableFilters,
                        employees: employee_filter,
                        clients: client_filter,
                        entries: entry_filter
                    });

                    setTableLoading(false);
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
                return record.client_accounting_entry
                    ? record.client_accounting_entry.client.name
                    : "";
            },
            onFilter: (value, record) =>
                record.client_accounting_entry &&
                record.client_accounting_entry.client.name.indexOf(value) === 0,
            sorter: (a, b) =>
                a.client_accounting_entry.client.name.length -
                b.client_accounting_entry.client.name.length,
            sortDirections: ["descend", "ascend"],
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
                return record.client_accounting_entry
                    ? capitalize(record.client_accounting_entry.type)
                    : "";
            },
            onFilter: (value, record) =>
                record.client_accounting_entry &&
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
                return record.client_accounting_entry
                    ? record.client_accounting_entry.title
                    : "";
            },
            onFilter: (value, record) =>
                record.client_accounting_entry &&
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

    const componentRef = useRef();

    const handlePrintPayroll = useReactToPrint({
        content: () => componentRef.current
    });

    return (
        <Card>
            <Title level={4}>
                Debit/Credit{" "}
                <DatePicker
                    style={{ width: "200px" }}
                    placeholder="Pick a Payroll Date"
                    value={payrollDate ? moment(payrollDate) : ""}
                    onChange={e => {
                        setPayrollMonthFilter(null);
                        setPayrollDate(e.format("YYYY-MM-DD"));
                    }}
                    className="pull-right"
                />{" "}
                <span
                    className="pull-right"
                    style={{ margin: "0 10px", fontSize: 12, lineHeight: 2.5 }}
                >
                    or
                </span>
                <DatePicker.RangePicker
                    picker="month"
                    className="pull-right"
                    placeholder={["Month Start", "Month End"]}
                    value={
                        payrollMonthFilter
                            ? [
                                  moment(payrollMonthFilter.monthStart),
                                  moment(payrollMonthFilter.monthEnd)
                              ]
                            : ""
                    }
                    onChange={e => {
                        setPayrollDate(null);
                        setPayrollMonthFilter({
                            monthStart: e[0],
                            monthEnd: e[1]
                        });
                    }}
                />
            </Title>
            <div ref={componentRef}>
                <div className="text-center">
                    <Text>
                        <Select
                            style={{
                                width: "100%",
                                textAlign: "center",
                                fontSize: 20,
                                fontStyle: "italic",
                                border: "none"
                            }}
                            className="select-no-border"
                            defaultValue="COMMANDO SECURITY SERVICE AGENCY, INC.
                            (COMMANDO)"
                        >
                            <Select.Option
                                value="COMMANDO SECURITY SERVICE AGENCY, INC.
                                (COMMANDO)"
                            >
                                COMMANDO SECURITY SERVICE AGENCY, INC.
                                (COMMANDO)
                            </Select.Option>
                            <Select.Option value="FIRST COMMANDO MANPOWER SERVICES">
                                FIRST COMMANDO MANPOWER SERVICES
                            </Select.Option>
                        </Select>
                        <br></br>
                        <i>
                            BUTUAN MAIN OFFICE
                            <br />
                            126 T. Calo Ext., 8600 Butuan City
                            <br />
                            Tel. No. (085) 342-8283 and (085) 341-3214
                        </i>
                    </Text>
                    <Title level={4} className="mb-0">
                        Debit/Credit Report
                        <br />
                        {payrollMonthFilter
                            ? payrollMonthFilter.monthStart.format("YYYY-MM") !=
                              payrollMonthFilter.monthEnd.format("YYYY-MM")
                                ? `${payrollMonthFilter.monthStart.format(
                                      "MMMM YYYY"
                                  )} - ${payrollMonthFilter.monthEnd.format(
                                      "MMMM YYYY"
                                  )}`
                                : payrollMonthFilter.monthStart.format(
                                      "MMMM YYYY"
                                  )
                            : ""}
                    </Title>
                </div>
                <br />
                <Table
                    columns={columns}
                    dataSource={employeeAccountingReports}
                    onChange={onChange}
                    pagination={false}
                    size="small"
                    loading={tableLoading}
                />
                <div className="text-right mt-10">
                    <Title level={4}>
                        Total: {currencyFormat(Math.abs(totalAmount))}
                    </Title>
                </div>
            </div>

            <div className="text-right mt-10">
                <Button type="primary" onClick={e => handlePrintPayroll()}>
                    Print
                </Button>
            </div>
        </Card>
    );
};

export default TabReportsDebitCredit;
