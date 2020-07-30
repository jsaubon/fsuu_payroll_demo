import React, { useState, useEffect } from "react";
import Title from "antd/lib/typography/Title";
import {
    Card,
    Form,
    Input,
    Row,
    Col,
    Select,
    InputNumber,
    DatePicker,
    Button,
    notification
} from "antd";
import { fetchData } from "../../../../axios";

const FormNewPayrollData = ({
    payrollDetails,
    setPayrollDetails,
    accountingEntries,
    setAccountingEntries
}) => {
    const [employeesList, setEmployeesList] = useState([]);
    const [showLoading, setShowLoading] = useState(false);

    useEffect(() => {
        setShowLoading(true);
        fetchData(
            "GET",
            "api/employee?client_id=" + payrollDetails.client_id
        ).then(res => {
            if (res.success) {
                setShowLoading(false);
                // setEmployeesList(res.data);
                // console.log(res.data);
                let _employeeList = [];
                res.data.map((employee, key) => {
                    _employeeList.push({
                        id: employee.id,
                        name: employee.name,
                        days_of_work: 0,
                        hours_overtime: 0
                    });
                });

                setEmployeesList(_employeeList);
            }
        });

        return () => {};
    }, [payrollDetails.client_id]);

    useEffect(() => {
        // console.log(payrollDetails);
        if (payrollDetails.client_id != "") {
            fetchData(
                "GET",
                "api/accounting_entry?client_id=" + payrollDetails.client_id
            ).then(res => {
                if (res.success) {
                    setAccountingEntries({
                        debit: res.debit,
                        credit: res.credit
                    });
                }
            });
        }
        return () => {};
    }, [payrollDetails]);

    const handleUpdateEmployee = (index, key, value) => {
        let _employeeList = [...employeesList];
        _employeeList[index][key] = value;
        setEmployeesList([..._employeeList]);
    };

    useEffect(() => {
        let _payrollData = [];
        employeesList.map((employee, key) => {
            let _employeePayroll = {
                name: employee.name,
                days_of_work: employee.days_of_work,
                debit: [],
                credit: [],
                neyPay: 0
            };

            let grossPay = 0;
            accountingEntries.debit.map((debit, key) => {
                let amount =
                    debit.title != "Overtime Pay"
                        ? debit.amount * employee.days_of_work
                        : debit.amount * employee.hours_overtime;

                grossPay += amount;

                _employeePayroll.debit.push({
                    title: debit.title,
                    amount: amount
                });
            });
            _employeePayroll.debit.push({
                title: "GROSS PAY",
                amount: grossPay
            });

            let netPay = 0;
            accountingEntries.credit.map((credit, key) => {
                _employeePayroll.credit.push({
                    title: credit.title,
                    amount: credit.amount
                });

                netPay += credit.amount;
            });
            _employeePayroll.netPay =
                _employeePayroll.debit[_employeePayroll.debit.length - 1]
                    .amount - netPay;
            _payrollData.push(_employeePayroll);
        });
        setPayrollDetails({
            ...payrollDetails,
            employeePayroll: [..._payrollData]
        });
        return () => {};
    }, [employeesList]);

    return (
        <>
            <Row>
                <Col xs={{ span: 24, offset: 0 }} md={{ span: 12, offset: 6 }}>
                    <div className="ant-table ant-table-bordered ant-table-responsive">
                        <div className="ant-table-container">
                            <div className="ant-table-content">
                                <table style={{ tableLayout: "auto" }}>
                                    <thead className="ant-table-thead">
                                        <tr>
                                            <th
                                                className="ant-table-cell text-center"
                                                colSpan={4}
                                            >
                                                Employees
                                            </th>
                                        </tr>
                                        <tr>
                                            <th
                                                className="ant-table-cell"
                                                style={{ width: 50 }}
                                            >
                                                #
                                            </th>
                                            <th className="ant-table-cell">
                                                Name
                                            </th>
                                            <th
                                                className="ant-table-cell text-center"
                                                style={{ width: 150 }}
                                            >
                                                # of Days Work
                                            </th>
                                            <th
                                                className="ant-table-cell text-center"
                                                style={{ width: 150 }}
                                            >
                                                Hours Overtime
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="ant-table-tbody">
                                        {employeesList.length > 0 ? (
                                            employeesList.map(
                                                (employee, key) => {
                                                    return (
                                                        <tr
                                                            key={key}
                                                            className="ant-table-row ant-table-row-level-0"
                                                        >
                                                            <td className="ant-table-cell">
                                                                {key + 1}
                                                            </td>
                                                            <td className="ant-table-cell">
                                                                {employee.name}
                                                            </td>
                                                            <td className="ant-table-cell">
                                                                <InputNumber
                                                                    style={{
                                                                        width:
                                                                            "100%"
                                                                    }}
                                                                    value={
                                                                        employee.days_of_work
                                                                    }
                                                                    onChange={value =>
                                                                        handleUpdateEmployee(
                                                                            key,
                                                                            "days_of_work",
                                                                            value
                                                                        )
                                                                    }
                                                                    min={0}
                                                                />
                                                            </td>
                                                            <td className="ant-table-cell">
                                                                <InputNumber
                                                                    style={{
                                                                        width:
                                                                            "100%"
                                                                    }}
                                                                    name="hours_overtime"
                                                                    value={
                                                                        employee.hours_overtime
                                                                    }
                                                                    onChange={value =>
                                                                        handleUpdateEmployee(
                                                                            key,
                                                                            "hours_overtime",
                                                                            value
                                                                        )
                                                                    }
                                                                    min={0}
                                                                />
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            )
                                        ) : (
                                            <tr
                                                className="ant-table-row
                                            ant-table-row-level-0"
                                            >
                                                <td
                                                    className="ant-table-cell text-center"
                                                    colSpan={4}
                                                >
                                                    No Data Found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default FormNewPayrollData;
