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
    const [rawData, setRawData] = useState([]);
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
                    let _all_data = [];
                    let _totalAmount = 0;
                    Object.values(res.data).map((entry, key) => {
                        // if(entry.amount != 0) {
                        _all_data.push(entry);

                        if (
                            (entry.client_accounting_entry.type ==
                                "debit" &&
                            entry.client_accounting_entry.visible == 1)
                        ) {
                        } else {
                            _data.push(entry);

                            if (
                                entry.client_accounting_entry.type ==
                                "debit" 
                            ) {
                                _totalAmount += parseFloat(entry.amount);
                            } else {
                                _totalAmount -= parseFloat(entry.amount);
                            }
                        }
                    });

                    setRawData(_data);

                    setEmployeeAccountingReports(_data);
                    let employee_filter = [];
                    let client_filter = [];
                    let entry_filter = [];
                    _all_data.map((accounting, key) => {
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

                            
                        }
                    });
                    console.log(entry_filter);
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

    useEffect(() => {
        console.log(tableFilters);
        return () => {};
    }, [tableFilters]);
    const capitalize = s => {
        if (typeof s !== "string") return "";
        return s.charAt(0).toUpperCase() + s.slice(1);
    };
    const [columns, setColumns] = useState([
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
                    record.client_accounting_entry.title.indexOf(value) === 0 &&
                    record.amount != 0,
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
        ]);
    useEffect(() => {
        setColumns([
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
                    record.client_accounting_entry.title.indexOf(value) === 0 &&
                    record.amount != 0,
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
        ]);
    },[tableFilters]);

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

    const [filterColumns, setFilterColumns] = useState([]);
    useEffect(() => {
        console.log(filterColumns);
        if (filterColumns.length > 0) {
            let _columns = [
                {
                    title: "Client",
                    dataIndex: "client",
                    key: "client",
                    // render: (text, record) => {
                    //     return record.client_accounting_entry
                    //         ? record.client_accounting_entry.client.name
                    //         : "";
                    // },
                    onFilter: (value, record) =>
                        record.client_accounting_entry &&
                        record.client_accounting_entry.client.name.indexOf(
                            value
                        ) === 0,
                    // sorter: (a, b) =>
                    //     a.client_accounting_entry.client.name.length -
                    //     b.client_accounting_entry.client.name.length,
                    // sortDirections: ["descend", "ascend"],
                    filters: [...tableFilters.clients]
                },

                {
                    title: "Employee",
                    dataIndex: "client_employee",
                    key: "client_employee",
                    // render: (text, record) => {
                    //     return record.client_employee.name;
                    // },
                    // onFilter: (value, record) =>
                    //     record.client_employee.name.indexOf(value) === 0,
                    filters: [...tableFilters.employees]
                }
            ];

            filterColumns.forEach((title, key) => {
                if (title != "All") {
                    _columns.push({
                        title: title,
                        dataIndex: title.replace(/ /g, "_"),
                        key: title.replace(/ /g, "_"),
                        render: (text, record) => {
                            if(record.client_employee == 'Total') {
                                return <b>{currencyFormat(
                                    record[title.replace(/ /g, "_")]
                                )}</b>;
                            } else {
                                return currencyFormat(
                                    record[title.replace(/ /g, "_")]
                                );
                            }
                            
                        }
                    });
                }
            });

            _columns.push({
                title: "Payroll Date",
                dataIndex: "client_employee_payroll",
                key: "client_employee_payroll"
                // render: (text, record) => {
                //     return (
                //         moment(
                //             record.client_employee_payroll.client_payroll
                //                 .date_start
                //         ).format("YYYY-MM-DD") +
                //         " to " +
                //         moment(
                //             record.client_employee_payroll.client_payroll
                //                 .date_end
                //         ).format("YYYY-MM-DD")
                //     );
                // }
            });

            setColumns(_columns);

            let _data = [];
            let _totalAmount = 0;

            let columnTotals = {};
            filterColumns.forEach((filter,key) => {
                columnTotals[filter] = 0;
            });
            //console.log(columnTotals);
            filterColumns.forEach((filter, key) => {
                let _filter = filter.replace(/ /g, "_");
                rawData.forEach((entry, index) => {
                    if (entry.client_accounting_entry.title == filter) {
                        let data_employee = arrayColumn(
                            _data,
                            "client_employee"
                        );

                        let employee_index = data_employee.indexOf(
                            entry.client_employee.name
                        );
                        if (employee_index !== -1) {
                            // NAA NA
                            if (_data[employee_index][_filter]) {
                                _data[employee_index][_filter] =
                                    _data[employee_index][_filter] +
                                    entry.amount;

                                if (
                                    entry.client_accounting_entry.type ==
                                    "debit"
                                ) {
                                    columnTotals[entry.client_accounting_entry.title] += entry.amount
                                        ? entry.amount
                                        : 0;
                                    _totalAmount += entry.amount
                                        ? entry.amount
                                        : 0;
                                } else {
                                    columnTotals[entry.client_accounting_entry.title] += entry.amount
                                        ? entry.amount
                                        : 0;
                                    _totalAmount -= entry.amount
                                        ? entry.amount
                                        : 0;
                                }
                            } else {
                                _data[employee_index][_filter] = entry.amount;

                                if (
                                    entry.client_accounting_entry.type ==
                                    "debit"
                                ) {
                                    columnTotals[entry.client_accounting_entry.title] += entry.amount
                                        ? entry.amount
                                        : 0;
                                    _totalAmount += entry.amount
                                        ? entry.amount
                                        : 0;
                                } else {
                                    columnTotals[entry.client_accounting_entry.title] += entry.amount
                                        ? entry.amount
                                        : 0;
                                    _totalAmount -= entry.amount
                                        ? entry.amount
                                        : 0;
                                }
                            }
                        } else {
                            let _temp = {
                                client:
                                    entry.client_accounting_entry.client.name,
                                client_employee: entry.client_employee.name,
                                client_employee_payroll:
                                    moment(
                                        entry.client_employee_payroll
                                            .client_payroll.date_start
                                    ).format("YYYY-MM-DD") +
                                    " to " +
                                    moment(
                                        entry.client_employee_payroll
                                            .client_payroll.date_end
                                    ).format("YYYY-MM-DD"),
                                [_filter]: entry.amount ? entry.amount : 0
                            };
                            if (entry.client_accounting_entry.type == "debit") {

                                columnTotals[entry.client_accounting_entry.title] += entry.amount
                                        ? entry.amount
                                        : 0;
                                _totalAmount += entry.amount ? entry.amount : 0;
                            } else {

                                columnTotals[entry.client_accounting_entry.title] += entry.amount
                                        ? entry.amount
                                        : 0;
                                _totalAmount -= entry.amount ? entry.amount : 0;
                            }

                            _data.push(_temp);
                        }
                    }
                });
            });

           // console.log('filtered',_data);
            let report_data = [];
            _data.forEach((row, index) => {
                let invalid_fields = ['client','client_employee','client_employee_payroll'];
                let subTotal = 0;
                Object.keys(row).forEach((field, key ) => {
                    if(!invalid_fields.includes(field)) {
                        subTotal += row[field];
                    }
                });
                if(subTotal > 0) {
                    report_data.push(row);
                }
            });
            // console.log('report_data',report_data);
            
            //console.log('_data[_data.length-1]',_data[_data.length-1]);
            if(report_data[report_data.length-1].client_employee != 'Total') {
                let totalRow = {
                    client: '',
                    client_employee: 'Total',
                    client_employee_payroll: ''
                };
                filterColumns.forEach((column, key) => {
                    totalRow[column.replace(/ /g, "_")] = columnTotals[column];
                });
                report_data.push(totalRow);
            }

            // ;
            setEmployeeAccountingReports(report_data);
            setTotalAmount(_totalAmount);
        }
        return () => {};
    }, [filterColumns]);

    const arrayColumn = (arr, n) => arr.map(x => x[n]);

    return (
        <Card>
            <Title level={4}>
                Debit/Credit{" "}
                {rawData.length > 0 && (
                    <Select
                        className="pull-right"
                        style={{ width: "200px" }}
                        placeholder="Pick Column"
                        mode="multiple"
                        onChange={e => {
                            setFilterColumns(e);
                        }}
                    >
                        <Select.Option value="Basic Pay">
                            Basic Pay
                        </Select.Option>
                        <Select.Option value="Night Premium Pay">
                            Night Premium Pay
                        </Select.Option>
                        <Select.Option value="13th-Month Pay">
                            13th-Month Pay
                        </Select.Option>
                        <Select.Option value="5-Day Service Leave">
                            5-Day Service Leave
                        </Select.Option>
                        <Select.Option value="COLA">COLA</Select.Option>
                        <Select.Option value="SSS">SSS</Select.Option>
                        <Select.Option value="PhilHealth">
                            PhilHealth
                        </Select.Option>
                        <Select.Option value="Pag-IBIG">Pag-IBIG</Select.Option>
                        <Select.Option value="Bond">Bond</Select.Option>
                        <Select.Option value="LOANS SSS">
                            LOANS SSS
                        </Select.Option>
                        <Select.Option value="LOANS Pag-IBIG">
                            LOANS Pag-IBIG
                        </Select.Option>
                        <Select.Option value="OTHERS C/A">
                            OTHERS C/A
                        </Select.Option>
                        <Select.Option value="OTHERS Canteen">
                            OTHERS Canteen
                        </Select.Option>
                        <Select.Option value="Overtime Pay">
                            Overtime Pay
                        </Select.Option>
                        <Select.Option value="OTHERS Misc.">
                            OTHERS Misc.
                        </Select.Option>
                        <Select.Option value="Insurance">
                            Insurance
                        </Select.Option>
                        <Select.Option value="License">License</Select.Option>
                        <Select.Option value="Separation Pay">
                            Separation Pay
                        </Select.Option>
                        <Select.Option value="Spcl. Hol. Pay">
                            Spcl. Hol. Pay
                        </Select.Option>
                        <Select.Option value="Reg. Hol. Pay">
                            Reg. Hol. Pay
                        </Select.Option>
                        <Select.Option value="SL/VL">SL/VL</Select.Option>
                        <Select.Option value="LOANS NorthStar">
                            LOANS NorthStar
                        </Select.Option>
                        <Select.Option value="OTHERS Ammos & Accessories">
                            OTHERS Ammos & Accessories
                        </Select.Option>
                        <Select.Option value="Uniform Allowance">
                            Uniform Allowance
                        </Select.Option>
                        <Select.Option value="Night Spcl. Hol. Pay">
                            Night Spcl. Hol. Pay
                        </Select.Option>
                        <Select.Option value="Overtime Spcl. Hol. Pay">
                            Overtime Spcl. Hol. Pay
                        </Select.Option>
                        <Select.Option value="Night Reg. Hol. Pay">
                            Night Reg. Hol. Pay
                        </Select.Option>
                        <Select.Option value="Overtime Reg. Hol. Pay">
                            Overtime Reg. Hol. Pay
                        </Select.Option>
                    </Select>
                )}
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
