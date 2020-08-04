import React, { useState, useEffect } from "react";
import Title from "antd/lib/typography/Title";
import PageHeader from "./pageHeader";
import {
    Card,
    Row,
    Col,
    Skeleton,
    Divider,
    Button,
    Tabs,
    Table,
    Input
} from "antd";
import Text from "antd/lib/typography/Text";
import {
    BuildOutlined,
    UserOutlined,
    CalendarOutlined,
    PhoneOutlined
} from "@ant-design/icons";
import { fetchData } from "../../../axios";
import moment from "moment";
import ModalAddEditClient from "./pageClients/modalAddEditClient";
import CardClientDetails from "./pageClientInfo/cardClientDetails";
import { clientEmployeesTableColumns } from "./pageClientInfo/tabs/tabEmployeesList/clientEmployeesTableColumns";
import TabContentClientEmployees from "./pageClientInfo/tabs/tabEmployeesList/tabContentClientEmployees";
import TabContentClientAccountingEntries from "./pageClientInfo/tabs/tabDebitCreditSettings/tabContentClientAccountingEntries";
import TabClientPayrolls from "./pageClientInfo/tabs/tabClientPayrolls/tabClientPayrolls";
const PageClientInfo = ({ match, history }) => {
    const client_id = match.params.id;
    const [clientInfo, setClientInfo] = useState();
    const [showModalAddEditClient, setShowModalAddEditClient] = useState(false);

    useEffect(() => {
        getClientInfo();
        return () => {};
    }, []);

    const getClientInfo = () => {
        fetchData("GET", "api/client/" + client_id).then(res => {
            // console.log(res);
            if (res.success) {
                setClientInfo(res.data);
            }
        });
    };

    const toggleShowModalAddEditClient = () => {
        setShowModalAddEditClient(!showModalAddEditClient);
    };

    useEffect(() => {
        if (!showModalAddEditClient) {
            getClientInfo();
        }
        return () => {};
    }, [showModalAddEditClient]);

    function changeTabCallback(key) {
        // console.log(key);
    }

    return (
        <>
            {/* <PageHeader title="Client Information" history={history} /> */}

            <Row
                style={{
                    marginLeft: "-10px",
                    marginRight: "-10px",
                    marginBottom: 10
                }}
            >
                <Col xs={24} md={18}>
                    <Button type="primary" onClick={e => history.goBack()}>
                        Back
                    </Button>
                </Col>
                <Col xs={24} md={6}></Col>
            </Row>
            <Row>
                <Col xs={24} md={6} className="px-0 ">
                    <CardClientDetails
                        toggleShowModalAddEditClient={
                            toggleShowModalAddEditClient
                        }
                        clientInfo={clientInfo}
                    />
                </Col>
                <Col xs={24} md={18}>
                    <Card className="pt-0">
                        <Tabs defaultActiveKey="1" onChange={changeTabCallback}>
                            <Tabs.TabPane tab="Employees List" key="1">
                                <TabContentClientEmployees
                                    client_id={client_id}
                                />
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Payrolls" key="2">
                                <TabClientPayrolls client_id={client_id} />
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Debit/Credit Settings" key="3">
                                <TabContentClientAccountingEntries
                                    client_id={client_id}
                                />
                            </Tabs.TabPane>
                        </Tabs>
                    </Card>
                </Col>
            </Row>

            <ModalAddEditClient
                showModalAddEditClient={showModalAddEditClient}
                toggleShowModalAddEditClient={toggleShowModalAddEditClient}
                _clientInformation={clientInfo}
            />
        </>
    );
};

export default PageClientInfo;
