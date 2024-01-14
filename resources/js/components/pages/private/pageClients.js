import React, { useState, useEffect, useContext } from "react";
import {
    Button,
    Input,
    Row,
    Col,
    Card,
    Divider,
    Select,
    List,
    Space
} from "antd";
import Title from "antd/lib/typography/Title";
import Meta from "antd/lib/card/Meta";
import ModalAddEditClient from "./pageClients/modalAddEditClient";

import ClientsContext from "../../../contexts/clientsContext";
import { fetchData } from "../../../axios";
import Text from "antd/lib/typography/Text";
import {
    PhoneOutlined,
    CalendarOutlined,
    SortAscendingOutlined,
    SortDescendingOutlined,
    OrderedListOutlined,
    HomeOutlined,
    FileOutlined,
    FolderOutlined,
    PlusOutlined
} from "@ant-design/icons";
import CardClientInfo from "./pageClients/cardClientInfo";
import PageClientsDepartmentView from "./pageClients/PageClientsDepartmentView";
import PageClientsListView from "./pageClients/PageClientsListView";
import useAxiosQuery from "../../../providers/useAxiosQuery";

const PageClients = ({ history }) => {
    const { stateClients, dispatchClients } = useContext(ClientsContext);
    const [sortClient, setSortClient] = useState("asc");
    const [clientType, setClientType] = useState("");
    const [searchClient, setSearchClient] = useState("");

    useEffect(() => {
        // console.log(stateClients.clients);
        return () => {};
    }, [stateClients]);
    const [showModalAddEditClient, setShowModalAddEditClient] = useState(false);
    const handleSearchClient = client => {
        setSearchClient(client);
    };

    const toggleShowModalAddEditClient = () => {
        setShowModalAddEditClient(!showModalAddEditClient);
    };

    const toggleSortClient = () => {
        setSortClient(sortClient == "asc" ? "desc" : "asc");
    };

    const changeSearchClient = value => {
        setSearchClient(value);
    };

    let userdata = JSON.parse(localStorage.userdata);

    const [viewMode, setViewMode] = useState("List View");

    useEffect(() => {
        return () => {};
    }, [viewMode]);

    return (
        <>
            <Title level={3}>Employees List</Title>
            <Row style={{ marginLeft: "-10px", marginRight: "-10px" }}>
                <Col xs={24} md={18}>
                    <Space>
                        {userdata.role != "Staff" && (
                            <Button
                                type="primary"
                                onClick={e => toggleShowModalAddEditClient()}
                                icon={<PlusOutlined />}
                            >
                                New
                            </Button>
                        )}
                        <Button
                            type={
                                viewMode == "List View" ? "default" : "primary"
                            }
                            onClick={e => setViewMode("List View")}
                            icon={<OrderedListOutlined />}
                        >
                            List View
                        </Button>
                        <Button
                            type={
                                viewMode == "Department View"
                                    ? "default"
                                    : "primary"
                            }
                            onClick={e => setViewMode("Department View")}
                            icon={<FolderOutlined />}
                        >
                            Department View
                        </Button>
                    </Space>
                </Col>
                {/* <Col xs={24} md={4}>
                    <Select
                        placeholder="Filter Client Type"
                        style={{ width: "100%" }}
                        onChange={value => setClientType(value)}
                    >
                        <Select.Option value="All">All</Select.Option>
                        <Select.Option value="Commando">Commando</Select.Option>
                        <Select.Option value="First Commando">
                            First Commando
                        </Select.Option>
                    </Select>
                </Col> */}
                <Col xs={24} md={6}>
                    <div style={{ display: "flex" }}>
                        <Input.Search
                            placeholder={
                                viewMode == "List View"
                                    ? "Search Employee"
                                    : "Search Department"
                            }
                            onSearch={value => handleSearchClient(value)}
                            style={{ width: "100%" }}
                            className="pull-right"
                            onChange={e => changeSearchClient(e.target.value)}
                        />
                        {viewMode == "List View" && (
                            <Button
                                type="link"
                                onClick={e => toggleSortClient()}
                            >
                                {sortClient == "asc" ? (
                                    <SortAscendingOutlined
                                        style={{ fontSize: 20 }}
                                    />
                                ) : (
                                    <SortDescendingOutlined
                                        style={{ fontSize: 20 }}
                                    />
                                )}
                            </Button>
                        )}
                    </div>
                </Col>
            </Row>
            {viewMode == "Department View" ? (
                <PageClientsDepartmentView
                    history={history}
                    searchClient={searchClient}
                    sortClient={sortClient}
                    clientType={clientType}
                    showModalAddEditClient={showModalAddEditClient}
                    toggleShowModalAddEditClient={toggleShowModalAddEditClient}
                />
            ) : (
                <PageClientsListView
                    history={history}
                    searchClient={searchClient}
                    clientType={clientType}
                    showClientEmployeesModal={showModalAddEditClient}
                    toggleShowAddEditClientEmployeesModal={
                        toggleShowModalAddEditClient
                    }
                />
            )}
        </>
    );
};

export default PageClients;
