import React from "react";
import Title from "antd/lib/typography/Title";
import { Tabs, Card } from "antd";
import TabReportsPayroll from "./pageReports/tabReportsPayroll";
import TabReportsDebitCredit from "./pageReports/tabReportsDebitCredit";
import PrintProvider, { Print, NoPrint } from "react-easy-print";
import TabReportsCashbond from "./pageReports/tabReportsCashbond";

const PageReports = () => {
    return (
        <NoPrint>
            <Title levle={3}>General Reports</Title>
            <Tabs defaultActiveKey="1" type="card" tabPosition="top">
                <Tabs.TabPane tab="Payrolls" key="1">
                    <TabReportsPayroll />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Debit/Credit" key="2">
                    <TabReportsDebitCredit />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Cashbond" key="3">
                    <TabReportsCashbond />
                </Tabs.TabPane>
            </Tabs>
        </NoPrint>
    );
};

export default PageReports;
