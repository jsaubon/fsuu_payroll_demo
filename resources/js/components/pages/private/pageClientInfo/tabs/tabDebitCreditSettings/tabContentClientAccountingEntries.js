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
            order: 17,
            title: "SSS",
            amount: 0,
            visible: true
        },
        {
            order: 18,
            title: "PhilHealth",
            amount: 0,
            visible: true
        },
        {
            order: 19,
            title: "Pag-IBIG",
            amount: 0,
            visible: true
        },
        {
            order: 20,
            title: "Bond",
            amount: 0,
            visible: true
        },
        {
            order: 21,
            title: "License",
            amount: 0,
            visible: true
        },
        {
            order: 22,
            title: "LOANS SSS",
            amount: 0,
            visible: true
        },
        {
            order: 23,
            title: "LOANS Pag-IBIG",
            amount: 0,
            visible: true
        },
        {
            order: 24,
            title: "LOANS NorthStar",
            amount: 0,
            visible: true
        },
        {
            order: 25,
            title: "OTHERS C/A",
            amount: 0,
            visible: true
        },
        {
            order: 26,
            title: "OTHERS Canteen",
            amount: 0,
            visible: true
        },
        {
            order: 27,
            title: "OTHERS Ammos & Accessories",
            amount: 0,
            visible: true
        },
        {
            order: 28,
            title: "OTHERS Misc.",
            amount: 0,
            visible: true
        }
    ]);
    const [debitList, setDebitList] = useState([
        {
            order: 1,
            title: "Basic Pay",
            amount: 0,
            visible: true
        },
        {
            order: 2,
            title: "Reg. Hol. Pay",
            amount: 0,
            visible: false
        },
        {
            order: 3,
            title: "Spcl. Hol. Pay",
            amount: 0,
            visible: false
        },
        {
            order: 4,
            title: "Night Premium Pay",
            amount: 0,
            visible: true
        },
        {
            order: 5,
            title: "Night Reg. Hol. Pay",
            amount: 0,
            visible: false
        },
        {
            order: 6,
            title: "Night Spcl. Hol. Pay",
            amount: 0,
            visible: false
        },
        {
            order: 7,
            title: "13th-Month Pay",
            amount: 0,
            visible: false
        },
        {
            order: 8,
            title: "Uniform Allowance",
            amount: 0,
            visible: false
        },
        {
            order: 9,
            title: "5-Day Service Leave",
            amount: 0,
            visible: true
        },
        {
            order: 10,
            title: "SL/VL",
            amount: 0,
            visible: true
        },
        {
            order: 11,
            title: "Separation Pay",
            amount: 0,
            visible: true
        },
        {
            order: 12,
            title: "COLA",
            amount: 0,
            visible: true
        },
        {
            order: 13,
            title: "Overtime Pay",
            amount: 0,
            visible: true
        },
        {
            order: 14,
            title: "Overtime Reg. Hol. Pay",
            amount: 0,
            visible: false
        },
        {
            order: 15,
            title: "Overtime Spcl. Hol. Pay",
            amount: 0,
            visible: false
        },
        {
            order: 16,
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
                    let _creditList = creditList;
                    _creditList.map((credit, key) => {
                        let cred = res.credit.find(
                            p => p.title == credit.title
                        );
                        if (cred) {
                            credit["id"] = cred.id;
                            credit.amount = cred.amount;
                            credit.visible = cred.visible;
                        }
                    });
                    setCreditList([..._creditList]);
                }
                if (res.debit.length) {
                    let _debitList = debitList;
                    _debitList.map((debit, key) => {
                        let cred = res.debit.find(p => p.title == debit.title);
                        if (cred) {
                            debit["id"] = cred.id;
                            debit.amount = cred.amount;
                            debit.visible = cred.visible;
                        }
                    });
                    setDebitList([..._debitList]);
                }
            }
        );
    };

    const saveCreditSettings = () => {
        console.log(creditList);
        fetchData("POST", "api/accounting_entry", {
            type: 'debit',
            data: creditList,
            client_id
        }).then(res => {
            console.log(res);
            if (res.success) {
                notification.success({
                    message: "Credit Settings Successfully Saved"
                });
            }
        });
    };

    const saveDebitSettings = () => {
        console.log(debitList);
        fetchData("POST", "api/accounting_entry", {
            type: 'debit',
            data: debitList,
            client_id
        }).then(res => {
            console.log(res);
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
