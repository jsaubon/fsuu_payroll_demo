import React, { useState, useEffect } from "react";
import { Card, Table, Row, Col, DatePicker } from "antd";
import Title from "antd/lib/typography/Title";
import { fetchData } from "../../../../axios";
import moment from "moment";
import { Print } from "react-easy-print";
import { currencyFormat } from "../../../currencyFormat";
const TabReportsPayroll = () => {
    const arrayColumn = (arr, n) => arr.map(x => x[n]);
    const [payrollList, setPayrollList] = useState([]);

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
                return record.id ? record.client_payroll.client.name : "";
            },
            // filterMultiple: false,
            onFilter: (value, record) =>
                record.client_payroll.client.name.indexOf(value) === 0,
            sorter: (a, b) =>
                a.client_payroll.client.name.length -
                b.client_payroll.client.name.length,
            sortDirections: ["descend", "ascend"],
            filters: [...tableFilters.clients]
        },
        {
            title: "Employee",
            dataIndex: "employee",
            key: "employee",
            className: "fz-10  w-nowrap",
            render: (text, record) => {
                return record.id ? record.client_employee.name : "";
            },
            // filterMultiple: false,
            onFilter: (value, record) =>
                record.client_employee.name.indexOf(value) === 0,
            sorter: (a, b) =>
                a.client_employee.name.length - b.client_employee.name.length,
            sortDirections: ["descend", "ascend"],
            filters: [...tableFilters.employees]
        },
        {
            title: "Payroll Date",
            dataIndex: "payrollDate",
            key: "payrollDate",
            className: "fz-10 text-center w-nowrap",
            render: (text, record) => {
                if (record.id) {
                    return (
                        moment(record.client_payroll.date_start).format(
                            "YYYY-MM-DD"
                        ) +
                        " to " +
                        moment(record.client_payroll.date_end).format(
                            "YYYY-MM-DD"
                        )
                    );
                } else {
                    return (
                        <div className="text-right">
                            <b>Total</b>
                        </div>
                    );
                }
            }
        },
        {
            title: "13th-Month Pay",
            dataIndex: "13thMonthPay",
            key: "13thMonthPay",
            className: "fz-10 text-center",
            render: (text, record) => {
                if (record.id) {
                    let rec = record.client_employee_accountings.find(
                        p =>
                            p.client_accounting_entry != null &&
                            p.client_accounting_entry.title == "13th-Month Pay"
                    );
                    return currencyFormat(rec.amount);
                } else {
                    return <b>{currencyFormat(record.total13thMonthPay)}</b>;
                }
            }
        },
        {
            title: "Uniform Allowance",
            dataIndex: "UniformAllowance",
            key: "UniformAllowance",
            className: "fz-10 text-center",
            render: (text, record) => {
                if (record.id) {
                    let rec = record.client_employee_accountings.find(
                        p =>
                            p.client_accounting_entry != null &&
                            p.client_accounting_entry.title ==
                                "Uniform Allowance"
                    );
                    return currencyFormat(rec.amount);
                } else {
                    return (
                        <b>{currencyFormat(record.totalUniformAllowance)}</b>
                    );
                }
            }
        },
        {
            title: "SL/VL",
            dataIndex: "SLVL",
            key: "SLVL",
            className: "fz-10 text-center",
            render: (text, record) => {
                if (record.id) {
                    let rec = record.client_employee_accountings.find(
                        p =>
                            p.client_accounting_entry != null &&
                            p.client_accounting_entry.title == "SL/VL"
                    );
                    return currencyFormat(rec.amount);
                } else {
                    return <b>{currencyFormat(record.totalSLVL)}</b>;
                }
            }
        },
        {
            title: "Separation Pay",
            dataIndex: "SeparationPay",
            key: "SeparationPay",
            className: "fz-10 text-center",
            render: (text, record) => {
                if (record.id) {
                    let rec = record.client_employee_accountings.find(
                        p =>
                            p.client_accounting_entry != null &&
                            p.client_accounting_entry.title == "Separation Pay"
                    );
                    return currencyFormat(rec.amount);
                } else {
                    return <b>{currencyFormat(record.totalSeparationPay)}</b>;
                }
            }
        },
        {
            title: "SSS",
            dataIndex: "SSS",
            key: "SSS",
            className: "fz-10 text-center",
            render: (text, record) => {
                if (record.id) {
                    let rec = record.client_employee_accountings.find(
                        p =>
                            p.client_accounting_entry != null &&
                            p.client_accounting_entry.title == "SSS"
                    );
                    return currencyFormat(rec.amount);
                } else {
                    return <b>{currencyFormat(record.totalSSS)}</b>;
                }
            }
        },
        {
            title: "PhilHealth",
            dataIndex: "PhilHealth",
            key: "PhilHealth",
            className: "fz-10 text-center",
            render: (text, record) => {
                if (record.id) {
                    let rec = record.client_employee_accountings.find(
                        p =>
                            p.client_accounting_entry != null &&
                            p.client_accounting_entry.title == "PhilHealth"
                    );
                    return currencyFormat(rec.amount);
                } else {
                    return <b>{currencyFormat(record.totalPhilHealth)}</b>;
                }
            }
        },
        {
            title: "Pag-IBIG",
            dataIndex: "Pag-IBIG",
            key: "Pag-IBIG",
            className: "fz-10 text-center",
            render: (text, record) => {
                if (record.id) {
                    let rec = record.client_employee_accountings.find(
                        p =>
                            p.client_accounting_entry != null &&
                            p.client_accounting_entry.title == "Pag-IBIG"
                    );
                    return currencyFormat(rec.amount);
                } else {
                    return <b>{currencyFormat(record.totalPagIBIG)}</b>;
                }
            }
        },
        {
            title: "Bond",
            dataIndex: "Bond",
            key: "Bond",
            className: "fz-10 text-center",
            render: (text, record) => {
                if (record.id) {
                    let rec = record.client_employee_accountings.find(
                        p =>
                            p.client_accounting_entry != null &&
                            p.client_accounting_entry.title == "Bond"
                    );
                    return currencyFormat(rec.amount);
                } else {
                    return <b>{currencyFormat(record.totalBond)}</b>;
                }
            }
        },
        {
            title: "LOANS SSS",
            dataIndex: "LOANS_SSS",
            key: "LOANS_SSS",
            className: "fz-10 text-center",
            render: (text, record) => {
                if (record.id) {
                    let rec = record.client_employee_accountings.find(
                        p =>
                            p.client_accounting_entry != null &&
                            p.client_accounting_entry.title == "LOANS SSS"
                    );
                    return currencyFormat(rec.amount);
                } else {
                    return <b>{currencyFormat(record.totalLOANSSSS)}</b>;
                }
            }
        },
        {
            title: "LOANS Pag-IBIG",
            dataIndex: "LOANS_Pag-IBIG",
            key: "LOANS_Pag-IBIG",
            className: "fz-10 text-center",
            render: (text, record) => {
                if (record.id) {
                    let rec = record.client_employee_accountings.find(
                        p =>
                            p.client_accounting_entry != null &&
                            p.client_accounting_entry.title == "LOANS Pag-IBIG"
                    );
                    return currencyFormat(rec.amount);
                } else {
                    return <b>{currencyFormat(record.totalLOANSPagIBIG)}</b>;
                }
            }
        },

        {
            title: "LOANS NorthStar",
            dataIndex: "LOANS_NorthStar",
            key: "LOANS_NorthStar",
            className: "fz-10 text-center",
            render: (text, record) => {
                if (record.id) {
                    let rec = record.client_employee_accountings.find(
                        p =>
                            p.client_accounting_entry != null &&
                            p.client_accounting_entry.title == "LOANS NorthStar"
                    );
                    return rec ? currencyFormat(rec.amount) : 0;
                } else {
                    return <b>{currencyFormat(record.totalLOANNorthStar)}</b>;
                }
            }
        },
        {
            title: "OTHERS C/A",
            dataIndex: "OTHERS_C/A",
            key: "OTHERS_C/A",
            className: "fz-10 text-center",
            render: (text, record) => {
                if (record.id) {
                    let rec = record.client_employee_accountings.find(
                        p =>
                            p.client_accounting_entry != null &&
                            p.client_accounting_entry.title == "OTHERS C/A"
                    );
                    return currencyFormat(rec.amount);
                } else {
                    return <b>{currencyFormat(record.totalOTHERSCA)}</b>;
                }
            }
        },
        {
            title: "OTHERS Canteen",
            dataIndex: "OTHERS_Canteen",
            key: "OTHERS_Canteen",
            className: "fz-10 text-center",
            render: (text, record) => {
                if (record.id) {
                    let rec = record.client_employee_accountings.find(
                        p =>
                            p.client_accounting_entry != null &&
                            p.client_accounting_entry.title == "OTHERS Canteen"
                    );
                    return currencyFormat(rec.amount);
                } else {
                    return <b>{currencyFormat(record.totalOTHERSCanteen)}</b>;
                }
            }
        },
        {
            title: "OTHERS Ammos & Accessories",
            dataIndex: "OTHERS_Ammos_&_Accessories",
            key: "OTHERS_Ammos_&_Accessories",
            className: "fz-10 text-center",
            render: (text, record) => {
                if (record.id) {
                    let rec = record.client_employee_accountings.find(
                        p =>
                            p.client_accounting_entry != null &&
                            p.client_accounting_entry.title ==
                                "OTHERS Ammos & Accessories"
                    );

                    return currencyFormat(rec.amount);
                } else {
                    return (
                        <b>
                            {currencyFormat(record.totalOTHERSAmmosAccessories)}
                        </b>
                    );
                }
            }
        },
        {
            title: "OTHERS Misc.",
            dataIndex: "OTHERS_Misc.",
            key: "OTHERS_Misc.",
            className: "fz-10 text-center",
            render: (text, record) => {
                if (record.id) {
                    let rec = record.client_employee_accountings.find(
                        p =>
                            p.client_accounting_entry != null &&
                            p.client_accounting_entry.title == "OTHERS Misc."
                    );
                    return currencyFormat(rec.amount);
                } else {
                    return <b>{currencyFormat(record.totalOTHERSMisc)}</b>;
                }
            }
        }
    ];

    useEffect(() => {
        if (payrollDate) {
            fetchData(
                "GET",
                "api/employee_payroll?payroll_date=" + payrollDate
            ).then(res => {
                // console.log(res.data);
                let data = res.data;

                let _totalAmount = 0;
                let _clients = [];
                let _employees = [];
                let _entry = {
                    total13thMonthPay: 0,
                    totalUniformAllowance: 0,
                    totalSLVL: 0,
                    totalSeparationPay: 0,
                    totalSSS: 0,
                    totalPhilHealth: 0,
                    totalPagIBIG: 0,
                    totalBond: 0,
                    totalLOANSSSS: 0,
                    totalLOANSPagIBIG: 0,
                    totalLOANNorthStar: 0,
                    totalOTHERSCA: 0,
                    totalOTHERSCanteen: 0,
                    totalOTHERSAmmosAccessories: 0,
                    totalOTHERSMisc: 0
                };
                let _data = res.data;
                _data.map((payroll, key) => {
                    // console.log(payroll);
                    let recs = payroll.client_employee_accountings.filter(
                        p =>
                            p.client_accounting_entry != null &&
                            (p.client_accounting_entry.title ==
                                "13th-Month Pay" ||
                                p.client_accounting_entry.title ==
                                    "Uniform Allowance" ||
                                p.client_accounting_entry.title == "SL/VL" ||
                                p.client_accounting_entry.title ==
                                    "Separation Pay" ||
                                p.client_accounting_entry.title == "SSS" ||
                                p.client_accounting_entry.title ==
                                    "PhilHealth" ||
                                p.client_accounting_entry.title == "Pag-IBIG" ||
                                p.client_accounting_entry.title == "Bond" ||
                                p.client_accounting_entry.title ==
                                    "LOANS SSS" ||
                                p.client_accounting_entry.title ==
                                    "LOANS Pag-IBIG" ||
                                p.client_accounting_entry.title ==
                                    "LOANS NorthStar" ||
                                p.client_accounting_entry.title ==
                                    "OTHERS C/A" ||
                                p.client_accounting_entry.title ==
                                    "OTHERS Canteen" ||
                                p.client_accounting_entry.title ==
                                    "OTHERS Ammos & Accessories" ||
                                p.client_accounting_entry.title ==
                                    "OTHERS Misc.")
                    );

                    recs.map((entry, key) => {
                        _entry.total13thMonthPay +=
                            entry.client_accounting_entry.title ==
                            "13th-Month Pay"
                                ? entry.amount
                                : 0;
                        _entry.totalUniformAllowance +=
                            entry.client_accounting_entry.title ==
                            "Uniform Allowance"
                                ? entry.amount
                                : 0;
                        _entry.totalSLVL +=
                            entry.client_accounting_entry.title == "SL/VL"
                                ? entry.amount
                                : 0;
                        _entry.totalSeparationPay +=
                            entry.client_accounting_entry.title ==
                            "Separation Pay"
                                ? entry.amount
                                : 0;
                        _entry.totalSSS +=
                            entry.client_accounting_entry.title == "SSS"
                                ? entry.amount
                                : 0;
                        _entry.totalPhilHealth +=
                            entry.client_accounting_entry.title == "Phil Health"
                                ? entry.amount
                                : 0;
                        _entry.totalPagIBIG +=
                            entry.client_accounting_entry.title == "Pag-IBIG"
                                ? entry.amount
                                : 0;
                        _entry.totalLOANSSSS +=
                            entry.client_accounting_entry.title == "LOANS SSS"
                                ? entry.amount
                                : 0;
                        _entry.totalLOANSPagIBIG +=
                            entry.client_accounting_entry.title ==
                            "LOANS Pag-IBIG"
                                ? entry.amount
                                : 0;
                        _entry.totalLOANNorthStar +=
                            entry.client_accounting_entry.title ==
                            "LOANS NorthStar"
                                ? entry.amount
                                : 0;
                        _entry.totalOTHERSCA +=
                            entry.client_accounting_entry.title == "OTHERS C/A"
                                ? entry.amount
                                : 0;
                        _entry.totalOTHERSCanteen +=
                            entry.client_accounting_entry.title ==
                            "OTHERS Canteen"
                                ? entry.amount
                                : 0;
                        _entry.totalOTHERSAmmosAccessories +=
                            entry.client_accounting_entry.title ==
                            "OTHERS Ammos & Accessories"
                                ? entry.amount
                                : 0;
                        _entry.totalOTHERSMisc +=
                            entry.client_accounting_entry.title ==
                            "OTHERS Misc."
                                ? entry.amount
                                : 0;
                    });

                    recs = arrayColumn(recs, "amount");
                    recs = recs.reduce((sum, x) => sum + x);
                    _totalAmount += recs;

                    _clients.push({
                        text: payroll.client_payroll.client.name,
                        value: payroll.client_payroll.client.name
                    });
                    _employees.push({
                        text: payroll.client_employee.name,
                        value: payroll.client_employee.name
                    });
                });
                // console.log(_entry);
                data.push(_entry);

                setPayrollList(data);
                setTableFilters({
                    ...tableFilters,
                    clients: _clients,
                    employees: _employees
                });
                setTotalAmount(_totalAmount);
            });
        }

        return () => {};
    }, [payrollDate]);

    return (
        <Print>
            <Card>
                <Title level={4}>Payroll</Title>
                <Row className="mb-10">
                    <Col xs={0} md={19}></Col>
                    <Col xs={24} md={5}>
                        <DatePicker
                            style={{ width: "100%" }}
                            placeholder="Pick a Payroll Date"
                            onChange={e =>
                                setPayrollDate(e.format("YYYY-MM-DD"))
                            }
                            className="text-center"
                        />
                    </Col>
                </Row>
                <div style={{ overflowX: "auto" }}>
                    <Table
                        size="small"
                        dataSource={payrollList}
                        columns={columns}
                        pagination={false}
                    />
                </div>
                {/* <div className="text-right mt-10">Total: {totalAmount}</div> */}
            </Card>
        </Print>
    );
};

export default TabReportsPayroll;
