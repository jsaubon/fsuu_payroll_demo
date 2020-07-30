import React, { useEffect } from "react";

const TblPayrollData = ({ payrollDetails, accountingEntries }) => {
    useEffect(() => {
        console.log(payrollDetails.employeePayroll);
        return () => {};
    }, [payrollDetails.employeePayroll]);
    return (
        <>
            <div className="ant-table ant-table-bordered ant-table-responsive mt-10 ant-table-small">
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
                                        colSpan={
                                            accountingEntries.debit.length + 1
                                        }
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
                                            return (
                                                <th
                                                    className="ant-table-cell text-center fz-10"
                                                    key={key}
                                                >
                                                    {debit.title}
                                                </th>
                                            );
                                        }
                                    )}
                                    <th className="ant-table-cell text-center fz-10 ">
                                        GROSS PAY
                                    </th>
                                    {accountingEntries.credit.map(
                                        (credit, key) => {
                                            return (
                                                <th
                                                    className="ant-table-cell text-center fz-10"
                                                    key={key}
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
                                        if (employee.debit.length > 0) {
                                            return (
                                                <tr
                                                    key={key}
                                                    className="ant-table-row
                                                ant-table-row-level-0"
                                                >
                                                    <td className="ant-table-cell text-center fz-10">
                                                        {key}
                                                    </td>
                                                    <td
                                                        className="ant-table-cell text-center fz-10"
                                                        style={{
                                                            whiteSpace: "nowrap"
                                                        }}
                                                    >
                                                        {employee.name}
                                                    </td>
                                                    <td className="ant-table-cell text-center fz-10">
                                                        {employee.days_of_work}
                                                    </td>
                                                    {employee.debit.map(
                                                        (debit, debit_key) => {
                                                            return (
                                                                <td
                                                                    key={
                                                                        debit_key
                                                                    }
                                                                    className="ant-table-cell text-center fz-10"
                                                                >
                                                                    {debit.title ==
                                                                    "GROSS PAY" ? (
                                                                        <b>
                                                                            {
                                                                                debit.amount
                                                                            }
                                                                        </b>
                                                                    ) : (
                                                                        debit.amount
                                                                    )}
                                                                </td>
                                                            );
                                                        }
                                                    )}
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
        </>
    );
};

export default TblPayrollData;
