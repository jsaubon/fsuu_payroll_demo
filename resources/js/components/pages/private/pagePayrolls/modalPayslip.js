import React from "react";
import { Modal, Row, Col, Card } from "antd";
import { Print, NoPrint } from "react-easy-print";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";

const ModalPayslip = ({
    selectedPayroll,
    showModalPayslip,
    toggleShowModalPayslip,
    accountingEntries
}) => {
    console.log(selectedPayroll);
    return (
        <Modal
            title="Payslip"
            visible={showModalPayslip}
            onOk={toggleShowModalPayslip}
            onCancel={toggleShowModalPayslip}
            width="1152px"
        >
            <Print single={true} name="payslip" className="payslipPrint">
                <Row>
                    {selectedPayroll.client_employee_payrolls.map(
                        (payroll, key) => {
                            return (
                                <Col xs={12} md={12} key={key}>
                                    <Card>
                                        <div className="text-center">
                                            <Text style={{ display: "block" }}>
                                                <b>
                                                    {selectedPayroll
                                                        ? selectedPayroll.client
                                                              .type ==
                                                          "Commando"
                                                            ? "COMMANDO SECURITY SERVICE AGENCY, INC. (COMMANDO)"
                                                            : "FIRST COMMANDO MANPOWER SERVICES"
                                                        : ""}
                                                </b>
                                            </Text>
                                            <Text>
                                                <i>
                                                    126 T. Calo Extension,
                                                    Butuan City
                                                    <br />
                                                    PAYSLIP
                                                </i>
                                            </Text>
                                        </div>
                                    </Card>
                                </Col>
                            );
                        }
                    )}
                </Row>
            </Print>
        </Modal>
    );
};

export default ModalPayslip;
