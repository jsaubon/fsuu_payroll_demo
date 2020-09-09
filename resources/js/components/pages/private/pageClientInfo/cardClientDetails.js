import React from "react";
import { Card, Row, Col, Button, Skeleton } from "antd";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import {
    UserOutlined,
    PhoneOutlined,
    CalendarOutlined
} from "@ant-design/icons";
import moment from "moment";

const CardClientDetails = ({ toggleShowModalAddEditClient, clientInfo }) => {
    let userdata = JSON.parse(localStorage.userdata);
    return (
        <>
            <Card className="pb-10">
                <Title level={3} className="text-center">
                    Client Information
                </Title>

                <Row>
                    <Col xs={24} md={24} className="text-center">
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
                    <Col xs={24} md={24} className="mt-10">
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
                        <Text className="mt-0 mb-0 d-block">
                            {clientInfo ? (
                                clientInfo.address || "-"
                            ) : (
                                <Skeleton.Input
                                    size="small"
                                    active
                                    style={{ width: "250px", marginTop: "5px" }}
                                />
                            )}
                        </Text>
                        <Text className="mt-0 mb-0 d-block">
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
                        </Text>
                        <Text className="mt-0 mb-0 d-block">
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
                        </Text>
                    </Col>
                    <Col xs={24} md={24} className="mt-10">
                        <Text>Other Information</Text>
                        <Text className="mt-0 mb-0">
                            {clientInfo ? (
                                clientInfo.other_infos.length > 0 ? (
                                    clientInfo.other_infos.map(
                                        (other_info, key) => {
                                            return (
                                                <Text
                                                    key={key}
                                                    className="mt-0 mb-0 d-block"
                                                >
                                                    {other_info.title}:{" "}
                                                    {other_info.description}
                                                </Text>
                                            );
                                        }
                                    )
                                ) : (
                                    // <small>no data found</small>
                                    ""
                                )
                            ) : (
                                <>
                                    <br></br>
                                    <Skeleton.Input
                                        size="small"
                                        active
                                        style={{
                                            width: "250px",
                                            marginTop: "5px"
                                        }}
                                    />
                                    <Skeleton.Input
                                        size="small"
                                        active
                                        style={{
                                            width: "250px",
                                            marginTop: "5px"
                                        }}
                                    />
                                    <Skeleton.Input
                                        size="small"
                                        active
                                        style={{
                                            width: "250px",
                                            marginTop: "5px"
                                        }}
                                    />
                                    <Skeleton.Input
                                        size="small"
                                        active
                                        style={{
                                            width: "250px",
                                            marginTop: "5px"
                                        }}
                                    />
                                </>
                            )}
                        </Text>

                        {userdata.role != "Staff" && (
                            <Button
                                type="primary"
                                block
                                className="mt-15"
                                onClick={e => toggleShowModalAddEditClient()}
                            >
                                {" "}
                                Edit
                            </Button>
                        )}
                    </Col>
                </Row>
            </Card>
        </>
    );
};

export default CardClientDetails;
