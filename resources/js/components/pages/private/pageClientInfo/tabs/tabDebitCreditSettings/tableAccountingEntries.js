import React, { useState, useRef } from "react";
import { InputNumber, Modal, Table, Checkbox } from "antd";
import { fetchData } from "../../../../../../axios";
import moment from "moment";
import Title from "antd/lib/typography/Title";
import { Print, NoPrint } from "react-easy-print";
import { currencyFormat } from "../../../../../currencyFormat";
import { useReactToPrint } from "react-to-print";
import ModalAccoutingEntry from "./tableAccountingEntriesByEmployee";
import TableAccountingEntriesByEmployee from "./tableAccountingEntriesByEmployee";

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
                                    <th className="ant-table-cell">Fixed</th>
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
                                            <td className="ant-table-cell text-center">
                                                <Checkbox
                                                    checked={accountEntry.fixed}
                                                    onChange={e => {
                                                        let _accountingEntries = accountingEntries;
                                                        _accountingEntries[
                                                            key
                                                        ].fixed =
                                                            e.target.checked;

                                                        setAccountingEntries([
                                                            ..._accountingEntries
                                                        ]);
                                                    }}
                                                />
                                            </td>
                                            <td className="ant-table-cell">
                                                <InputNumber
                                                    value={
                                                        accountEntry.fixed
                                                            ? accountEntry.fixed_amount
                                                            : accountEntry.amount
                                                    }
                                                    min={0}
                                                    onChange={value => {
                                                        let _accountingEntries = accountingEntries;
                                                        if (
                                                            accountEntry.fixed
                                                        ) {
                                                            _accountingEntries[
                                                                key
                                                            ].fixed_amount = value;
                                                        } else {
                                                            _accountingEntries[
                                                                key
                                                            ].amount = value;
                                                        }
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
                    width={"80%"}
                    style={{ top: 20 }}
                    okText="Close"
                >
                    <TableAccountingEntriesByEmployee
                        employeeAccountingReports={employeeAccountingReports}
                        totalAmount={totalAmount}
                        setTotalAmount={setTotalAmount}
                        employeeFilters={employeeFilters}
                        yearFilters={yearFilters}
                    />
                </Modal>
            )}
        </>
    );
};

export default TableAccountingEntries;
