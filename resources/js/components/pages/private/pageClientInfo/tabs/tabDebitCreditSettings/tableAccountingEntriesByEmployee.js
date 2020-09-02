import React, { useRef } from "react";
import { Modal, Table, Button } from "antd";
import Title from "antd/lib/typography/Title";
import { currencyFormat } from "../../../../../currencyFormat";
import { useReactToPrint } from "react-to-print";
import moment from "moment";

const TableAccountingEntriesByEmployee = ({
    employeeAccountingReports,
    totalAmount,
    setTotalAmount,
    employeeFilters,
    yearFilters
}) => {
    let columns = [
        {
            title: "Employer",
            dataIndex: "employer",
            key: "employer",
            render: (text, record) => {
                return record.client_employee_payroll.client_payroll.client
                    .name;
            }
        },
        {
            title: "Employee",
            dataIndex: "client_employee",
            key: "client_employee",
            render: (text, record) => {
                return record.client_employee.name;
            },
            filterMultiple: false,
            onFilter: (value, record) =>
                record.client_employee.name.indexOf(value) === 0,
            sorter: (a, b) =>
                a.client_employee.name.length - b.client_employee.name.length,
            sortDirections: ["descend", "ascend"],
            filters: [...employeeFilters]
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
            title: "Year",
            dataIndex: "year",
            key: "year",
            render: (text, record) => {
                return moment(
                    record.client_employee_payroll.client_payroll.date_start
                ).format("YYYY");
            },
            onFilter: (value, record) =>
                record.client_employee_payroll.client_payroll.date_start.indexOf(
                    value
                ) === 0,
            filters: [...yearFilters]
        },
        {
            title: "Month",
            dataIndex: "month",
            key: "month",
            render: (text, record) => {
                return moment(
                    record.client_employee_payroll.client_payroll.date_start
                ).format("MMMM");
            },
            onFilter: (value, record) =>
                record.client_employee_payroll.client_payroll.date_start.indexOf(
                    value
                ) === 0,
            filters: [
                {
                    text: "January",
                    value: "January"
                },
                {
                    text: "February",
                    value: "February"
                },
                {
                    text: "March",
                    value: "March"
                },
                {
                    text: "April",
                    value: "April"
                },
                {
                    text: "May",
                    value: "May"
                },
                {
                    text: "June",
                    value: "June"
                },
                {
                    text: "July",
                    value: "July"
                },
                {
                    text: "August",
                    value: "August"
                },
                {
                    text: "September",
                    value: "September"
                },
                {
                    text: "October",
                    value: "October"
                },
                {
                    text: "November",
                    value: "November"
                },
                {
                    text: "December",
                    value: "December"
                }
            ]
        },
        {
            title: "Payroll Date",
            dataIndex: "client_employee_payroll",
            key: "client_employee_payroll",
            render: (text, record) => {
                return (
                    moment(
                        record.client_employee_payroll.client_payroll.date_start
                    ).format("DD") +
                    " - " +
                    moment(
                        record.client_employee_payroll.client_payroll.date_end
                    ).format("DD")
                );
            },
            onFilter: (value, record) =>
                record.client_employee_payroll.client_payroll.date_start.indexOf(
                    value
                ) === 0,
            filters: [...yearFilters]
        }
    ];

    function onChange(pagination, filters, sorter, extra) {
        let _totalAmount = 0;
        extra.currentDataSource.map((record, key) => {
            _totalAmount += record.amount;
        });
        setTotalAmount(_totalAmount);
    }

    const componentRef = useRef();

    const handlePrintPayroll = useReactToPrint({
        content: () => componentRef.current
    });
    return (
        <div ref={componentRef}>
            <Table
                columns={columns}
                dataSource={employeeAccountingReports}
                onChange={onChange}
                pagination={{
                    hideOnSinglePage: true,
                    pageSize: 50
                }}
            />
            <div className="text-right mt-10">
                <Title level={4}>Total: {currencyFormat(totalAmount)}</Title>
            </div>

            <div className="text-right mt-10">
                <Button type="primary" onClick={e => handlePrintPayroll()}>
                    Print
                </Button>
            </div>
        </div>
    );
};

export default TableAccountingEntriesByEmployee;
