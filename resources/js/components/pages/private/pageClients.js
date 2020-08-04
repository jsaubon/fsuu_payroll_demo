import React, { useState, useEffect, useContext } from "react";
import { Button, Input, Row, Col, Card, Divider } from "antd";
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
    SortDescendingOutlined
} from "@ant-design/icons";
import CardClientInfo from "./pageClients/cardClientInfo";
import { getClients } from "./pageClients/getClients";

const PageClients = ({ history }) => {
    const { stateClients, dispatchClients } = useContext(ClientsContext);
    const [sortClient, setSortClient] = useState("asc");
    const [searchClient, setSearchClient] = useState("");

    useEffect(() => {
        // console.log(stateClients.clients);
        return () => {};
    }, [stateClients]);
    const [showModalAddEditClient, setShowModalAddEditClient] = useState(false);
    const handleSearchClient = client => {
        setSearchClient(client);
    };

    useEffect(() => {
        getClients(dispatchClients, searchClient, sortClient);
        return () => {};
    }, [sortClient, searchClient]);
    const toggleShowModalAddEditClient = () => {
        setShowModalAddEditClient(!showModalAddEditClient);
    };

    const toggleSortClient = () => {
        setSortClient(sortClient == "asc" ? "desc" : "asc");
    };

    const changeSearchClient = value => {
        setSearchClient(value);
    };

    return (
        <>
            <Title level={3}>Clients List</Title>
            <Row style={{ marginLeft: "-10px", marginRight: "-10px" }}>
                <Col xs={24} md={18}>
                    <Button
                        type="primary"
                        onClick={e => toggleShowModalAddEditClient()}
                    >
                        New
                    </Button>
                </Col>
                <Col xs={24} md={6}>
                    <div style={{ display: "flex" }}>
                        <Input.Search
                            placeholder="Search Client"
                            onSearch={value => handleSearchClient(value)}
                            style={{ width: "100%" }}
                            className="pull-right"
                            onChange={e => changeSearchClient(e.target.value)}
                        />
                        <Button type="link" onClick={e => toggleSortClient()}>
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
                    </div>
                </Col>
            </Row>
            <Row style={{ marginLeft: "-10px", marginRight: "-10px" }}>
                {stateClients &&
                    stateClients.clients.map((client, key) => {
                        return (
                            <CardClientInfo
                                history={history}
                                key={key}
                                client={client}
                            />
                        );
                    })}
            </Row>

            {showModalAddEditClient && (
                <ModalAddEditClient
                    showModalAddEditClient={showModalAddEditClient}
                    toggleShowModalAddEditClient={toggleShowModalAddEditClient}
                />
            )}
        </>
    );
};

export default PageClients;
