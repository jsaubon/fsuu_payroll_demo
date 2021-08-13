import React, { useRef } from "react";
import { Modal, Row, Col, Card } from "antd";
import { Print, NoPrint } from "react-easy-print";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import moment from "moment";
import { currencyFormat } from "../../../currencyFormat";
import { useReactToPrint } from "react-to-print";

const ModalPayslip = ({
    selectedPayroll,
    showModalPayslip,
    toggleShowModalPayslip,
    accountingEntries
}) => {
    console.log(selectedPayroll);
    const chunk = (arr, size) =>
        Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
            arr.slice(i * size, i * size + size)
        );

    let chunkedPayrolls = chunk(selectedPayroll.client_employee_payrolls, 6);
    console.log(chunkedPayrolls);
    const componentRef = useRef();

    const handlePrintPayroll = useReactToPrint({
        content: () => componentRef.current
    });

    let cardCount = 0;

    return (
        <Modal
            title="Payslip"
            visible={showModalPayslip}
            onOk={handlePrintPayroll}
            okText={"Print"}
            cancelText={"Close"}
            onCancel={toggleShowModalPayslip}
            width="1152px"
        >
            <div ref={componentRef}>
                {chunkedPayrolls.map((chunkedPayroll, chunked_key) => {
                    return (
                        <>
                            <Row key={chunked_key}>
                                {chunkedPayroll.map((payroll, key) => {
                                    let grossPay = 0;
                                    let netPay = 0;

                                    return (
                                        <>
                                            <Col xs={12} md={12} key={key}>
                                                <Card
                                                    style={{
                                                        border:
                                                            "1px solid black"
                                                    }}
                                                    className="employeePayslip"
                                                >
                                                    <div className="text-center">
                                                        <Text
                                                            style={{
                                                                display: "block"
                                                            }}
                                                        >
                                                            <b>
                                                                {selectedPayroll
                                                                    ? selectedPayroll
                                                                          .client
                                                                          .type ==
                                                                      "Commando"
                                                                        ? "COMMANDO SECURITY SERVICE AGENCY, INC. (COMMANDO)"
                                                                        : "FIRST COMMANDO MANPOWER SERVICES"
                                                                    : ""}
                                                            </b>
                                                        </Text>
                                                        <Text>
                                                            <i>
                                                                126 T. Calo
                                                                Extension,
                                                                Butuan City
                                                                <br />
                                                                PAYSLIP
                                                            </i>
                                                        </Text>
                                                    </div>
                                                    <br />
                                                    <Row>
                                                        <Col
                                                            xs={4}
                                                            className="pr-0"
                                                        >
                                                            <Text>
                                                                <b>NAME</b>
                                                            </Text>
                                                        </Col>
                                                        <Col xs={20}>
                                                            <Text
                                                                style={{
                                                                    display:
                                                                        "block",
                                                                    borderBottom:
                                                                        "1px solid black",
                                                                    width: "70%"
                                                                }}
                                                            >
                                                                <b>
                                                                    {
                                                                        payroll
                                                                            .client_employee
                                                                            .name
                                                                    }
                                                                </b>
                                                            </Text>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col
                                                            xs={4}
                                                            className="pr-0"
                                                        >
                                                            <Text>
                                                                <b>CLIENT</b>
                                                            </Text>
                                                        </Col>
                                                        <Col xs={20}>
                                                            <Text
                                                                style={{
                                                                    display:
                                                                        "block",
                                                                    borderBottom:
                                                                        "1px solid black",
                                                                    width: "70%"
                                                                }}
                                                            >
                                                                {
                                                                    selectedPayroll
                                                                        .client
                                                                        .name
                                                                }
                                                            </Text>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col
                                                            xs={4}
                                                            className="pr-0"
                                                        >
                                                            <Text>
                                                                <b>PERIOD</b>
                                                            </Text>
                                                        </Col>
                                                        <Col xs={20}>
                                                            <Text
                                                                style={{
                                                                    display:
                                                                        "block",
                                                                    borderBottom:
                                                                        "1px solid black",
                                                                    width: "70%"
                                                                }}
                                                            >
                                                                {moment(
                                                                    selectedPayroll.date_start
                                                                ).format(
                                                                    "MM.DD.YYYY"
                                                                )}
                                                                -
                                                                {moment(
                                                                    selectedPayroll.date_end
                                                                ).format(
                                                                    "MM.DD.YYYY"
                                                                )}
                                                            </Text>
                                                        </Col>
                                                    </Row>

                                                    {/* DEBIT/CREDIT CONETNT */}
                                                    <div>
                                                        {payroll.client_employee_accountings
                                                            .filter(
                                                                p =>
                                                                    p
                                                                        .client_accounting_entry
                                                                        .type ==
                                                                    "debit"
                                                            )
                                                            .map(
                                                                (
                                                                    employee_accounting,
                                                                    employee_accountings_key
                                                                ) => {
                                                                    if (
                                                                        employee_accounting.amount !=
                                                                            0 &&
                                                                        employee_accounting
                                                                            .client_accounting_entry
                                                                            .visible
                                                                    ) {
                                                                        let title =
                                                                            employee_accounting
                                                                                .client_accounting_entry
                                                                                .title;
                                                                        let count =
                                                                            payroll.days_of_work;
                                                                        let prefix =
                                                                            "";

                                                                        if (
                                                                            title ==
                                                                            "Basic Pay"
                                                                        ) {
                                                                            count =
                                                                                payroll.days_of_work;
                                                                            prefix =
                                                                                "days";
                                                                        }
                                                                        if (
                                                                            title ==
                                                                            "Reg. Hol. Pay"
                                                                        ) {
                                                                            count =
                                                                                payroll.days_of_work_reg_hol;
                                                                            prefix =
                                                                                "days";
                                                                        }
                                                                        if (
                                                                            title ==
                                                                            "Spcl. Hol. Pay"
                                                                        ) {
                                                                            count =
                                                                                payroll.days_of_work_spcl_hol;
                                                                            prefix =
                                                                                "days";
                                                                        }

                                                                        if (
                                                                            title ==
                                                                            "Night Premium Pay"
                                                                        ) {
                                                                            count =
                                                                                payroll.night_pay;
                                                                            prefix =
                                                                                "hours";
                                                                        }
                                                                        if (
                                                                            title ==
                                                                            "Night Reg. Hol. Pay"
                                                                        ) {
                                                                            count =
                                                                                payroll.night_pay_reg_hol;
                                                                            prefix =
                                                                                "hours";
                                                                        }
                                                                        if (
                                                                            title ==
                                                                            "Night Spcl. Hol. Pay"
                                                                        ) {
                                                                            count =
                                                                                payroll.night_pay_spcl_hol;
                                                                            prefix =
                                                                                "hours";
                                                                        }

                                                                        if (
                                                                            title ==
                                                                            "Overtime Pay"
                                                                        ) {
                                                                            count =
                                                                                payroll.hours_overtime;
                                                                            prefix =
                                                                                "hours";
                                                                        }
                                                                        if (
                                                                            title ==
                                                                            "Overtime Reg. Hol. Pay"
                                                                        ) {
                                                                            count =
                                                                                payroll.hours_overtime_reg_hol;
                                                                            prefix =
                                                                                "hours";
                                                                        }
                                                                        if (
                                                                            title ==
                                                                            "Overtime Spcl. Hol. Pay"
                                                                        ) {
                                                                            count =
                                                                                payroll.hours_overtime_spcl_hol;
                                                                            prefix =
                                                                                "hours";
                                                                        }

                                                                        grossPay +=
                                                                            employee_accounting.amount;

                                                                        return (
                                                                            <Row
                                                                                key={
                                                                                    employee_accountings_key
                                                                                }
                                                                            >
                                                                                <Col
                                                                                    xs={
                                                                                        10
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        title
                                                                                    }
                                                                                </Col>
                                                                                <Col
                                                                                    xs={
                                                                                        8
                                                                                    }
                                                                                >
                                                                                    <Row>
                                                                                        <Col
                                                                                            xs={
                                                                                                10
                                                                                            }
                                                                                            className={
                                                                                                prefix !=
                                                                                                ""
                                                                                                    ? "payslip-col text-center"
                                                                                                    : ""
                                                                                            }
                                                                                        >
                                                                                            {prefix !=
                                                                                            ""
                                                                                                ? count
                                                                                                : ""}
                                                                                        </Col>
                                                                                        <Col
                                                                                            xs={
                                                                                                14
                                                                                            }
                                                                                            className={
                                                                                                prefix ==
                                                                                                ""
                                                                                                    ? "text-center"
                                                                                                    : ""
                                                                                            }
                                                                                        >
                                                                                            {prefix !=
                                                                                            ""
                                                                                                ? prefix
                                                                                                : count}
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                                <Col
                                                                                    xs={
                                                                                        6
                                                                                    }
                                                                                    className="payslip-col text-right"
                                                                                >
                                                                                    {currencyFormat(
                                                                                        employee_accounting.amount
                                                                                    )}
                                                                                </Col>
                                                                            </Row>
                                                                        );
                                                                    }
                                                                }
                                                            )}
                                                        <Row>
                                                            <Col xs={10}>
                                                                <b>
                                                                    GROSS SALARY
                                                                    :
                                                                </b>
                                                            </Col>
                                                            <Col xs={8}></Col>
                                                            <Col
                                                                xs={6}
                                                                className="payslip-col text-right"
                                                            >
                                                                <b>
                                                                    ₱
                                                                    {currencyFormat(
                                                                        grossPay
                                                                    )}
                                                                </b>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs={24}>
                                                                LESS: DEDUCTIONS
                                                            </Col>
                                                        </Row>
                                                        {payroll.client_employee_accountings
                                                            .filter(
                                                                p =>
                                                                    p
                                                                        .client_accounting_entry
                                                                        .type ==
                                                                    "credit"
                                                            )
                                                            .map(
                                                                (
                                                                    employee_accounting,
                                                                    employee_accountings_key
                                                                ) => {
                                                                    if (
                                                                        employee_accounting.amount !=
                                                                            0 &&
                                                                        employee_accounting
                                                                            .client_accounting_entry
                                                                            .visible
                                                                    ) {
                                                                        let title =
                                                                            employee_accounting
                                                                                .client_accounting_entry
                                                                                .title;

                                                                        netPay +=
                                                                            employee_accounting.amount;

                                                                        return (
                                                                            <Row
                                                                                key={
                                                                                    employee_accountings_key
                                                                                }
                                                                            >
                                                                                <Col
                                                                                    xs={
                                                                                        10
                                                                                    }
                                                                                    className="pl-30"
                                                                                >
                                                                                    {
                                                                                        title
                                                                                    }
                                                                                </Col>
                                                                                <Col
                                                                                    xs={
                                                                                        2
                                                                                    }
                                                                                ></Col>
                                                                                <Col
                                                                                    xs={
                                                                                        4
                                                                                    }
                                                                                    className="payslip-col text-right"
                                                                                >
                                                                                    {currencyFormat(
                                                                                        employee_accounting.amount
                                                                                    )}
                                                                                </Col>
                                                                            </Row>
                                                                        );
                                                                    }
                                                                }
                                                            )}
                                                        <Row>
                                                            <Col
                                                                className="pl-30"
                                                                xs={10}
                                                            >
                                                                Total Deductions
                                                            </Col>
                                                            <Col xs={8}></Col>
                                                            <Col
                                                                xs={6}
                                                                className="payslip-col text-right"
                                                            >
                                                                {currencyFormat(
                                                                    netPay
                                                                )}
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col xs={10}>
                                                                <b>NET DUE</b>
                                                            </Col>
                                                            <Col xs={8}></Col>
                                                            <Col
                                                                xs={6}
                                                                className=" text-right"
                                                                style={{
                                                                    borderBottom:
                                                                        "4px double black"
                                                                }}
                                                            >
                                                                <b>
                                                                    ₱
                                                                    {currencyFormat(
                                                                        grossPay -
                                                                            netPay
                                                                    )}
                                                                </b>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </Card>
                                            </Col>
                                        </>
                                    );
                                })}
                            </Row>
                            <div className="page-break" />
                        </>
                    );
                })}
            </div>
        </Modal>
    );
};

export default ModalPayslip;
