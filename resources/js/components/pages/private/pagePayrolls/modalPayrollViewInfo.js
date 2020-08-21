import React, { useState } from "react";
import { Modal, Row, Col, DatePicker, Input } from "antd";
import { Print } from "react-easy-print";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import moment from "moment";
import PreviewFooter from "./previewFooter";
import { currencyFormat } from "../../../currencyFormat";
const ModalPayrollViewInfo = ({
    selectedPayroll,
    showModalPayrollViewInfo,
    toggleShowModalPayrollViewInfo,
    accountingEntries
}) => {
    // console.log(selectedPayroll);
    let totalGrossPay = 0;
    let totalNetPay = 0;
    return (
        <>
            <Modal
                title="Payroll Information"
                visible={showModalPayrollViewInfo}
                onOk={toggleShowModalPayrollViewInfo}
                onCancel={toggleShowModalPayrollViewInfo}
                width="95%"
            >
                <Print single={true} name="payroll" className="payrollPrint">
                    <div className="text-center">
                        <Title level={4} className="mb-0">
                            <i>
                                {selectedPayroll
                                    ? selectedPayroll.client.type == "Commando"
                                        ? "COMMANDO SECURITY SERVICE AGENCY, INC. (COMMANDO)"
                                        : "FIRST COMMANDO MANPOWER SERVICES"
                                    : ""}
                            </i>
                        </Title>
                        <Text>
                            <i>
                                BUTUAN MAIN OFFICE
                                <br />
                                126 T. Calo Ext., 8600 Butuan City
                                <br />
                                Tel. No. (085) 342-8283 and (085) 341-3214
                            </i>
                        </Text>
                    </div>
                    <Row>
                        <Col xs={24} md={12} className="text-center">
                            <div className="ant-form-item-label">
                                <label>NAME OF CLIENT </label>
                                <Input
                                    className="br-b-only"
                                    style={{
                                        width: 200
                                    }}
                                    value={selectedPayroll.client.name}
                                />
                            </div>
                        </Col>
                        <Col xs={24} md={12} className="text-center">
                            <div className="ant-form-item-label">
                                <label>SALARY PERIOD </label>
                                <DatePicker.RangePicker
                                    style={{
                                        width: 250,
                                        borderTop: 0,
                                        borderLeft: 0,
                                        borderRight: 0
                                    }}
                                    value={[
                                        moment(
                                            selectedPayroll.date_start,
                                            "YYYY-MM-DD"
                                        ),
                                        moment(
                                            selectedPayroll.date_end,
                                            "YYYY-MM-DD"
                                        )
                                    ]}
                                    open={false}
                                    format="YYYY-MM-DD"
                                    separator="to"
                                />
                            </div>
                        </Col>
                    </Row>
                    <div className="mt-10">
                        <div className="payroll-table ant-table ant-table-bordered ant-table-responsive ant-table-small ">
                            <div className="ant-table-container">
                                <div className="ant-table-content">
                                    <table style={{ tableLayout: "auto" }}>
                                        <thead className="ant-table-thead">
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
                                                        accountingEntries.debit.filter(
                                                            p =>
                                                                p.visible ==
                                                                true
                                                        ).length + 1
                                                    }
                                                >
                                                    DEBIT
                                                </th>
                                                <th
                                                    className="ant-table-cell text-center fz-12"
                                                    colSpan={
                                                        accountingEntries.credit
                                                            .length
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
                                                            if (
                                                                debit.title ==
                                                                    "Basic Pay" ||
                                                                debit.title ==
                                                                    "Night Premium Pay" ||
                                                                debit.title ==
                                                                    "Overtime Pay"
                                                            ) {
                                                                return (
                                                                    <th
                                                                        className="ant-table-cell text-center fz-10"
                                                                        key={
                                                                            key
                                                                        }
                                                                    >
                                                                        {
                                                                            debit.title
                                                                        }
                                                                    </th>
                                                                );
                                                            }
                                                            return (
                                                                <th
                                                                    className="ant-table-cell text-center fz-10 c-pointer"
                                                                    key={key}
                                                                >
                                                                    {
                                                                        debit.title
                                                                    }
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
                                            {selectedPayroll.client_employee_payrolls.map(
                                                (employee_payroll, key) => {
                                                    let grossPay = 0;
                                                    let netPay = 0;
                                                    return (
                                                        <tr
                                                            key={key}
                                                            className="ant-table-row ant-table-row-level-0"
                                                        >
                                                            <td className="ant-table-cell text-center fz-10">
                                                                {key + 1}
                                                            </td>
                                                            <td
                                                                className="ant-table-cell text-center fz-10"
                                                                style={{
                                                                    whiteSpace:
                                                                        "nowrap"
                                                                }}
                                                            >
                                                                <b>
                                                                    {
                                                                        employee_payroll
                                                                            .client_employee
                                                                            .name
                                                                    }
                                                                </b>
                                                            </td>
                                                            <td className="ant-table-cell text-center fz-10">
                                                                {
                                                                    employee_payroll.days_of_work
                                                                }
                                                            </td>
                                                            {employee_payroll.client_employee_accountings
                                                                .filter(
                                                                    p =>
                                                                        p
                                                                            .client_accounting_entry
                                                                            .type ==
                                                                        "debit"
                                                                )
                                                                .map(
                                                                    (
                                                                        debit,
                                                                        key
                                                                    ) => {
                                                                        if (
                                                                            debit
                                                                                .client_accounting_entry
                                                                                .visible
                                                                        ) {
                                                                            grossPay += parseFloat(
                                                                                debit.amount
                                                                            );

                                                                            totalGrossPay += parseFloat(
                                                                                debit.amount
                                                                            );

                                                                            return (
                                                                                <td
                                                                                    key={
                                                                                        key
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
                                                                {grossPay.toFixed(
                                                                    2
                                                                )}
                                                            </td>
                                                            {employee_payroll.client_employee_accountings
                                                                .filter(
                                                                    p =>
                                                                        p
                                                                            .client_accounting_entry
                                                                            .type ==
                                                                        "credit"
                                                                )
                                                                .map(
                                                                    (
                                                                        credit,
                                                                        key
                                                                    ) => {
                                                                        netPay += parseFloat(
                                                                            credit.amount
                                                                        );

                                                                        totalNetPay += parseFloat(
                                                                            credit.amount
                                                                        );
                                                                        return (
                                                                            <td
                                                                                key={
                                                                                    key
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
                                                                {currencyFormat(
                                                                    grossPay -
                                                                        netPay
                                                                )}
                                                            </td>
                                                            <td></td>
                                                        </tr>
                                                    );
                                                }
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div
                                style={{ textAlign: "right", paddingRight: 72 }}
                            >
                                <b>
                                    Total:
                                    {currencyFormat(
                                        totalGrossPay - totalNetPay
                                    )}
                                </b>
                            </div>
                        </div>
                    </div>
                    <Row className="mt-15">
                        <PreviewFooter />
                    </Row>
                </Print>
            </Modal>
        </>
    );
};

export default ModalPayrollViewInfo;
