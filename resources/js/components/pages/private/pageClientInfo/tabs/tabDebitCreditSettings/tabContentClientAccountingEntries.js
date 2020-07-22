import React, { useState, useEffect } from "react";
import {
    Row,
    Col,
    Button,
    Input,
    Table,
    Divider,
    Form,
    InputNumber
} from "antd";
import { fetchData } from "../../../../../../axios";
import { clientDebitSettingsTableColumns } from "./clientDebitSettingsTableColumns";
import { clientCreditSettingsTableColumns } from "./clientCreditSettingsTableColumns";
import Title from "antd/lib/typography/Title";
import FormAddDebitCredit from "./formAddDebitCredit";

const TabContentClientAccountingEntries = ({ client_id }) => {
    const [
        clientAccountingEntryDebits,
        setClientAccountingEntryDebits
    ] = useState([]);
    const [
        clientAccountingEntryCredits,
        setClientAccountingEntryCredits
    ] = useState([]);

    useEffect(() => {
        getClientAccountingEntry();
        return () => {};
    }, []);
    const getClientAccountingEntry = () => {
        fetchData("GET", "api/accounting_entry?client_id=" + client_id).then(
            res => {
                console.log(res);
                setClientAccountingEntryDebits(res.debit);
                setClientAccountingEntryCredits(res.credit);
            }
        );
    };
    return (
        <>
            <Row>
                <Col xs={24} md={24}>
                    <Title level={3}>Debits</Title>
                    <FormAddDebitCredit
                        client_id={client_id}
                        getClientAccountingEntry={getClientAccountingEntry}
                        type="debit"
                    />

                    <Table
                        dataSource={clientAccountingEntryDebits}
                        columns={clientDebitSettingsTableColumns(
                            getClientAccountingEntry
                        )}
                        pagination={false}
                        // pagination={{
                        //     onChange: (page, pageSize) =>
                        //         handleOnPageChange(page, pageSize),
                        //     onShowSizeChange: (current, size) =>
                        //         handleOnPageSizeChange(current, size),
                        //     total: clientDebitSettings.length
                        // }}
                    />
                    <Divider />
                    <Title level={3}>Credits</Title>

                    <FormAddDebitCredit
                        client_id={client_id}
                        getClientAccountingEntry={getClientAccountingEntry}
                        type="credit"
                    />

                    <Table
                        dataSource={clientAccountingEntryCredits}
                        columns={clientCreditSettingsTableColumns(
                            getClientAccountingEntry
                        )}
                        pagination={false}
                        // pagination={{
                        //     onChange: (page, pageSize) =>
                        //         handleOnPageChange(page, pageSize),
                        //     onShowSizeChange: (current, size) =>
                        //         handleOnPageSizeChange(current, size),
                        //     total: clientDebitSettings.length
                        // }}
                    />
                </Col>
            </Row>
        </>
    );
};

export default TabContentClientAccountingEntries;
