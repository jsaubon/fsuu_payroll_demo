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
    setAccountingEntries,
    showForm
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
                // let row_number = 0;(res.data);
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
                    let _debit = res.debit;
                    _debit.forEach(debit => {
                        debit["visible"] =
                            debit.title == "13th-Month Pay" ? false : true;
                    });
                    let _credit = res.credit;
                    _credit.forEach(credit => {
                        credit["visible"] = true;
                    });
                    setAccountingEntries({
                        debit: _debit,
                        credit: _credit
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
                netPay: 0,
                grossPay: 0
            };

            let grossPay = 0;
            accountingEntries.debit.map((debit, key) => {
                let amount =
                    debit.title != "Overtime Pay"
                        ? debit.amount * employee.days_of_work
                        : debit.amount * employee.hours_overtime;
                amount = amount.toFixed(2);

                if (debit.title != "13th-Month Pay") {
                    grossPay += parseFloat(amount);
                }

                _employeePayroll.debit.push({
                    id: debit.id,
                    title: debit.title,
                    amount: amount,
                    visible: debit.title == "13th-Month Pay" ? false : true
                });
            });

            _employeePayroll.grossPay = grossPay.toFixed(2);

            // _employeePayroll.debit.push({
            //     title: "GROSS PAY",
            //     amount: grossPay.toFixed(2),
            //     visible: true
            // });

            let netPay = 0;
            accountingEntries.credit.map((credit, key) => {
                let amount = credit.amount;
                amount = amount.toFixed(2);
                _employeePayroll.credit.push({
                    id: credit.id,
                    title: credit.title,
                    amount: amount,
                    visible: true
                });

                netPay += parseFloat(amount);
            });
            _employeePayroll.netPay = (grossPay - netPay).toFixed(2);
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
            <Card className={`mt-10 ${!showForm && "hide"}`}>
                <Row>
                    <Col
                        xs={{ span: 24, offset: 0 }}
                        md={{ span: 12, offset: 6 }}
                    >
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
                                                                    {
                                                                        employee.name
                                                                    }
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
            </Card>
        </>
    );
};

export default FormNewPayrollData;
