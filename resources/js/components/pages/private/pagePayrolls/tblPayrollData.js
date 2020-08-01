import React, { useEffect, useState } from "react";
import { Modal, Popconfirm, InputNumber, Row, Col, Input } from "antd";
import { head } from "lodash";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import PreviewFooter from "./previewFooter";

const TblPayrollData = ({
    payrollDetails,
    setPayrollDetails,
    accountingEntries,
    showForm
}) => {
    useEffect(() => {
        //console.log("payrollDetails", payrollDetails);
        return () => {};
    }, [payrollDetails.employeePayroll]);

    const [
        showModalTblHeaderCalculation,
        setShowModalTblHeaderCalculation
    ] = useState(false);

    const [showModalEditAmount, setShowModalEditAmount] = useState(false);

    const [selectedTD, setSelectedTD] = useState();
    const toggleShowModalEditAmount = TD => {
        setSelectedTD(TD);
        setShowModalEditAmount(!showModalEditAmount);
    };

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

    let row_number = 0;

    const handleBtnEditAmount = (employee_key, type, entry_key, entry) => {
        let data = {
            employee_key,
            type,
            entry_key,
            entry
        };
        toggleShowModalEditAmount(data);
    };

    const [triggerCalculate, setTriggerCalculate] = useState(false);
    const handleModalEditAmount = () => {
        let _employeePayroll = payrollDetails.employeePayroll;
        _employeePayroll[selectedTD.employee_key][selectedTD.type][
            selectedTD.entry_key
        ] = selectedTD.entry;

        setPayrollDetails({
            ...payrollDetails,
            employeePayroll: [..._employeePayroll]
        });

        toggleShowModalEditAmount();
        setTriggerCalculate(true);
    };

    const reCalculate = () => {
        let _employeePayroll = payrollDetails.employeePayroll;
        _employeePayroll.forEach(payrolls => {
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
        setTriggerCalculate(false);
    };

    useEffect(() => {
        if (triggerCalculate) {
            reCalculate();
        }
        return () => {};
    }, [triggerCalculate]);

    return (
        <>
            <div
                className={`ant-table ant-table-bordered ant-table-responsive mt-10 ant-table-small ${showForm &&
                    "hide"}`}
            >
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
                                                                        className="ant-table-cell text-center fz-10 c-pointer"
                                                                        onClick={e =>
                                                                            handleBtnEditAmount(
                                                                                key,
                                                                                "debit",
                                                                                debit_key,
                                                                                debit
                                                                            )
                                                                        }
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
                                                                    className="ant-table-cell text-center fz-10 c-pointer"
                                                                    onClick={e =>
                                                                        handleBtnEditAmount(
                                                                            key,
                                                                            "credit",
                                                                            credit_key,
                                                                            credit
                                                                        )
                                                                    }
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

            <Row className={`mt-15 ${showForm && "hide"}`}>
                <PreviewFooter />
            </Row>
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

            <Modal
                title={selectedTD && selectedTD.entry.title}
                okText="Re Calculate"
                cancelText="Cancel"
                visible={showModalEditAmount}
                onOk={e => {
                    handleModalEditAmount();
                }}
                onCancel={e => toggleShowModalEditAmount()}
            >
                {selectedTD && (
                    <>
                        <InputNumber
                            value={parseFloat(selectedTD.entry.amount)}
                            step="0.01"
                            min={0}
                            style={{ width: "100%" }}
                            onChange={value =>
                                setSelectedTD({
                                    ...selectedTD,
                                    entry: {
                                        ...selectedTD.entry,
                                        amount: value.toFixed(2)
                                    }
                                })
                            }
                        />
                    </>
                )}
            </Modal>
        </>
    );
};

export default TblPayrollData;
