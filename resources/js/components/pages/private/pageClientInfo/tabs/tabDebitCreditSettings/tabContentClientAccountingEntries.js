import React, { useState, useEffect } from "react";
import {
    Row,
    Col,
    Button,
    Input,
    Table,
    Divider,
    Form,
    InputNumber,
    Space,
    notification
} from "antd";
import { fetchData } from "../../../../../../axios";
import Title from "antd/lib/typography/Title";
import TableAccountingEntries from "./tableAccountingEntries";

const TabContentClientAccountingEntries = ({ client_id }) => {
    const [creditList, setCreditList] = useState([
        {
            title: "SSS",
            amount: 0,
            visible: true
        },
        {
            title: "PhilHealth",
            amount: 0,
            visible: true
        },
        {
            title: "Pag-IBIG",
            amount: 0,
            visible: true
        },
        {
            title: "Bond",
            amount: 0,
            visible: true
        },
        {
            title: "LOANS SSS",
            amount: 0,
            visible: true
        },
        {
            title: "LOANS Pag-IBIG",
            amount: 0,
            visible: true
        },
        {
            title: "OTHERS C/A",
            amount: 0,
            visible: true
        },
        {
            title: "OTHERS Canteen",
            amount: 0,
            visible: true
        },
        {
            title: "OTHERS Ammos & Accessories",
            amount: 0,
            visible: true
        },
        {
            title: "OTHERS Misc.",
            amount: 0,
            visible: true
        }
    ]);
    const [debitList, setDebitList] = useState([
        {
            title: "Basic Pay",
            amount: 0,
            visible: true
        },
        {
            title: "Reg. Hol. Pay",
            amount: 0,
            visible: false
        },
        {
            title: "Spcl. Hol. Pay",
            amount: 0,
            visible: false
        },
        {
            title: "Night Premium Pay",
            amount: 0,
            visible: true
        },
        {
            title: "Night Reg. Hol. Pay",
            amount: 0,
            visible: false
        },
        {
            title: "Night Spcl. Hol. Pay",
            amount: 0,
            visible: false
        },
        {
            title: "13th-Month Pay",
            amount: 0,
            visible: false
        },
        {
            title: "Uniform Allowance",
            amount: 0,
            visible: false
        },
        {
            title: "5-Day Service Leave",
            amount: 0,
            visible: true
        },
        {
            title: "SL/VL",
            amount: 0,
            visible: true
        },
        {
            title: "Separation Pay",
            amount: 0,
            visible: true
        },
        {
            title: "COLA",
            amount: 0,
            visible: true
        },
        {
            title: "Overtime Pay",
            amount: 0,
            visible: true
        },
        {
            title: "Overtime Reg. Hol. Pay",
            amount: 0,
            visible: false
        },
        {
            title: "Overtime Spcl. Hol. Pay",
            amount: 0,
            visible: false
        },
        {
            title: "Others",
            amount: 0,
            visible: true
        }
    ]);

    useEffect(() => {
        getClientAccountingEntry();
        return () => {};
    }, []);
    const getClientAccountingEntry = () => {
        fetchData("GET", "api/accounting_entry?client_id=" + client_id).then(
            res => {
                if (res.credit.length) {
                    setCreditList(res.credit);
                }
                if (res.debit.length) {
                    setDebitList(res.debit);
                }
            }
        );
    };

    const saveCreditSettings = () => {
        fetchData("POST", "api/accounting_entry", {
            credit: creditList,
            client_id
        }).then(res => {
            if (res.success) {
                notification.success({
                    message: "Credit Settings Successfully Saved"
                });
            }
        });
    };

    const saveDebitSettings = () => {
        fetchData("POST", "api/accounting_entry", {
            debit: debitList,
            client_id
        }).then(res => {
            if (res.success) {
                notification.success({
                    message: "Debit Settings Successfully Saved"
                });
            }
        });
    };

    return (
        <>
            <Row>
                <Col xs={24} md={12}>
                    <Title level={3}>Debits</Title>

                    <TableAccountingEntries
                        accountingEntries={debitList}
                        setAccountingEntries={setDebitList}
                    />
                    <div className="mt-10">
                        <Button
                            type="primary"
                            block
                            onClick={e => saveDebitSettings()}
                        >
                            Save Debit Settings
                        </Button>
                    </div>
                </Col>
                <Col xs={24} md={12}>
                    <Title level={3}>Credits</Title>

                    <TableAccountingEntries
                        accountingEntries={creditList}
                        setAccountingEntries={setCreditList}
                    />
                    <div className="mt-10">
                        <Button
                            type="primary"
                            block
                            onClick={e => saveCreditSettings()}
                        >
                            Save Credit Settings
                        </Button>
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default TabContentClientAccountingEntries;
