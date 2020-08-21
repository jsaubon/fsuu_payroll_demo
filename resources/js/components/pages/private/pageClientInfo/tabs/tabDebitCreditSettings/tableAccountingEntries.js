import React, { useState } from "react";
import { InputNumber, Modal, Table, Checkbox } from "antd";
import { fetchData } from "../../../../../../axios";
import moment from "moment";
import Title from "antd/lib/typography/Title";
import { Print, NoPrint } from "react-easy-print";
import { currencyFormat } from "../../../../../currencyFormat";

const TableAccountingEntries = ({
    accountingEntries,
    setAccountingEntries
}) => {
    const [
        showModalAccountingReports,
        setShowModalAccountingReports
    ] = useState(false);
    const [
        employeeAccountingReports,
        setEmployeeAccountingReports
    ] = useState();
    const [selectedAccountingEntry, setSelectedAccountingEntry] = useState();
    const toggleShowModalAccountingReports = () => {
        setShowModalAccountingReports(!showModalAccountingReports);
    };
    const [employeeFilters, setEmployeeFilters] = useState([]);
    const [yearFilters, setYearFilters] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    const showReports = (e, _accountEntry) => {
        setSelectedAccountingEntry(_accountEntry);
        setEmployeeAccountingReports(null);
        e.preventDefault(true);
        fetchData("GET", "api/employee_accounting/" + _accountEntry.id).then(
            res => {
                if (res.success) {
                    setEmployeeAccountingReports(res.data);
                    toggleShowModalAccountingReports();
                    let employee_filter = [];
                    let year_filter = [];
                    let _totalAmount = 0;
                    res.data.map((accounting, key) => {
                        //console.log(accounting.client_employee_payroll.client_payroll.date_start);
                        let emp_temp = employee_filter.find(
                            p => p.text == accounting.client_employee.name
                        );
                        if (!emp_temp) {
                            employee_filter.push({
                                text: accounting.client_employee.name,
                                value: accounting.client_employee.name
                            });
                        }

                        let year_temp = year_filter.find(
                            p =>
                                p.text ==
                                moment(
                                    accounting.client_employee_payroll
                                        .client_payroll.date_start
                                ).format("YYYY")
                        );

                        if (!year_temp) {
                            year_filter.push({
                                text: moment(
                                    accounting.client_employee_payroll
                                        .client_payroll.date_start
                                ).format("YYYY"),
                                value: moment(
                                    accounting.client_employee_payroll
                                        .client_payroll.date_start
                                ).format("YYYY")
                            });
                        }

                        _totalAmount += parseFloat(accounting.amount);
                    });

                    setYearFilters(year_filter);
                    setTotalAmount(_totalAmount);
                    setEmployeeFilters([...employee_filter]);
                }
            }
        );
    };

    let columns = [
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
    return (
        <>
            <div className="ant-table ant-table-bordered">
                <div className="ant-table-container">
                    <div className="ant-table-content">
                        <table style={{ tableLayout: "auto" }}>
                            <thead className="ant-table-thead">
                                <tr>
                                    <th className="ant-table-cell">Title</th>
                                    <th className="ant-table-cell">Visible</th>
                                    <th
                                        className="ant-table-cell"
                                        style={{ width: "10%" }}
                                    >
                                        Amount
                                    </th>
                                    <th
                                        className="ant-table-cell"
                                        style={{ width: "10%" }}
                                    >
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="ant-table-tbody">
                                {accountingEntries.map((accountEntry, key) => {
                                    return (
                                        <tr
                                            className="ant-table-row ant-table-row-level-0"
                                            key={key}
                                        >
                                            <td className="ant-table-cell">
                                                {accountEntry.title}
                                            </td>

                                            <td className="ant-table-cell text-center">
                                                <Checkbox
                                                    checked={
                                                        accountEntry.visible
                                                    }
                                                    onChange={e => {
                                                        let _accountingEntries = accountingEntries;
                                                        _accountingEntries[
                                                            key
                                                        ].visible =
                                                            e.target.checked;
                                                        setAccountingEntries([
                                                            ..._accountingEntries
                                                        ]);
                                                    }}
                                                />
                                            </td>
                                            <td className="ant-table-cell">
                                                <InputNumber
                                                    value={accountEntry.amount}
                                                    min={0}
                                                    onChange={value => {
                                                        let _accountingEntries = accountingEntries;
                                                        _accountingEntries[
                                                            key
                                                        ].amount = value;
                                                        setAccountingEntries([
                                                            ..._accountingEntries
                                                        ]);
                                                    }}
                                                />
                                            </td>

                                            <td className="ant-table-cell">
                                                <a
                                                    href="#"
                                                    onClick={e =>
                                                        showReports(
                                                            e,
                                                            accountEntry
                                                        )
                                                    }
                                                >
                                                    Reports
                                                </a>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {selectedAccountingEntry && (
                <Modal
                    title={selectedAccountingEntry.title}
                    visible={showModalAccountingReports}
                    onOk={e => toggleShowModalAccountingReports()}
                    onCancel={toggleShowModalAccountingReports}
                    // confirmLoading={formSaveLoading}
                    // width={"90%"}
                    style={{ top: 20 }}
                    okText="Close"
                >
                    <Table
                        columns={columns}
                        dataSource={employeeAccountingReports}
                        onChange={onChange}
                        pagination={{ hideOnSinglePage: true, pageSize: 50 }}
                    />
                    <div className="text-right mt-10">
                        <Title level={4}>
                            Total: {currencyFormat(totalAmount)}
                        </Title>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default TableAccountingEntries;
