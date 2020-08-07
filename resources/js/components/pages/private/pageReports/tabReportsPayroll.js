import React, { useState, useEffect } from "react";
import { Card, Table, Row, Col, DatePicker } from "antd";
import Title from "antd/lib/typography/Title";
import { fetchData } from "../../../../axios";
import moment from "moment";
const TabReportsPayroll = () => {
    const arrayColumn = (arr, n) => arr.map(x => x[n]);
    const [payrollList, setPayrollList] = useState([]);
    function formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    }
    const [totalAmount, setTotalAmount] = useState(0);
    const [tableFilters, setTableFilters] = useState({
        clients: [],
        employees: []
    });
    const [payrollDate, setPayrollDate] = useState();

    const columns = [
        {
            title: "Client",
            dataIndex: "client",
            key: "client",
            className: "fz-10 w-nowrap",
            render: (text, record) => {
                return record.client_employee.client.name;
            },
            // filterMultiple: false,
            onFilter: (value, record) =>
                record.client_employee.client.name.indexOf(value) === 0,
            // sorter: (a, b) =>
            //     a.client_employee.name.length - b.client_employee.name.length,
            // sortDirections: ["descend", "ascend"],
            filters: [...tableFilters.clients]
        },
        {
            title: "Employee",
            dataIndex: "employee",
            key: "employee",
            className: "fz-10  w-nowrap",
            render: (text, record) => {
                return record.client_employee.name;
            },
            // filterMultiple: false,
            onFilter: (value, record) =>
                record.client_employee.name.indexOf(value) === 0,
            // sorter: (a, b) =>
            //     a.client_employee.name.length - b.client_employee.name.length,
            // sortDirections: ["descend", "ascend"],
            filters: [...tableFilters.employees]
        },
        {
            title: "Payroll Date",
            dataIndex: "payrollDate",
            key: "payrollDate",
            className: "fz-10 text-center w-nowrap",
            render: (text, record) => {
                return (
                    moment(record.client_payroll.date_start).format(
                        "YYYY-MM-DD"
                    ) +
                    " to " +
                    moment(record.client_payroll.date_end).format("YYYY-MM-DD")
                );
            }
        },
        {
            title: "13th-Month Pay",
            dataIndex: "13thMonthPay",
            key: "13thMonthPay",
            className: "fz-10 text-center",
            render: (text, record) => {
                let rec = record.client_employee_accountings.find(
                    p => p.client_accounting_entry.title == "13th-Month Pay"
                );
                return formatNumber(rec.amount);
            }
        },
        {
            title: "SSS",
            dataIndex: "SSS",
            key: "SSS",
            className: "fz-10 text-center",
            render: (text, record) => {
                let rec = record.client_employee_accountings.find(
                    p => p.client_accounting_entry.title == "SSS"
                );
                return formatNumber(rec.amount);
            }
        },
        {
            title: "PhilHealth",
            dataIndex: "PhilHealth",
            key: "PhilHealth",
            className: "fz-10 text-center",
            render: (text, record) => {
                let rec = record.client_employee_accountings.find(
                    p => p.client_accounting_entry.title == "PhilHealth"
                );
                return formatNumber(rec.amount);
            }
        },
        {
            title: "Pag-IBIG",
            dataIndex: "Pag-IBIG",
            key: "Pag-IBIG",
            className: "fz-10 text-center",
            render: (text, record) => {
                let rec = record.client_employee_accountings.find(
                    p => p.client_accounting_entry.title == "Pag-IBIG"
                );
                return formatNumber(rec.amount);
            }
        },
        {
            title: "Bond",
            dataIndex: "Bond",
            key: "Bond",
            className: "fz-10 text-center",
            render: (text, record) => {
                let rec = record.client_employee_accountings.find(
                    p => p.client_accounting_entry.title == "Bond"
                );
                return formatNumber(rec.amount);
            }
        },
        {
            title: "LOANS SSS",
            dataIndex: "LOANS_SSS",
            key: "LOANS_SSS",
            className: "fz-10 text-center",
            render: (text, record) => {
                let rec = record.client_employee_accountings.find(
                    p => p.client_accounting_entry.title == "LOANS SSS"
                );
                return formatNumber(rec.amount);
            }
        },
        {
            title: "LOANS Pag-IBIG",
            dataIndex: "LOANS_Pag-IBIG",
            key: "LOANS_Pag-IBIG",
            className: "fz-10 text-center",
            render: (text, record) => {
                let rec = record.client_employee_accountings.find(
                    p => p.client_accounting_entry.title == "LOANS Pag-IBIG"
                );
                return formatNumber(rec.amount);
            }
        },
        {
            title: "OTHERS C/A",
            dataIndex: "OTHERS_C/A",
            key: "OTHERS_C/A",
            className: "fz-10 text-center",
            render: (text, record) => {
                let rec = record.client_employee_accountings.find(
                    p => p.client_accounting_entry.title == "OTHERS C/A"
                );
                return formatNumber(rec.amount);
            }
        },
        {
            title: "OTHERS Canteen",
            dataIndex: "OTHERS_Canteen",
            key: "OTHERS_Canteen",
            className: "fz-10 text-center",
            render: (text, record) => {
                let rec = record.client_employee_accountings.find(
                    p => p.client_accounting_entry.title == "OTHERS Canteen"
                );
                return formatNumber(rec.amount);
            }
        },
        {
            title: "OTHERS Ammos & Accessories",
            dataIndex: "OTHERS_Ammos_&_Accessories",
            key: "OTHERS_Ammos_&_Accessories",
            className: "fz-10 text-center",
            render: (text, record) => {
                let rec = record.client_employee_accountings.find(
                    p =>
                        p.client_accounting_entry.title ==
                        "OTHERS Ammos & Accessories"
                );
                return formatNumber(rec.amount);
            }
        },
        {
            title: "OTHERS Misc.",
            dataIndex: "OTHERS_Misc.",
            key: "OTHERS_Misc.",
            className: "fz-10 text-center",
            render: (text, record) => {
                let rec = record.client_employee_accountings.find(
                    p => p.client_accounting_entry.title == "OTHERS Misc."
                );
                return formatNumber(rec.amount);
            }
        },
        {
            title: "Total",
            dataIndex: "total",
            key: "total",
            className: "fz-10 text-center",
            render: (text, record) => {
                let recs = record.client_employee_accountings.filter(
                    p =>
                        p.client_accounting_entry.title == "13th-Month Pay" ||
                        p.client_accounting_entry.title == "SSS" ||
                        p.client_accounting_entry.title == "PhilHealth" ||
                        p.client_accounting_entry.title == "Pag-IBIG" ||
                        p.client_accounting_entry.title == "Bond" ||
                        p.client_accounting_entry.title == "LOANS SSS" ||
                        p.client_accounting_entry.title == "LOANS Pag-IBIG" ||
                        p.client_accounting_entry.title == "OTHERS C/A" ||
                        p.client_accounting_entry.title == "OTHERS Canteen" ||
                        p.client_accounting_entry.title == "OTHERS Misc."
                );
                recs = arrayColumn(recs, "amount");
                recs = recs.reduce((sum, x) => sum + x);

                return formatNumber(recs);
            }
        }
    ];

    useEffect(() => {
        if (payrollDate) {
            fetchData(
                "GET",
                "api/employee_payroll?payroll_date=" + payrollDate
            ).then(res => {
                setPayrollList(res.data);
                let _totalAmount = 0;
                let _clients = [];
                let _employees = [];
                res.data.map((payroll, key) => {
                    let recs = payroll.client_employee_accountings.filter(
                        p =>
                            p.client_accounting_entry.title ==
                                "13th-Month Pay" ||
                            p.client_accounting_entry.title == "SSS" ||
                            p.client_accounting_entry.title == "PhilHealth" ||
                            p.client_accounting_entry.title == "Pag-IBIG" ||
                            p.client_accounting_entry.title == "Bond" ||
                            p.client_accounting_entry.title == "LOANS SSS" ||
                            p.client_accounting_entry.title ==
                                "LOANS Pag-IBIG" ||
                            p.client_accounting_entry.title == "OTHERS C/A" ||
                            p.client_accounting_entry.title ==
                                "OTHERS Canteen" ||
                            p.client_accounting_entry.title == "OTHERS Misc."
                    );
                    recs = arrayColumn(recs, "amount");
                    recs = recs.reduce((sum, x) => sum + x);
                    _totalAmount += recs;

                    _clients.push({
                        text: payroll.client_employee.client.name,
                        value: payroll.client_employee.client.name
                    });
                    _employees.push({
                        text: payroll.client_employee.name,
                        value: payroll.client_employee.name
                    });
                });
                setTableFilters({
                    ...tableFilters,
                    clients: _clients,
                    employees: _employees
                });
                setTotalAmount(formatNumber(_totalAmount.toFixed(2)));
            });
        }

        return () => {};
    }, [payrollDate]);

    return (
        <Card>
            <Title level={4}>Payroll</Title>
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
            <Table
                size="small"
                dataSource={payrollList}
                columns={columns}
                pagination={false}
            />
            <div className="text-right mt-10">Total: {totalAmount}</div>
        </Card>
    );
};

export default TabReportsPayroll;
