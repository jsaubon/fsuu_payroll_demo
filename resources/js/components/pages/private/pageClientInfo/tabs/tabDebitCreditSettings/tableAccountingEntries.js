import React from "react";
import { InputNumber } from "antd";

const TableAccountingEntries = ({
    accountingEntries,
    setAccountingEntries
}) => {
    return (
        <>
            <div className="ant-table ant-table-bordered">
                <div className="ant-table-container">
                    <div className="ant-table-content">
                        <table style={{ tableLayout: "auto" }}>
                            <thead className="ant-table-thead">
                                <tr>
                                    <th className="ant-table-cell">Title</th>
                                    <th
                                        className="ant-table-cell"
                                        style={{ width: "10%" }}
                                    >
                                        Amount
                                    </th>
                                    <th
                                        className="ant-table-cell"
                                        style={{ width: "10%" }}
                                    >
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="ant-table-tbody">
                                {accountingEntries.map((accountEntry, key) => {
                                    return (
                                        <tr
                                            className="ant-table-row ant-table-row-level-0"
                                            key={key}
                                        >
                                            <td className="ant-table-cell">
                                                {accountEntry.title}
                                            </td>
                                            <td className="ant-table-cell">
                                                <InputNumber
                                                    value={accountEntry.amount}
                                                    min={0}
                                                    onChange={value => {
                                                        let _accountingEntries = accountingEntries;
                                                        _accountingEntries[
                                                            key
                                                        ].amount = value;
                                                        setAccountingEntries([
                                                            ..._accountingEntries
                                                        ]);
                                                    }}
                                                />
                                            </td>
                                            <td className="ant-table-cell">
                                                <a href="#">Reports</a>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TableAccountingEntries;
