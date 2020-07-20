import React, { useState, useEffect } from "react";
import Title from "antd/lib/typography/Title";
import PageHeader from "./pageHeader";
import { Card, Row, Col, Skeleton, Divider, Button } from "antd";
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

const pageClientInfo = ({ match, history }) => {
    const client_id = match.params.id;
    const [clientInfo, setClientInfo] = useState();
    const [showModalAddEditClient, setShowModalAddEditClient] = useState(false);

    useEffect(() => {
        getClientInfo();
        return () => {};
    }, []);

    const getClientInfo = () => {
        fetchData("GET", "api/client/" + client_id).then(res => {
            console.log(res);
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

    return (
        <>
            {/* <PageHeader title="Client Information" history={history} /> */}

            <Row style={{ marginLeft: "-10px", marginRight: "-10px" }}>
                <Col xs={24} md={18}>
                    <Button type="primary" onClick={e => history.goBack()}>
                        Back
                    </Button>
                </Col>
                <Col xs={24} md={6}></Col>
            </Row>
            <Card className="mt-10">
                <Row>
                    <Col xs={24} md={8}>
                        <Title level={3}>Client Information</Title>
                    </Col>
                    <Col xs={24} md={16} className="text-right">
                        <Button
                            type="link"
                            onClick={e => toggleShowModalAddEditClient()}
                        >
                            {" "}
                            Edit
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} md={4} className="text-center">
                        {clientInfo ? (
                            <img
                                src={`${location.origin}/${clientInfo.photo}`}
                                alt="avatar"
                                style={{ width: "170px", height: "170px" }}
                            />
                        ) : (
                            <Skeleton.Image
                                style={{ width: "170px", height: "170px" }}
                            />
                        )}
                    </Col>
                    <Col xs={24} md={8}>
                        <Text>Basic Information</Text>
                        <Title level={3} className="mt-0 mb-0">
                            <UserOutlined />{" "}
                            {clientInfo ? (
                                clientInfo.name
                            ) : (
                                <Skeleton.Input
                                    size="small"
                                    active
                                    style={{ width: "200px", marginTop: "5px" }}
                                />
                            )}
                        </Title>
                        <Title level={4} className="mt-0 mb-0">
                            {clientInfo ? (
                                clientInfo.address || "-"
                            ) : (
                                <Skeleton.Input
                                    size="small"
                                    active
                                    style={{ width: "400px", marginTop: "5px" }}
                                />
                            )}
                        </Title>
                        <Title level={4} className="mt-0 mb-0">
                            <PhoneOutlined />{" "}
                            {clientInfo ? (
                                clientInfo.contact_number || "-"
                            ) : (
                                <Skeleton.Input
                                    size="small"
                                    active
                                    style={{ width: "150px", marginTop: "5px" }}
                                />
                            )}
                        </Title>
                        <Title level={4} className="mt-0 mb-0">
                            <CalendarOutlined />{" "}
                            {clientInfo ? (
                                clientInfo.client_since ? (
                                    moment(clientInfo.client_since).format("LL")
                                ) : (
                                    "-"
                                )
                            ) : (
                                <Skeleton.Input
                                    size="small"
                                    active
                                    style={{ width: "150px", marginTop: "5px" }}
                                />
                            )}
                        </Title>
                    </Col>
                    <Col xs={24} md={12}>
                        <Text>Other Information</Text>
                        <Title level={4} className="mt-0 mb-0">
                            {clientInfo ? (
                                clientInfo.other_infos.length > 0 ? (
                                    clientInfo.other_infos.map(
                                        (other_info, key) => {
                                            return (
                                                <Title
                                                    key={key}
                                                    level={4}
                                                    className="mt-0 mb-0"
                                                >
                                                    {other_info.title}:{" "}
                                                    {other_info.description}
                                                </Title>
                                            );
                                        }
                                    )
                                ) : (
                                    // <small>no data found</small>
                                    ""
                                )
                            ) : (
                                <>
                                    <Skeleton.Input
                                        size="small"
                                        active
                                        style={{
                                            width: "400px",
                                            marginTop: "5px"
                                        }}
                                    />
                                    <Skeleton.Input
                                        size="small"
                                        active
                                        style={{
                                            width: "400px",
                                            marginTop: "5px"
                                        }}
                                    />
                                    <Skeleton.Input
                                        size="small"
                                        active
                                        style={{
                                            width: "400px",
                                            marginTop: "5px"
                                        }}
                                    />
                                    <Skeleton.Input
                                        size="small"
                                        active
                                        style={{
                                            width: "400px",
                                            marginTop: "5px"
                                        }}
                                    />
                                </>
                            )}
                        </Title>
                    </Col>
                </Row>
            </Card>

            <ModalAddEditClient
                showModalAddEditClient={showModalAddEditClient}
                toggleShowModalAddEditClient={toggleShowModalAddEditClient}
                _clientInformation={clientInfo}
            />
        </>
    );
};

export default pageClientInfo;
