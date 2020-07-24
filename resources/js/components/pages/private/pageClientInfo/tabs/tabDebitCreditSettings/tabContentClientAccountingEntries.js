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
            amount: 0
        },
        {
            title: "PhilHealth",
            amount: 0
        },
        {
            title: "Pag-IBIG",
            amount: 0
        },
        {
            title: "Band",
            amount: 0
        },
        {
            title: "LOANS SSS",
            amount: 0
        },
        {
            title: "LOANS Pag-IBIG",
            amount: 0
        },
        {
            title: "OTHERS C/A",
            amount: 0
        },
        {
            title: "OTHERS Canteen",
            amount: 0
        },
        {
            title: "OTHERS Ammos & Accessories",
            amount: 0
        },
        {
            title: "OTHERS Misc.",
            amount: 0
        }
    ]);
    const [debitList, setDebitList] = useState([
        {
            title: "Basic Pay",
            amount: 0
        },
        {
            title: "Night Premium Pay",
            amount: 0
        },
        {
            title: "13th-Month Pay",
            amount: 0
        },
        {
            title: "5-Day Service Leave",
            amount: 0
        },
        {
            title: "COLA",
            amount: 0
        },
        {
            title: "Overtime Pay",
            amount: 0
        },
        {
            title: "Others",
            amount: 0
        }
    ]);

    useEffect(() => {
        getClientAccountingEntry();
        return () => {};
    }, []);
    const getClientAccountingEntry = () => {
        fetchData("GET", "api/accounting_entry?client_id=" + client_id).then(
            res => {
                console.log(res);
                if (res.credit.length) {
                    setCreditList(res.credit);
                }
                if (res.debit.length) {
                    setDebitList(res.debit);
                }
                // setClientAccountingEntryDebits(res.debit);
                // setClientAccountingEntryCredits(res.credit);
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
