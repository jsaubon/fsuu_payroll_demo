import React, { useState } from "react";
import { Button, Input, Row, Col, Card, Divider } from "antd";
import Title from "antd/lib/typography/Title";
import Meta from "antd/lib/card/Meta";
import ModalAddEditClient from "./pageClients/modalAddEditClient";

const PageClients = () => {
    const [showModalAddEditClient, setShowModalAddEditClient] = useState(false);
    const handleSearchClient = client => {
        console.log(client);
    };

    const toggleShowModalAddEditClient = () => {
        setShowModalAddEditClient(!showModalAddEditClient);
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
                    <Input.Search
                        placeholder="Search Client"
                        onSearch={value => handleSearchClient(value)}
                        style={{ width: "100%" }}
                        className="pull-right"
                    />
                </Col>
            </Row>
            <Row style={{ marginLeft: "-10px", marginRight: "-10px" }}>
                <Col xs={24} md={4} className="p-10 mt-10">
                    <Card
                        hoverable
                        // style={{ width: 240 }}
                        cover={
                            <img
                                alt="example"
                                src={`${location.origin}/assets/images/building.jpg`}
                                height={170}
                            />
                        }
                    >
                        <Meta
                            title="Europe Street beat"
                            description="www.instagram.com"
                        />
                    </Card>
                </Col>
                <Col xs={24} md={4} className="p-10 mt-10">
                    <Card
                        hoverable
                        // style={{ width: 240 }}
                        cover={
                            <img
                                alt="example"
                                src={`${location.origin}/assets/images/building.jpg`}
                                height={170}
                            />
                        }
                    >
                        <Meta
                            title="Europe Street beat"
                            description="www.instagram.com"
                        />
                    </Card>
                </Col>
                <Col xs={24} md={4} className="p-10 mt-10">
                    <Card
                        hoverable
                        // style={{ width: 240 }}
                        cover={
                            <img
                                alt="example"
                                src={`${location.origin}/assets/images/building.jpg`}
                                height={170}
                            />
                        }
                    >
                        <Meta
                            title="Europe Street beat"
                            description="www.instagram.com"
                        />
                    </Card>
                </Col>
                <Col xs={24} md={4} className="p-10 mt-10">
                    <Card
                        hoverable
                        // style={{ width: 240 }}
                        cover={
                            <img
                                alt="example"
                                src={`${location.origin}/assets/images/building.jpg`}
                                height={170}
                            />
                        }
                    >
                        <Meta
                            title="Europe Street beat"
                            description="www.instagram.com"
                        />
                    </Card>
                </Col>
                <Col xs={24} md={4} className="p-10 mt-10">
                    <Card
                        hoverable
                        // style={{ width: 240 }}
                        cover={
                            <img
                                alt="example"
                                src={`${location.origin}/assets/images/building.jpg`}
                                height={170}
                            />
                        }
                    >
                        <Meta
                            title="Europe Street beat"
                            description="www.instagram.com"
                        />
                    </Card>
                </Col>
                <Col xs={24} md={4} className="p-10 mt-10">
                    <Card
                        hoverable
                        // style={{ width: 240 }}
                        cover={
                            <img
                                alt="example"
                                src={`${location.origin}/assets/images/building.jpg`}
                                height={170}
                            />
                        }
                    >
                        <Meta
                            title="Europe Street beat"
                            description="www.instagram.com"
                        />
                    </Card>
                </Col>
                <Col xs={24} md={4} className="p-10 mt-10">
                    <Card
                        hoverable
                        // style={{ width: 240 }}
                        cover={
                            <img
                                alt="example"
                                src={`${location.origin}/assets/images/building.jpg`}
                                height={170}
                            />
                        }
                    >
                        <Meta
                            title="Europe Street beat"
                            description="www.instagram.com"
                        />
                    </Card>
                </Col>
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
