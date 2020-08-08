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
    showForm,
    setClientInfo
}) => {
    const [employeesList, setEmployeesList] = useState([]);
    const [showLoading, setShowLoading] = useState(false);

    useEffect(() => {
        if (payrollDetails.date_start != "") {
            setShowLoading(true);
            fetchData(
                "GET",
                "api/employee?client_id=" +
                    payrollDetails.client_id +
                    "&date_start=" +
                    payrollDetails.date_start +
                    "&date_end=" +
                    payrollDetails.date_end
            ).then(res => {
                if (res.success) {
                    setClientInfo(res.client);
                    setShowLoading(false);
                    let _employeeList = [];
                    res.data.map((employee, key) => {
                        _employeeList.push({
                            id: employee.id,
                            name: employee.name,
                            days_of_work: 0,
                            days_of_work_reg_hol: 0,
                            days_of_work_spcl_hol: 0,
                            night_pay: 0,
                            night_pay_reg_hol: 0,
                            night_pay_spcl_hol: 0,
                            hours_overtime: 0,
                            hours_overtime_reg_hol: 0,
                            hours_overtime_spcl_hol: 0,
                            deductions: employee.client_employee_deductions
                        });
                    });

                    setEmployeesList(_employeeList);
                }
            });
        }

        return () => {};
    }, [payrollDetails.date_start]);

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
                            debit.title == "13th-Month Pay" ||
                            debit.title == "Uniform Allowance"
                                ? false
                                : true;
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

    const arrayColumn = (arr, n) => arr.map(x => x[n]);
    const arrSum = arr => arr.reduce((a, b) => a + b, 0);

    useEffect(() => {
        let _payrollData = [];
        employeesList.map((employee, key) => {
            let _employeePayroll = {
                name: employee.name,
                days_of_work: employee.days_of_work,
                hours_overtime: employee.hours_overtime,
                days_of_work: employee.days_of_work,
                days_of_work_reg_hol: employee.days_of_work_reg_hol,
                days_of_work_spcl_hol: employee.days_of_work_spcl_hol,
                night_pay: employee.night_pay,
                night_pay_reg_hol: employee.night_pay_reg_hol,
                night_pay_spcl_hol: employee.night_pay_spcl_hol,
                hours_overtime: employee.hours_overtime,
                hours_overtime_reg_hol: employee.hours_overtime_reg_hol,
                hours_overtime_spcl_hol: employee.hours_overtime_spcl_hol,
                debit: [],
                credit: [],
                netPay: 0,
                grossPay: 0,
                totalBasicPay: 0,
                totalNightPay: 0,
                totalOvertimePay: 0,
                employee_id: employee.id
            };

            let grossPay = 0;
            let totalBasicPay = 0;
            let totalNightPay = 0;
            let totalOvertimePay = 0;
            accountingEntries.debit.map((debit, key) => {
                let amount = 0;

                if (debit.title == "Basic Pay") {
                    amount = debit.amount * employee.days_of_work;
                } else if (debit.title == "Reg. Hol. Pay") {
                    amount = debit.amount * employee.days_of_work_reg_hol;
                } else if (debit.title == "Spcl. Hol. Pay") {
                    amount = debit.amount * employee.days_of_work_spcl_hol;
                } else if (debit.title == "Overtime Pay") {
                    amount = debit.amount * employee.hours_overtime;
                } else if (debit.title == "Overtime Reg. Hol. Pay") {
                    amount = debit.amount * employee.hours_overtime_reg_hol;
                } else if (debit.title == "Overtime Spcl. Hol. Pay") {
                    amount = debit.amount * employee.hours_overtime_spcl_hol;
                } else if (debit.title == "Night Premium Pay") {
                    amount = debit.amount * employee.night_pay;
                } else if (debit.title == "Night Reg. Hol. Pay") {
                    amount = debit.amount * employee.night_pay_reg_hol;
                } else if (debit.title == "Night Spcl. Hol. Pay") {
                    amount = debit.amount * employee.night_pay_spcl_hol;
                } else {
                    amount = debit.amount * employee.days_of_work;
                }

                if (
                    debit.title == "Basic Pay" ||
                    debit.title == "Reg. Hol. Pay" ||
                    debit.title == "Spcl. Hol. Pay"
                ) {
                    totalBasicPay +=
                        debit.title == "Basic Pay"
                            ? debit.amount * employee.days_of_work
                            : 0;
                    totalBasicPay +=
                        debit.title == "Reg. Hol. Pay"
                            ? debit.amount * employee.days_of_work_reg_hol
                            : 0;
                    totalBasicPay +=
                        debit.title == "Spcl. Hol. Pay"
                            ? debit.amount * employee.days_of_work_spcl_hol
                            : 0;
                }

                if (
                    debit.title == "Night Premium Pay" ||
                    debit.title == "Night Reg. Hol. Pay" ||
                    debit.title == "Night Spcl. Hol. Pay"
                ) {
                    totalNightPay +=
                        debit.title == "Night Premium Pay"
                            ? debit.amount * employee.night_pay
                            : 0;
                    totalNightPay +=
                        debit.title == "Night Reg. Hol. Pay"
                            ? debit.amount * employee.night_pay_reg_hol
                            : 0;
                    totalNightPay +=
                        debit.title == "Night Spcl. Hol. Pay"
                            ? debit.amount * employee.night_pay_spcl_hol
                            : 0;
                }
                if (
                    debit.title == "Overtime Pay" ||
                    debit.title == "Overtime Reg. Hol. Pay" ||
                    debit.title == "Overtime Spcl. Hol. Pay"
                ) {
                    totalOvertimePay +=
                        debit.title == "Overtime Pay"
                            ? debit.amount * employee.hours_overtime
                            : 0;
                    totalOvertimePay +=
                        debit.title == "Overtime Reg. Hol. Pay"
                            ? debit.amount * employee.hours_overtime_reg_hol
                            : 0;
                    totalOvertimePay +=
                        debit.title == "Overtime Spcl. Hol. Pay"
                            ? debit.amount * employee.hours_overtime_spcl_hol
                            : 0;
                }

                amount = amount.toFixed(2);

                if (
                    debit.title != "13th-Month Pay" ||
                    debit.title == "Uniform Allowance"
                ) {
                    grossPay += parseFloat(amount);
                }

                _employeePayroll.debit.push({
                    id: debit.id,
                    title: debit.title,
                    amount: amount,
                    visible:
                        debit.title == "13th-Month Pay" ||
                        debit.title == "Uniform Allowance"
                            ? false
                            : true
                });
            });

            _employeePayroll.grossPay = grossPay.toFixed(2);
            _employeePayroll.totalBasicPay = totalBasicPay.toFixed(2);
            _employeePayroll.totalNightPay = totalNightPay.toFixed(2);
            _employeePayroll.totalOvertimePay = totalOvertimePay.toFixed(2);

            let netPay = 0;
            accountingEntries.credit.map((credit, key) => {
                let amount = credit.amount;
                amount = amount.toFixed(2);

                let _deduction = employee.deductions.filter(
                    p => credit.title.indexOf(p.deduction) !== -1
                );
                // console.log(_deduction);

                let sum = arrSum(arrayColumn(_deduction, "amount"));
                sum = sum + credit.amount;
                sum = sum.toFixed(2);
                _employeePayroll.credit.push({
                    id: credit.id,
                    title: credit.title,
                    amount: _deduction.length > 0 ? sum : amount,
                    visible: true
                });

                netPay += parseFloat(_deduction.length > 0 ? sum : amount);
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
                    <Col xs={{ span: 24 }} md={{ span: 24 }}>
                        <div className="ant-table ant-table-bordered ant-table-responsive ant-table-small">
                            <div className="ant-table-container">
                                <div className="ant-table-content">
                                    <table style={{ tableLayout: "auto" }}>
                                        <thead className="ant-table-thead">
                                            <tr>
                                                <th
                                                    className="ant-table-cell text-center fz-10"
                                                    colSpan={11}
                                                >
                                                    Employees
                                                </th>
                                            </tr>
                                            <tr>
                                                <th
                                                    className="ant-table-cell fz-10"
                                                    style={{ width: 50 }}
                                                >
                                                    #
                                                </th>
                                                <th className="ant-table-cell fz-10">
                                                    Name
                                                </th>
                                                <th
                                                    className="ant-table-cell fz-10 text-center"
                                                    style={{ width: 150 }}
                                                >
                                                    # of Days Work
                                                </th>
                                                <th
                                                    className="ant-table-cell fz-10 text-center"
                                                    style={{ width: 150 }}
                                                >
                                                    # of Days Work (Reg.
                                                    Holiday)
                                                </th>
                                                <th
                                                    className="ant-table-cell fz-10 text-center"
                                                    style={{ width: 150 }}
                                                >
                                                    # of Days Work (Spcl.
                                                    Holiday)
                                                </th>
                                                <th
                                                    className="ant-table-cell fz-10 text-center"
                                                    style={{ width: 150 }}
                                                >
                                                    Night Hours
                                                </th>
                                                <th
                                                    className="ant-table-cell fz-10 text-center"
                                                    style={{ width: 150 }}
                                                >
                                                    Night Hours (Reg. Holiday)
                                                </th>
                                                <th
                                                    className="ant-table-cell fz-10 text-center"
                                                    style={{ width: 150 }}
                                                >
                                                    Night Hours (Spcl. Holiday)
                                                </th>
                                                <th
                                                    className="ant-table-cell fz-10 text-center"
                                                    style={{ width: 150 }}
                                                >
                                                    Hours Overtime
                                                </th>
                                                <th
                                                    className="ant-table-cell fz-10 text-center"
                                                    style={{ width: 150 }}
                                                >
                                                    Hours Overtime (Reg.
                                                    Holiday)
                                                </th>
                                                <th
                                                    className="ant-table-cell fz-10 text-center"
                                                    style={{ width: 150 }}
                                                >
                                                    Hours Overtime (Spcl.
                                                    Holiday)
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
                                                                <td
                                                                    className="ant-table-cell"
                                                                    style={{
                                                                        whiteSpace:
                                                                            "nowrap"
                                                                    }}
                                                                >
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
                                                                        value={
                                                                            employee.days_of_work_reg_hol
                                                                        }
                                                                        onChange={value =>
                                                                            handleUpdateEmployee(
                                                                                key,
                                                                                "days_of_work_reg_hol",
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
                                                                        value={
                                                                            employee.days_of_work_spcl_hol
                                                                        }
                                                                        onChange={value =>
                                                                            handleUpdateEmployee(
                                                                                key,
                                                                                "days_of_work_spcl_hol",
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
                                                                        name="night_pay"
                                                                        value={
                                                                            employee.night_pay
                                                                        }
                                                                        onChange={value =>
                                                                            handleUpdateEmployee(
                                                                                key,
                                                                                "night_pay",
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
                                                                        name="night_pay_reg_hol"
                                                                        value={
                                                                            employee.night_pay_reg_hol
                                                                        }
                                                                        onChange={value =>
                                                                            handleUpdateEmployee(
                                                                                key,
                                                                                "night_pay_reg_hol",
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
                                                                        name="night_pay_spcl_hol"
                                                                        value={
                                                                            employee.night_pay_spcl_hol
                                                                        }
                                                                        onChange={value =>
                                                                            handleUpdateEmployee(
                                                                                key,
                                                                                "night_pay_spcl_hol",
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
                                                                <td className="ant-table-cell">
                                                                    <InputNumber
                                                                        style={{
                                                                            width:
                                                                                "100%"
                                                                        }}
                                                                        name="hours_overtime_reg_hol"
                                                                        value={
                                                                            employee.hours_overtime_reg_hol
                                                                        }
                                                                        onChange={value =>
                                                                            handleUpdateEmployee(
                                                                                key,
                                                                                "hours_overtime_reg_hol",
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
                                                                        name="hours_overtime_spcl_hol"
                                                                        value={
                                                                            employee.hours_overtime_spcl_hol
                                                                        }
                                                                        onChange={value =>
                                                                            handleUpdateEmployee(
                                                                                key,
                                                                                "hours_overtime_spcl_hol",
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
                                                        colSpan={11}
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
