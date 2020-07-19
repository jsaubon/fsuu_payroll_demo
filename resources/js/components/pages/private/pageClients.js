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
import moment from "moment";

const PageClients = () => {
    const { stateClients, dispatchClients } = useContext(ClientsContext);
    const [sortClient, setSortClient] = useState("asc");
    const [searchClient, setSearchClient] = useState("");
    const getClients = () => {
        fetchData(
            "GET",
            "api/client?search=" + searchClient + "&sort=" + sortClient
        ).then(res => {
            if (res.success) {
                console.log(res);
                dispatchClients({ type: "SAVE_CLIENTS", payload: res.data });
            }
        });
    };
    useEffect(() => {
        // console.log(stateClients.clients);
        return () => {};
    }, [stateClients]);
    const [showModalAddEditClient, setShowModalAddEditClient] = useState(false);
    const handleSearchClient = client => {
        setSearchClient(client);
    };

    useEffect(() => {
        getClients();
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
            <div>
                <Title level={3}>Clients List</Title>
            </div>
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
                            <Col
                                key={key}
                                xs={24}
                                md={4}
                                className="p-10 mt-10"
                            >
                                <Card
                                    hoverable
                                    // style={{ width: 240 }}
                                    cover={
                                        <img
                                            alt="example"
                                            src={`${location.origin}/${client.photo}`}
                                            height={170}
                                        />
                                    }
                                >
                                    {/* <Meta
                                        title={client.name}
                                        description={`${client.address} <br/> ${client.contact_number}`}
                                    /> */}
                                    <Title level={4}>{client.name}</Title>
                                    {client.address && (
                                        <>
                                            <Text>{client.address}</Text>
                                            <br></br>
                                        </>
                                    )}

                                    {client.contact_number && (
                                        <>
                                            <Text>
                                                <PhoneOutlined />{" "}
                                                {client.contact_number}
                                            </Text>
                                            <br></br>
                                        </>
                                    )}
                                    {client.client_since && (
                                        <Text>
                                            <CalendarOutlined />{" "}
                                            {moment(client.client_since).format(
                                                "YYYY-MM-DD"
                                            )}
                                        </Text>
                                    )}
                                </Card>
                            </Col>
                        );
                    })}
            </Row>

            {showModalAddEditClient && (
                <ModalAddEditClient
                    showModalAddEditClient={showModalAddEditClient}
                    toggleShowModalAddEditClient={toggleShowModalAddEditClient}
                    getClients={getClients}
                />
            )}
        </>
    );
};

export default PageClients;
