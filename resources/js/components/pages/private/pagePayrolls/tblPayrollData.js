import React, { useEffect, useState } from "react";
import { Modal, Popconfirm } from "antd";
import { head } from "lodash";

const TblPayrollData = ({
    payrollDetails,
    setPayrollDetails,
    accountingEntries
}) => {
    useEffect(() => {
        //console.log("payrollDetails", payrollDetails);
        return () => {};
    }, [payrollDetails.employeePayroll]);

    const [
        showModalTblHeaderCalculation,
        setShowModalTblHeaderCalculation
    ] = useState(false);

    const [selectedHeader, setSelectedHeader] = useState();
    const toggleShowModalTblHeaderCalculation = header => {
        setSelectedHeader(header);
        setShowModalTblHeaderCalculation(!showModalTblHeaderCalculation);
    };

    const handleRemovePayrollCalculation = () => {
        let _employeePayroll = payrollDetails.employeePayroll;

        _employeePayroll.forEach(payrolls => {
            let column = payrolls[selectedHeader.type].find(
                p => p.id == selectedHeader.id
            );
            column.amount = "0.00";

            let totalDebit = 0;
            payrolls.debit.forEach(payroll => {
                if (payroll.title != "13th-Month Pay") {
                    totalDebit += parseFloat(payroll.amount);
                } else {
                    // payroll.amount = totalDebit.toFixed(2);
                }
            });
            payrolls.grossPay = totalDebit.toFixed(2);

            let totalCredit = 0;
            payrolls.credit.forEach(payroll => {
                totalCredit += parseFloat(payroll.amount);
            });
            //console.log(totalDebit, totalCredit, totalDebit - totalCredit);
            payrolls.netPay = (totalDebit - totalCredit).toFixed(2);
        });

        setPayrollDetails({
            ...payrollDetails,
            employeePayroll: [..._employeePayroll]
        });

        toggleShowModalTblHeaderCalculation();
    };

    useEffect(() => {
        // setPayrollDetails({
        //     ...payrollDetails,
        //     employeePayroll: [..._payrollData]
        // });
        return () => {};
    }, [payrollDetails.employeePayroll]);
    return (
        <>
            <div className="ant-table ant-table-bordered ant-table-responsive mt-10 ant-table-small o-flow-x">
                <div className="ant-table-container">
                    <div className="ant-table-content">
                        <table style={{ tableLayout: "auto" }}>
                            <thead className="ant-table-thead ">
                                <tr>
                                    <th
                                        className="ant-table-cell text-center fz-12"
                                        colSpan={3}
                                    >
                                        Employee
                                    </th>
                                    <th
                                        className="ant-table-cell text-center fz-12"
                                        colSpan={accountingEntries.debit.length}
                                    >
                                        DEBIT
                                    </th>
                                    <th
                                        className="ant-table-cell text-center fz-12"
                                        colSpan={
                                            accountingEntries.credit.length
                                        }
                                    >
                                        CREDIT
                                    </th>
                                    <th
                                        className="ant-table-cell text-center fz-10"
                                        rowSpan={2}
                                    >
                                        NET PAY
                                    </th>
                                    <th
                                        className="ant-table-cell text-center fz-10"
                                        rowSpan={2}
                                    >
                                        SIGNATURE
                                    </th>
                                </tr>
                                <tr>
                                    <th className="ant-table-cell text-center fz-10">
                                        #
                                    </th>
                                    <th className="ant-table-cell text-center fz-10">
                                        Name
                                    </th>
                                    <th className="ant-table-cell text-center fz-10">
                                        # of Days Work
                                    </th>
                                    {accountingEntries.debit.map(
                                        (debit, key) => {
                                            if (debit.visible) {
                                                return (
                                                    <th
                                                        className="ant-table-cell text-center fz-10 c-pointer"
                                                        key={key}
                                                        onClick={e =>
                                                            toggleShowModalTblHeaderCalculation(
                                                                debit
                                                            )
                                                        }
                                                    >
                                                        {debit.title}
                                                    </th>
                                                );
                                            }
                                        }
                                    )}
                                    <th className="ant-table-cell text-center fz-10 ">
                                        GROSS PAY
                                    </th>
                                    {accountingEntries.credit.map(
                                        (credit, key) => {
                                            return (
                                                <th
                                                    className="ant-table-cell text-center fz-10 c-pointer"
                                                    key={key}
                                                    onClick={e =>
                                                        toggleShowModalTblHeaderCalculation(
                                                            credit
                                                        )
                                                    }
                                                >
                                                    {credit.title}
                                                </th>
                                            );
                                        }
                                    )}
                                </tr>
                            </thead>
                            <tbody className="ant-table-tbody">
                                {payrollDetails.employeePayroll.map(
                                    (employee, key) => {
                                        let row_number = 0;
                                        let _debit_basic_pay = employee.debit.find(
                                            p => p.title == "Basic Pay"
                                        );

                                        if (
                                            _debit_basic_pay &&
                                            _debit_basic_pay.amount > 0
                                        ) {
                                            row_number++;
                                            return (
                                                <tr
                                                    key={key}
                                                    className="ant-table-row
                                                ant-table-row-level-0"
                                                >
                                                    <td className="ant-table-cell text-center fz-10">
                                                        {row_number}
                                                    </td>
                                                    <td
                                                        className="ant-table-cell text-center fz-10"
                                                        style={{
                                                            whiteSpace: "nowrap"
                                                        }}
                                                    >
                                                        <b>{employee.name}</b>
                                                    </td>
                                                    <td className="ant-table-cell text-center fz-10">
                                                        {employee.days_of_work}
                                                    </td>
                                                    {employee.debit.map(
                                                        (debit, debit_key) => {
                                                            if (debit.visible) {
                                                                return (
                                                                    <td
                                                                        key={
                                                                            debit_key
                                                                        }
                                                                        className="ant-table-cell text-center fz-10"
                                                                    >
                                                                        {
                                                                            debit.amount
                                                                        }
                                                                    </td>
                                                                );
                                                            }
                                                        }
                                                    )}
                                                    <td className="ant-table-cell text-center fz-10">
                                                        <b>
                                                            {employee.grossPay}
                                                        </b>
                                                    </td>
                                                    {employee.credit.map(
                                                        (
                                                            credit,
                                                            credit_key
                                                        ) => {
                                                            return (
                                                                <td
                                                                    key={
                                                                        credit_key
                                                                    }
                                                                    className="ant-table-cell text-center fz-10"
                                                                >
                                                                    {
                                                                        credit.amount
                                                                    }
                                                                </td>
                                                            );
                                                        }
                                                    )}
                                                    <td className="ant-table-cell text-center fz-10">
                                                        <b>{employee.netPay}</b>
                                                    </td>
                                                    <td className="ant-table-cell text-center fz-10"></td>
                                                </tr>
                                            );
                                        }
                                    }
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Modal
                title="Confirmation"
                okText="Yes"
                cancelText="No"
                visible={showModalTblHeaderCalculation}
                onOk={e => {
                    handleRemovePayrollCalculation();
                }}
                onCancel={toggleShowModalTblHeaderCalculation}
            >
                <p>
                    Remove "{selectedHeader && selectedHeader.title}" from
                    Payroll Calculation?
                </p>
            </Modal>
        </>
    );
};

export default TblPayrollData;
