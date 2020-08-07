import React from "react";
import Title from "antd/lib/typography/Title";
import { Tabs, Card } from "antd";
import TabReportsPayroll from "./pageReports/tabReportsPayroll";

const PageReports = () => {
    return (
        <div>
            <Title levle={3}>General Reports</Title>
            <Tabs defaultActiveKey="1" type="card" tabPosition="left">
                <Tabs.TabPane tab="Payrolls" key="1">
                    <TabReportsPayroll />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Debit/Credit" key="2">
                    Content of Tab Pane 2
                </Tabs.TabPane>
                <Tabs.TabPane tab="Assigned Posts" key="3">
                    Content of Tab Pane 3
                </Tabs.TabPane>
            </Tabs>
        </div>
    );
};

export default PageReports;
